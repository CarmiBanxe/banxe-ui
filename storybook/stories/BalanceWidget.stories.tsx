import type { Meta, StoryObj } from '@storybook/react'
import { BalanceWidget } from '@banxe/ui'

const meta: Meta<typeof BalanceWidget> = {
  title: 'Financial/BalanceWidget',
  component: BalanceWidget,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    currency: 'GBP',
    total: '4750.00',
    available: '4700.00',
    pending: '50.00',
  },
}
export default meta
type Story = StoryObj<typeof BalanceWidget>

export const Loaded: Story = {}

export const LoadedEUR: Story = {
  name: 'Loaded (EUR)',
  args: {
    currency: 'EUR',
    total: '2100.00',
    available: '2100.00',
    pending: '0.00',
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Error: Story = {
  args: { error: true },
}

export const ZeroPending: Story = {
  name: 'No Pending',
  args: { pending: '0.00', available: '4750.00' },
}

export const LargeBalance: Story = {
  name: 'Large Balance (>100k)',
  args: {
    total: '125000.00',
    available: '120000.00',
    pending: '5000.00',
  },
}
