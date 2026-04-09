export interface SpendingInsight {
  id: string
  category: string
  amount: number
  currency: string
  trend: 'up' | 'down' | 'stable'
  changePercent: number
  period: string
  confidence: number // 0–1
}

export interface AnomalyAlert {
  id: string
  type: 'unusual_spending' | 'large_transaction' | 'recurring_change'
  message: string
  severity: 'low' | 'medium' | 'high'
  confidence: number
  timestamp: string
}

export interface CategoryBreakdown {
  category: string
  amount: number
  percentage: number
  color: string
}
