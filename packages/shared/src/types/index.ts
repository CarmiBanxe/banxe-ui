/**
 * packages/shared/src/types — BANXE shared TypeScript types
 * Used by web-next, web-vite, and mobile
 *
 * I-05 invariant: all monetary amounts are string (Decimal), never number/float
 */

// ── Customer ──────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  kyc_status: KycStatus
  created_at: string // ISO-8601
}

export type KycStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"

// ── Account ───────────────────────────────────────────────────────────────────

export interface Account {
  id: string
  customer_id: string
  currency: string      // ISO 4217 (e.g. "GBP")
  balance: string       // Decimal string — I-05
  status: AccountStatus
  iban: string
  created_at: string
}

export type AccountStatus = "ACTIVE" | "FROZEN" | "CLOSED"

// ── Transaction ───────────────────────────────────────────────────────────────

export interface Transaction {
  id: string
  account_id: string
  date: string          // ISO-8601 date
  description: string
  reference: string
  debit: string | null  // Decimal string — I-05
  credit: string | null // Decimal string — I-05
  balance_after: string // Decimal string — I-05
  status: TransactionStatus
  direction: "credit" | "debit"
}

export type TransactionStatus = "COMPLETED" | "PENDING" | "BLOCKED" | "FAILED"

// ── Payment ───────────────────────────────────────────────────────────────────

export interface PaymentRequest {
  account_id: string
  recipient_iban: string
  amount: string        // Decimal string — I-05
  currency: string
  reference?: string
  psd2_consent: true    // Required — PSD2 SCA
}

export interface Payment {
  id: string
  status: PaymentStatus
  amount: string        // Decimal string — I-05
  currency: string
  recipient_iban: string
  reference?: string
  created_at: string
}

export type PaymentStatus =
  | "INITIATED"
  | "SCA_PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"

// ── Statement ─────────────────────────────────────────────────────────────────

export interface Statement {
  statement_id: string
  customer_id: string
  account_id: string
  currency: string
  period_start: string
  period_end: string
  opening_balance: string  // Decimal string — I-05
  closing_balance: string  // Decimal string — I-05
  total_debits: string     // Decimal string — I-05
  total_credits: string    // Decimal string — I-05
  net_movement: string     // Decimal string — I-05
  transaction_count: number
  transactions: Transaction[]
  generated_at: string
}

// ── KYC ───────────────────────────────────────────────────────────────────────

export interface KycWorkflow {
  id: string
  customer_id: string
  status: KycStatus
  steps: KycStep[]
  created_at: string
  updated_at: string
}

export type KycStepType = "ID_DOCUMENT" | "SELFIE" | "LIVENESS" | "ADDRESS_PROOF"
export type KycStepStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED"

export interface KycStep {
  type: KycStepType
  status: KycStepStatus
  required: boolean
}

// ── API responses ─────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string
  status: number
  request_id?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
}

// ── Decision Lineage (AgentDecisionRecord) ──────────────────────────────────
//
// Mirrors banxe-architecture/schemas/agent_decision_record.schema.json 1:1
// (ADR-046 Decision Lineage Schema). The atomic unit of decision lineage:
// one consequential L2 agent decision → one immutable record, keyed to a
// client intent and linkable via correlation_id. The S4 sink stores these.
//
// R-SEC: NO field may carry secret material or raw PII beyond the
// PII-minimized, regulator-legible summary permitted in reasoning_summary.

/** Net compliance outcome of the evaluated policies (ADR-046 D2). */
export type ComplianceResult = "PASS" | "FAIL" | "ESCALATE" | "N/A"

/** Whether the decision crossed a cost cap (ADR-047 D5). */
export type BudgetBreachFlag = "NONE" | "WARN" | "BREACH"

export interface AgentDecisionRecord {
  /** Primary identity of this decision record (UUID/ULID). Immutable. */
  record_id: string
  /** Instant the decision was finalized — UTC, RFC 3339 / ISO-8601. */
  timestamp: string
  /** Canonical snake_case id of the deciding L2 agent (e.g. mlro_agent). */
  agent_id: string
  /** What caused the decision — event type + reference. No secrets/PII. */
  triggering_event: string
  /** The client intent this decision serves. PII-minimized. */
  intent: string
  /** Ordered policy / rule / invariant ids evaluated. MAY be empty []. */
  policies_evaluated: string[]
  /** Net compliance outcome. */
  compliance_result: ComplianceResult
  /** Concise, regulator-facing rationale. PII-minimized, not raw CoT. */
  reasoning_summary: string
  /** Confidence 0..1 on the HITL scale: AUTO >0.90 / REVIEW 0.70–0.90 / BLOCK <0.70. */
  confidence_score: number
  /** The concrete action taken or proposed (e.g. APPROVE_PAYMENT, FILE_SAR). */
  action_taken: string
  /** HITL reviewer identity; null for AUTO decisions. Non-null when confidence < 0.90. */
  human_reviewed_by: string | null
  /** Cross-cutting trace id tying this decision to the intent→execution→audit chain. */
  correlation_id: string
  /** ADR-047 D5: total tokens (in+out) consumed by this decision's inference. */
  cost_tokens: number
  /** ADR-047 D5: monetary cost as a DECIMAL STRING — never a float (I-05). */
  cost_amount: string
  /** ADR-047 D5: reference to the per-window budget bucket this counted against. */
  budget_window_ref: string
  /** ADR-047 D5: cap-crossing state for this decision. */
  budget_breach_flag: BudgetBreachFlag
  /** ADR-046 D2 tamper-evidence anchor. Nullable until the immutable sink is live (§D6). */
  immutable_storage_ref: string | null
  /** ADR-046 §D5: input/prompt tokens. Nullable until the cost-metering sink is live (§D6). */
  input_tokens: number | null
  /** ADR-046 §D5: output/completion tokens. Nullable until the cost-metering sink is live (§D6). */
  output_tokens: number | null
}
