import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[--color-primary] text-[--color-text-inverse] hover:bg-[--color-primary-light] focus-visible:ring-2 focus-visible:ring-[--color-primary]",
  secondary:
    "bg-[--color-accent] text-[--color-text-inverse] hover:bg-[--color-accent-light] focus-visible:ring-2 focus-visible:ring-[--color-accent]",
  outline:
    "border border-[--color-border-default] bg-transparent text-[--color-text-primary] hover:bg-[--color-bg-elevated]",
  ghost:
    "bg-transparent text-[--color-text-primary] hover:bg-[--color-bg-elevated]",
  destructive:
    "bg-[--color-error] text-[--color-text-inverse] hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-[--color-error]",
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-sm rounded-[--radius-md]",
  md: "h-10 px-4 text-sm rounded-[--radius-md]",
  lg: "h-12 px-6 text-base rounded-[--radius-md]",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
