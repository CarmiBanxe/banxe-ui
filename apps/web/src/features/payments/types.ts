export interface SendMoneyForm {
  step: 1 | 2 | 3
  recipientName: string
  recipientIban: string
  amount: number
  currency: string
  reference: string
}

export interface PaymentResult {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  amount: number
  currency: string
  recipientName: string
  timestamp: string
  estimatedArrival: string
}

export type SendStep = 'recipient' | 'amount' | 'confirm'
