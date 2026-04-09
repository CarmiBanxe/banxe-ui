/**
 * Unit tests for BANXE web screens (W-01..W-06)
 * IL-061 | Developer Plane | banxe-ui
 *
 * Strategy:
 * - Each screen renders without crashing (smoke test)
 * - Key DOM elements present (headings, ARIA labels, amounts)
 * - Compliance/AI requirements met (AI badge, compliance flag)
 */

import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { Dashboard } from '../../apps/web/src/screens/Dashboard'
import { Transactions } from '../../apps/web/src/screens/Transactions'
import { Wallets } from '../../apps/web/src/screens/Wallets'
import { Send } from '../../apps/web/src/screens/Send'
import { AIAssistant } from '../../apps/web/src/screens/AIAssistant'
import { Profile } from '../../apps/web/src/screens/Profile'

// ── W-01: Dashboard ──────────────────────────────────────────────────────────

describe('Dashboard (W-01)', () => {
  it('renders without crashing', () => {
    const { container } = render(<Dashboard />)
    expect(container).toBeTruthy()
  })

  it('shows recent transactions heading', () => {
    render(<Dashboard />)
    expect(screen.getByText('Recent transactions')).toBeTruthy()
  })

  it('shows quick actions nav', () => {
    render(<Dashboard />)
    const nav = screen.getByRole('navigation', { name: 'Quick actions' })
    expect(nav).toBeTruthy()
  })

  it('shows AI insight card', () => {
    render(<Dashboard />)
    // AIInsightCard renders content about FX spending
    expect(screen.getByText(/FX spending/i)).toBeTruthy()
  })

  it('shows "See all" link to transactions', () => {
    render(<Dashboard />)
    expect(screen.getByRole('link', { name: 'See all' })).toBeTruthy()
  })
})

// ── W-02: Transactions ───────────────────────────────────────────────────────

describe('Transactions (W-02)', () => {
  it('renders without crashing', () => {
    const { container } = render(<Transactions />)
    expect(container).toBeTruthy()
  })

  it('shows Transactions heading', () => {
    render(<Transactions />)
    expect(screen.getByRole('heading', { name: 'Transactions' })).toBeTruthy()
  })

  it('shows search input with correct ARIA label', () => {
    render(<Transactions />)
    expect(screen.getByRole('searchbox', { name: 'Search transactions' })).toBeTruthy()
  })

  it('shows status filter with correct ARIA label', () => {
    render(<Transactions />)
    expect(screen.getByRole('combobox', { name: 'Filter by status' })).toBeTruthy()
  })

  it('shows Export CSV button', () => {
    render(<Transactions />)
    expect(screen.getByRole('button', { name: /export transactions/i })).toBeTruthy()
  })

  it('renders transaction list items', () => {
    render(<Transactions />)
    const list = screen.getByRole('list', { name: 'Transaction list' })
    const items = within(list).getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
  })

  it('clears filters when Clear filters is clicked', () => {
    render(<Transactions />)
    const searchInput = screen.getByRole('searchbox', { name: 'Search transactions' })
    fireEvent.change(searchInput, { target: { value: 'xxxx-no-match' } })
    const clearBtn = screen.queryByText('Clear all filters')
    if (clearBtn) fireEvent.click(clearBtn)
    // After clearing, search input should be empty
    expect((searchInput as HTMLInputElement).value).toBe('')
  })

  it('shows compliance warning when BLOCKED/REVIEW transactions exist', () => {
    render(<Transactions />)
    // Mock data contains REVIEW transaction, so compliance flag should appear
    expect(screen.getByText(/compliance review/i)).toBeTruthy()
  })
})

// ── W-03: Wallets ────────────────────────────────────────────────────────────

describe('Wallets (W-03)', () => {
  it('renders without crashing', () => {
    const { container } = render(<Wallets />)
    expect(container).toBeTruthy()
  })

  it('shows Wallets heading', () => {
    render(<Wallets />)
    expect(screen.getByRole('heading', { name: 'Wallets' })).toBeTruthy()
  })

  it('renders wallet list with correct ARIA labels', () => {
    render(<Wallets />)
    const walletRegion = screen.getByRole('complementary', { name: 'Your wallets' })
    expect(walletRegion).toBeTruthy()
  })

  it('shows GBP wallet card', () => {
    render(<Wallets />)
    expect(screen.getByRole('button', { name: /GBP wallet/i })).toBeTruthy()
  })

  it('shows IBAN with copy button', () => {
    render(<Wallets />)
    expect(screen.getByRole('button', { name: 'Copy IBAN' })).toBeTruthy()
  })

  it('shows action buttons for selected wallet', () => {
    render(<Wallets />)
    expect(screen.getByRole('button', { name: /Deposit to GBP/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Withdraw from GBP/i })).toBeTruthy()
  })

  it('shows deposit modal on Deposit button click', () => {
    render(<Wallets />)
    const depositBtn = screen.getByRole('button', { name: /Deposit to GBP/i })
    fireEvent.click(depositBtn)
    expect(screen.getByRole('dialog', { name: 'Deposit funds' })).toBeTruthy()
  })
})

// ── W-04: Send ───────────────────────────────────────────────────────────────

describe('Send (W-04)', () => {
  it('renders without crashing', () => {
    const { container } = render(<Send />)
    expect(container).toBeTruthy()
  })

  it('shows Send Money heading', () => {
    render(<Send />)
    expect(screen.getByRole('heading', { name: 'Send Money' })).toBeTruthy()
  })

  it('shows beneficiary search on step 1', () => {
    render(<Send />)
    expect(screen.getByRole('region', { name: 'Choose recipient' })).toBeTruthy()
  })

  it('shows step 2 after selecting beneficiary', () => {
    render(<Send />)
    const aliceBtn = screen.getByRole('button', { name: /Alice Johnson/i })
    fireEvent.click(aliceBtn)
    expect(screen.getByRole('region', { name: 'Enter amount' })).toBeTruthy()
  })

  it('shows beneficiary list with ARIA labels', () => {
    render(<Send />)
    const beneficiaries = screen.getAllByRole('button', { name: /Send to/i })
    expect(beneficiaries.length).toBeGreaterThan(0)
  })

  it('shows step progress indicator', () => {
    render(<Send />)
    expect(screen.getByRole('navigation', { name: 'Payment steps' })).toBeTruthy()
  })
})

// ── W-05: AIAssistant ────────────────────────────────────────────────────────

describe('AIAssistant (W-05)', () => {
  it('renders without crashing', () => {
    const { container } = render(<AIAssistant />)
    expect(container).toBeTruthy()
  })

  it('shows AI Assistant heading', () => {
    render(<AIAssistant />)
    expect(screen.getByRole('heading', { name: 'AI Assistant' })).toBeTruthy()
  })

  it('shows mandatory "AI cannot initiate payments" notice', () => {
    render(<AIAssistant />)
    expect(screen.getByText(/AI cannot initiate payments/i)).toBeTruthy()
  })

  it('shows suggestion chips in idle state', () => {
    render(<AIAssistant />)
    expect(screen.getByText(/What is my spending/i)).toBeTruthy()
  })

  it('has accessible message input', () => {
    render(<AIAssistant />)
    expect(screen.getByRole('textbox', { name: 'Message to AI assistant' })).toBeTruthy()
  })

  it('has send button', () => {
    render(<AIAssistant />)
    expect(screen.getByRole('button', { name: 'Send message' })).toBeTruthy()
  })

  it('shows audit log notice', () => {
    render(<AIAssistant />)
    expect(screen.getByText(/logged for audit/i)).toBeTruthy()
  })

  it('conversation log has ARIA role=log', () => {
    render(<AIAssistant />)
    expect(screen.getByRole('log', { name: 'AI assistant conversation' })).toBeTruthy()
  })
})

// ── W-06: Profile ────────────────────────────────────────────────────────────

describe('Profile (W-06)', () => {
  it('renders without crashing', () => {
    const { container } = render(<Profile />)
    expect(container).toBeTruthy()
  })

  it('shows Profile heading', () => {
    render(<Profile />)
    expect(screen.getByRole('heading', { name: 'Profile & Settings' })).toBeTruthy()
  })

  it('shows user name', () => {
    render(<Profile />)
    expect(screen.getByText('Moriel Carmi')).toBeTruthy()
  })

  it('shows KYC verification section', () => {
    render(<Profile />)
    expect(screen.getByText('Identity verification (KYC)')).toBeTruthy()
  })

  it('shows 2FA toggle with correct role', () => {
    render(<Profile />)
    const toggle = screen.getByRole('switch', { name: 'Toggle two-factor authentication' })
    expect(toggle).toBeTruthy()
  })

  it('shows notification toggles', () => {
    render(<Profile />)
    expect(screen.getByRole('switch', { name: /Toggle Email notifications/i })).toBeTruthy()
    expect(screen.getByRole('switch', { name: /Toggle SMS alerts/i })).toBeTruthy()
    expect(screen.getByRole('switch', { name: /Toggle Push notifications/i })).toBeTruthy()
  })

  it('shows Edit button for personal details', () => {
    render(<Profile />)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy()
  })

  it('shows editable name field after clicking Edit', () => {
    render(<Profile />)
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByRole('textbox', { name: 'Full name' })).toBeTruthy()
  })

  it('danger zone is collapsed by default', () => {
    render(<Profile />)
    const dangerToggle = screen.getByRole('button', { name: 'Danger zone' })
    expect(dangerToggle.getAttribute('aria-expanded')).toBe('false')
  })
})
