import type { Meta, StoryObj } from '@storybook/react'
import { QuickActionButton } from '../../apps/web/src/components/QuickActionButton'

const meta: Meta<typeof QuickActionButton> = {
  title: 'Tremor/QuickActionButton',
  component: QuickActionButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
}
export default meta
type Story = StoryObj<typeof QuickActionButton>

const ACTIONS = [
  { icon: <span>↑</span>, label: 'Send',     onClick: () => {} },
  { icon: <span>↓</span>, label: 'Receive',  onClick: () => {} },
  { icon: <span>⇄</span>, label: 'Exchange', onClick: () => {} },
]

export const Default: Story = { args: { actions: ACTIONS } }

export const WithDisabled: Story = {
  args: {
    actions: [
      ...ACTIONS,
      { icon: <span>+</span>, label: 'Buy Crypto', onClick: () => {}, disabled: true },
    ],
  },
}
