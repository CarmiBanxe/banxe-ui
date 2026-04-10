import React from 'react'
import {
  Card,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Title,
} from '@tremor/react'

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  category: string
  status: 'completed' | 'pending' | 'failed'
}

const MOCK: Transaction[] = [
  { id: '1', date: '2026-04-09', description: 'Carrefour', amount: -45.30, currency: 'EUR', category: 'Groceries', status: 'completed' },
  { id: '2', date: '2026-04-09', description: 'Spotify', amount: -9.99, currency: 'EUR', category: 'Subscriptions', status: 'completed' },
  { id: '3', date: '2026-04-08', description: 'Salary', amount: 3200.00, currency: 'EUR', category: 'Income', status: 'completed' },
  { id: '4', date: '2026-04-08', description: 'Transfer', amount: -500.00, currency: 'EUR', category: 'Transfer', status: 'pending' },
  { id: '5', date: '2026-04-07', description: 'Amazon', amount: -89.90, currency: 'EUR', category: 'Shopping', status: 'failed' },
]

const STATUS_COLOR = {
  completed: 'emerald',
  pending: 'amber',
  failed: 'rose',
} as const

interface Props {
  transactions?: Transaction[]
  title?: string
}

export function TransactionTable({ transactions = MOCK, title = 'Recent Transactions' }: Props): React.ReactElement {
  return (
    <Card className="banxe-card">
      <Title className="text-slate-100">{title}</Title>
      <Table className="mt-4">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="text-slate-400">Date</TableHeaderCell>
            <TableHeaderCell className="text-slate-400">Description</TableHeaderCell>
            <TableHeaderCell className="text-slate-400">Category</TableHeaderCell>
            <TableHeaderCell className="text-slate-400 text-right">Amount</TableHeaderCell>
            <TableHeaderCell className="text-slate-400">Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-slate-800/50 transition-colors">
              <TableCell className="text-slate-400 text-sm">{tx.date}</TableCell>
              <TableCell className="text-slate-100 font-medium">{tx.description}</TableCell>
              <TableCell className="text-slate-400 text-sm">{tx.category}</TableCell>
              <TableCell className={`font-mono font-semibold text-right ${tx.amount >= 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                {tx.amount >= 0 ? '+' : ''}
                {new Intl.NumberFormat('en-GB', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(tx.amount)}{' '}
                {tx.currency}
              </TableCell>
              <TableCell>
                <Badge color={STATUS_COLOR[tx.status]}>{tx.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
