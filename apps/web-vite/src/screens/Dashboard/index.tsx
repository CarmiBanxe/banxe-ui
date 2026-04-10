import React from 'react'
import {
  BalanceWidget,
  TransactionRow,
  AIInsightCard,
  StatusChip,
} from '@banxe/ui'
import wallets from '../../../../../mocks/data/wallets.json'
import transactions from '../../../../../mocks/data/transactions.json'
import type { TransactionStatus } from '@banxe/ui'

/**
 * Dashboard — W-01
 *
 * Layout: two-column (main 2/3 + right panel 1/3)
 * Per BANXE-SCREEN-INVENTORY.md W-01 spec.
 */
export function Dashboard(): React.ReactElement {
  const primaryWallet = wallets[0]

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-bg-base">

      {/* ── Main column ── */}
      <main className="flex-1 flex flex-col gap-6">

        {/* Balance widget */}
        {primaryWallet && (
          <BalanceWidget
            currency={primaryWallet.currency}
            total={primaryWallet.total}
            available={primaryWallet.available}
            pending={primaryWallet.pending}
          />
        )}

        {/* Quick actions */}
        <nav
          className="grid grid-cols-4 gap-3"
          aria-label="Quick actions"
        >
          {(['Send', 'Add', 'Exchange', 'More'] as const).map((action) => (
            <button
              key={action}
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-surface border border-border-subtle hover:bg-overlay transition-colors"
            >
              <span className="text-xl" aria-hidden="true">
                {{ Send: '↑', Add: '+', Exchange: '⇄', More: '•••' }[action]}
              </span>
              <span className="text-xs text-secondary">{action}</span>
            </button>
          ))}
        </nav>

        {/* Recent transactions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-primary">
              Recent transactions
            </h2>
            <a
              href="/transactions"
              className="text-sm text-brand-primary hover:underline"
            >
              See all
            </a>
          </div>

          <div
            className="rounded-lg bg-surface border border-border-subtle overflow-hidden"
            role="list"
            aria-label="Recent transactions"
          >
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} role="listitem">
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
        </section>
      </main>

      {/* ── Right panel ── */}
      <aside
        className="w-80 flex-shrink-0 flex flex-col gap-4"
        aria-label="Insights and alerts"
      >
        <AIInsightCard
          insight="Your FX spending increased 34% this month vs. your 3-month average."
          confidence="HIGH"
          explanation="Based on 12 outbound EUR transactions totalling £2,340 vs. £1,750 average over Oct–Dec 2025."
          actionLabel="Review transactions"
          onAction={() => {}}
        />

        {/* Wallet summary */}
        <section className="rounded-lg bg-surface border border-border-subtle p-4">
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
            Wallets
          </h2>
          <div className="flex flex-col gap-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {wallet.currency}
                  </p>
                  <p className="text-xs font-mono text-secondary">
                    {wallet.iban}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-primary">
                    {wallet.available}
                  </p>
                  <StatusChip status={wallet.status as 'ACTIVE'} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}
