import React from 'react'
import { Badge } from '@tremor/react'

interface Props {
  confidence: number // 0–1
  showPercent?: boolean
}

function getColor(confidence: number): 'emerald' | 'amber' | 'rose' {
  if (confidence > 0.8) return 'emerald'
  if (confidence > 0.6) return 'amber'
  return 'rose'
}

function getLabel(confidence: number): string {
  if (confidence > 0.8) return 'High'
  if (confidence > 0.6) return 'Medium'
  return 'Low'
}

export function ConfidenceBadge({ confidence, showPercent = true }: Props): React.ReactElement {
  const color = getColor(confidence)
  const label = getLabel(confidence)
  const pct = Math.round(confidence * 100)

  return (
    <Badge color={color} aria-label={`AI confidence: ${pct}%`}>
      {label}{showPercent ? ` · ${pct}%` : ''}
    </Badge>
  )
}
