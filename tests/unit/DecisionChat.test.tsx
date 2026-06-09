/**
 * S8 acceptance — the chat surface is REALLY wired to L1.
 *
 * Proves the UI half of chat→L1→L2→port→lineage: a submitted intent calls the
 * typed /v1/intent client, renders the user message optimistically, and renders
 * the returned AgentDecisionRecord inline as a DecisionView — or a governance /
 * HITL / not-enabled message when there is no dispatched record.
 *
 * The submit function is injected, so this exercises the real container wiring
 * (state, optimistic render, response→message mapping) with no live backend.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { IntentResponse, IntentSubmitRequest } from '@banxe/shared/api'
import { DecisionChat } from '../../apps/web-vite/src/screens/DecisionChat'
import { makeDecisionRecord } from './fixtures/agentDecisionRecord'

/** A typed fake intent submitter that always resolves to `response`. */
function fakeSubmit(response: IntentResponse) {
  return vi.fn(async (_body: IntentSubmitRequest): Promise<IntentResponse> => response)
}

async function submit(text: string): Promise<void> {
  const user = userEvent.setup()
  const input = screen.getByRole('textbox', { name: /message to banxe ai/i })
  await user.type(input, text)
  await user.click(screen.getByRole('button', { name: /send message/i }))
}

describe('DecisionChat (S8) — real L1 wiring', () => {
  it('submits to /v1/intent with the intent text and a correlation id', async () => {
    const submitIntent = fakeSubmit({
      enabled: true,
      disposition: 'DISPATCHED',
      decision_record: makeDecisionRecord(),
    })
    render(<DecisionChat submitIntent={submitIntent} />)

    await submit('pay Alice £10')

    await waitFor(() => expect(submitIntent).toHaveBeenCalledTimes(1))
    const arg = submitIntent.mock.calls[0][0]
    expect(arg.intent_text).toBe('pay Alice £10')
    expect(arg.correlation_id).toMatch(/^corr-/)
  })

  it('renders the user message optimistically, then the decision record inline', async () => {
    const record = makeDecisionRecord({ action_taken: 'APPROVE_PAYMENT' })
    const submitIntent = fakeSubmit({
      enabled: true,
      disposition: 'DISPATCHED',
      decision_record: record,
    })
    render(<DecisionChat submitIntent={submitIntent} />)

    await submit('pay Alice £10')

    // Optimistic user message.
    expect(screen.getByText('pay Alice £10')).toBeTruthy()
    // Agent response is a DecisionView (not free text).
    expect(await screen.findByTestId('decision-view')).toBeTruthy()
    expect(screen.getByText('APPROVE_PAYMENT')).toBeTruthy()
  })

  it('renders a sanctions FAIL decision record inline (no dispatch is fabricated)', async () => {
    const record = makeDecisionRecord({
      action_taken: 'HALT_COMPLIANCE_BLOCK',
      compliance_result: 'FAIL',
    })
    const submitIntent = fakeSubmit({
      enabled: true,
      disposition: 'DISPATCHED',
      decision_record: record,
    })
    render(<DecisionChat submitIntent={submitIntent} />)

    await submit('pay the sanctioned entity')

    expect(await screen.findByTestId('decision-view')).toBeTruthy()
    expect(screen.getByText('HALT_COMPLIANCE_BLOCK')).toBeTruthy()
  })

  it('shows a governance / HITL message when the intent is UNRESOLVED', async () => {
    const submitIntent = fakeSubmit({
      enabled: true,
      disposition: 'GOVERNANCE_EVENT',
      governance_event: {
        correlation_id: 'corr-x',
        status: 'UNRESOLVED',
        reason: 'no canonical process for this intent.',
      },
    })
    render(<DecisionChat submitIntent={submitIntent} />)

    await submit('do something undefined')

    expect(await screen.findByText(/human reviewer will follow up \(HITL\)/i)).toBeTruthy()
    expect(screen.queryByTestId('decision-view')).toBeNull()
  })

  it('shows a safe message when the layer is not enabled', async () => {
    const submitIntent = fakeSubmit({ enabled: false, disposition: 'NOT_ENABLED' })
    render(<DecisionChat submitIntent={submitIntent} />)

    await submit('pay Alice £10')

    expect(await screen.findByText(/not enabled yet/i)).toBeTruthy()
  })

  it('shows an error message when the request fails (request not actioned)', async () => {
    const submitIntent = vi.fn(async (_body: IntentSubmitRequest): Promise<IntentResponse> => {
      throw new Error('network')
    })
    render(<DecisionChat submitIntent={submitIntent} />)

    await submit('pay Alice £10')

    expect(await screen.findByText(/was not actioned/i)).toBeTruthy()
  })
})
