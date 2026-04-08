import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { StatusChip } from '@banxe/ui'

const meta: Meta<typeof StatusChip> = {
  title: 'Financial/StatusChip',
  component: StatusChip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof StatusChip>

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(['COMPLETED','PENDING','FAILED','BLOCKED','REVIEW','ACTIVE','RESTRICTED','SUSPENDED'] as const).map(
        (s) => <StatusChip key={s} status={s} />
      )}
    </div>
  ),
}

export const Completed: Story = { args: { status: 'COMPLETED' } }
export const Pending:   Story = { args: { status: 'PENDING' } }
export const Failed:    Story = { args: { status: 'FAILED' } }
export const Blocked:   Story = { args: { status: 'BLOCKED' } }
export const Review:    Story = { args: { status: 'REVIEW' } }
export const SizeMd:    Story = { args: { status: 'COMPLETED', size: 'md' } }
