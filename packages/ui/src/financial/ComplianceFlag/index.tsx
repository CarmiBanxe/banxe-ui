import React from 'react'

export type FlagType = 'AML' | 'SANCTIONS' | 'EDD' | 'SAR' | 'STRUCTURING' | 'REVIEW' | 'BLOCKED'

interface ComplianceFlagProps {
  type: FlagType
  note?: string
  compact?: boolean
}

const FLAG_CONFIG: Record<FlagType, { label: string; detail: string; className: string }> = {
  AML:          { label: 'AML Review',   detail: 'AML monitoring triggered',          className: 'border-warning text-warning bg-warning-subtle' },
  SANCTIONS:    { label: 'Sanctions Hit', detail: 'Sanctions check match',            className: 'border-error text-error bg-error-subtle' },
  EDD:          { label: 'EDD Required', detail: 'Enhanced due diligence required',   className: 'border-warning text-warning bg-warning-subtle' },
  SAR:          { label: 'SAR Filed',    detail: 'Suspicious activity report filed',  className: 'border-error text-error bg-error-subtle' },
  STRUCTURING:  { label: 'Structuring',  detail: 'Possible structuring detected',     className: 'border-warning text-warning bg-warning-subtle' },
  REVIEW:       { label: 'Under Review', detail: 'Transaction flagged for review',    className: 'border-warning text-warning bg-warning-subtle' },
  BLOCKED:      { label: 'Blocked',      detail: 'Transaction blocked by compliance', className: 'border-error text-error bg-error-subtle' },
}

/**
 * ComplianceFlag — compliance annotation on a transaction or account.
 * Always visible to authorized roles. Never hidden or styled away.
 */
export function ComplianceFlag({ type, note, compact = false }: ComplianceFlagProps): React.ReactElement {
  const { label, detail, className } = FLAG_CONFIG[type]

  if (compact) {
    return (
      <span
        role="img"
        aria-label={`Compliance flag: ${label}`}
        title={note ?? detail}
        className={`inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded border ${className}`}
      >
        ⚑ {label}
      </span>
    )
  }

  return (
    <div
      role="alert"
      aria-label={`Compliance flag: ${label}`}
      className={`rounded-md border px-3 py-2 text-sm ${className}`}
    >
      <p className="font-semibold">⚑ {label}</p>
      <p className="text-xs mt-0.5 opacity-80">{note ?? detail}</p>
    </div>
  )
}
