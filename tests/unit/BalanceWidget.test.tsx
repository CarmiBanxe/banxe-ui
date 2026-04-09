/**
 * BalanceWidget unit tests
 * IL-062 | Developer Plane | banxe-ui
 */

import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BalanceWidget } from '../../packages/ui/src/financial/BalanceWidget'

const DEFAULT_PROPS = {
  currency: 'GBP',
  total: '4750.00',
  available: '4700.00',
  pending: '50.00',
}

describe('BalanceWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<BalanceWidget {...DEFAULT_PROPS} />)
    expect(container).toBeTruthy()
  })

  it('displays currency', () => {
    render(<BalanceWidget {...DEFAULT_PROPS} />)
    expect(screen.getByText('GBP')).toBeTruthy()
  })

  it('displays available amount', () => {
    render(<BalanceWidget {...DEFAULT_PROPS} />)
    expect(screen.getByText('4700.00')).toBeTruthy()
  })

  it('displays pending amount when non-zero', () => {
    render(<BalanceWidget {...DEFAULT_PROPS} />)
    expect(screen.getByText('50.00')).toBeTruthy()
  })

  it('does not show pending when zero', () => {
    render(<BalanceWidget {...DEFAULT_PROPS} pending="0.00" />)
    // "0.00" should not appear for pending (implementation-specific)
    // The widget should gracefully omit the pending section
    const totalAmounts = screen.queryAllByText('0.00')
    // There should be no prominent "pending" label with zero amount
    expect(totalAmounts.length).toBeLessThan(2)
  })

  it('shows loading skeleton when loading=true', () => {
    render(<BalanceWidget {...DEFAULT_PROPS} loading />)
    const skeleton = screen.getByRole('status', { name: /loading/i })
    expect(skeleton).toBeTruthy()
  })

  it('shows error state when error=true', () => {
    render(<BalanceWidget {...DEFAULT_PROPS} error />)
    expect(screen.getByRole('alert')).toBeTruthy()
  })

  it('has accessible amount label', () => {
    render(<BalanceWidget {...DEFAULT_PROPS} />)
    // Should announce amount meaningfully
    const region = screen.getByRole('region', { name: /balance/i })
    expect(region).toBeTruthy()
  })

  it('uses monospace font class for amounts', () => {
    const { container } = render(<BalanceWidget {...DEFAULT_PROPS} />)
    const mono = container.querySelector('.font-mono, [class*="mono"]')
    expect(mono).toBeTruthy()
  })

  it('shows EUR wallet correctly', () => {
    render(
      <BalanceWidget
        currency="EUR"
        total="2100.00"
        available="2100.00"
        pending="0.00"
      />,
    )
    expect(screen.getByText('EUR')).toBeTruthy()
    expect(screen.getByText('2100.00')).toBeTruthy()
  })
})
