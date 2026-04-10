import { apiClient } from '../client'

export interface Wallet {
  id: string
  currency: string
  total: string
  available: string
  pending: string
  iban: string
  status: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED'
}

export const walletsApi = {
  list: (): Promise<Wallet[]> =>
    apiClient.get<Wallet[]>('/wallets'),

  getById: (id: string): Promise<Wallet> =>
    apiClient.get<Wallet>(`/wallets/${id}`),
}
