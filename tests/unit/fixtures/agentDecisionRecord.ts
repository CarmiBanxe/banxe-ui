/**
 * Test fixtures — real AgentDecisionRecord shapes (ADR-046 Decision Lineage).
 * Mirrors banxe-architecture/schemas/agent_decision_record.schema.json.
 */
import type {
  AgentDecisionRecord,
  ComplianceResult,
} from '../../../packages/shared/src/types/index'

/** Build a complete, schema-valid AgentDecisionRecord with overrides. */
export function makeDecisionRecord(
  overrides: Partial<AgentDecisionRecord> = {},
): AgentDecisionRecord {
  return {
    record_id: '01HZ8K9M4Qtest-record-0001',
    timestamp: '2026-06-09T10:15:30.123Z',
    agent_id: 'aml_check_agent',
    triggering_event: 'inbound_payment:pay_8821',
    intent: 'Send €1,200 to a SEPA recipient',
    policies_evaluated: ['I-02', 'R-COMP-FCA-02', 'aml_scenarios:v7'],
    compliance_result: 'PASS',
    reasoning_summary:
      'Counterparty and amount within established profile; no sanctions match; AML scenarios clear.',
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
    ...overrides,
  }
}

/** One representative record per compliance outcome. */
export const RECORDS_BY_COMPLIANCE: Record<ComplianceResult, AgentDecisionRecord> = {
  PASS: makeDecisionRecord({ compliance_result: 'PASS' }),
  FAIL: makeDecisionRecord({
    compliance_result: 'FAIL',
    action_taken: 'REJECT_KYC',
    confidence_score: 0.62,
    human_reviewed_by: 'mlro_jane_doe',
    budget_breach_flag: 'WARN',
  }),
  ESCALATE: makeDecisionRecord({
    compliance_result: 'ESCALATE',
    action_taken: 'HOLD_FOR_REVIEW',
    confidence_score: 0.81,
    human_reviewed_by: 'mlro_jane_doe',
  }),
  'N/A': makeDecisionRecord({ compliance_result: 'N/A', policies_evaluated: [] }),
}
