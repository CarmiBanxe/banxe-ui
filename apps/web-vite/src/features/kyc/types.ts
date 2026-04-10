export interface KycStatus {
  level: 'none' | 'basic' | 'enhanced' | 'full'
  status: 'not_started' | 'pending' | 'approved' | 'rejected'
  documents: KycDocument[]
  limits: { daily: number; monthly: number; currency: string }
}

export interface KycDocument {
  type: 'passport' | 'id_card' | 'proof_of_address' | 'selfie'
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted'
  submittedAt?: string
}
