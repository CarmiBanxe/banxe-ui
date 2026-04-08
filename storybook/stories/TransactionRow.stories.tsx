import type { Meta, StoryObj } from '@storybook/react'
import { TransactionRow } from '@banxe/ui'

const meta: Meta<typeof TransactionRow> = {
  title: 'Financial/TransactionRow',
  component: TransactionRow,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    counterparty: 'FAKE_Amazon UK',
    reference: 'REF-20260408-001',
    amount: '49.99',
    currency: 'GBP',
    direction: 'OUT',
    status: 'COMPLETED',
    date: '2026-04-08',
  },
}
export default meta
type Story = StoryObj<typeof TransactionRow>

export const Completed: Story = {}

export const Incoming: Story = {
  args: {
    counterparty: 'FAKE_Employer Ltd',
    reference: 'SALARY-APR-2026',
    amount: '3500.00',
    direction: 'IN',
    status: 'COMPLETED',
  },
}

export const Pending: Story = {
  args: {
    counterparty: 'FAKE_SEPA GmbH',
    amount: '1200.00',
    currency: 'EUR',
    status: 'PENDING',
  },
}

export const Review: Story = {
  args: {
    counterparty: 'FAKE_Suspicious Corp',
    amount: '9800.00',
    status: 'REVIEW',
  },
}

export const Blocked: Story = {
  args: {
    counterparty: 'FAKE_Blocked Payee',
    amount: '500.00',
    status: 'BLOCKED',
  },
}

export const Failed: Story = {
  args: {
    counterparty: 'FAKE_Failed Recipient',
    amount: '200.00',
    status: 'FAILED',
  },
}
