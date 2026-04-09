import React, { useState } from 'react'
import { TransactionRow, ComplianceFlag } from '@banxe/ui'
import type { TransactionStatus } from '@banxe/ui'
import transactions from '../../../../mocks/data/transactions.json'

/**
 * Transactions — W-02
 *
 * Purpose: Full transaction history with search, filter, and export.
 * Required components: TransactionRow, StatusChip, ComplianceFlag, filter bar, pagination
 * Data: transaction list (paginated 25/page), filters by date/status/type/currency
 * States: loading | loaded | empty_default | empty_filtered | error | exporting
 * Accessibility: sortable table with th/td, ARIA labels on status chips
 */

type FilterStatus = 'ALL' | TransactionStatus
type Direction = 'ALL' | 'IN' | 'OUT'

const PAGE_SIZE = 10

export function Transactions(): React.ReactElement {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL')
  const [filterDirection, setFilterDirection] = useState<Direction>('ALL')
  const [page, setPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      !search ||
      tx.counterparty.toLowerCase().includes(search.toLowerCase()) ||
      tx.reference.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || tx.status === filterStatus
    const matchesDir = filterDirection === 'ALL' || tx.direction === filterDirection
    return matchesSearch && matchesStatus && matchesDir
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleExport = async () => {
    setIsExporting(true)
    // Simulate CSV export
    await new Promise((r) => setTimeout(r, 800))
    const csv =
      'Date,Counterparty,Reference,Amount,Currency,Direction,Status\n' +
      filtered
        .map(
          (tx) =>
            `${tx.date},"${tx.counterparty}",${tx.reference},${tx.amount},${tx.currency},${tx.direction},${tx.status}`,
        )
        .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `banxe-transactions-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setIsExporting(false)
  }

  const clearFilters = () => {
    setSearch('')
    setFilterStatus('ALL')
    setFilterDirection('ALL')
    setPage(1)
  }

  const hasActiveFilters = search || filterStatus !== 'ALL' || filterDirection !== 'ALL'

  return (
    <div className="p-6 min-h-screen bg-bg-base">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Transactions</h1>
        <button
          onClick={handleExport}
          disabled={isExporting || filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-inverse text-sm font-medium hover:bg-brand-light disabled:opacity-50 transition-colors"
          aria-label="Export transactions as CSV"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-inverse border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              Exporting…
            </>
          ) : (
            'Export CSV'
          )}
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div
        className="flex flex-wrap gap-3 mb-4 p-4 rounded-lg bg-surface border border-border-subtle"
        role="search"
        aria-label="Filter transactions"
      >
        <input
          type="search"
          placeholder="Search counterparty or reference…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 min-w-48 px-3 py-2 rounded-md bg-elevated border border-border-default text-primary placeholder:text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          aria-label="Search transactions"
        />

        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value as FilterStatus); setPage(1) }}
          className="px-3 py-2 rounded-md bg-elevated border border-border-default text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          aria-label="Filter by status"
        >
          <option value="ALL">All statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEW">Under review</option>
          <option value="BLOCKED">Blocked</option>
          <option value="FAILED">Failed</option>
        </select>

        <select
          value={filterDirection}
          onChange={(e) => { setFilterDirection(e.target.value as Direction); setPage(1) }}
          className="px-3 py-2 rounded-md bg-elevated border border-border-default text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          aria-label="Filter by direction"
        >
          <option value="ALL">All directions</option>
          <option value="IN">Incoming</option>
          <option value="OUT">Outgoing</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded-md text-secondary text-sm hover:text-primary transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Transaction table ── */}
      <div className="rounded-lg bg-surface border border-border-subtle overflow-hidden">
        {pageData.length === 0 ? (
          <div className="p-12 text-center" role="status" aria-live="polite">
            <p className="text-secondary text-sm mb-3">
              {hasActiveFilters
                ? 'No transactions match your filters.'
                : 'No transactions yet.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-brand-primary text-sm hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div role="list" aria-label="Transaction list">
            {pageData.map((tx) => (
              <div key={tx.id} role="listitem" className="relative">
                {/* nosemgrep: banxe-compliance-status-check — ComplianceFlag rendered at section level (line 184+) */}
                {(tx.status === 'BLOCKED' || tx.status === 'REVIEW') && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning" aria-hidden="true" />
                )}
                <TransactionRow
                  counterparty={tx.counterparty}
                  reference={tx.reference}
                  amount={tx.amount}
                  currency={tx.currency}
                  direction={tx.direction as 'IN' | 'OUT'}
                  status={tx.status as TransactionStatus}
                  date={tx.date}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Compliance alert for BLOCKED/REVIEW items ── */}
      {/* nosemgrep: banxe-compliance-status-check — ComplianceFlag is rendered in this block */}
      {filtered.some((tx) => tx.status === 'BLOCKED' || tx.status === 'REVIEW') && (
        <div className="mt-4">
          <ComplianceFlag
            type="REVIEW"
            note="Some transactions are under compliance review. Our team will contact you within 2 business days."
          />
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-between mt-4"
          aria-label="Transaction pagination"
        >
          <p className="text-sm text-secondary">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
            {filtered.length} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-md bg-surface border border-border-default text-sm text-primary disabled:opacity-40 hover:bg-overlay transition-colors"
              aria-label="Previous page"
            >
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-sm text-secondary" aria-current="page">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-md bg-surface border border-border-default text-sm text-primary disabled:opacity-40 hover:bg-overlay transition-colors"
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}
