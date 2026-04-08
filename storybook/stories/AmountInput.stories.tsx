import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AmountInput } from '@banxe/ui'

const meta: Meta<typeof AmountInput> = {
  title: 'Financial/AmountInput',
  component: AmountInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof AmountInput>

const Controlled = (args: React.ComponentProps<typeof AmountInput>): React.ReactElement => {
  const [value, setValue] = useState('')
  return <AmountInput {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: { currency: 'GBP', available: '4700.00' },
}

export const WithError: Story = {
  render: (args) => <Controlled {...args} />,
  args: { currency: 'GBP', available: '4700.00', error: 'Amount is required' },
}

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { currency: 'GBP', available: '4700.00', disabled: true },
}

export const EUR: Story = {
  render: (args) => <Controlled {...args} />,
  args: { currency: 'EUR', available: '2100.00' },
}
