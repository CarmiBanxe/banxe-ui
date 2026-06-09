import React, { useCallback, useState } from 'react'
import type { IntentResponse, IntentSubmitRequest } from '@banxe/shared/api'
import { ChatShell } from '../../components/ChatShell'
import type { ChatMessage } from '../../components/ChatShell'
import { apiClient } from '../../api/client'

/**
 * DecisionChat (S8) — the chat-first surface, now REALLY wired.
 *
 * S7 was a scaffold (a seeded conversation, a placeholder onSubmit). S8 replaces
 * that with the live L1 Intent Layer flow:
 *
 *   user text → POST /v1/intent (typed client) → L1 classify → route → L2 mask
 *             → ADR-046 decision record → rendered inline as a DecisionView.
 *
 * The user message renders OPTIMISTICALLY (before the round-trip); the agent
 * response is structured, never free text — a DecisionView for a dispatched
 * record, or a governance / HITL message when the intent is UNRESOLVED, the
 * layer is not enabled, or no in-process mask handled it.
 *
 * The submit function is injected (defaulting to the real typed API) so the
 * container is unit-testable without a live backend.
 */

export type SubmitIntent = (body: IntentSubmitRequest) => Promise<IntentResponse>

// POST /v1/intent via the typed web app client. The shared typed contract lives
// in packages/shared/src/api/endpoints.ts (api.intent.submit) for web-next/mobile;
// web-vite calls its own client with the same IntentResponse type.
const defaultSubmitIntent: SubmitIntent = (body) =>
  apiClient.post<IntentResponse>('/v1/intent', body)

export interface DecisionChatProps {
  /** Override the intent submission (tests inject a fake; defaults to POST /v1/intent). */
  submitIntent?: SubmitIntent
}

const AGENT_ERROR =
  'Something went wrong reaching BANXE AI. Your request was not actioned — please try again.'

function newCorrelationId(): string {
  const uuid = globalThis.crypto?.randomUUID?.()
  return uuid ? `corr-${uuid}` : `corr-${Date.now().toString(36)}`
}

/** Turn an L1 disposition into the agent's chat message. */
function toAgentMessage(response: IntentResponse, id: string): ChatMessage {
  if (response.decision_record) {
    return { id, role: 'agent', kind: 'decision', decision: response.decision_record }
  }
  if (response.governance_event) {
    return {
      id,
      role: 'agent',
      kind: 'text',
      text: `I can't action that automatically — ${response.governance_event.reason} A human reviewer will follow up (HITL).`,
    }
  }
  if (!response.enabled) {
    return {
      id,
      role: 'agent',
      kind: 'text',
      text: 'AI intent routing is not enabled yet. No action was taken.',
    }
  }
  return {
    id,
    role: 'agent',
    kind: 'text',
    text: response.detail ?? 'Your request was received and routed for review.',
  }
}

export function DecisionChat({
  submitIntent = defaultSubmitIntent,
}: DecisionChatProps = {}): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const onSubmit = useCallback(
    async (text: string): Promise<void> => {
      const correlationId = newCorrelationId()
      // Optimistic user-message render (kept from S7).
      setMessages((prev) => [
        ...prev,
        { id: `u-${prev.length}-${correlationId}`, role: 'user', kind: 'text', text },
      ])
      try {
        const response = await submitIntent({ intent_text: text, correlation_id: correlationId })
        setMessages((prev) => [
          ...prev,
          toAgentMessage(response, `a-${prev.length}-${correlationId}`),
        ])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${prev.length}-${correlationId}`,
            role: 'agent',
            kind: 'text',
            text: AGENT_ERROR,
          },
        ])
      }
    },
    [submitIntent],
  )

  return <ChatShell title="BANXE AI — Decisions" messages={messages} onSubmit={onSubmit} />
}
