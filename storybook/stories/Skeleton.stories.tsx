import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton, TransactionRowSkeleton, BalanceWidgetSkeleton } from '../../packages/ui/src/primitives/Skeleton'

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded', backgrounds: { default: 'dark' } },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
  args: { variant: 'text', width: '200px' },
}

export const Block: Story = {
  args: { variant: 'block', width: '320px', height: '80px' },
}

export const Circle: Story = {
  args: { variant: 'circle', width: '40px', height: '40px' },
}

export const TransactionRowLoading: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <TransactionRowSkeleton key={i} />
      ))}
    </div>
  ),
}

export const BalanceWidgetLoading: Story = {
  render: () => <BalanceWidgetSkeleton />,
}
