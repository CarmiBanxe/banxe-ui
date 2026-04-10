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
