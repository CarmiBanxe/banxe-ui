/**
 * packages/shared/src/hooks/useSessionTimeout.ts
 *
 * Platform-agnostic session timeout hook.
 *
 * Manages a two-phase timer:
 *   Phase 1 (0 → timeoutMs - warningMs): silent countdown
 *   Phase 2 (timeoutMs - warningMs → timeoutMs): warning countdown with remainingSecs
 *
 * Consumers call `resetTimer()` on every user activity event (platform-specific).
 * When timeout fires, `onTimeout()` is called (platform-specific: redirect/logout).
 *
 * Usage:
 *   const { resetTimer, showWarning, remainingSecs } = useSessionTimeout({
 *     timeoutMs: 5 * 60 * 1000,   // 5 min
 *     warningMs: 60 * 1000,       // warn at 4 min (1 min left)
 *     onTimeout: () => router.push('/auth/login'),
 *   })
 */

import { useState, useCallback, useRef, useEffect } from "react"

export interface SessionTimeoutOptions {
  /** Total inactivity timeout in ms. Default: 5 minutes. */
  timeoutMs?: number
  /** How many ms before timeout to show the warning. Default: 60 seconds. */
  warningMs?: number
  /** Called when the session times out (user inactive for timeoutMs). */
  onTimeout: () => void
}

export interface SessionTimeoutResult {
  /** Call this on every user activity event to reset the timer. */
  resetTimer: () => void
  /** True when in the warning phase (< warningMs remaining). */
  showWarning: boolean
  /** Seconds remaining in the warning countdown (0 when not in warning phase). */
  remainingSecs: number
  /** Dismiss the warning and extend the session (calls resetTimer). */
  extendSession: () => void
}

export function useSessionTimeout({
  timeoutMs = 5 * 60 * 1000,
  warningMs = 60 * 1000,
  onTimeout,
}: SessionTimeoutOptions): SessionTimeoutResult {
  const [showWarning, setShowWarning] = useState(false)
  const [remainingSecs, setRemainingSecs] = useState(0)

  const silentTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearAll = useCallback(() => {
    if (silentTimerRef.current)  clearTimeout(silentTimerRef.current)
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current)
    if (countdownRef.current)    clearInterval(countdownRef.current)
    silentTimerRef.current  = null
    timeoutTimerRef.current = null
    countdownRef.current    = null
  }, [])

  const resetTimer = useCallback(() => {
    clearAll()
    setShowWarning(false)
    setRemainingSecs(0)

    // Phase 1: silent — fire when warningMs remain
    silentTimerRef.current = setTimeout(() => {
      const secs = Math.round(warningMs / 1000)
      setShowWarning(true)
      setRemainingSecs(secs)

      // Countdown tick every second
      countdownRef.current = setInterval(() => {
        setRemainingSecs((s: number) => {
          if (s <= 1) {
            clearInterval(countdownRef.current!)
            countdownRef.current = null
            return 0
          }
          return s - 1
        })
      }, 1000)
    }, timeoutMs - warningMs)

    // Phase 2: actual timeout
    timeoutTimerRef.current = setTimeout(() => {
      clearAll()
      setShowWarning(false)
      onTimeout()
    }, timeoutMs)
  }, [timeoutMs, warningMs, onTimeout, clearAll])

  const extendSession = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => { clearAll() }
  }, [clearAll])

  return { resetTimer, showWarning, remainingSecs, extendSession }
}
