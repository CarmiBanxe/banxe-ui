import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, CreditCard, RefreshCw, type LucideIcon } from "lucide-react"

// ── Skeleton component ───────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[--radius-md] bg-[--color-bg-elevated] ${className ?? ""}`}
      aria-hidden="true"
    />
  )
}

// ── Types ────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string
  date: string
  description: string
  amount: string    // Decimal string — I-05: never float
  direction: "credit" | "debit"
  status: "COMPLETED" | "PENDING" | "BLOCKED"
}

// ── Mock data (replace with API call) ────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tx-001", date: "2026-04-10", description: "Salary credit", amount: "3000.00", direction: "credit", status: "COMPLETED" },
  { id: "tx-002", date: "2026-04-09", description: "Rent payment", amount: "1200.00", direction: "debit", status: "COMPLETED" },
  { id: "tx-003", date: "2026-04-08", description: "Grocery store", amount: "87.45", direction: "debit", status: "COMPLETED" },
  { id: "tx-004", date: "2026-04-07", description: "Transfer to savings", amount: "500.00", direction: "debit", status: "PENDING" },
  { id: "tx-005", date: "2026-04-06", description: "Interest payment", amount: "12.30", direction: "credit", status: "COMPLETED" },
]

// ── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const classes = {
    COMPLETED: "bg-[--color-success-subtle] text-[--color-success]",
    PENDING:   "bg-[--color-warning-subtle] text-[--color-warning]",
    BLOCKED:   "bg-[--color-error-subtle]   text-[--color-error]",
  }
  return (
    <span
      className={`inline-flex rounded-[--radius-pill] px-2 py-0.5 text-xs font-medium ${classes[status]}`}
      aria-label={`Status: ${status.toLowerCase()}`}
    >
      {status}
    </span>
  )
}

// ── Quick action button ───────────────────────────────────────────────────────

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon
  label: string
  href: string
}) {
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // TODO: replace with server component data fetch from /v1/ledger/accounts/{id}/balance
  const balance = "6300.00"
  const currency = "GBP"
  const isLoading = false

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
          <nav aria-label="Main navigation">
            <a href="/settings" className="text-sm text-[--color-text-secondary] hover:text-[--color-text-primary]" aria-label="Go to settings">
              Settings
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">

        {/* Balance card */}
        <Card aria-label="Account balance">
          <CardContent className="pt-6">
            <p className="text-sm text-[--color-text-secondary]">Available balance</p>
            {isLoading ? (
              <Skeleton className="h-10 w-48 mt-1" />
            ) : (
              <p
                className="text-4xl font-bold text-[--color-primary] mt-1 tabular-nums"
                aria-label={`${currency} ${balance}`}
              >
                {currency} {balance}
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
            <QuickAction icon={CreditCard} label="Cards" href="/cards" />
            <QuickAction icon={RefreshCw} label="Statement" href="/statement" />
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
            {isLoading ? (
              <ul className="space-y-4" aria-busy="true" aria-label="Loading transactions">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="divide-y divide-[--color-border-subtle]" aria-label="Recent transactions">
                {MOCK_TRANSACTIONS.map((tx) => (
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

                    {/* Amount — I-05: display as string, never parse as float */}
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        tx.direction === "credit" ? "text-[--color-success]" : "text-[--color-text-primary]"
                      }`}
                      aria-label={`${tx.direction === "credit" ? "+" : "-"}£${tx.amount}`}
                    >
                      {tx.direction === "credit" ? "+" : "−"}£{tx.amount}
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
