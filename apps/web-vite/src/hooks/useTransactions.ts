import { useState, useEffect, useCallback } from 'react'
import { transactionsApi, type Transaction, type TransactionFilters } from '../api/endpoints/transactions'

/**
 * useTransactions — fetch transaction list with filters.
 * MSW intercepts in dev; real API in prod.
 */
export function useTransactions(initialFilters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters)

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    transactionsApi
      .list(filters)
      .then((data) => {
        setTransactions(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err)
        setLoading(false)
      })
  }, [filters])

  useEffect(() => { refetch() }, [refetch])

  const updateFilters = (partial: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  return { transactions, loading, error, filters, updateFilters, refetch }
}
