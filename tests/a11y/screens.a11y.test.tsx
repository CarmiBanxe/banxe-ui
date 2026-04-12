/**
 * Accessibility tests (axe-core) for BANXE web screens (W-01..W-06)
 * IL-061 | Developer Plane | banxe-ui
 *
 * Each screen must pass axe accessibility audit with 0 violations.
 * axe checks: WCAG 2.1 AA criteria relevant to fintech UIs.
 *
 * Setup: jest-axe is a peer dependency. Run: npm install --save-dev jest-axe axe-core
 */

import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

import { Dashboard } from '../../apps/web-vite/src/screens/Dashboard'
import { Transactions } from '../../apps/web-vite/src/screens/Transactions'
import { Wallets } from '../../apps/web-vite/src/screens/Wallets'
import { Send } from '../../apps/web-vite/src/screens/Send'
import { AIAssistant } from '../../apps/web-vite/src/screens/AIAssistant'
import { Profile } from '../../apps/web-vite/src/screens/Profile'

expect.extend(toHaveNoViolations)

// Helper: render + axe
async function a11yCheck(
  element: React.ReactElement,
): Promise<jest.Matchers<void>> {
  const { container } = render(element)
  const results = await axe(container, {
    rules: {
      // Skip color-contrast in test env (no CSS variables resolved)
      'color-contrast': { enabled: false },
    },
  })
  return expect(results)
}

describe('Accessibility — W-01: Dashboard', () => {
  it('has no axe violations', async () => {
    (await a11yCheck(<Dashboard />)).toHaveNoViolations()
  })
})

describe('Accessibility — W-02: Transactions', () => {
  it('has no axe violations', async () => {
    (await a11yCheck(<Transactions />)).toHaveNoViolations()
  })
})

describe('Accessibility — W-03: Wallets', () => {
  it('has no axe violations', async () => {
    (await a11yCheck(<Wallets />)).toHaveNoViolations()
  })
})

describe('Accessibility — W-04: Send', () => {
  it('has no axe violations on step 1 (recipient)', async () => {
    (await a11yCheck(<Send />)).toHaveNoViolations()
  })
})

describe('Accessibility — W-05: AIAssistant', () => {
  it('has no axe violations in idle state', async () => {
    (await a11yCheck(<AIAssistant />)).toHaveNoViolations()
  })
})

describe('Accessibility — W-06: Profile', () => {
  it('has no axe violations', async () => {
    (await a11yCheck(<Profile />)).toHaveNoViolations()
  })
})
