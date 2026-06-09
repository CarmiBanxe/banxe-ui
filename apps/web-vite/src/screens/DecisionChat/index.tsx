import React from 'react'
import { ChatShell } from '../../components/ChatShell'
import type { ChatMessage } from '../../components/ChatShell'
import type { AgentDecisionRecord } from '@banxe/shared/types'

/**
 * DecisionChat (S7) — chat-first surface mounted ALONGSIDE the screen-first
 * nav (non-destructive; S8 converges the two). An agent response here is a
 * traceable AgentDecisionRecord rendered inline via DecisionView.
 *
 * The seeded conversation is illustrative scaffolding; real L1 Intent → agent
 * → decision-record dispatch is wired in S8.
 */

const SAMPLE_DECISION: AgentDecisionRecord = {
  record_id: '01HZ8K9M4Q7example0001',
  timestamp: '2026-06-09T10:15:30.123Z',
  agent_id: 'aml_check_agent',
  triggering_event: 'intent_submission:int_4471',
  intent: 'Send €1,200 to FAKE_SEPA Recipient GmbH',
  policies_evaluated: ['I-02', 'R-COMP-FCA-02', 'aml_scenarios:v7'],
  compliance_result: 'PASS',
  reasoning_summary:
    'Counterparty and amount within the established profile; no sanctions match; AML scenarios clear.',
  confidence_score: 0.94,
  action_taken: 'APPROVE_PAYMENT',
  human_reviewed_by: null,
  correlation_id: 'corr-7f3a2b10',
  cost_tokens: 1840,
  cost_amount: '0.0212',
  budget_window_ref: 'aml_check_agent:2026-06-09T10',
  budget_breach_flag: 'NONE',
  immutable_storage_ref: null,
  input_tokens: null,
  output_tokens: null,
}

const SEED: ChatMessage[] = [
  { id: 'u-1', role: 'user', kind: 'text', text: 'Send €1,200 to FAKE_SEPA Recipient GmbH' },
  { id: 'a-1', role: 'agent', kind: 'decision', decision: SAMPLE_DECISION },
]

export function DecisionChat(): React.ReactElement {
  return <ChatShell title="BANXE AI — Decisions" messages={SEED} />
}
