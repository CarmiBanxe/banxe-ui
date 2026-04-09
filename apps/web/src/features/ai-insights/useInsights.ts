import { useState, useEffect } from 'react'
import type { SpendingInsight, AnomalyAlert, CategoryBreakdown } from './types'

const MOCK_INSIGHTS: SpendingInsight[] = [
  { id: '1', category: 'Food & Dining', amount: 432.50, currency: 'EUR', trend: 'up', changePercent: 12, period: 'This month', confidence: 0.87 },
  { id: '2', category: 'Transport', amount: 189.00, currency: 'EUR', trend: 'down', changePercent: -8, period: 'This month', confidence: 0.92 },
  { id: '3', category: 'Subscriptions', amount: 67.99, currency: 'EUR', trend: 'stable', changePercent: 0, period: 'This month', confidence: 0.95 },
]

const MOCK_ALERTS: AnomalyAlert[] = [
  { id: '1', type: 'unusual_spending', message: 'Spending in Food & Dining is 12% above your average', severity: 'medium', confidence: 0.87, timestamp: '2026-04-09T06:00:00Z' },
]

const MOCK_BREAKDOWN: CategoryBreakdown[] = [
  { category: 'Food & Dining', amount: 432.50, percentage: 35, color: '#2563EB' },
  { category: 'Transport', amount: 189.00, percentage: 15, color: '#F59E0B' },
  { category: 'Subscriptions', amount: 67.99, percentage: 6, color: '#10B981' },
  { category: 'Shopping', amount: 312.00, percentage: 25, color: '#8B5CF6' },
  { category: 'Other', amount: 234.51, percentage: 19, color: '#94A3B8' },
]

export function useInsights() {
  const [insights, setInsights] = useState<SpendingInsight[]>([])
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([])
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setInsights(MOCK_INSIGHTS)
      setAlerts(MOCK_ALERTS)
      setBreakdown(MOCK_BREAKDOWN)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return { insights, alerts, breakdown, loading }
}
