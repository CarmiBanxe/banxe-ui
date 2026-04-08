import React from 'react'

export type ChipStatus =
  | 'COMPLETED'
  | 'PENDING'
  | 'FAILED'
  | 'BLOCKED'
  | 'REVIEW'
  | 'ACTIVE'
  | 'RESTRICTED'
  | 'SUSPENDED'

interface StatusChipProps {
  status: ChipStatus
  size?: 'sm' | 'md'
}

const CONFIG: Record<ChipStatus, { label: string; className: string; icon: string }> = {
  COMPLETED:  { label: 'Completed',  icon: '✓', className: 'bg-success-subtle text-success border-transparent' },
  PENDING:    { label: 'Pending',    icon: '○', className: 'bg-warning-subtle text-warning border-transparent' },
  FAILED:     { label: 'Failed',     icon: '✕', className: 'bg-error-subtle text-error border-transparent' },
  BLOCKED:    { label: 'Blocked',    icon: '⊘', className: 'bg-error-subtle text-error border border-error' },
  REVIEW:     { label: 'Review',     icon: '⚑', className: 'bg-warning-subtle text-warning border border-warning' },
  ACTIVE:     { label: 'Active',     icon: '●', className: 'bg-success-subtle text-success border-transparent' },
  RESTRICTED: { label: 'Restricted', icon: '⚠', className: 'bg-warning-subtle text-warning border border-warning' },
  SUSPENDED:  { label: 'Suspended',  icon: '⊘', className: 'bg-error-subtle text-error border-transparent' },
}

const SIZE = {
  sm: 'text-xs px-1.5 py-0.5 gap-1',
  md: 'text-sm px-2 py-1 gap-1.5',
}

/**
 * StatusChip — status indicator with icon + text.
 * Never relies on color alone (WCAG 1.4.1).
 */
export function StatusChip({ status, size = 'sm' }: StatusChipProps): React.ReactElement {
  const { label, icon, className } = CONFIG[status]
  return (
    <span
      role="status"
      aria-label={`Status: ${label}`}
      className={`inline-flex items-center rounded font-medium border ${className} ${SIZE[size]}`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  )
}
