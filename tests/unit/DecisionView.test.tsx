/**
 * S7 acceptance (a): a client view renders a REAL AgentDecisionRecord.
 * DecisionView renders every record field and surfaces compliance via the
 * reused ComplianceFlag component for each compliance_result.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { DecisionView } from '../../apps/web-vite/src/components/DecisionView'
import { makeDecisionRecord, RECORDS_BY_COMPLIANCE } from './fixtures/agentDecisionRecord'

describe('DecisionView (S7-a)', () => {
  it('renders all fields of a real AgentDecisionRecord', () => {
    const record = makeDecisionRecord()
    render(<DecisionView record={record} />)

    // intent + decision (action_taken)
    expect(screen.getByText(record.intent)).toBeTruthy()
    expect(screen.getByText(record.action_taken)).toBeTruthy()
    // confidence_score rendered as percent
    expect(screen.getByText('94%')).toBeTruthy()
    // reasoning_summary
    expect(screen.getByText(record.reasoning_summary)).toBeTruthy()
    // cost: decimal-string amount + tokens (I-05 — never a float)
    expect(screen.getByText(record.cost_amount)).toBeTruthy()
    expect(screen.getByText(/1840 tokens/)).toBeTruthy()
    // agent + correlation provenance
    expect(screen.getByText(/aml_check_agent/)).toBeTruthy()
    expect(screen.getByText(record.correlation_id)).toBeTruthy()
  })

  it('reuses ComplianceFlag for FAIL (BLOCKED)', () => {
    render(<DecisionView record={RECORDS_BY_COMPLIANCE.FAIL} />)
    const flag = screen.getByRole('alert')
    expect(within(flag).getByText(/Blocked/)).toBeTruthy()
  })

  it('reuses ComplianceFlag for ESCALATE (REVIEW)', () => {
    render(<DecisionView record={RECORDS_BY_COMPLIANCE.ESCALATE} />)
    const flag = screen.getByRole('alert')
    expect(within(flag).getByText(/Under Review/)).toBeTruthy()
  })

  it('shows a calm PASS indicator for a clean decision', () => {
    render(<DecisionView record={RECORDS_BY_COMPLIANCE.PASS} />)
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.getByLabelText('Compliance result: PASS')).toBeTruthy()
    expect(screen.getByText(/Compliance: PASS/)).toBeTruthy()
  })

  it('renders a compliance outcome for every compliance_result value', () => {
    for (const result of ['PASS', 'FAIL', 'ESCALATE', 'N/A'] as const) {
      const { unmount } = render(<DecisionView record={RECORDS_BY_COMPLIANCE[result]} />)
      expect(screen.getByLabelText(`Compliance result: ${result}`)).toBeTruthy()
      unmount()
    }
  })

  it('shows the HITL reviewer when present and hides it otherwise', () => {
    const { unmount } = render(<DecisionView record={RECORDS_BY_COMPLIANCE.FAIL} />)
    expect(screen.getByText('mlro_jane_doe')).toBeTruthy()
    expect(screen.getByText(/Reviewed by/i)).toBeTruthy()
    unmount()

    render(<DecisionView record={makeDecisionRecord({ human_reviewed_by: null })} />)
    expect(screen.queryByText(/Reviewed by/i)).toBeNull()
  })

  it('surfaces a budget breach flag when not NONE', () => {
    render(<DecisionView record={makeDecisionRecord({ budget_breach_flag: 'BREACH' })} />)
    expect(screen.getByLabelText('Budget breach: BREACH')).toBeTruthy()
  })
})
