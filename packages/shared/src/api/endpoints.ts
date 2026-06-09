/**
 * packages/shared/src/api/endpoints.ts — Typed BANXE API endpoints
 *
 * Maps to real banxe-emi-stack routes (base: http://localhost:8000):
 *
 *   GET  /v1/ledger/accounts                              → accounts.list()
 *   GET  /v1/ledger/accounts/{id}/balance                 → accounts.balance()
 *   GET  /v1/accounts/{id}/statement?customer_id=&from=&to= → accounts.statement()
 *   POST /v1/payments                                     → transfers.create()
 *   GET  /v1/payments                                     → transfers.list()
 *   GET  /v1/payments/{idempotency_key}                   → transfers.get()
 *   POST /v1/kyc/workflows                                → kyc.start()
 *   GET  /v1/kyc/workflows/{id}                           → kyc.status()
 *   GET  /v1/customers                                    → customers.list()
 *   GET  /v1/customers/{id}                               → customers.get()
 *
 * I-05: all monetary amounts are Decimal strings — never number.
 */

import type { AgentDecisionRecord } from "../types/index.js"
import type { BanxeApiClient } from "./client"

// ── Response types matching banxe-emi-stack Pydantic schemas ─────────────────

export interface LedgerAccount {
  account_id: string
  name: string
  type: "OPERATIONAL" | "SAFEGUARDING" | string
  currency: string        // ISO 4217
  status: "ACTIVE" | "FROZEN" | "CLOSED"
}

export interface LedgerAccountList {
  accounts: LedgerAccount[]
  total: number
}

export interface AccountBalance {
  account_id: string
  available: string       // Decimal string — I-05
  total: string           // Decimal string — I-05
  currency: string
  on_hold: string | null  // Decimal string or null — I-05
}

export interface TransactionLine {
  date: string            // ISO-8601 date
  description: string
  reference: string
  debit: string | null    // Decimal string — I-05
  credit: string | null   // Decimal string — I-05
  balance_after: string   // Decimal string — I-05
  transaction_id: string
}

export interface StatementResponse {
  statement_id: string
  customer_id: string
  account_id: string
  currency: string
  period_start: string    // ISO-8601
  period_end: string      // ISO-8601
  opening_balance: string // Decimal string — I-05
  closing_balance: string // Decimal string — I-05
  total_debits: string    // Decimal string — I-05
  total_credits: string   // Decimal string — I-05
  net_movement: string    // Decimal string — I-05
  transaction_count: number
  transactions: TransactionLine[]
  generated_at: string    // ISO-8601 datetime UTC
}

export interface StatementParams {
  customer_id: string
  from: string            // YYYY-MM-DD
  to: string              // YYYY-MM-DD
  currency?: string
}

export interface PaymentRequest {
  recipient_iban: string
  amount: string          // Decimal string — I-05
  currency: string        // ISO 4217
  reference?: string
  idempotency_key?: string
  psd2_consent: true      // PSD2 Art. 97 — required
}

export interface PaymentResponse {
  payment_id: string
  idempotency_key: string
  status: "INITIATED" | "SCA_PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED"
  amount: string          // Decimal string — I-05
  currency: string
  recipient_iban: string
  reference?: string
  created_at: string
}

export interface CustomerResponse {
  customer_id: string
  email?: string
  first_name?: string
  last_name?: string
  state: string
  risk_level?: string
  created_at?: string
}

export interface CustomerListResponse {
  customers: CustomerResponse[]
  total: number
}

export interface KycWorkflow {
  workflow_id: string
  customer_id: string
  status: "PENDING" | "IN_PROGRESS" | "PENDING_REVIEW" | "APPROVED" | "REJECTED"
  created_at: string
  updated_at?: string
}

// ── L1 Intent Layer (ADR-049, S8) — chat→L1→L2→port→lineage ──────────────────

export interface IntentSubmitRequest {
  intent_text: string
  /** Optional caller trace id; the backend generates one when absent. */
  correlation_id?: string
}

/** Emitted when an intent resolves to no canonical process (ADR-048 D3.3). */
export interface IntentGovernanceEvent {
  correlation_id: string
  status: "UNRESOLVED" | string
  reason: string
}

/** Disposition of POST /v1/intent: a dispatched decision record, a governance
 *  event, or a safe NOT_ENABLED no-op (the layer is off pre-activation). */
export interface IntentResponse {
  enabled: boolean
  disposition: "DISPATCHED" | "GOVERNANCE_EVENT" | "NOT_ENABLED" | string
  decision_record?: AgentDecisionRecord | null
  governance_event?: IntentGovernanceEvent | null
  detail?: string | null
}

// ── API factory ───────────────────────────────────────────────────────────────

/**
 * createBanxeApi — binds typed endpoint functions to a BanxeApiClient.
 *
 * Usage (web-next server component):
 *   const api = createBanxeApi(client)
 *   const { accounts } = await api.accounts.list()
 *
 * Usage (mobile):
 *   const api = createBanxeApi(client)
 *   const balance = await api.accounts.balance('acc-operational-001')
 */
export function createBanxeApi(client: BanxeApiClient) {
  return {
    accounts: {
      /** GET /v1/ledger/accounts — list all ledger accounts */
      list: () =>
        client.get<LedgerAccountList>("/v1/ledger/accounts"),

      /** GET /v1/ledger/accounts/{id}/balance — real-time balance */
      balance: (accountId: string) =>
        client.get<AccountBalance>(`/v1/ledger/accounts/${accountId}/balance`),

      /** GET /v1/accounts/{id}/statement — account statement with transactions */
      statement: (accountId: string, params: StatementParams) => {
        const qs = new URLSearchParams({
          customer_id: params.customer_id,
          from: params.from,
          to: params.to,
          ...(params.currency ? { currency: params.currency } : {}),
        }).toString()
        return client.get<StatementResponse>(
          `/v1/accounts/${accountId}/statement?${qs}`
        )
      },
    },

    transfers: {
      /** POST /v1/payments — initiate PSD2 payment */
      create: (body: PaymentRequest) =>
        client.post<PaymentResponse>("/v1/payments", body),

      /** GET /v1/payments — list payments */
      list: () =>
        client.get<PaymentResponse[]>("/v1/payments"),

      /** GET /v1/payments/{idempotency_key} */
      get: (idempotencyKey: string) =>
        client.get<PaymentResponse>(`/v1/payments/${idempotencyKey}`),
    },

    kyc: {
      /** POST /v1/kyc/workflows — start KYC workflow */
      start: (customerId: string) =>
        client.post<KycWorkflow>("/v1/kyc/workflows", { customer_id: customerId }),

      /** GET /v1/kyc/workflows/{id} — get KYC status */
      status: (workflowId: string) =>
        client.get<KycWorkflow>(`/v1/kyc/workflows/${workflowId}`),
    },

    customers: {
      /** GET /v1/customers — list customers */
      list: (state?: string) => {
        const qs = state ? `?state=${state}` : ""
        return client.get<CustomerListResponse>(`/v1/customers${qs}`)
      },

      /** GET /v1/customers/{id} — get customer profile */
      get: (customerId: string) =>
        client.get<CustomerResponse>(`/v1/customers/${customerId}`),
    },

    intent: {
      /**
       * POST /v1/intent — submit a free-form client intent (chat→L1→L2→port→
       * lineage). Returns the dispatched AgentDecisionRecord, a governance event
       * (UNRESOLVED), or a NOT_ENABLED no-op. Gated by INTENT_LAYER_ENABLED.
       */
      submit: (body: IntentSubmitRequest) =>
        client.post<IntentResponse>("/v1/intent", body),

      /** GET /v1/intent/decision/{correlation_id} — fetch the emitted record. */
      getDecision: (correlationId: string) =>
        client.get<AgentDecisionRecord>(`/v1/intent/decision/${correlationId}`),
    },

    decisions: {
      /**
       * GET /v1/intent/decision/{correlation_id} — fetch the AgentDecisionRecord
       * for a decision lineage trace (ADR-046 / S4 sink). Backed by the S8 L1
       * Intent Layer route (the same record the chat surface holds by id).
       */
      getByCorrelation: (correlationId: string) =>
        client.get<AgentDecisionRecord>(`/v1/intent/decision/${correlationId}`),
    },
  }
}

export type BanxeApi = ReturnType<typeof createBanxeApi>
