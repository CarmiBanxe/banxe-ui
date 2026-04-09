import React, { useState } from 'react'
import { AmountInput, StatusChip } from '@banxe/ui'

/**
 * Send / Transfer — W-04
 *
 * Purpose: Initiate outbound payment. Step-by-step guided flow (5 steps).
 * Required components: BeneficiarySearch, AmountInput, RailSelector, FeeBreakdown,
 *   ConfirmationSummary, SCAChallenge (>£30), ProcessingState, ResultScreen
 * Data: beneficiaries list, current balances, exchange rates, fee schedule, rail options
 * States: step_recipient | step_amount | step_confirm | processing | success | failed | pending | blocked
 * Accessibility: announces "Step N of 5", amount confirms recipient + amount
 * Trust/compliance: sanctions check on beneficiary (non-blocking UX), SCA >£30, typed confirm >£10k
 */

type Step = 'recipient' | 'amount' | 'confirm' | 'processing' | 'result'
type Rail = 'FPS' | 'CHAPS' | 'SEPA'
type ResultType = 'success' | 'failed' | 'pending' | 'blocked'

interface Beneficiary {
  id: string
  name: string
  iban: string
  sortCode?: string
  currency: string
}

const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id: 'b1', name: 'Alice Johnson', iban: 'GB29NWBK60161331926819', sortCode: '60-16-13', currency: 'GBP' },
  { id: 'b2', name: 'Bob Müller GmbH', iban: 'DE89370400440532013000', currency: 'EUR' },
  { id: 'b3', name: 'ACME Corp Ltd', iban: 'GB29NWBK60161331000001', sortCode: '60-16-13', currency: 'GBP' },
]

const STEP_LABELS: Record<Step, string> = {
  recipient: 'Choose recipient',
  amount: 'Enter amount',
  confirm: 'Review & confirm',
  processing: 'Processing',
  result: 'Done',
}

const STEPS: Step[] = ['recipient', 'amount', 'confirm', 'processing', 'result']

function StepIndicator({ current }: { current: Step }) {
  const visibleSteps: Step[] = ['recipient', 'amount', 'confirm']
  const currentIdx = visibleSteps.indexOf(current)

  if (!visibleSteps.includes(current)) return null

  return (
    <nav
      className="flex items-center gap-2 mb-6"
      aria-label="Payment steps"
    >
      {visibleSteps.map((step, i) => (
        <React.Fragment key={step}>
          <div
            className={`flex items-center gap-1.5 ${i <= currentIdx ? 'text-primary' : 'text-secondary'}`}
            aria-current={step === current ? 'step' : undefined}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i < currentIdx
                  ? 'bg-success text-inverse'
                  : i === currentIdx
                    ? 'bg-brand-primary text-inverse'
                    : 'bg-surface border border-border-default'
              }`}
            >
              {i < currentIdx ? '✓' : i + 1}
            </span>
            <span className="text-sm hidden sm:inline">{STEP_LABELS[step]}</span>
          </div>
          {i < visibleSteps.length - 1 && (
            <div className={`flex-1 h-px ${i < currentIdx ? 'bg-success' : 'bg-border-subtle'}`} />
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export function Send(): React.ReactElement {
  const [step, setStep] = useState<Step>('recipient')
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null)
  const [beneficiarySearch, setBeneficiarySearch] = useState('')
  const [isNewBeneficiary, setIsNewBeneficiary] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIban, setNewIban] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('GBP')
  const [rail, setRail] = useState<Rail>('FPS')
  const [scaCode, setScaCode] = useState('')
  const [scaError, setScaError] = useState('')
  const [resultType, setResultType] = useState<ResultType>('success')
  const [reference, setReference] = useState('')

  const numAmount = +(amount || '0')
  const requiresSCA = numAmount > 30
  const requiresTypedConfirm = numAmount > 10000
  const [typedConfirm, setTypedConfirm] = useState('')

  const filteredBeneficiaries = MOCK_BENEFICIARIES.filter(
    (b) =>
      !beneficiarySearch ||
      b.name.toLowerCase().includes(beneficiarySearch.toLowerCase()) ||
      b.iban.includes(beneficiarySearch),
  )

  const getRailOptions = (): Rail[] => {
    if (currency === 'EUR') return ['SEPA']
    if (numAmount >= 10000) return ['CHAPS', 'FPS']
    return ['FPS', 'CHAPS']
  }

  const getFee = (r: Rail): string => {
    if (r === 'CHAPS') return '£25.00'
    if (r === 'SEPA') return '€1.50'
    return 'Free'
  }

  const handleConfirm = async () => {
    if (requiresSCA && scaCode.length < 6) {
      setScaError('Enter your 6-digit security code')
      return
    }
    if (requiresTypedConfirm && typedConfirm !== amount) {
      setScaError(`Type exactly "${amount}" to confirm this large payment`)
      return
    }
    setStep('processing')
    await new Promise((r) => setTimeout(r, 2000))
    const ref = `REF-${Date.now().toString().slice(-8)}`
    setReference(ref)
    setResultType('success')
    setStep('result')
  }

  const reset = () => {
    setStep('recipient')
    setBeneficiary(null)
    setBeneficiarySearch('')
    setAmount('')
    setScaCode('')
    setScaError('')
    setTypedConfirm('')
    setReference('')
  }

  const stepNumber = STEPS.indexOf(step) + 1

  return (
    <div className="p-6 min-h-screen bg-bg-base flex justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold text-primary mb-2">Send Money</h1>
        <p className="text-sm text-secondary mb-6" aria-live="polite">
          {step !== 'processing' && step !== 'result'
            ? `Step ${Math.min(stepNumber, 3)} of 3 — ${STEP_LABELS[step]}`
            : ''}
        </p>

        <StepIndicator current={step} />

        {/* ── Step 1: Recipient ── */}
        {step === 'recipient' && (
          <section aria-label="Choose recipient">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsNewBeneficiary(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isNewBeneficiary
                    ? 'bg-brand-primary text-inverse'
                    : 'bg-surface border border-border-default text-secondary hover:text-primary'
                }`}
              >
                Saved beneficiaries
              </button>
              <button
                onClick={() => setIsNewBeneficiary(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isNewBeneficiary
                    ? 'bg-brand-primary text-inverse'
                    : 'bg-surface border border-border-default text-secondary hover:text-primary'
                }`}
              >
                New recipient
              </button>
            </div>

            {!isNewBeneficiary ? (
              <>
                <input
                  type="search"
                  placeholder="Search by name or IBAN…"
                  value={beneficiarySearch}
                  onChange={(e) => setBeneficiarySearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border-default text-primary placeholder:text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary mb-3"
                  aria-label="Search beneficiaries"
                />
                <div className="flex flex-col gap-2">
                  {filteredBeneficiaries.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setBeneficiary(b)
                        setCurrency(b.currency)
                        setStep('amount')
                      }}
                      className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border-subtle hover:bg-overlay transition-colors text-left"
                      aria-label={`Send to ${b.name}`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-primary">{b.name}</p>
                        <p className="text-xs font-mono text-secondary">{b.iban}</p>
                      </div>
                      <StatusChip status="ACTIVE" size="sm" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs text-secondary mb-1" htmlFor="new-name">
                    Recipient name
                  </label>
                  <input
                    id="new-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border-default text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Full name or company"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary mb-1" htmlFor="new-iban">
                    IBAN / Account number
                  </label>
                  <input
                    id="new-iban"
                    value={newIban}
                    onChange={(e) => setNewIban(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border-default text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="GB29 NWBK 6016 1331 9268 19"
                  />
                </div>
                <button
                  onClick={() => {
                    if (newName && newIban) {
                      setBeneficiary({ id: 'new', name: newName, iban: newIban, currency: 'GBP' })
                      setStep('amount')
                    }
                  }}
                  disabled={!newName || !newIban}
                  className="py-2 rounded-lg bg-brand-primary text-inverse text-sm font-medium hover:bg-brand-light disabled:opacity-50 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </section>
        )}

        {/* ── Step 2: Amount ── */}
        {step === 'amount' && beneficiary && (
          <section aria-label="Enter amount">
            <div className="p-3 rounded-lg bg-surface border border-border-subtle mb-4">
              <p className="text-xs text-secondary">Sending to</p>
              <p className="text-sm font-semibold text-primary">{beneficiary.name}</p>
              <p className="text-xs font-mono text-secondary">{beneficiary.iban}</p>
            </div>

            <AmountInput
              value={amount}
              currency={currency}
              onChange={setAmount}
              onCurrencyChange={setCurrency}
              label="Amount"
            />

            <div className="mt-4">
              <p className="text-xs text-secondary mb-2">Payment rail</p>
              <div className="flex gap-2">
                {getRailOptions().map((r) => (
                  <button
                    key={r}
                    onClick={() => setRail(r)}
                    className={`flex-1 p-3 rounded-lg border text-sm transition-colors ${
                      rail === r
                        ? 'border-brand-primary bg-brand-subtle text-brand-primary'
                        : 'border-border-subtle bg-surface text-secondary hover:text-primary'
                    }`}
                    aria-pressed={rail === r}
                  >
                    <p className="font-semibold">{r}</p>
                    <p className="text-xs mt-0.5">{getFee(r)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setStep('recipient')}
                className="flex-1 py-2 rounded-lg bg-surface border border-border-default text-sm text-primary hover:bg-overlay transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep('confirm')}
                disabled={!amount || +amount <= 0}
                className="flex-1 py-2 rounded-lg bg-brand-primary text-inverse text-sm font-medium hover:bg-brand-light disabled:opacity-50 transition-colors"
              >
                Review →
              </button>
            </div>
          </section>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 'confirm' && beneficiary && (
          <section aria-label="Confirm payment">
            <div className="p-4 rounded-lg bg-surface border border-border-subtle mb-4">
              <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
                Payment summary
              </h2>
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-secondary">To</dt>
                  <dd className="text-primary font-semibold">{beneficiary.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">IBAN</dt>
                  <dd className="font-mono text-primary text-xs">{beneficiary.iban}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Amount</dt>
                  <dd className="font-mono font-bold text-primary">{amount} {currency}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Rail</dt>
                  <dd className="text-primary">{rail}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Fee</dt>
                  <dd className="text-primary">{getFee(rail)}</dd>
                </div>
              </dl>
            </div>

            {requiresTypedConfirm && (
              <div className="mb-4 p-3 rounded-lg bg-warning-subtle border border-warning">
                <p className="text-sm text-warning mb-2">
                  Large payment confirmation required. Type the exact amount:
                </p>
                <input
                  value={typedConfirm}
                  onChange={(e) => { setTypedConfirm(e.target.value); setScaError('') }}
                  placeholder={amount}
                  className="w-full px-3 py-2 rounded-lg bg-elevated border border-border-default text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  aria-label="Type the amount to confirm"
                />
              </div>
            )}

            {requiresSCA && (
              <div className="mb-4">
                <label className="block text-xs text-secondary mb-1" htmlFor="sca-code">
                  Security code (from your authenticator app)
                </label>
                <input
                  id="sca-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={scaCode}
                  onChange={(e) => { setScaCode(e.target.value.replace(/\D/g, '')); setScaError('') }}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border-default text-primary font-mono text-lg text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  aria-label="6-digit security code"
                  aria-describedby={scaError ? 'sca-error' : undefined}
                />
                {scaError && (
                  <p id="sca-error" className="mt-1 text-xs text-error" role="alert">
                    {scaError}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('amount')}
                className="flex-1 py-2 rounded-lg bg-surface border border-border-default text-sm text-primary hover:bg-overlay transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 rounded-lg bg-brand-primary text-inverse text-sm font-medium hover:bg-brand-light transition-colors"
                aria-label={`Confirm payment of ${amount} ${currency} to ${beneficiary.name}`}
              >
                Confirm payment
              </button>
            </div>
          </section>
        )}

        {/* ── Processing ── */}
        {step === 'processing' && (
          <section
            className="flex flex-col items-center py-16 gap-4"
            aria-live="assertive"
            aria-label="Payment processing"
          >
            <div className="w-16 h-16 rounded-full bg-brand-subtle flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-primary font-semibold">Processing payment…</p>
            <p className="text-secondary text-sm">Please do not close this window</p>
          </section>
        )}

        {/* ── Result ── */}
        {step === 'result' && (
          <section
            className="flex flex-col items-center py-12 gap-4"
            aria-live="polite"
          >
            {resultType === 'success' && (
              <>
                <div className="w-16 h-16 rounded-full bg-success-subtle flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h2 className="text-xl font-bold text-primary">Payment sent</h2>
                <p className="text-sm text-secondary">Reference: <span className="font-mono">{reference}</span></p>
                <div className="flex gap-3 mt-4 w-full max-w-xs">
                  <a
                    href="/transactions"
                    className="flex-1 py-2 rounded-lg bg-surface border border-border-default text-sm text-center text-primary hover:bg-overlay transition-colors"
                  >
                    View in transactions
                  </a>
                  <button
                    onClick={reset}
                    className="flex-1 py-2 rounded-lg bg-brand-primary text-inverse text-sm font-medium hover:bg-brand-light transition-colors"
                  >
                    New payment
                  </button>
                </div>
              </>
            )}
            {resultType === 'blocked' && (
              <>
                <div className="w-16 h-16 rounded-full bg-warning-subtle flex items-center justify-center text-3xl">
                  ⚠
                </div>
                <h2 className="text-xl font-bold text-primary">Payment under review</h2>
                <p className="text-sm text-secondary text-center max-w-xs">
                  This payment requires compliance review. You&apos;ll be notified within 2 business days.
                </p>
                <button onClick={reset} className="mt-4 px-6 py-2 rounded-lg bg-surface border border-border-default text-sm text-primary hover:bg-overlay transition-colors">
                  Done
                </button>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
