import React from 'react'

/**
 * Input — BANXE design system primitive
 *
 * Variants: default | monospace (amounts, IBANs, references)
 * States: default | focused | error | disabled
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  monospace?: boolean
  leftAdornment?: React.ReactNode
  rightAdornment?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      monospace = false,
      leftAdornment,
      rightAdornment,
      id,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const errorId = error ? `${inputId}-error` : undefined
    const hintId  = hint  ? `${inputId}-hint`  : undefined

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-secondary"
          >
            {label}
          </label>
        )}

        <div className={`relative flex items-center ${error ? 'ring-1 ring-error' : ''} rounded-lg`}>
          {leftAdornment && (
            <span className="absolute left-3 text-secondary pointer-events-none" aria-hidden="true">
              {leftAdornment}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            className={[
              'w-full bg-surface border rounded-lg text-primary transition-colors',
              'placeholder:text-disabled',
              'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error ? 'border-error' : 'border-border-default',
              monospace ? 'font-mono' : '',
              leftAdornment ? 'pl-9' : 'pl-3',
              rightAdornment ? 'pr-9' : 'pr-3',
              'py-2 text-sm',
              className,
            ].join(' ')}
            {...props}
          />

          {rightAdornment && (
            <span className="absolute right-3 text-secondary" aria-hidden="true">
              {rightAdornment}
            </span>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-xs text-secondary">{hint}</p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-error" role="alert">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
