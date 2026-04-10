import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[--color-text-primary]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={error ? "true" : undefined}
          className={cn(
            "h-10 w-full rounded-[--radius-md] border px-3 py-2 text-sm",
            "bg-[--color-bg-surface] text-[--color-text-primary]",
            "placeholder:text-[--color-text-disabled]",
            "transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-border-focus] focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:bg-[--color-interaction-disabled] disabled:text-[--color-text-disabled]",
            error
              ? "border-[--color-error] focus-visible:ring-[--color-error]"
              : "border-[--color-border-default]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs text-[--color-text-secondary]">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-[--color-error]">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"
