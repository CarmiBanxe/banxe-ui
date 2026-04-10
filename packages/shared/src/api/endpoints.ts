/**
 * packages/shared/src/api/endpoints.ts — Typed BANXE API endpoints
 *
 * Wraps the generic BanxeApiClient with typed functions for each
 * banxe-emi-stack endpoint. Import via @banxe/shared/api.
 *
 * Backend base URL: http://localhost:8000/v1 (configured in consumers)
 * I-05 invariant: all monetary amounts remain Decimal strings
 */

import type {
  Account,
  Transaction,
  Statement,
  Payment,
  PaymentRequest,
  Customer,
  KycStatus,
} from "../types/index.js"
import type { BanxeApiClient } from "./client.js"

export interface KycStatusResponse {
  status: KycStatus
  submitted_at?: string
  reviewed_at?: string
  rejection_reason?: string
}

export interface TransactionListParams {
  account_id?: string
  limit?: number
  offset?: number
  direction?: "credit" | "debit"
  status?: string
}

/**
 * createBanxeApi — factory that binds typed endpoint functions to a client.
 *
 * Usage (web-next):
 *   const api = createBanxeApi(client)
 *   const accounts = await api.accounts.list()
 *
 * Usage (mobile):
 *   const api = createBanxeApi(client)
 *   const me = await api.customers.me()
 */
export function createBanxeApi(client: BanxeApiClient) {
  return {
    accounts: {
      /** GET /v1/accounts — list all accounts for the authenticated customer */
      list: () =>
        client.get<Account[]>("/v1/accounts"),

      /** GET /v1/accounts/:id — get single account */
      get: (id: string) =>
        client.get<Account>(`/v1/accounts/${id}`),

      /** GET /v1/accounts/:id/statement — account statement */
      statement: (id: string) =>
        client.get<Statement>(`/v1/accounts/${id}/statement`),
    },

    transactions: {
      /** GET /v1/transactions — list transactions with optional filters */
      list: (params?: TransactionListParams) => {
        const qs = params
          ? "?" + new URLSearchParams(
              Object.entries(params)
                .filter(([, v]) => v !== undefined)
                .map(([k, v]) => [k, String(v)])
            ).toString()
          : ""
        return client.get<Transaction[]>(`/v1/transactions${qs}`)
      },

      /** GET /v1/transactions/:id */
      get: (id: string) =>
        client.get<Transaction>(`/v1/transactions/${id}`),
    },

    transfers: {
      /** POST /v1/transfers — initiate a PSD2 SCA payment */
      create: (body: PaymentRequest) =>
        client.post<Payment>("/v1/transfers", body),
    },

    kyc: {
      /** GET /v1/kyc — current KYC status for the authenticated customer */
      status: () =>
        client.get<KycStatusResponse>("/v1/kyc"),
    },

    customers: {
      /** GET /v1/customers/me — authenticated customer profile */
      me: () =>
        client.get<Customer>("/v1/customers/me"),
    },
  }
}

export type BanxeApi = ReturnType<typeof createBanxeApi>
