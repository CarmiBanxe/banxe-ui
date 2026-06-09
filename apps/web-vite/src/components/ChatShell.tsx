import React, { useState } from 'react'
import { AIInsightCard } from '@banxe/ui'
import type { AgentDecisionRecord } from '@banxe/shared/types'
import { DecisionView } from './DecisionView'

/**
 * ChatShell — chat-first surface for the AI-Native client experience (S7).
 *
 * Layout: a scrolling message list (user + agent bubbles) over a text input.
 * An agent response is not free text — it is structured: either an inline
 * AgentDecisionRecord card (DecisionView) or an AI insight (reused
 * AIInsightCard). The empty state always mounts a reused AIInsightCard so the
 * surface introduces itself.
 *
 * S7 is a scaffold: onSubmit is a placeholder dispatch. Real L1 Intent Layer
 * wiring (submit → agent → decision record) lands in S8. Styling references
 * the repo's AI-Native tokens (ai-accent, bubble bg, typing indicator) rather
 * than duplicating them.
 */

export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  /** Agent messages may carry a decision record or an insight; user messages carry text. */
  kind?: 'text' | 'decision' | 'insight'
  text?: string
  decision?: AgentDecisionRecord
  insight?: { insight: string; confidence: 'HIGH' | 'MEDIUM' | 'UNCERTAIN'; explanation?: string }
}

export interface ChatShellProps {
  title?: string
  messages?: ChatMessage[]
  /** Placeholder dispatch in S7; real L1 Intent wiring is S8. */
  onSubmit?: (text: string) => void
  /** Optional welcome insight shown in the empty state (reused AIInsightCard). */
  welcomeInsight?: { insight: string; confidence: 'HIGH' | 'MEDIUM' | 'UNCERTAIN'; explanation?: string }
}

const DEFAULT_WELCOME = {
  insight: 'Ask me about a payment, a balance, or a compliance decision. Every agent response is a traceable decision record.',
  confidence: 'HIGH' as const,
  explanation: 'BANXE AI surfaces an auditable AgentDecisionRecord for every consequential decision (ADR-046).',
}

function AgentMessage({ message }: { message: ChatMessage }): React.ReactElement {
  if (message.kind === 'decision' && message.decision) {
    return <DecisionView record={message.decision} />
  }
  if (message.kind === 'insight' && message.insight) {
    return (
      <AIInsightCard
        insight={message.insight.insight}
        confidence={message.insight.confidence}
        explanation={message.insight.explanation}
      />
    )
  }
  return (
    <div
      className="max-w-sm lg:max-w-lg bg-surface border border-border-subtle rounded-2xl rounded-tl-sm px-4 py-3"
      aria-label="AI-generated content follows"
    >
      <p className="text-primary text-sm leading-relaxed">{message.text}</p>
    </div>
  )
}

export function ChatShell({
  title = 'BANXE AI',
  messages,
  onSubmit,
  welcomeInsight = DEFAULT_WELCOME,
}: ChatShellProps): React.ReactElement {
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages ?? [])
  const [input, setInput] = useState('')

  const items = messages ?? localMessages

  const submit = (): void => {
    const text = input.trim()
    if (!text) return
    // Optimistically render the user's message; real dispatch happens in S8.
    if (!messages) {
      setLocalMessages((prev) => [...prev, { id: `u-${prev.length}`, role: 'user', kind: 'text', text }])
    }
    onSubmit?.(text)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full bg-bg-base" data-testid="chat-shell">
      {/* ── Header ── */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-border-subtle bg-surface">
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-ai-accent/20 text-ai-accent"
            aria-hidden="true"
          >
            ✦
          </span>
          <div>
            <h1 className="text-lg font-bold text-primary">{title}</h1>
            <p className="text-xs text-secondary">AI cannot initiate payments — all interactions are logged for audit</p>
          </div>
        </div>
      </header>

      {/* ── Message list / response area ── */}
      <div
        className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        {/* Empty state mounts a reused AIInsightCard so the surface introduces itself. */}
        {items.length === 0 && (
          <div className="flex-shrink-0">
            <AIInsightCard
              insight={welcomeInsight.insight}
              confidence={welcomeInsight.confidence}
              explanation={welcomeInsight.explanation}
            />
          </div>
        )}

        {items.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'user' ? (
              <div className="max-w-xs lg:max-w-md bg-brand-subtle rounded-2xl rounded-tr-sm px-4 py-3">
                <p className="text-primary text-sm">{msg.text}</p>
              </div>
            ) : (
              <div className="max-w-sm lg:max-w-lg w-full">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded bg-ai-accent/20 text-ai-accent"
                    aria-label="AI-generated content"
                  >
                    ✦ AI
                  </span>
                </div>
                <AgentMessage message={msg} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-border-subtle bg-surface">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder="Ask BANXE AI…"
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl bg-elevated border border-border-default text-primary placeholder:text-secondary text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Message to BANXE AI"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-brand-primary text-inverse hover:bg-brand-light disabled:opacity-50 transition-colors"
            aria-label="Send message"
          >
            ↑
          </button>
        </div>
        <p className="mt-2 text-xs text-secondary">
          AI responses are for informational purposes only and may contain errors.
        </p>
      </div>
    </div>
  )
}
