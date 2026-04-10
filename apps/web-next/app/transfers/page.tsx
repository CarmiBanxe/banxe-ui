"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShieldCheck } from "lucide-react"

type Step = "form" | "review" | "confirm"

export default function TransfersPage() {
  const [step, setStep] = useState<Step>("form")
  const [iban, setIban] = useState("")
  const [amount, setAmount] = useState("")
  const [reference, setReference] = useState("")
  const [psd2Consent, setPsd2Consent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ibanError, setIbanError] = useState<string | null>(null)
  const [amountError, setAmountError] = useState<string | null>(null)

  function validateIban(v: string) {
    // Basic IBAN format check — full validation server-side
    const clean = v.replace(/\s/g, "").toUpperCase()
    if (clean.length < 15 || clean.length > 34) return "IBAN must be 15–34 characters"
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(clean)) return "Invalid IBAN format"
    return null
  }

  function validateAmount(v: string) {
    if (!v) return "Amount is required"
    if (!/^\d+(\.\d{1,2})?$/.test(v)) return "Enter a valid amount (e.g. 100.00)"
    if (parseFloat(v) <= 0) return "Amount must be greater than 0"
    return null
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ibanErr = validateIban(iban)
    const amtErr = validateAmount(amount)
    setIbanError(ibanErr)
    setAmountError(amtErr)
    if (ibanErr || amtErr) return
    setStep("review")
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    if (!psd2Consent) return
    setLoading(true)
    try {
      // TODO: POST /v1/payments — PSD2 SCA two-step
      await new Promise((r) => setTimeout(r, 1200))
      setStep("confirm")
    } finally {
      setLoading(false)
    }
  }

  const formattedIban = iban.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim().toUpperCase()

  // ── Step 1: Form ───────────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <main className="min-h-screen bg-[--color-bg-page] px-4 py-8" aria-label="Transfer money">
        <div className="mx-auto max-w-lg">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] mb-6"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </a>

          <Card>
            <CardHeader>
              <CardTitle>Send money</CardTitle>
              <p className="text-sm text-[--color-text-secondary]">
                PSD2 SCA — you will confirm this transfer in the next step.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} noValidate className="flex flex-col gap-4">
                <Input
                  label="Recipient IBAN"
                  id="iban"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  placeholder="GB29 NWBK 6016 1331 9268 19"
                  value={iban}
                  onChange={(e) => { setIban(e.target.value); setIbanError(null) }}
                  error={ibanError ?? undefined}
                  aria-required="true"
                />

                <Input
                  label="Amount (GBP)"
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setAmountError(null) }}
                  error={amountError ?? undefined}
                  hint="Amounts stored as Decimal strings — no floating point"
                  aria-required="true"
                />

                <Input
                  label="Reference (optional)"
                  id="reference"
                  type="text"
                  maxLength={140}
                  placeholder="Invoice #1234"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />

                <Button type="submit" size="lg" className="w-full mt-2">
                  Review transfer
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // ── Step 2: PSD2 Review + Consent ─────────────────────────────────────────
  if (step === "review") {
    return (
      <main className="min-h-screen bg-[--color-bg-page] px-4 py-8" aria-label="Confirm transfer — Step 2 of 2">
        <div className="mx-auto max-w-lg">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-[--color-warning] mb-2" aria-hidden="true">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium">PSD2 Strong Customer Authentication</span>
              </div>
              <CardTitle>Review and confirm</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm mb-6" aria-label="Transfer summary">
                <div className="flex justify-between">
                  <dt className="text-[--color-text-secondary]">Recipient IBAN</dt>
                  <dd className="font-mono font-medium text-[--color-text-primary]">{formattedIban}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[--color-text-secondary]">Amount</dt>
                  <dd className="font-semibold text-[--color-text-primary] tabular-nums">
                    GBP {amount}
                  </dd>
                </div>
                {reference && (
                  <div className="flex justify-between">
                    <dt className="text-[--color-text-secondary]">Reference</dt>
                    <dd className="text-[--color-text-primary]">{reference}</dd>
                  </div>
                )}
              </dl>

              <div className="rounded-[--radius-md] border border-[--color-border-subtle] bg-[--color-bg-elevated] p-4 mb-6">
                <p className="text-xs text-[--color-text-secondary] leading-relaxed">
                  Under <strong>PSD2 Article 97</strong>, this payment requires Strong Customer
                  Authentication. By confirming, you authorise BANXE to execute this payment on
                  your behalf. This instruction cannot be reversed once submitted.
                </p>
              </div>

              <form onSubmit={handleConfirm} noValidate className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <input
                    id="psd2-consent"
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-[--color-border-default] accent-[--color-primary]"
                    checked={psd2Consent}
                    onChange={(e) => setPsd2Consent(e.target.checked)}
                    required
                    aria-required="true"
                  />
                  <label htmlFor="psd2-consent" className="text-xs text-[--color-text-secondary] leading-relaxed">
                    I confirm this payment and consent to SCA under PSD2 Art. 97.
                    I understand this transfer is irreversible once executed.
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep("form")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    loading={loading}
                    disabled={!psd2Consent}
                    aria-disabled={!psd2Consent}
                  >
                    {loading ? "Submitting…" : "Confirm payment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // ── Step 3: Success ────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[--color-bg-page] flex items-center justify-center px-4" aria-label="Transfer confirmed">
      <Card className="max-w-sm w-full text-center">
        <CardContent className="pt-8 pb-8">
          <div
            className="mx-auto h-14 w-14 rounded-full bg-[--color-success-subtle] flex items-center justify-center mb-4"
            aria-hidden="true"
          >
            <ShieldCheck className="h-7 w-7 text-[--color-success]" />
          </div>
          <h1 className="text-lg font-semibold text-[--color-text-primary] mb-2">
            Payment submitted
          </h1>
          <p className="text-sm text-[--color-text-secondary] mb-6">
            GBP {amount} to {formattedIban} — processing under PSD2 SCA.
          </p>
          <Button variant="outline" size="lg" className="w-full" onClick={() => window.location.href = "/dashboard"}>
            Back to dashboard
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
