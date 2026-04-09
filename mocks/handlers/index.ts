/**
 * MSW handlers — intercept API calls in dev/test
 * IL-062 | Developer Plane | banxe-ui
 *
 * Setup: import { worker } from './browser' in main.tsx (dev only)
 * Ref: https://mswjs.io/docs/
 */

import { http, HttpResponse } from 'msw'
import walletsData from '../data/wallets.json'
import transactionsData from '../data/transactions.json'
import customerData from '../data/customer.json'

const BASE = '/api'

export const handlers = [
  // ── Wallets ──────────────────────────────────────────────────────────────
  http.get(`${BASE}/wallets`, () => {
    return HttpResponse.json(walletsData)
  }),

  http.get(`${BASE}/wallets/:id`, ({ params }) => {
    const wallet = walletsData.find((w) => w.id === params.id)
    if (!wallet) {
      return HttpResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }
    return HttpResponse.json(wallet)
  }),

  // ── Transactions ─────────────────────────────────────────────────────────
  http.get(`${BASE}/transactions`, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const direction = url.searchParams.get('direction')
    const search = url.searchParams.get('search')?.toLowerCase()

    let data = [...transactionsData]

    if (status && status !== 'ALL') {
      data = data.filter((tx) => tx.status === status)
    }
    if (direction && direction !== 'ALL') {
      data = data.filter((tx) => tx.direction === direction)
    }
    if (search) {
      data = data.filter(
        (tx) =>
          tx.counterparty.toLowerCase().includes(search) ||
          tx.reference.toLowerCase().includes(search),
      )
    }

    return HttpResponse.json(data)
  }),

  http.get(`${BASE}/transactions/:id`, ({ params }) => {
    const tx = transactionsData.find((t) => t.id === params.id)
    if (!tx) {
      return HttpResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }
    return HttpResponse.json(tx)
  }),

  // ── Customer ─────────────────────────────────────────────────────────────
  http.get(`${BASE}/customer/me`, () => {
    return HttpResponse.json(customerData)
  }),

  http.patch(`${BASE}/customer/me`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ ...customerData, ...body })
  }),

  // ── Payments ─────────────────────────────────────────────────────────────
  http.post(`${BASE}/payments`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    await new Promise((r) => setTimeout(r, 1500))
    return HttpResponse.json({
      payment_id: `pmt-${Date.now()}`,
      reference: `REF-${Date.now().toString().slice(-8)}`,
      status: 'PROCESSING',
      ...body,
    })
  }),

  // ── Auth stub ─────────────────────────────────────────────────────────────
  http.post(`${BASE}/auth/token`, async () => {
    return HttpResponse.json({
      access_token: 'mock-jwt-token',
      token_type: 'bearer',
      expires_in: 3600,
    })
  }),
]
