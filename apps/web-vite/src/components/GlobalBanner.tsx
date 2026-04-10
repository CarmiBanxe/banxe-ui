import React, { useState } from 'react'

/**
 * GlobalBanner — shared state banners per BANXE-SCREEN-INVENTORY.md
 *
 * States handled:
 * - network_offline: "You're offline — some features unavailable"
 * - compliance_hold: "Your account is under review" (read-only mode)
 * - session_expiring: "Your session expires in 2 minutes"
 * - maintenance: "Scheduled maintenance" (static config)
 */

type BannerType = 'offline' | 'compliance_hold' | 'session_expiring'

interface Banner {
  type: BannerType
  message: string
  dismissible: boolean
}

// In a real app these come from global state / WebSocket events.
// For prototype: detect browser offline status.

export function GlobalBanner(): React.ReactElement | null {
  const [dismissed, setDismissed] = useState<Set<BannerType>>(new Set())
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  React.useEffect(() => {
    const onOnline  = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online',  onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online',  onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const activeBanners: Banner[] = []

  if (!isOnline) {
    activeBanners.push({
      type: 'offline',
      message: "You're offline — some features are unavailable",
      dismissible: false,
    })
  }

  const visible = activeBanners.filter((b) => !dismissed.has(b.type))
  if (visible.length === 0) return null

  const BG: Record<BannerType, string> = {
    offline: 'bg-error-subtle border-error text-error',
    compliance_hold: 'bg-warning-subtle border-warning text-warning',
    session_expiring: 'bg-info-subtle border-info text-info',
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-px"
      role="status"
      aria-live="polite"
    >
      {visible.map((banner) => (
        <div
          key={banner.type}
          className={`flex items-center justify-between px-4 py-2 border-b text-sm ${BG[banner.type]}`}
        >
          <p>{banner.message}</p>
          {banner.dismissible && (
            <button
              onClick={() => setDismissed((prev) => new Set([...prev, banner.type]))}
              className="ml-4 text-xs hover:underline"
              aria-label="Dismiss notification"
            >
              Dismiss
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
