/**
 * Dashboard — Server Component
 * Fetches real data from banxe-emi-stack via /v1/accounts + /v1/transactions.
 * Falls back to mock data when backend is unreachable (dev without backend running).
 * I-05: all monetary amounts remain as strings — never parsed as float.
 */

import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, CreditCard, RefreshCw, type LucideIcon } from "lucide-react"
import { getServerApi } from "@/lib/api"
import { ApiError } from "@banxe/shared/api"
import type { Account, Transaction } from "@banxe/shared/types"

// ── Fallback mock data (used when backend is unreachable) ─────────────────────

const MOCK_ACCOUNT: Account = {
  id: "acc-mock-001",
  customer_id: "cust-mock-001",
  currency: "GBP",
  balance: "4700.00",
  status: "ACTIVE",
  iban: "GB29****1234",
  created_at: "2026-01-01T00:00:00Z",
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tx-001", account_id: "acc-mock-001", date: "2026-04-10", description: "Salary credit", reference: "SALARY-APR", debit: null, credit: "3000.00", balance_after: "4700.00", status: "COMPLETED", direction: "credit" },
  { id: "tx-002", account_id: "acc-mock-001", date: "2026-04-09", description: "Rent payment", reference: "RENT-APR", debit: "1200.00", credit: null, balance_after: "1700.00", status: "COMPLETED", direction: "debit" },
  { id: "tx-003", account_id: "acc-mock-001", date: "2026-04-08", description: "Grocery store", reference: "POS-REF-001", debit: "87.45", credit: null, balance_after: "2900.00", status: "COMPLETED", direction: "debit" },
  { id: "tx-004", account_id: "acc-mock-001", date: "2026-04-07", description: "Transfer to savings", reference: "INT-XFER-001", debit: "500.00", credit: null, balance_after: "2987.45", status: "PENDING", direction: "debit" },
  { id: "tx-005", account_id: "acc-mock-001", date: "2026-04-06", description: "Interest payment", reference: "INT-APR", debit: null, credit: "12.30", balance_after: "3487.45", status: "COMPLETED", direction: "credit" },
]

// ── Subcomponents ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const classes: Record<string, string> = {
    COMPLETED: "bg-[--color-success-subtle] text-[--color-success]",
    PENDING:   "bg-[--color-warning-subtle] text-[--color-warning]",
    BLOCKED:   "bg-[--color-error-subtle]   text-[--color-error]",
    FAILED:    "bg-[--color-error-subtle]   text-[--color-error]",
  }
  return (
    <span
      className={`inline-flex rounded-[--radius-pill] px-2 py-0.5 text-xs font-medium ${classes[status] ?? ""}`}
      aria-label={`Status: ${status.toLowerCase()}`}
    >
      {status}
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

function DataSourceBadge({ isMock }: { isMock: boolean }) {
  if (!isMock) return null
  return (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs bg-[--color-warning-subtle] text-[--color-warning]">
      ⚠ Mock data — backend offline
    </span>
  )
}

// ── Page (Server Component) ───────────────────────────────────────────────────

export default async function DashboardPage() {
  let account: Account = MOCK_ACCOUNT
  let transactions: Transaction[] = MOCK_TRANSACTIONS
  let isMock = true
  let backendError: string | null = null

  try {
    const api = await getServerApi()

    // Fetch accounts list — take first active account
    const accounts = await api.accounts.list()
    const primaryAccount = accounts.find((a) => a.status === "ACTIVE") ?? accounts[0]

    if (primaryAccount) {
      account = primaryAccount

      // Fetch recent transactions for this account
      const txList = await api.transactions.list({
        account_id: primaryAccount.id,
        limit: 10,
      })
      transactions = txList
      isMock = false
    }
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        redirect("/auth/login")
      }
      backendError = `API error ${err.status}: ${err.message}`
    } else {
      // Network error (backend not running) — use mock data silently in dev
      backendError = process.env.NODE_ENV === "development"
        ? "Backend unreachable — using mock data"
        : null
    }
  }

  const balance = account.balance
  const currency = account.currency
  const currencySymbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : currency === "USD" ? "$" : currency

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
            <DataSourceBadge isMock={isMock} />
            <nav aria-label="Main navigation">
              <a href="/settings" className="text-sm text-[--color-text-secondary] hover:text-[--color-text-primary]" aria-label="Go to settings">
                Settings
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Backend error banner (dev only) */}
      {backendError && process.env.NODE_ENV === "development" && (
        <div role="alert" className="bg-[--color-warning-subtle] border-b border-[--color-warning] px-4 py-2 text-xs text-[--color-warning] text-center">
          {backendError}
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">

        {/* Balance card */}
        <Card aria-label="Account balance">
          <CardContent className="pt-6">
            <p className="text-sm text-[--color-text-secondary]">Available balance</p>
            {/* I-05: balance is a Decimal string from API — display directly, never parseFloat */}
            <p
              className="text-4xl font-bold text-[--color-primary] mt-1 tabular-nums"
              aria-label={`${currency} ${balance}`}
            >
              {currencySymbol}{balance}
            </p>
            <p className="text-xs text-[--color-text-secondary] mt-1">
              FCA CASS 7.15 safeguarded — as of {new Date().toLocaleDateString("en-GB")}
            </p>
            {account.iban && (
              <p className="text-xs text-[--color-text-tertiary] mt-0.5 font-mono">
                IBAN: {account.iban}
              </p>
            )}
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
            <QuickAction icon={CreditCard} label="Cards" href="/cards" />
            <QuickAction icon={RefreshCw} label="Statement" href={`/statement?account=${account.id}`} />
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
                No transactions yet
              </p>
            ) : (
              <ul className="divide-y divide-[--color-border-subtle]" aria-label="Recent transactions">
                {transactions.map((tx) => (
                  <li key={tx.id} className="flex items-center gap-3 py-3">
                    {/* Direction indicator */}
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tx.direction === "credit"
                          ? "bg-[--color-success-subtle] text-[--color-success]"
                          : "bg-[--color-error-subtle] text-[--color-error]"
                      }`}
                      aria-hidden="true"
                    >
                      {tx.direction === "credit" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>

                    {/* Description + date */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[--color-text-primary] truncate">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <time dateTime={tx.date} className="text-xs text-[--color-text-secondary]">
                          {new Date(tx.date).toLocaleDateString("en-GB")}
                        </time>
                        <StatusBadge status={tx.status} />
                      </div>
                    </div>

                    {/* Amount — I-05: display as Decimal string, never parse as float */}
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        tx.direction === "credit" ? "text-[--color-success]" : "text-[--color-text-primary]"
                      }`}
                      aria-label={`${tx.direction === "credit" ? "+" : "-"}${currencySymbol}${tx.credit ?? tx.debit}`}
                    >
                      {tx.direction === "credit" ? "+" : "−"}{currencySymbol}{tx.credit ?? tx.debit}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
