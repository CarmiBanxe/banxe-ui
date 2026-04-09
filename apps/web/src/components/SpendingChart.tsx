import React from 'react'
import { AreaChart, Card, Title } from '@tremor/react'

interface SpendingDataPoint {
  date: string
  Spending: number
  Budget: number
}

const MOCK_DATA: SpendingDataPoint[] = [
  { date: 'Mon', Spending: 120, Budget: 150 },
  { date: 'Tue', Spending: 85,  Budget: 150 },
  { date: 'Wed', Spending: 210, Budget: 150 },
  { date: 'Thu', Spending: 65,  Budget: 150 },
  { date: 'Fri', Spending: 190, Budget: 150 },
  { date: 'Sat', Spending: 310, Budget: 150 },
  { date: 'Sun', Spending: 95,  Budget: 150 },
]

interface Props {
  data?: SpendingDataPoint[]
  title?: string
}

export function SpendingChart({ data = MOCK_DATA, title = 'Weekly Spending' }: Props): React.ReactElement {
  return (
    <Card className="banxe-card">
      <Title className="text-slate-100">{title}</Title>
      <AreaChart
        className="mt-4 h-48"
        data={data}
        index="date"
        categories={['Spending', 'Budget']}
        colors={['blue', 'amber']}
        showAnimation
        curveType="monotone"
      />
    </Card>
  )
}
