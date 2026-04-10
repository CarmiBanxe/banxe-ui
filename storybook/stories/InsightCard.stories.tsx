import type { Meta, StoryObj } from '@storybook/react'
import { InsightCard } from '../../apps/web/src/components/InsightCard'

const meta: Meta<typeof InsightCard> = {
  title: 'Tremor/InsightCard',
  component: InsightCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
}
export default meta
type Story = StoryObj<typeof InsightCard>

export const Default: Story = {
  args: {
    insight: { id: '1', category: 'Food & Dining', amount: 432.50, currency: 'EUR', trend: 'up', changePercent: 12, period: 'This month', confidence: 0.87 },
  },
}

export const HighConfidence: Story = {
  args: {
    insight: { id: '2', category: 'Transport', amount: 189.00, currency: 'EUR', trend: 'down', changePercent: -8, period: 'This month', confidence: 0.95 },
  },
}

export const LowConfidence: Story = {
  args: {
    insight: { id: '3', category: 'Shopping', amount: 312.00, currency: 'EUR', trend: 'stable', changePercent: 0, period: 'This month', confidence: 0.4 },
  },
}
