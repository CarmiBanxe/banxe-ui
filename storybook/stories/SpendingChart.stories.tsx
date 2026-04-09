import type { Meta, StoryObj } from '@storybook/react'
import { SpendingChart } from '../../apps/web/src/components/SpendingChart'

const meta: Meta<typeof SpendingChart> = {
  title: 'Tremor/SpendingChart',
  component: SpendingChart,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: 480 }}><Story /></div>],
}
export default meta
type Story = StoryObj<typeof SpendingChart>

export const Default: Story = {}

export const EmptyData: Story = {
  args: { data: [], title: 'No data yet' },
}

export const CustomTitle: Story = {
  args: { title: 'Monthly Budget vs Actual' },
}
