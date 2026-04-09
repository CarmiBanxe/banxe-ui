import React from 'react'

/**
 * Skeleton — loading placeholder primitive
 *
 * Rule: NEVER use spinner-only loading states.
 * Always use skeleton screens that match the layout of the loaded content.
 *
 * Variants:
 * - text: single line of text
 * - block: rectangular area (cards, images)
 * - circle: avatar, icon placeholder
 */

export interface SkeletonProps {
  variant?: 'text' | 'block' | 'circle'
  width?: string
  height?: string
  className?: string
  'aria-label'?: string
}

export function Skeleton({
  variant = 'block',
  width,
  height,
  className = '',
  'aria-label': ariaLabel,
}: SkeletonProps): React.ReactElement {
  const base =
    'skeleton animate-shimmer bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface bg-[length:200%_100%]'

  const variantClass = {
    text:   'h-4 rounded-sm',
    block:  'rounded-lg',
    circle: 'rounded-full',
  }[variant]

  return (
    <div
      className={[base, variantClass, className].join(' ')}
      style={{ width, height }}
      role="status"
      aria-label={ariaLabel ?? 'Loading…'}
      aria-live="polite"
    />
  )
}

/** Pre-composed skeleton for a single TransactionRow */
export function TransactionRowSkeleton(): React.ReactElement {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
      <Skeleton variant="circle" width="32px" height="32px" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" height="10px" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <Skeleton variant="text" width="64px" />
        <Skeleton variant="text" width="48px" height="10px" />
      </div>
    </div>
  )
}

/** Pre-composed skeleton for a BalanceWidget */
export function BalanceWidgetSkeleton(): React.ReactElement {
  return (
    <div className="p-6 rounded-xl bg-surface border border-border-subtle flex flex-col gap-3">
      <Skeleton variant="text" width="80px" height="12px" />
      <Skeleton variant="text" width="200px" height="36px" />
      <div className="flex gap-6">
        <Skeleton variant="text" width="120px" height="12px" />
        <Skeleton variant="text" width="120px" height="12px" />
      </div>
    </div>
  )
}
