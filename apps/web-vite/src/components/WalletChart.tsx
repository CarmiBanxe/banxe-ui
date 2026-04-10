import React from 'react'
import { BarChart, Card, Title } from '@tremor/react'

interface WalletData {
  name: string
  Fiat: number
  Crypto: number
}

const MOCK_DATA: WalletData[] = [
  { name: 'EUR', Fiat: 12500, Crypto: 0 },
  { name: 'GBP', Fiat: 3200,  Crypto: 0 },
  { name: 'BTC', Fiat: 0,     Crypto: 8900 },
  { name: 'ETH', Fiat: 0,     Crypto: 4200 },
]

interface Props {
  data?: WalletData[]
  title?: string
}

export function WalletChart({ data = MOCK_DATA, title = 'Wallet Distribution' }: Props): React.ReactElement {
  return (
    <Card className="banxe-card">
      <Title className="text-slate-100">{title}</Title>
      <BarChart
        className="mt-4 h-48"
        data={data}
        index="name"
        categories={['Fiat', 'Crypto']}
        colors={['blue', 'amber']}
        showAnimation
        stack
      />
    </Card>
  )
}
