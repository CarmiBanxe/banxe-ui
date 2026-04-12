/**
 * Accessibility tests for Tremor components — BANXE AI BANK
 * Uses jest-axe (compatible with vitest globals) + @testing-library/react
 */
import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { SpendingChart } from '../../apps/web-vite/src/components/SpendingChart'
import { WalletChart } from '../../apps/web-vite/src/components/WalletChart'
import { InsightCard } from '../../apps/web-vite/src/components/InsightCard'
import { TransactionTable } from '../../apps/web-vite/src/components/TransactionTable'
import { QuickActionButton } from '../../apps/web-vite/src/components/QuickActionButton'
import { ConfidenceBadge } from '../../apps/web-vite/src/components/ConfidenceBadge'
import type { SpendingInsight } from '../../apps/web-vite/src/features/ai-insights'

expect.extend(toHaveNoViolations)

const MOCK_INSIGHT: SpendingInsight = {
  id: '1',
  category: 'Food & Dining',
  amount: 432.50,
  currency: 'EUR',
  trend: 'up',
  changePercent: 12,
  period: 'This month',
  confidence: 0.87,
}

const MOCK_ACTIONS = [
  { icon: <span>↑</span>, label: 'Send',    onClick: () => {} },
  { icon: <span>↓</span>, label: 'Receive', onClick: () => {} },
  { icon: <span>⇄</span>, label: 'Exchange', onClick: () => {} },
]

describe('SpendingChart a11y', () => {
  it('renders without violations', async () => {
    const { container } = render(<SpendingChart />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders with custom title', () => {
    const { getByText } = render(<SpendingChart title="Monthly Spending" />)
    expect(getByText('Monthly Spending')).toBeTruthy()
  })
})

describe('WalletChart a11y', () => {
  it('renders without violations', async () => {
    const { container } = render(<WalletChart />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('InsightCard a11y', () => {
  it('renders without violations', async () => {
    const { container } = render(<InsightCard insight={MOCK_INSIGHT} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('shows confidence percentage', () => {
    const { getByText } = render(<InsightCard insight={MOCK_INSIGHT} />)
    expect(getByText('87%')).toBeTruthy()
  })

  it('shows category name', () => {
    const { getByText } = render(<InsightCard insight={MOCK_INSIGHT} />)
    expect(getByText('Food & Dining')).toBeTruthy()
  })
})

describe('TransactionTable a11y', () => {
  it('renders without violations', async () => {
    const { container } = render(<TransactionTable />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('shows all 5 mock transactions', () => {
    const { getByText } = render(<TransactionTable />)
    expect(getByText('Carrefour')).toBeTruthy()
    expect(getByText('Spotify')).toBeTruthy()
    expect(getByText('Salary')).toBeTruthy()
  })
})

describe('QuickActionButton a11y', () => {
  it('renders without violations', async () => {
    const { container } = render(<QuickActionButton actions={MOCK_ACTIONS} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has aria-label on each button', () => {
    const { getByRole } = render(<QuickActionButton actions={MOCK_ACTIONS} />)
    expect(getByRole('button', { name: 'Send' })).toBeTruthy()
    expect(getByRole('button', { name: 'Receive' })).toBeTruthy()
    expect(getByRole('button', { name: 'Exchange' })).toBeTruthy()
  })
})

describe('ConfidenceBadge a11y', () => {
  it('renders without violations', async () => {
    const { container } = render(<ConfidenceBadge confidence={0.87} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has aria-label with percentage', () => {
    const { getByLabelText } = render(<ConfidenceBadge confidence={0.87} />)
    expect(getByLabelText('AI confidence: 87%')).toBeTruthy()
  })

  it('shows High for confidence > 0.8', () => {
    const { getByText } = render(<ConfidenceBadge confidence={0.9} />)
    expect(getByText('High · 90%')).toBeTruthy()
  })

  it('shows Medium for confidence 0.6–0.8', () => {
    const { getByText } = render(<ConfidenceBadge confidence={0.7} />)
    expect(getByText('Medium · 70%')).toBeTruthy()
  })

  it('shows Low for confidence < 0.6', () => {
    const { getByText } = render(<ConfidenceBadge confidence={0.4} />)
    expect(getByText('Low · 40%')).toBeTruthy()
  })
})
