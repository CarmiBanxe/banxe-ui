import React, { useState } from 'react'
import { StatusChip } from '@banxe/ui'
import type { ChipStatus } from '@banxe/ui'

/**
 * Profile / Settings — W-06
 *
 * Purpose: Account management, notification preferences, security settings.
 * Required components: ProfileCard, KYCStatusPanel, NotificationPreferencesForm,
 *   SecuritySettings (2FA), StatementDownload, DangerZone
 * Data: user profile, KYC/EDD status, 2FA config, notification prefs, API access
 * States: viewing | editing | saving | saved | error
 */

type KYCStatus = 'APPROVED' | 'PENDING' | 'IN_REVIEW' | 'REJECTED'

interface UserProfile {
  name: string
  email: string
  entityType: 'individual' | 'business'
  kycStatus: KYCStatus
  eddStatus: 'NOT_REQUIRED' | 'PENDING' | 'COMPLETED'
  twoFaEnabled: boolean
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

const MOCK_PROFILE: UserProfile = {
  name: 'Moriel Carmi',
  email: 'm.carmi@banxe.com',
  entityType: 'individual',
  kycStatus: 'APPROVED',
  eddStatus: 'NOT_REQUIRED',
  twoFaEnabled: true,
  notifications: { email: true, sms: false, push: true },
}

const KYC_STATUS_CHIP: Record<KYCStatus, ChipStatus> = {
  APPROVED: 'ACTIVE',
  PENDING: 'PENDING',
  IN_REVIEW: 'REVIEW',
  REJECTED: 'BLOCKED',
}

export function Profile(): React.ReactElement {
  const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile.name)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showDangerZone, setShowDangerZone] = useState(false)

  const handleSave = async () => {
    setSaveState('saving')
    await new Promise((r) => setTimeout(r, 800))
    setProfile((p) => ({ ...p, name: editName }))
    setSaveState('saved')
    setIsEditing(false)
    setTimeout(() => setSaveState('idle'), 3000)
  }

  const toggleNotification = (channel: keyof UserProfile['notifications']) => {
    setProfile((p) => ({
      ...p,
      notifications: { ...p.notifications, [channel]: !p.notifications[channel] },
    }))
  }

  return (
    <div className="p-6 min-h-screen bg-bg-base max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Profile & Settings</h1>

      {saveState === 'saved' && (
        <div className="mb-4 p-3 rounded-lg bg-success-subtle border border-success text-success text-sm" role="status">
          ✓ Changes saved
        </div>
      )}

      {/* ── Profile card ── */}
      <section className="rounded-lg bg-surface border border-border-subtle p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Personal details
          </h2>
          {!isEditing && (
            <button
              onClick={() => { setIsEditing(true); setEditName(profile.name) }}
              className="text-xs text-brand-primary hover:text-brand-light transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-secondary mb-1" htmlFor="profile-name">
                Full name
              </label>
              <input
                id="profile-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-elevated border border-border-default text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <p className="block text-xs text-secondary mb-1">Email</p>
              <p className="text-sm text-secondary">{profile.email} — contact support to change</p>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 rounded-lg bg-surface border border-border-default text-sm text-primary hover:bg-overlay transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveState === 'saving'}
                className="flex-1 py-2 rounded-lg bg-brand-primary text-inverse text-sm font-medium hover:bg-brand-light disabled:opacity-50 transition-colors"
              >
                {saveState === 'saving' ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        ) : (
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-secondary">Name</dt>
              <dd className="text-primary font-semibold">{profile.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary">Email</dt>
              <dd className="text-primary">{profile.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary">Account type</dt>
              <dd className="text-primary capitalize">{profile.entityType}</dd>
            </div>
          </dl>
        )}
      </section>

      {/* ── KYC status ── */}
      <section className="rounded-lg bg-surface border border-border-subtle p-5 mb-4">
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
          Verification status
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Identity verification (KYC)</p>
              <p className="text-xs text-secondary">FCA AML/CTF compliance verification</p>
            </div>
            <StatusChip status={KYC_STATUS_CHIP[profile.kycStatus]} />
          </div>
          {profile.eddStatus !== 'NOT_REQUIRED' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">Enhanced due diligence (EDD)</p>
                <p className="text-xs text-secondary">Additional verification required</p>
              </div>
              <StatusChip status={profile.eddStatus === 'COMPLETED' ? 'ACTIVE' : 'PENDING'} />
            </div>
          )}
          {profile.kycStatus === 'REJECTED' && (
            <p className="text-xs text-error bg-error-subtle rounded px-3 py-2" role="alert">
              Your identity verification was not completed. Please contact support.
            </p>
          )}
        </div>
      </section>

      {/* ── Security settings ── */}
      <section className="rounded-lg bg-surface border border-border-subtle p-5 mb-4">
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
          Security
        </h2>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-primary">Two-factor authentication</p>
            <p className="text-xs text-secondary">Required for payments over £30</p>
          </div>
          <button
            onClick={() => setProfile((p) => ({ ...p, twoFaEnabled: !p.twoFaEnabled }))}
            role="switch"
            aria-checked={profile.twoFaEnabled}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              profile.twoFaEnabled ? 'bg-brand-primary' : 'bg-border-default'
            }`}
            aria-label="Toggle two-factor authentication"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                profile.twoFaEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
        <div className="border-t border-border-subtle pt-3 mt-2">
          <button className="text-sm text-brand-primary hover:text-brand-light transition-colors">
            View active sessions →
          </button>
        </div>
      </section>

      {/* ── Notifications ── */}
      <section className="rounded-lg bg-surface border border-border-subtle p-5 mb-4">
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
          Notifications
        </h2>
        <div className="flex flex-col gap-3">
          {(
            [
              { key: 'email', label: 'Email notifications', desc: 'Transaction confirmations, statements' },
              { key: 'sms', label: 'SMS alerts', desc: 'Payment received, security alerts' },
              { key: 'push', label: 'Push notifications', desc: 'Real-time transaction alerts' },
            ] as const
          ).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary">{label}</p>
                <p className="text-xs text-secondary">{desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(key)}
                role="switch"
                aria-checked={profile.notifications[key]}
                aria-label={`Toggle ${label}`}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  profile.notifications[key] ? 'bg-brand-primary' : 'bg-border-default'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    profile.notifications[key] ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Statements ── */}
      <section className="rounded-lg bg-surface border border-border-subtle p-5 mb-4">
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
          Statements
        </h2>
        <div className="flex flex-col gap-2">
          {['March 2026', 'February 2026', 'January 2026'].map((month) => (
            <button
              key={month}
              className="flex items-center justify-between py-2 text-sm hover:bg-overlay rounded-lg px-2 transition-colors"
              aria-label={`Download ${month} statement`}
            >
              <span className="text-primary">{month} statement</span>
              <span className="text-brand-primary text-xs">Download PDF ↓</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Danger zone ── */}
      <section className="rounded-lg border border-error-subtle p-5">
        <button
          onClick={() => setShowDangerZone((v) => !v)}
          className="flex items-center justify-between w-full text-left"
          aria-label="Danger zone"
          aria-expanded={showDangerZone}
        >
          <h2 className="text-sm font-semibold text-error">Danger zone</h2>
          <span className="text-secondary text-sm">{showDangerZone ? '▲' : '▼'}</span>
        </button>
        {showDangerZone && (
          <div className="mt-3 pt-3 border-t border-error-subtle">
            <p className="text-xs text-secondary mb-3">
              Closing your account is permanent and cannot be undone. All data will be retained for 6 years
              per FCA record-keeping requirements.
            </p>
            <button className="px-4 py-2 rounded-lg border border-error text-error text-sm hover:bg-error-subtle transition-colors">
              Request account closure
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
