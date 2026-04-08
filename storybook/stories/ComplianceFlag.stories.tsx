import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ComplianceFlag } from '@banxe/ui'

const meta: Meta<typeof ComplianceFlag> = {
  title: 'Financial/ComplianceFlag',
  component: ComplianceFlag,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
}
export default meta
type Story = StoryObj<typeof ComplianceFlag>

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['AML','SANCTIONS','EDD','SAR','STRUCTURING'] as const).map(
        (t) => <ComplianceFlag key={t} type={t} />
      )}
    </div>
  ),
}

export const AMLFlag:     Story = { args: { type: 'AML' } }
export const SanctionsHit: Story = { args: { type: 'SANCTIONS' } }
export const EDDRequired: Story = { args: { type: 'EDD' } }
export const SARFiled:    Story = { args: { type: 'SAR' } }

export const CompactChip: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['AML','SANCTIONS','EDD','SAR','STRUCTURING'] as const).map(
        (t) => <ComplianceFlag key={t} type={t} compact />
      )}
    </div>
  ),
}
