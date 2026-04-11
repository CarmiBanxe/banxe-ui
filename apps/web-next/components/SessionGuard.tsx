"use client"

/**
 * SessionGuard — client component that enforces session timeout.
 *
 * Listens for user activity events (mouse, keyboard, touch, scroll) and
 * resets a 5-minute inactivity timer. At T-60s shows a warning modal.
 * On timeout: clears the auth cookie and redirects to /auth/login.
 *
 * Wrapped around all authenticated content in app/layout.tsx.
 */

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSessionTimeout } from "@banxe/shared/hooks"

const ACTIVITY_EVENTS = [
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "pointermove",
] as const

/** Clears the banxe_token cookie (client-side) */
function clearAuthCookie() {
  document.cookie = "banxe_token=; Max-Age=0; path=/; SameSite=Strict"
}

// ── Warning modal ─────────────────────────────────────────────────────────────

function SessionWarningModal({
  remainingSecs,
  onStay,
}: {
  remainingSecs: number
  onStay: () => void
}) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-desc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="mx-4 w-full max-w-sm rounded-[--radius-xl] bg-[--color-bg-surface] p-6 shadow-xl">
        {/* Icon */}
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[--color-warning-subtle]"
          aria-hidden="true"
        >
          <span className="text-2xl">⏱</span>
        </div>

        <h2
          id="session-warning-title"
          className="mb-2 text-center text-lg font-bold text-[--color-text-primary]"
        >
          Session expiring soon
        </h2>

        <p
          id="session-warning-desc"
          className="mb-6 text-center text-sm text-[--color-text-secondary]"
        >
          For your security, you will be signed out in{" "}
          <strong className="tabular-nums text-[--color-warning]">
            {remainingSecs}s
          </strong>{" "}
          due to inactivity.
        </p>

        <button
          onClick={onStay}
          className="w-full rounded-[--radius-md] bg-[--color-primary] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-border-focus]"
          autoFocus
        >
          Stay signed in
        </button>
      </div>
    </div>
  )
}

// ── Guard ─────────────────────────────────────────────────────────────────────

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleTimeout = useCallback(() => {
    clearAuthCookie()
    router.push("/auth/login?reason=session_expired")
  }, [router])

  const { resetTimer, showWarning, remainingSecs, extendSession } =
    useSessionTimeout({
      timeoutMs: 5 * 60 * 1000,  // 5 minutes
      warningMs: 60 * 1000,       // warn at 4 min (1 min left)
      onTimeout: handleTimeout,
    })

  useEffect(() => {
    // Start the timer on mount
    resetTimer()

    // Listen for any user activity to reset
    const handler = () => resetTimer()
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handler, { passive: true })
    )

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handler)
      )
    }
  }, [resetTimer])

  return (
    <>
      {children}
      {showWarning && (
        <SessionWarningModal
          remainingSecs={remainingSecs}
          onStay={extendSession}
        />
      )}
    </>
  )
}
