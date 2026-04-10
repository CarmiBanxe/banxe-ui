import type { Meta, StoryObj } from '@storybook/react'
import { WalletChart } from '../../apps/web/src/components/WalletChart'

const meta: Meta<typeof WalletChart> = {
  title: 'Tremor/WalletChart',
  component: WalletChart,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: 480 }}><Story /></div>],
}
export default meta
type Story = StoryObj<typeof WalletChart>

export const Default: Story = {}

export const CryptoOnly: Story = {
  args: {
    data: [
      { name: 'BTC', Fiat: 0, Crypto: 8900 },
      { name: 'ETH', Fiat: 0, Crypto: 4200 },
      { name: 'SOL', Fiat: 0, Crypto: 1100 },
    ],
    title: 'Crypto Portfolio',
  },
}

export const FiatOnly: Story = {
  args: {
    data: [
      { name: 'EUR', Fiat: 12500, Crypto: 0 },
      { name: 'GBP', Fiat: 3200, Crypto: 0 },
      { name: 'USD', Fiat: 5400, Crypto: 0 },
    ],
    title: 'Fiat Wallets',
  },
}
