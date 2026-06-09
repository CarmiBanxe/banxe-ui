/**
 * S8 — the shared typed intent endpoints (packages/shared/src/api/endpoints.ts).
 *
 * Verifies the typed contract web-next / mobile consume: api.intent.submit hits
 * POST /v1/intent, and both api.intent.getDecision and api.decisions.getByCorrelation
 * hit GET /v1/intent/decision/{id} (the S8 L1 lineage route).
 */
import { describe, it, expect, vi } from 'vitest'
import { createBanxeApi } from '../../packages/shared/src/api/endpoints'
import type { BanxeApiClient } from '../../packages/shared/src/api/client'

function fakeClient() {
  const client = {
    get: vi.fn(async (path: string) => ({ path })),
    post: vi.fn(async (path: string, body: unknown) => ({ path, body })),
    patch: vi.fn(async () => ({})),
    delete: vi.fn(async () => ({})),
  }
  return client
}

describe('shared api — intent endpoints (S8)', () => {
  it('submit() posts the intent to /v1/intent', async () => {
    const client = fakeClient()
    const api = createBanxeApi(client as unknown as BanxeApiClient)
    await api.intent.submit({ intent_text: 'pay Alice £10', correlation_id: 'c-1' })
    expect(client.post).toHaveBeenCalledWith('/v1/intent', {
      intent_text: 'pay Alice £10',
      correlation_id: 'c-1',
    })
  })

  it('getDecision() and decisions.getByCorrelation() resolve the lineage route', async () => {
    const client = fakeClient()
    const api = createBanxeApi(client as unknown as BanxeApiClient)
    await api.intent.getDecision('c-1')
    await api.decisions.getByCorrelation('c-2')
    expect(client.get).toHaveBeenCalledWith('/v1/intent/decision/c-1')
    expect(client.get).toHaveBeenCalledWith('/v1/intent/decision/c-2')
  })
})
