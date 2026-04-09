import { useState, useEffect } from 'react'
import { walletsApi, type Wallet } from '../api/endpoints/wallets'

/**
 * useWallets — fetch wallet list with loading/error state.
 * Falls back to mock data (MSW intercepts in dev).
 */
export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = () => {
    setLoading(true)
    setError(null)
    walletsApi
      .list()
      .then((data) => {
        setWallets(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err)
        setLoading(false)
      })
  }

  useEffect(() => { refetch() }, [])

  return { wallets, loading, error, refetch }
}
