import React, { useEffect, useRef } from 'react'

/**
 * Dialog — BANXE design system primitive
 *
 * Lightweight modal dialog with focus trap + Escape to close.
 * Note: Radix UI Dialog is preferred in production (installed via @radix-ui/react-dialog).
 * This is a self-contained fallback for dev prototype.
 */

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg'
}

const MAX_W: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: DialogProps): React.ReactElement | null {
  const overlayRef = useRef<HTMLDivElement>(null)
  const titleId = React.useId()
  const descId  = React.useId()

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — tabIndex makes dialog panel focusable (required for focus trap) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={[
          'relative w-full bg-elevated border border-border-default rounded-xl shadow-modal',
          'animate-fade-in',
          MAX_W[maxWidth],
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border-subtle">
          <h2 id={titleId} className="text-base font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors ml-4"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {description && (
            <p id={descId} className="text-sm text-secondary mb-4">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
