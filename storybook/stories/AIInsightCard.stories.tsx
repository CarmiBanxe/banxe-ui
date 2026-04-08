import type { Meta, StoryObj } from '@storybook/react'
import { AIInsightCard } from '@banxe/ui'

const meta: Meta<typeof AIInsightCard> = {
  title: 'Financial/AIInsightCard',
  component: AIInsightCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    insight: 'Your FX spending increased 34% this month compared to your 3-month average.',
    confidence: 'HIGH',
    explanation: 'Based on 12 outbound EUR transactions totalling £2,340 vs. £1,750 average over Oct–Dec 2025.',
  },
}
export default meta
type Story = StoryObj<typeof AIInsightCard>

export const HighConfidence: Story = {}

export const MediumConfidence: Story = {
  args: {
    insight: 'You may have a recurring payment due on 15 April based on last month\'s pattern.',
    confidence: 'MEDIUM',
    explanation: 'Detected similar outbound transaction on 15 March and 15 February.',
  },
}

export const Uncertain: Story = {
  args: {
    insight: 'Unusual transaction pattern detected — this may require review.',
    confidence: 'UNCERTAIN',
    explanation: 'Insufficient data to determine if this is a normal pattern.',
  },
}

export const WithAction: Story = {
  args: {
    actionLabel: 'Review transactions',
    onAction: () => alert('Navigate to transactions'),
  },
}

export const WithDismiss: Story = {
  args: {
    onDismiss: () => alert('Dismissed'),
  },
}
