import React from 'react'
import { Card, Metric, Text, Badge, ProgressBar } from '@tremor/react'
import type { SpendingInsight } from '../features/ai-insights'

interface Props {
  insight: SpendingInsight
}

export function InsightCard({ insight }: Props): React.ReactElement {
  const trendColor = insight.trend === 'up' ? 'rose' : insight.trend === 'down' ? 'emerald' : 'gray'
  const trendLabel =
    insight.trend === 'up'
      ? `+${insight.changePercent}%`
      : insight.trend === 'down'
        ? `${insight.changePercent}%`
        : '0%'

  return (
    <Card className="banxe-card">
      <div className="flex items-center justify-between">
        <Text className="text-slate-400">{insight.category}</Text>
        <Badge color={trendColor as 'rose' | 'emerald' | 'gray'}>{trendLabel}</Badge>
      </div>
      <Metric className="text-slate-100 font-mono mt-2">
        {new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: insight.currency,
          minimumFractionDigits: 2,
        }).format(insight.amount)}
      </Metric>
      <Text className="text-slate-500 text-xs mt-0.5">{insight.period}</Text>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>AI Confidence</span>
          <span>{Math.round(insight.confidence * 100)}%</span>
        </div>
        <ProgressBar value={insight.confidence * 100} color="blue" className="h-1.5" />
      </div>
    </Card>
  )
}
