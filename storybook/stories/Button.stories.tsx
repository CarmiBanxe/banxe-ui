import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../packages/ui/src/primitives/Button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'ghost', 'destructive'] },
    size:    { control: 'radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled:{ control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: 'Send Money', variant: 'primary', size: 'md' },
}

export const Secondary: Story = {
  args: { children: 'View details', variant: 'secondary', size: 'md' },
}

export const Ghost: Story = {
  args: { children: 'Cancel', variant: 'ghost', size: 'md' },
}

export const Destructive: Story = {
  args: { children: 'Delete account', variant: 'destructive', size: 'md' },
}

export const Loading: Story = {
  args: { children: 'Processing…', loading: true, variant: 'primary' },
}

export const Disabled: Story = {
  args: { children: 'Continue', disabled: true, variant: 'primary' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
