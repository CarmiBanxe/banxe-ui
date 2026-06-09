import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'

/**
 * AppRouter — React Router v6
 *
 * Routes:
 *   /           → Dashboard  (W-01)
 *   /transactions → Transactions (W-02)
 *   /wallets    → Wallets    (W-03)
 *   /send       → Send       (W-04)
 *   /ai         → AIAssistant (W-05)
 *   /settings   → Profile    (W-06)
 *
 * All screens lazy-loaded for code splitting.
 */

// Lazy-load screens
const Dashboard    = lazy(() => import('./screens/Dashboard').then((m) => ({ default: m.Dashboard })))
const Transactions = lazy(() => import('./screens/Transactions').then((m) => ({ default: m.Transactions })))
const Wallets      = lazy(() => import('./screens/Wallets').then((m) => ({ default: m.Wallets })))
const Send         = lazy(() => import('./screens/Send').then((m) => ({ default: m.Send })))
const AIAssistant  = lazy(() => import('./screens/AIAssistant').then((m) => ({ default: m.AIAssistant })))
const DecisionChat = lazy(() => import('./screens/DecisionChat').then((m) => ({ default: m.DecisionChat })))
const Profile      = lazy(() => import('./screens/Profile').then((m) => ({ default: m.Profile })))

function ScreenFallback() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-4">
      <div className="skeleton h-8 w-48 rounded-lg" />
      <div className="skeleton h-40 w-full rounded-xl" />
      <div className="skeleton h-24 w-full rounded-xl" />
    </div>
  )
}

export function AppRouter(): React.ReactElement {
  return (
    <Routes>
      {/* ── Authenticated app shell ── */}
      <Route path="/" element={<AppLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<ScreenFallback />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="transactions"
          element={
            <Suspense fallback={<ScreenFallback />}>
              <Transactions />
            </Suspense>
          }
        />
        <Route
          path="wallets"
          element={
            <Suspense fallback={<ScreenFallback />}>
              <Wallets />
            </Suspense>
          }
        />
        <Route
          path="send"
          element={
            <Suspense fallback={<ScreenFallback />}>
              <Send />
            </Suspense>
          }
        />
        <Route
          path="ai"
          element={
            <Suspense fallback={<ScreenFallback />}>
              <AIAssistant />
            </Suspense>
          }
        />
        {/* S7: chat-first decision surface, additive alongside screen-first nav (S8 converges). */}
        <Route
          path="chat"
          element={
            <Suspense fallback={<ScreenFallback />}>
              <DecisionChat />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<ScreenFallback />}>
              <Profile />
            </Suspense>
          }
        />
      </Route>

      {/* ── Auth shell (onboarding/login — Phase 2) ── */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/" replace />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
