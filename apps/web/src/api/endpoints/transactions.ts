import { apiClient } from '../client'

export interface Transaction {
  id: string
  counterparty: string
  reference: string
  amount: string
  currency: string
  direction: 'IN' | 'OUT'
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'BLOCKED' | 'REVIEW'
  date: string
  rail: 'FPS' | 'CHAPS' | 'SEPA' | 'SWIFT'
}

export interface TransactionFilters {
  status?: Transaction['status']
  direction?: 'IN' | 'OUT'
  currency?: string
  search?: string
  from?: string
  to?: string
  page?: number
  page_size?: number
}

function buildQuery(filters: TransactionFilters): string {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      params.set(k, String(v))
    }
  })
  const q = params.toString()
  return q ? `?${q}` : ''
}

export const transactionsApi = {
  list: (filters: TransactionFilters = {}): Promise<Transaction[]> =>
    apiClient.get<Transaction[]>(`/transactions${buildQuery(filters)}`),

  getById: (id: string): Promise<Transaction> =>
    apiClient.get<Transaction>(`/transactions/${id}`),
}
