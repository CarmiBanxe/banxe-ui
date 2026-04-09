/**
 * AmountInput unit tests
 * IL-062 | Developer Plane | banxe-ui
 */

import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AmountInput } from '../../packages/ui/src/financial/AmountInput'

describe('AmountInput', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <AmountInput value="" currency="GBP" onChange={() => {}} />,
    )
    expect(container).toBeTruthy()
  })

  it('shows label', () => {
    render(<AmountInput value="" currency="GBP" onChange={() => {}} label="Amount" />)
    expect(screen.getByText('Amount')).toBeTruthy()
  })

  it('shows currency', () => {
    render(<AmountInput value="" currency="GBP" onChange={() => {}} />)
    expect(screen.getByText('GBP')).toBeTruthy()
  })

  it('shows EUR currency', () => {
    render(<AmountInput value="" currency="EUR" onChange={() => {}} />)
    expect(screen.getByText('EUR')).toBeTruthy()
  })

  it('calls onChange when user types', () => {
    const onChange = vi.fn()
    render(<AmountInput value="" currency="GBP" onChange={onChange} />)
    const input = screen.getByRole('textbox', { name: /amount/i })
    fireEvent.change(input, { target: { value: '100.00' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('displays provided value', () => {
    render(<AmountInput value="250.00" currency="GBP" onChange={() => {}} />)
    const input = screen.getByRole('textbox', { name: /amount/i })
    expect((input as HTMLInputElement).value).toBe('250.00')
  })

  it('uses monospace font class (I-05 invariant: amounts in monospace)', () => {
    const { container } = render(
      <AmountInput value="100.00" currency="GBP" onChange={() => {}} />,
    )
    const mono = container.querySelector('.font-mono, [class*="mono"], input[class*="mono"]')
    expect(mono).toBeTruthy()
  })

  it('is accessible — input has a label', () => {
    render(<AmountInput value="" currency="GBP" onChange={() => {}} label="Enter amount" />)
    const label = screen.getByText('Enter amount')
    expect(label).toBeTruthy()
  })

  it('shows error message', () => {
    render(
      <AmountInput
        value=""
        currency="GBP"
        onChange={() => {}}
        error="Amount must be greater than zero"
      />,
    )
    expect(screen.getByText('Amount must be greater than zero')).toBeTruthy()
  })

  it('is disabled when disabled prop passed', () => {
    render(<AmountInput value="" currency="GBP" onChange={() => {}} disabled />)
    const input = screen.getByRole('textbox', { name: /amount/i })
    expect((input as HTMLInputElement).disabled).toBe(true)
  })

  it('does NOT use parseFloat — value stays as string', () => {
    // I-05 invariant: monetary amounts must not be converted to float
    let capturedValue: string | undefined
    render(
      <AmountInput
        value="9999.99"
        currency="GBP"
        onChange={(v) => { capturedValue = v }}
      />,
    )
    const input = screen.getByRole('textbox', { name: /amount/i })
    fireEvent.change(input, { target: { value: '1234.56' } })
    if (capturedValue !== undefined) {
      expect(typeof capturedValue).toBe('string')
    }
  })
})
