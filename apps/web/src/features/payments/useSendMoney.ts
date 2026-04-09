import { useState, useCallback } from 'react'
import type { SendMoneyForm, PaymentResult, SendStep } from './types'

const INITIAL_FORM: SendMoneyForm = {
  step: 1, recipientName: '', recipientIban: '',
  amount: 0, currency: 'EUR', reference: '',
}

export function useSendMoney() {
  const [form, setForm] = useState<SendMoneyForm>(INITIAL_FORM)
  const [result, setResult] = useState<PaymentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStep: SendStep =
    form.step === 1 ? 'recipient' : form.step === 2 ? 'amount' : 'confirm'

  const updateForm = useCallback((updates: Partial<SendMoneyForm>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }, [])

  const nextStep = useCallback(() => {
    setForm(prev => ({ ...prev, step: Math.min(prev.step + 1, 3) as 1 | 2 | 3 }))
  }, [])

  const prevStep = useCallback(() => {
    setForm(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) as 1 | 2 | 3 }))
  }, [])

  const submit = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await new Promise(r => setTimeout(r, 1500))
      setResult({
        id: `PAY-${Date.now()}`,
        status: 'completed',
        amount: form.amount,
        currency: form.currency,
        recipientName: form.recipientName,
        timestamp: new Date().toISOString(),
        estimatedArrival: 'Instant',
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }, [form])

  const reset = useCallback(() => {
    setForm(INITIAL_FORM)
    setResult(null)
    setError(null)
  }, [])

  return { form, currentStep, result, loading, error, updateForm, nextStep, prevStep, submit, reset }
}
