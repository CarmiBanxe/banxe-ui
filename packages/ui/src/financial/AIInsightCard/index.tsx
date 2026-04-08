import React, { useState } from 'react'

export type Confidence = 'HIGH' | 'MEDIUM' | 'UNCERTAIN'

interface AIInsightCardProps {
  insight: string
  confidence: Confidence
  explanation?: string
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
}

const CONFIDENCE_CONFIG: Record<Confidence, { label: string; className: string }> = {
  HIGH:      { label: 'High confidence',   className: 'text-success' },
  MEDIUM:    { label: 'Medium confidence', className: 'text-warning' },
  UNCERTAIN: { label: 'Uncertain',         className: 'text-secondary' },
}

/**
 * AIInsightCard — AI-generated content block.
 *
 * Mandatory rules per BANXE-UI-UX-SYSTEM.md:
 * - ALWAYS shows AI badge
 * - ALWAYS shows confidence level
 * - ALWAYS provides explanation toggle ("Why this?")
 * - NEVER auto-acts — action requires explicit user click
 * - All content labeled "AI-generated" for screen readers
 */
export function AIInsightCard({
  insight,
  confidence,
  explanation,
  actionLabel,
  onAction,
  onDismiss,
}: AIInsightCardProps): React.ReactElement {
  const [showExplanation, setShowExplanation] = useState(false)
  const { label: confLabel, className: confClass } = CONFIDENCE_CONFIG[confidence]

  return (
    <section
      aria-label="AI-generated insight"
      className="rounded-lg bg-ai-subtle border border-ai-accent/20 p-4"
    >
      {/* Header: AI badge + confidence */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full bg-ai-accent/20 text-ai-accent"
            aria-label="AI-generated content"
          >
            BANXE AI
          </span>
          <span className={`text-xs font-medium ${confClass}`}>
            {confLabel}
          </span>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs text-secondary hover:text-primary transition-colors"
            aria-label="Dismiss AI insight"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Insight text */}
      <p className="text-sm text-primary leading-relaxed">{insight}</p>

      {/* Explanation toggle */}
      {explanation && (
        <div className="mt-2">
          <button
            onClick={() => setShowExplanation((s) => !s)}
            className="text-xs text-brand-primary hover:underline"
            aria-expanded={showExplanation}
          >
            {showExplanation ? 'Hide explanation' : 'Why this?'}
          </button>
          {showExplanation && (
            <p className="mt-1.5 text-xs text-secondary leading-relaxed border-l-2 border-ai-accent/30 pl-3">
              {explanation}
            </p>
          )}
        </div>
      )}

      {/* Optional action */}
      {actionLabel && onAction && (
        <div className="mt-3">
          <button
            onClick={onAction}
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-brand-subtle text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </section>
  )
}
