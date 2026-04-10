import React from 'react'
import { AppRouter } from './router'
import { GlobalBanner } from './components/GlobalBanner'

/**
 * App — root component
 * Wraps router with global UI chrome (banners, toasts).
 */
export function App(): React.ReactElement {
  return (
    <>
      <GlobalBanner />
      <AppRouter />
    </>
  )
}
