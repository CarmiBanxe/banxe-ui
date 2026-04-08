import React, { useState } from 'react'

interface BalanceWidgetProps {
  currency: string
  total: string
  available: string
  pending: string
  loading?: boolean
  error?: boolean
}

/**
 * BalanceWidget — primary balance display component.
 *
 * Rules:
 * - Amounts always displayed as strings (Decimal-safe, no float)
 * - Privacy mode replaces amounts with "••••"
 * - Loading state uses skeleton (not spinner)
 * - Error state is inline (does not collapse the widget)
 */
export function BalanceWidget({
  currency,
  total,
  available,
  pending,
  loading = false,
  error = false,
}: BalanceWidgetProps): React.ReactElement {
  const [privacyMode, setPrivacyMode] = useState(false)

  const mask = (value: string): string => (privacyMode ? '••••' : value)

  if (loading) {
    return (
      <div
        className="rounded-lg bg-surface p-6 animate-pulse"
        aria-busy="true"
        aria-label="Loading balance"
      >
        <div className="h-3 w-20 bg-overlay rounded mb-3" />
        <div className="h-9 w-36 bg-overlay rounded mb-4" />
        <div className="flex gap-4">
          <div className="h-3 w-28 bg-overlay rounded" />
          <div className="h-3 w-24 bg-overlay rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="rounded-lg bg-surface p-6 border border-error-subtle"
        role="alert"
      >
        <p className="text-sm text-secondary">Balance unavailable</p>
        <button
          className="mt-2 text-sm text-brand-primary hover:underline"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-surface p-6">
      {/* Currency label */}
      <p className="text-xs text-secondary uppercase tracking-wider mb-1">
        {currency} Balance
      </p>

      {/* Primary amount */}
      <div className="flex items-baseline gap-3 mb-4">
        <span
          className="text-3xl font-bold font-mono text-primary"
          aria-label={`${mask(total)} ${currency} total balance`}
        >
          {mask(total)}
        </span>
        <button
          className="text-xs text-secondary hover:text-primary transition-colors"
          onClick={() => setPrivacyMode((p) => !p)}
          aria-pressed={privacyMode}
          aria-label={privacyMode ? 'Show balance' : 'Hide balance'}
        >
          {privacyMode ? 'Show' : 'Hide'}
        </button>
      </div>

      {/* Available / Pending breakdown */}
      <div className="flex gap-6">
        <div>
          <p className="text-xs text-secondary">Available</p>
          <p
            className="text-sm font-mono font-medium text-primary"
            aria-label={`${mask(available)} ${currency} available`}
          >
            {mask(available)}
          </p>
        </div>
        <div>
          <p className="text-xs text-secondary">Pending</p>
          <p
            className="text-sm font-mono font-medium text-warning"
            aria-label={`${mask(pending)} ${currency} pending`}
          >
            {mask(pending)}
          </p>
        </div>
      </div>
    </div>
  )
}
