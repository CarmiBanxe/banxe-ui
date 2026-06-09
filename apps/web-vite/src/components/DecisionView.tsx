import React from 'react'
import { ComplianceFlag } from '@banxe/ui'
import type { FlagType } from '@banxe/ui'
import type { AgentDecisionRecord, ComplianceResult } from '@banxe/shared/types'

/**
 * DecisionView — client-facing render of a single AgentDecisionRecord
 * (ADR-046 Decision Lineage). An agent response in the chat surface is a
 * decision record card: it shows WHAT the agent decided, WHETHER it cleared
 * compliance, HOW confident it was, WHY (reasoning), what it COST, and WHO
 * reviewed it (HITL).
 *
 * PII-safe by contract: it renders only the PII-minimized record fields
 * (R-SEC / ADR-016) — no raw client data, no secrets, no chain-of-thought.
 *
 * Compliance outcome is surfaced via the shared ComplianceFlag component for
 * the actionable outcomes (FAIL → BLOCKED, ESCALATE → REVIEW). A PASS/N/A
 * decision is shown as a non-alarming status indicator — rendering an alert
 * flag for a clean decision would mislabel it.
 */

interface DecisionViewProps {
  record: AgentDecisionRecord
}

/** Maps the actionable compliance outcomes onto a ComplianceFlag type. */
const COMPLIANCE_FLAG: Partial<Record<ComplianceResult, FlagType>> = {
  FAIL: 'BLOCKED',
  ESCALATE: 'REVIEW',
}

/** HITL band for the confidence score (ADR-046 / .claude/rules/agents.md). */
function confidenceBand(score: number): string {
  if (score > 0.9) return 'AUTO'
  if (score >= 0.7) return 'REVIEW'
  return 'BLOCK'
}

function ComplianceOutcome({ result }: { result: ComplianceResult }): React.ReactElement {
  const flagType = COMPLIANCE_FLAG[result]
  const isPass = result === 'PASS'
  return (
    <div role="group" aria-label={`Compliance result: ${result}`}>
      {flagType ? (
        // Actionable outcome — reuse the shared ComplianceFlag (an alert).
        <ComplianceFlag type={flagType} note={`Compliance result: ${result}`} />
      ) : (
        // PASS / N/A — clean decision, shown as a calm status (not an alert flag).
        <div
          role="status"
          className={`rounded-md border px-3 py-2 text-sm ${
            isPass ? 'border-success text-success bg-success-subtle' : 'border-border-subtle text-secondary'
          }`}
        >
          <p className="font-semibold">{isPass ? '✓ Compliance: PASS' : 'Compliance: N/A'}</p>
        </div>
      )}
    </div>
  )
}

export function DecisionView({ record }: DecisionViewProps): React.ReactElement {
  const confidencePct = Math.round(record.confidence_score * 100)

  return (
    <section
      aria-label="Agent decision record"
      data-testid="decision-view"
      data-record-id={record.record_id}
      className="rounded-lg bg-surface border border-border-subtle p-4 flex flex-col gap-3"
    >
      {/* Header: agent + AI provenance */}
      <header className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full bg-ai-accent/20 text-ai-accent"
          aria-label="AI-generated decision"
        >
          ✦ {record.agent_id}
        </span>
        <span className="text-xs text-secondary font-mono" aria-label="Correlation id">
          {record.correlation_id}
        </span>
      </header>

      {/* Intent — what the client asked for */}
      <div>
        <p className="text-xs text-secondary uppercase tracking-wider">Intent</p>
        <p className="text-sm text-primary">{record.intent}</p>
      </div>

      {/* Decision — the action taken */}
      <div>
        <p className="text-xs text-secondary uppercase tracking-wider">Decision</p>
        <p className="text-sm font-semibold text-primary">{record.action_taken}</p>
      </div>

      {/* Compliance outcome — reuses ComplianceFlag */}
      <ComplianceOutcome result={record.compliance_result} />

      {/* Confidence */}
      <div>
        <p className="text-xs text-secondary uppercase tracking-wider">Confidence</p>
        <p className="text-sm text-primary">
          <span className="font-mono font-semibold">{confidencePct}%</span>
          <span className="text-xs text-secondary ml-2">({confidenceBand(record.confidence_score)})</span>
        </p>
      </div>

      {/* Reasoning summary */}
      <div>
        <p className="text-xs text-secondary uppercase tracking-wider">Reasoning</p>
        <p className="text-sm text-primary leading-relaxed">{record.reasoning_summary}</p>
      </div>

      {/* Cost — Decimal string, never float (I-05) */}
      <div>
        <p className="text-xs text-secondary uppercase tracking-wider">Cost</p>
        <p className="text-sm text-primary">
          <span className="font-mono">{record.cost_amount}</span>
          <span className="text-xs text-secondary ml-2">{record.cost_tokens} tokens</span>
          {record.budget_breach_flag !== 'NONE' && (
            <span
              className="ml-2 text-xs font-semibold text-warning"
              aria-label={`Budget breach: ${record.budget_breach_flag}`}
            >
              ⚠ {record.budget_breach_flag}
            </span>
          )}
        </p>
      </div>

      {/* HITL reviewer — only when a human reviewed the decision */}
      {record.human_reviewed_by && (
        <div className="border-t border-border-subtle pt-2">
          <p className="text-xs text-secondary uppercase tracking-wider">Reviewed by (HITL)</p>
          <p className="text-sm text-primary">{record.human_reviewed_by}</p>
        </div>
      )}
    </section>
  )
}
