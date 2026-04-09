import React from 'react'

export type TransactionStatus =
  | 'COMPLETED'
  | 'PENDING'
  | 'FAILED'
  | 'BLOCKED'
  | 'REVIEW'

interface TransactionRowProps {
  counterparty: string
  reference?: string
  amount: string
  currency: string
  direction: 'IN' | 'OUT'
  status: TransactionStatus
  date: string
}

const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  COMPLETED: { label: 'Completed', className: 'bg-success-subtle text-success' },
  PENDING:   { label: 'Pending',   className: 'bg-warning-subtle text-warning' },
  FAILED:    { label: 'Failed',    className: 'bg-error-subtle text-error' },
  BLOCKED:   { label: 'Blocked',   className: 'bg-error-subtle text-error border border-error' },
  REVIEW:    { label: 'Review',    className: 'bg-warning-subtle text-warning border border-warning' },
}

/**
 * TransactionRow — single transaction list item.
 *
 * Amount is always a string (Decimal-safe).
 * Status chip includes text (not color alone) for accessibility.
 * Minimum height: 64px.
 */
export function TransactionRow({
  counterparty,
  reference,
  amount,
  currency,
  direction,
  status,
  date,
}: TransactionRowProps): React.ReactElement {
  const { label, className } = STATUS_CONFIG[status]
  const sign = direction === 'IN' ? '+' : '-'
  const amountClass =
    direction === 'IN' ? 'text-success' : 'text-primary'

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 min-h-[64px] border-b border-border-subtle hover:bg-overlay transition-colors"
      role="article"
    >
      {/* Counterparty info */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-primary truncate">
          {counterparty}
        </p>
        {reference && (
          <p className="text-xs font-mono text-secondary truncate">{reference}</p>
        )}
      </div>

      {/* Amount + status */}
      <div className="text-right flex-shrink-0">
        <p
          className={`text-md font-mono font-bold ${amountClass}`}
          aria-label={`${sign}${amount} ${currency}`}
        >
          {sign}{amount} {currency}
        </p>
        <div className="flex items-center justify-end gap-2 mt-1">
          <span
            className={`text-xs px-2 py-0.5 rounded-sm font-medium ${className}`}
            role="status"
            aria-label={`Status: ${label}`}
          >
            {label}
          </span>
          <span className="text-xs text-secondary">{date}</span>
        </div>
      </div>
    </div>
  )
}
