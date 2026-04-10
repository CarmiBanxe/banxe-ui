import { useState, useEffect } from 'react'
import type { KycStatus } from './types'

const MOCK_KYC: KycStatus = {
  level: 'enhanced',
  status: 'approved',
  documents: [
    { type: 'passport', status: 'approved', submittedAt: '2026-03-15T10:00:00Z' },
    { type: 'proof_of_address', status: 'approved', submittedAt: '2026-03-15T10:05:00Z' },
    { type: 'selfie', status: 'approved', submittedAt: '2026-03-15T10:10:00Z' },
  ],
  limits: { daily: 50000, monthly: 200000, currency: 'EUR' },
}

export function useKyc() {
  const [kyc, setKyc] = useState<KycStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setKyc(MOCK_KYC)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return { kyc, loading }
}
