import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * AuthLayout — centered card layout for login/onboarding
 * Used for: login, KYC onboarding, 2FA setup
 */
export function AuthLayout(): React.ReactElement {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-xl font-bold text-inverse">
          B
        </div>
        <span className="text-2xl font-bold text-primary">BANXE AI BANK</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-bg-surface border border-border-subtle rounded-xl p-8 shadow-modal">
        <Outlet />
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-secondary text-center">
        FCA authorised Electronic Money Institution · Reg. no. 123456
      </p>
    </div>
  )
}
