import React, { useState } from 'react'
import { BalanceWidget, StatusChip } from '@banxe/ui'
import type { ChipStatus } from '@banxe/ui'
import wallets from '../../../../../mocks/data/wallets.json'

/**
 * Wallets — W-03
 *
 * Purpose: Multi-currency wallet management. Fiat overview per wallet.
 * Required components: WalletCard, WalletDetailPanel, BalanceWidget, IBANDisplay, StatusChip
 * Data: wallet list (currency, balance, IBAN, status), pending deposits
 * States: loading | loaded | wallet_restricted | deposit_pending | fx_unavailable
 * Accessibility: IBAN readable with spaces, copy action announces "IBAN copied"
 */

interface WalletCardProps {
  id: string
  currency: string
  total: string
  available: string
  pending: string
  iban: string
  status: string
  isSelected: boolean
  onSelect: () => void
}

function WalletCard({ currency, total: _total, available, pending, iban, status, isSelected, onSelect }: WalletCardProps) {
  const isRestricted = status === 'RESTRICTED' || status === 'SUSPENDED'
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border transition-colors ${
        isSelected
          ? 'bg-overlay border-brand-primary ring-1 ring-brand-primary'
          : 'bg-surface border-border-subtle hover:bg-overlay'
      }`}
      aria-pressed={isSelected}
      aria-label={`${currency} wallet, ${available} available`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-lg font-bold text-primary">{currency}</p>
          <p className="text-xs font-mono text-secondary">{iban}</p>
        </div>
        <StatusChip status={status as ChipStatus} size="sm" />
      </div>
      <p className="text-2xl font-mono font-bold text-primary">
        {available}
      </p>
      <p className="text-xs text-secondary mt-0.5">
        available
        {pending !== '0.00' && (
          <span className="ml-2 text-warning">{pending} pending</span>
        )}
      </p>
      {isRestricted && (
        <p className="mt-2 text-xs text-error">
          ⚠ Wallet restricted — contact support
        </p>
      )}
    </button>
  )
}

function IBANDisplay({ iban }: { iban: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(iban.replace(/\*/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format IBAN with spaces for readability
  const formatted = iban.replace(/(.{4})/g, '$1 ').trim()

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm text-primary" aria-label={`IBAN: ${formatted}`}>
        {formatted}
      </span>
      <button
        onClick={handleCopy}
        className="text-xs text-brand-primary hover:text-brand-light transition-colors"
        aria-label={copied ? 'IBAN copied' : 'Copy IBAN'}
        aria-live="polite"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

export function Wallets(): React.ReactElement {
  const [selectedId, setSelectedId] = useState<string>(wallets[0]?.id ?? '')
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)

  const selected = wallets.find((w) => w.id === selectedId)

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-bg-base">

      {/* ── Wallet list ── */}
      <aside className="w-72 flex-shrink-0 flex flex-col gap-3" aria-label="Your wallets">
        <h1 className="text-xl font-bold text-primary mb-1">Wallets</h1>
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            {...wallet}
            isSelected={wallet.id === selectedId}
            onSelect={() => setSelectedId(wallet.id)}
          />
        ))}
        <button className="mt-1 px-4 py-2 rounded-lg border border-dashed border-border-default text-secondary text-sm hover:border-brand-primary hover:text-brand-primary transition-colors">
          + Open new wallet
        </button>
      </aside>

      {/* ── Wallet detail ── */}
      {selected ? (
        <main className="flex-1 flex flex-col gap-6">
          <BalanceWidget
            currency={selected.currency}
            total={selected.total}
            available={selected.available}
            pending={selected.pending}
          />

          {/* IBAN & actions */}
          <section className="rounded-lg bg-surface border border-border-subtle p-5">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Account details
            </h2>
            <dl className="flex flex-col gap-3">
              <div>
                <dt className="text-xs text-secondary mb-0.5">IBAN</dt>
                <dd>
                  <IBANDisplay iban={selected.iban} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-secondary mb-0.5">Currency</dt>
                <dd className="text-sm text-primary">{selected.currency}</dd>
              </div>
              <div>
                <dt className="text-xs text-secondary mb-0.5">Status</dt>
                <dd>
                  <StatusChip status={selected.status as ChipStatus} />
                </dd>
              </div>
            </dl>
          </section>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowDeposit(true)}
              className="p-4 rounded-lg bg-surface border border-border-subtle hover:bg-overlay transition-colors text-center"
              aria-label={`Deposit to ${selected.currency}`}
            >
              <span className="text-2xl block mb-1" aria-hidden="true">↓</span>
              <span className="text-sm text-primary">Deposit</span>
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="p-4 rounded-lg bg-surface border border-border-subtle hover:bg-overlay transition-colors text-center"
              aria-label={`Withdraw from ${selected.currency}`}
            >
              <span className="text-2xl block mb-1" aria-hidden="true">↑</span>
              <span className="text-sm text-primary">Withdraw</span>
            </button>
            <button
              className="p-4 rounded-lg bg-surface border border-border-subtle hover:bg-overlay transition-colors text-center"
              aria-label={`Exchange ${selected.currency}`}
            >
              <span className="text-2xl block mb-1" aria-hidden="true">⇄</span>
              <span className="text-sm text-primary">Exchange</span>
            </button>
          </div>

          {/* Restricted wallet banner */}
          {(selected.status === 'RESTRICTED' || selected.status === 'SUSPENDED') && (
            <div
              className="p-4 rounded-lg bg-warning-subtle border border-warning text-sm text-warning"
              role="alert"
            >
              ⚠ This wallet is {selected.status.toLowerCase()}. Some features are unavailable.
              <a href="/support" className="ml-2 underline">Contact support</a>
            </div>
          )}

          {/* Deposit modal stub */}
          {showDeposit && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
              aria-label="Deposit funds"
            >
              <div className="bg-elevated rounded-xl p-6 w-96 border border-border-default">
                <h2 className="text-lg font-bold text-primary mb-4">Deposit to {selected.currency}</h2>
                <p className="text-sm text-secondary mb-4">
                  Send funds to your IBAN:
                </p>
                <IBANDisplay iban={selected.iban} />
                <button
                  onClick={() => setShowDeposit(false)}
                  className="mt-6 w-full py-2 rounded-lg bg-brand-primary text-inverse text-sm font-medium hover:bg-brand-light transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Withdraw modal stub */}
          {showWithdraw && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
              aria-label="Withdraw funds"
            >
              <div className="bg-elevated rounded-xl p-6 w-96 border border-border-default">
                <h2 className="text-lg font-bold text-primary mb-4">Withdraw from {selected.currency}</h2>
                <p className="text-sm text-secondary mb-2">Feature available after KYC approval.</p>
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="mt-4 w-full py-2 rounded-lg bg-surface border border-border-default text-sm text-primary hover:bg-overlay transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center">
          <p className="text-secondary text-sm">Select a wallet to view details</p>
        </main>
      )}
    </div>
  )
}
