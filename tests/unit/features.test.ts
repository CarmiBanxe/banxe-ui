/**
 * Unit tests for feature hooks — ai-insights, payments, kyc
 * BANXE AI BANK | IL-068 | Developer Plane
 */
import { renderHook, act, waitFor } from '@testing-library/react'
import { useInsights } from '../../apps/web/src/features/ai-insights'
import { useSendMoney } from '../../apps/web/src/features/payments'
import { useKyc } from '../../apps/web/src/features/kyc'

// ── useInsights ──────────────────────────────────────────────────────────────

describe('useInsights', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => useInsights())
    expect(result.current.loading).toBe(true)
    expect(result.current.insights).toHaveLength(0)
  })

  it('loads insights, alerts, breakdown after timeout', async () => {
    const { result } = renderHook(() => useInsights())
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 1000 })
    expect(result.current.insights.length).toBeGreaterThan(0)
    expect(result.current.alerts.length).toBeGreaterThan(0)
    expect(result.current.breakdown.length).toBeGreaterThan(0)
  })

  it('insights have required fields', async () => {
    const { result } = renderHook(() => useInsights())
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 1000 })
    const insight = result.current.insights[0]
    expect(insight).toHaveProperty('id')
    expect(insight).toHaveProperty('category')
    expect(insight).toHaveProperty('confidence')
    expect(insight.confidence).toBeGreaterThan(0)
    expect(insight.confidence).toBeLessThanOrEqual(1)
  })

  it('breakdown percentages sum to ~100', async () => {
    const { result } = renderHook(() => useInsights())
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 1000 })
    const total = result.current.breakdown.reduce((s, b) => s + b.percentage, 0)
    expect(total).toBe(100)
  })
})

// ── useSendMoney ─────────────────────────────────────────────────────────────

describe('useSendMoney', () => {
  it('starts at step 1 (recipient)', () => {
    const { result } = renderHook(() => useSendMoney())
    expect(result.current.form.step).toBe(1)
    expect(result.current.currentStep).toBe('recipient')
  })

  it('nextStep advances from 1 to 2', () => {
    const { result } = renderHook(() => useSendMoney())
    act(() => { result.current.nextStep() })
    expect(result.current.form.step).toBe(2)
    expect(result.current.currentStep).toBe('amount')
  })

  it('nextStep advances from 2 to 3', () => {
    const { result } = renderHook(() => useSendMoney())
    act(() => { result.current.nextStep(); result.current.nextStep() })
    expect(result.current.form.step).toBe(3)
    expect(result.current.currentStep).toBe('confirm')
  })

  it('nextStep does not go beyond step 3', () => {
    const { result } = renderHook(() => useSendMoney())
    act(() => { result.current.nextStep(); result.current.nextStep(); result.current.nextStep() })
    expect(result.current.form.step).toBe(3)
  })

  it('prevStep goes back from 2 to 1', () => {
    const { result } = renderHook(() => useSendMoney())
    act(() => { result.current.nextStep() })
    act(() => { result.current.prevStep() })
    expect(result.current.form.step).toBe(1)
  })

  it('prevStep does not go below step 1', () => {
    const { result } = renderHook(() => useSendMoney())
    act(() => { result.current.prevStep() })
    expect(result.current.form.step).toBe(1)
  })

  it('updateForm updates fields', () => {
    const { result } = renderHook(() => useSendMoney())
    act(() => { result.current.updateForm({ recipientName: 'John Doe', currency: 'GBP' }) })
    expect(result.current.form.recipientName).toBe('John Doe')
    expect(result.current.form.currency).toBe('GBP')
  })

  it('submit sets result with PAY- prefix', async () => {
    const { result } = renderHook(() => useSendMoney())
    act(() => { result.current.updateForm({ recipientName: 'Test', amount: 100 }) })
    act(() => { void result.current.submit() })
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 2500 })
    expect(result.current.result).not.toBeNull()
    expect(result.current.result?.id).toMatch(/^PAY-/)
    expect(result.current.result?.status).toBe('completed')
  })

  it('reset clears form and result', async () => {
    const { result } = renderHook(() => useSendMoney())
    act(() => { result.current.updateForm({ recipientName: 'Test' }) })
    act(() => { result.current.reset() })
    expect(result.current.form.recipientName).toBe('')
    expect(result.current.result).toBeNull()
  })
})

// ── useKyc ───────────────────────────────────────────────────────────────────

describe('useKyc', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => useKyc())
    expect(result.current.loading).toBe(true)
    expect(result.current.kyc).toBeNull()
  })

  it('loads kyc with enhanced level', async () => {
    const { result } = renderHook(() => useKyc())
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 1000 })
    expect(result.current.kyc).not.toBeNull()
    expect(result.current.kyc?.level).toBe('enhanced')
    expect(result.current.kyc?.status).toBe('approved')
  })

  it('kyc has 3 approved documents', async () => {
    const { result } = renderHook(() => useKyc())
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 1000 })
    expect(result.current.kyc?.documents).toHaveLength(3)
    result.current.kyc?.documents.forEach(doc => {
      expect(doc.status).toBe('approved')
    })
  })

  it('kyc limits are set', async () => {
    const { result } = renderHook(() => useKyc())
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 1000 })
    expect(result.current.kyc?.limits.daily).toBe(50000)
    expect(result.current.kyc?.limits.monthly).toBe(200000)
    expect(result.current.kyc?.limits.currency).toBe('EUR')
  })
})
