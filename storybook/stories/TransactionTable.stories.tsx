import type { Meta, StoryObj } from '@storybook/react'
import { TransactionTable } from '../../apps/web/src/components/TransactionTable'

const meta: Meta<typeof TransactionTable> = {
  title: 'Tremor/TransactionTable',
  component: TransactionTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof TransactionTable>

export const Default: Story = {}

export const CustomTitle: Story = {
  args: { title: 'All Transactions' },
}
