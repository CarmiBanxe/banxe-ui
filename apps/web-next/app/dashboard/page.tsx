/**
 * Dashboard — Server Component
 * Fetches real data from banxe-emi-stack:
 *   GET /v1/ledger/accounts        → account list + balance
 *   GET /v1/ledger/accounts/{id}/balance → live balance
 *   GET /v1/accounts/{id}/statement → recent transactions
 *
 * Falls back to mock data when backend is unreachable.
 * I-05: all monetary amounts remain as Decimal strings — never parseFloat.
 */

import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, CreditCard, RefreshCw, type LucideIcon } from "lucide-react"
import { getServerApi } from "@/lib/api"
import { ApiError } from "@banxe/shared/api"
import type {
  LedgerAccount,
  AccountBalance,
  TransactionLine,
} from "@banxe/shared/api"

// ── Mock fallback (when backend is offline) ───────────────────────────────────

const MOCK_ACCOUNT: LedgerAccount = {
  account_id: "acc-mock-001",
  name: "Current Account (GBP)",
  type: "OPERATIONAL",
  currency: "GBP",
  status: "ACTIVE",
}

const MOCK_BALANCE: AccountBalance = {
  account_id: "acc-mock-001",
  available: "4700.00",
  total: "4750.00",
  currency: "GBP",
  on_hold: "50.00",
}

const MOCK_TRANSACTIONS: TransactionLine[] = [
  { transaction_id: "tx-001", date: "2026-04-10", description: "Salary credit", reference: "SALARY-APR", debit: null, credit: "3000.00", balance_after: "4700.00" },
  { transaction_id: "tx-002", date: "2026-04-09", description: "Rent payment", reference: "RENT-APR", debit: "1200.00", credit: null, balance_after: "1700.00" },
  { transaction_id: "tx-003", date: "2026-04-08", description: "Grocery store", reference: "POS-REF-001", debit: "87.45", credit: null, balance_after: "2900.00" },
  { transaction_id: "tx-004", date: "2026-04-07", description: "Transfer to savings", reference: "INT-XFER-001", debit: "500.00", credit: null, balance_after: "2987.45" },
  { transaction_id: "tx-005", date: "2026-04-06", description: "Interest payment", reference: "INT-APR", debit: null, credit: "12.30", balance_after: "3487.45" },
]

// ── Subcomponents ─────────────────────────────────────────────────────────────

function TxBadge({ tx }: { tx: TransactionLine }) {
  const isCredit = tx.credit !== null
  return (
    <span
      className={`inline-flex rounded-[--radius-pill] px-2 py-0.5 text-xs font-medium ${
        isCredit ? "bg-[--color-success-subtle] text-[--color-success]" :
                   "bg-[--color-bg-elevated] text-[--color-text-secondary]"
      }`}
      aria-label={isCredit ? "credit" : "debit"}
    >
      {isCredit ? "CR" : "DR"}
    </span>
  )
}

function QuickAction({ icon: Icon, label, href }: { icon: LucideIcon; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-2 rounded-[--radius-lg] border border-[--color-border-subtle] bg-[--color-bg-surface] p-4 text-sm font-medium text-[--color-text-primary] transition-colors hover:bg-[--color-bg-elevated] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-border-focus]"
      aria-label={label}
    >
      <Icon className="h-5 w-5 text-[--color-primary]" aria-hidden />
      <span>{label}</span>
    </a>
  )
}

function MockBadge({ isMock }: { isMock: boolean }) {
  if (!isMock) return null
  return (
    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs bg-[--color-warning-subtle] text-[--color-warning]">
      ⚠ Mock — backend offline
    </span>
  )
}

// ── Page (Server Component) ───────────────────────────────────────────────────

export default async function DashboardPage() {
  let account: LedgerAccount = MOCK_ACCOUNT
  let balance: AccountBalance = MOCK_BALANCE
  let transactions: TransactionLine[] = MOCK_TRANSACTIONS
  let isMock = true
  let backendError: string | null = null

  try {
    const api = await getServerApi()

    // 1. List accounts — take first ACTIVE one
    const accountList = await api.accounts.list()
    const primary = accountList.accounts.find((a) => a.status === "ACTIVE") ??
                    accountList.accounts[0]

    if (primary) {
      account = primary

      // 2. Live balance for the account
      balance = await api.accounts.balance(primary.account_id)

      // 3. Recent statement (last 30 days) for transactions
      const today = new Date()
      const from  = new Date(today)
      from.setDate(from.getDate() - 30)
      const fmt = (d: Date) => d.toISOString().slice(0, 10)

      const stmt = await api.accounts.statement(primary.account_id, {
        customer_id: "cust-001",   // TODO: read from session/JWT claims
        from: fmt(from),
        to: fmt(today),
        currency: primary.currency,
      })

      transactions = stmt.transactions.slice(0, 10)
      isMock = false
    }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect("/auth/login")
      backendError = `API error ${err.status}: ${err.message}`
    } else {
      backendError = "Backend unreachable — showing mock data"
    }
  }

  const currency = balance.currency
  const currencySymbol = currency === "GBP" ? "£" :
                         currency === "EUR" ? "€" :
                         currency === "USD" ? "$" : currency

  return (
    <main className="min-h-screen bg-[--color-bg-page]" aria-label="Dashboard">
      {/* Header */}
      <header className="border-b border-[--color-border-subtle] bg-[--color-bg-surface] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[--radius-md] bg-[--color-primary] flex items-center justify-center" aria-hidden="true">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="font-semibold text-[--color-primary]">BANXE</span>
          </div>
          <div className="flex items-center gap-4">
            <MockBadge isMock={isMock} />
            <nav aria-label="Main navigation">
              <a href="/settings" className="text-sm text-[--color-text-secondary] hover:text-[--color-text-primary]" aria-label="Settings">
                Settings
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Dev error banner */}
      {backendError && process.env.NODE_ENV === "development" && (
        <div role="alert" className="bg-[--color-warning-subtle] border-b border-[--color-warning] px-4 py-2 text-xs text-[--color-warning] text-center">
          {backendError}
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">

        {/* Balance card */}
        <Card aria-label="Account balance">
          <CardContent className="pt-6">
            <p className="text-sm text-[--color-text-secondary]">{account.name}</p>
            {/* I-05: available is a Decimal string — never parseFloat */}
            <p
              className="text-4xl font-bold text-[--color-primary] mt-1 tabular-nums"
              aria-label={`Available balance: ${currency} ${balance.available}`}
            >
              {currencySymbol}{balance.available}
            </p>
            {balance.on_hold && balance.on_hold !== "0" && (
              <p className="text-xs text-[--color-warning] mt-0.5 tabular-nums">
                {currencySymbol}{balance.on_hold} on hold
              </p>
            )}
            <p className="text-xs text-[--color-text-secondary] mt-1">
              FCA CASS 7.15 safeguarded — as of {new Date().toLocaleDateString("en-GB")}
            </p>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="text-base font-semibold text-[--color-text-primary] mb-3">
            Quick actions
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickAction icon={ArrowUpRight} label="Send money" href="/transfers" />
            <QuickAction icon={ArrowDownLeft} label="Request" href="/transfers/request" />
            <QuickAction icon={CreditCard} label="KYC" href="/kyc" />
            <QuickAction icon={RefreshCw} label="Statement" href={`/statement?account=${account.account_id}`} />
          </div>
        </section>

        {/* Recent transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent transactions</CardTitle>
              <a href="/transactions" className="text-sm text-[--color-primary] hover:underline">
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-[--color-text-secondary] text-center py-8">
                No transactions in the last 30 days
              </p>
            ) : (
              <ul className="divide-y divide-[--color-border-subtle]" aria-label="Recent transactions">
                {transactions.map((tx) => {
                  const isCredit = tx.credit !== null
                  return (
                    <li key={tx.transaction_id} className="flex items-center gap-3 py-3">
                      {/* Direction icon */}
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCredit ? "bg-[--color-success-subtle] text-[--color-success]"
                                   : "bg-[--color-error-subtle] text-[--color-error]"
                        }`}
                        aria-hidden="true"
                      >
                        {isCredit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>

                      {/* Description + date */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[--color-text-primary] truncate">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <time dateTime={tx.date} className="text-xs text-[--color-text-secondary]">
                            {new Date(tx.date).toLocaleDateString("en-GB")}
                          </time>
                          <TxBadge tx={tx} />
                        </div>
                      </div>

                      {/* Amount — I-05: Decimal string, never parseFloat */}
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          isCredit ? "text-[--color-success]" : "text-[--color-text-primary]"
                        }`}
                        aria-label={`${isCredit ? "+" : "-"}${currencySymbol}${tx.credit ?? tx.debit}`}
                      >
                        {isCredit ? "+" : "−"}{currencySymbol}{tx.credit ?? tx.debit}
                      </p>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
