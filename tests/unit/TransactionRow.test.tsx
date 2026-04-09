/**
 * TransactionRow unit tests
 * IL-062 | Developer Plane | banxe-ui
 */

import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TransactionRow } from '../../packages/ui/src/financial/TransactionRow'

const BASE_TX = {
  counterparty: 'FAKE_Amazon UK',
  reference:    'REF-20260408-001',
  amount:       '49.99',
  currency:     'GBP',
  direction:    'OUT' as const,
  status:       'COMPLETED' as const,
  date:         '2026-04-08',
}

describe('TransactionRow', () => {
  it('renders without crashing', () => {
    const { container } = render(<TransactionRow {...BASE_TX} />)
    expect(container).toBeTruthy()
  })

  it('shows counterparty name', () => {
    render(<TransactionRow {...BASE_TX} />)
    expect(screen.getByText('FAKE_Amazon UK')).toBeTruthy()
  })

  it('shows amount', () => {
    render(<TransactionRow {...BASE_TX} />)
    expect(screen.getByText(/49\.99/)).toBeTruthy()
  })

  it('shows currency', () => {
    render(<TransactionRow {...BASE_TX} />)
    expect(screen.getByText(/GBP/)).toBeTruthy()
  })

  it('shows status chip', () => {
    render(<TransactionRow {...BASE_TX} />)
    expect(screen.getByText(/Completed/i)).toBeTruthy()
  })

  it('renders PENDING status', () => {
    render(<TransactionRow {...BASE_TX} status="PENDING" />)
    expect(screen.getByText(/Pending/i)).toBeTruthy()
  })

  it('renders BLOCKED status', () => {
    render(<TransactionRow {...BASE_TX} status="BLOCKED" />)
    expect(screen.getByText(/Blocked/i)).toBeTruthy()
  })

  it('renders REVIEW status', () => {
    render(<TransactionRow {...BASE_TX} status="REVIEW" />)
    expect(screen.getByText(/Review/i)).toBeTruthy()
  })

  it('renders FAILED status', () => {
    render(<TransactionRow {...BASE_TX} status="FAILED" />)
    expect(screen.getByText(/Failed/i)).toBeTruthy()
  })

  it('renders inbound direction differently from outbound', () => {
    const { rerender, container: c1 } = render(<TransactionRow {...BASE_TX} direction="IN" />)
    const inHTML = c1.innerHTML

    rerender(<TransactionRow {...BASE_TX} direction="OUT" />)
    const outHTML = c1.innerHTML

    // Inbound and outbound should have different visual treatment
    expect(inHTML).not.toBe(outHTML)
  })

  it('shows date', () => {
    render(<TransactionRow {...BASE_TX} />)
    expect(screen.getByText(/2026-04-08/)).toBeTruthy()
  })

  it('uses monospace font for amount', () => {
    const { container } = render(<TransactionRow {...BASE_TX} />)
    const mono = container.querySelector('.font-mono, [class*="mono"]')
    expect(mono).toBeTruthy()
  })

  it('renders without reference gracefully', () => {
    const { counterparty, amount, currency, direction, status, date } = BASE_TX
    const { container } = render(
      <TransactionRow
        counterparty={counterparty}
        amount={amount}
        currency={currency}
        direction={direction}
        status={status}
        date={date}
      />,
    )
    expect(container).toBeTruthy()
  })
})
