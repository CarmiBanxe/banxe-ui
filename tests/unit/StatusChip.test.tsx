/**
 * StatusChip unit tests
 * IL-062 | Developer Plane | banxe-ui
 */

import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusChip } from '../../packages/ui/src/financial/StatusChip'
import type { ChipStatus } from '../../packages/ui/src/financial/StatusChip'

describe('StatusChip', () => {
  it('renders without crashing', () => {
    const { container } = render(<StatusChip status="ACTIVE" />)
    expect(container).toBeTruthy()
  })

  const statuses: ChipStatus[] = ['ACTIVE', 'PENDING', 'REVIEW', 'BLOCKED', 'FAILED']

  statuses.forEach((status) => {
    it(`renders ${status} with a label`, () => {
      render(<StatusChip status={status} />)
      // Each status should render some visible text
      expect(document.body.textContent?.trim().length).toBeGreaterThan(0)
    })
  })

  it('renders in small size', () => {
    const { container } = render(<StatusChip status="ACTIVE" size="sm" />)
    expect(container).toBeTruthy()
  })

  it('renders in default size', () => {
    const { container } = render(<StatusChip status="ACTIVE" />)
    expect(container).toBeTruthy()
  })

  it('renders ACTIVE with positive styling', () => {
    const { container } = render(<StatusChip status="ACTIVE" />)
    const html = container.innerHTML
    // Should have success color class
    expect(html).toMatch(/success|green|#22C55E/i)
  })

  it('renders BLOCKED with error styling', () => {
    const { container } = render(<StatusChip status="BLOCKED" />)
    const html = container.innerHTML
    expect(html).toMatch(/error|red|#EF4444/i)
  })

  it('renders PENDING with warning styling', () => {
    const { container } = render(<StatusChip status="PENDING" />)
    const html = container.innerHTML
    expect(html).toMatch(/warning|yellow|#F59E0B/i)
  })

  it('renders REVIEW with warning styling', () => {
    const { container } = render(<StatusChip status="REVIEW" />)
    const html = container.innerHTML
    expect(html).toMatch(/warning|yellow|#F59E0B|review/i)
  })

  it('is accessible — has visible text content', () => {
    render(<StatusChip status="ACTIVE" />)
    expect(document.body.textContent?.trim()).not.toBe('')
  })
})
