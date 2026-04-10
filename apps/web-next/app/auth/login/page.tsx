"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [pin, setPin] = useState("")
  const [gdprConsent, setGdprConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gdprConsent) {
      setError("You must consent to data processing to continue.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      // TODO: wire to API — POST /v1/auth/login
      await new Promise((r) => setTimeout(r, 800))
      // redirect to dashboard on success
      window.location.href = "/dashboard"
    } catch {
      setError("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[--color-bg-page] px-4"
      aria-label="Login page"
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          {/* BANXE Logo */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="h-8 w-8 rounded-[--radius-md] bg-[--color-primary] flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="font-semibold text-[--color-primary]">BANXE</span>
          </div>
          <CardTitle>Sign in to your account</CardTitle>
          <p className="text-sm text-[--color-text-secondary]">
            FCA-authorised EMI — your funds are safeguarded
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              id="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <Input
              label="PIN"
              type="password"
              id="pin"
              autoComplete="current-password"
              inputMode="numeric"
              maxLength={6}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit PIN"
              hint="Enter your 6-digit PIN"
            />

            {/* GDPR + PSD2 consent — required */}
            <div className="flex items-start gap-3">
              <input
                id="gdpr-consent"
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[--color-border-default] accent-[--color-primary]"
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                required
                aria-required="true"
              />
              <label htmlFor="gdpr-consent" className="text-xs text-[--color-text-secondary] leading-relaxed">
                I consent to the processing of my personal data for authentication
                purposes under{" "}
                <a href="/legal/privacy" className="underline text-[--color-primary]">
                  GDPR Art. 6(1)(b)
                </a>{" "}
                and{" "}
                <a href="/legal/psd2" className="underline text-[--color-primary]">
                  PSD2
                </a>
                .
              </label>
            </div>

            {error && (
              <p role="alert" className="text-sm text-[--color-error]">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <p className="text-center text-sm text-[--color-text-secondary]">
              <a href="/auth/forgot-pin" className="underline text-[--color-primary]">
                Forgot PIN?
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
