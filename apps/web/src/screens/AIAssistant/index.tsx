import React, { useState, useRef, useEffect } from 'react'
import { AIInsightCard } from '@banxe/ui'
import type { Confidence } from '@banxe/ui'

/**
 * AI Assistant — W-05
 *
 * Purpose: Interactive AI for financial queries, insights, anomaly alerts.
 * Required components: AIChatInterface, AIBadge, ConfidenceIndicator, FeedbackButtons
 * Data: chat history (session), recent transactions context, active flags
 * States: idle | thinking | responded | uncertain | error
 * Accessibility: responses labeled "AI-generated content follows", AI badge always visible
 * Trust/compliance: every response has AI badge + confidence. "AI cannot initiate payments."
 * Audit: all interactions logged (FCA audit trail)
 */

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  confidence?: Confidence
  timestamp: Date
  feedback?: 'up' | 'down' | null
}

type AiState = 'idle' | 'thinking' | 'error'

const SUGGESTION_CHIPS = [
  'What is my spending this month?',
  'Any unusual transactions?',
  'How do I make a SEPA payment?',
  'What is my available balance?',
]

const MOCK_RESPONSES: Array<{ keywords: string[]; content: string; confidence: Confidence }> = [
  {
    keywords: ['spending', 'month'],
    content:
      'Your total spending this month is £1,249.99 across 4 outbound transactions. This is 34% higher than your 3-month average of £933. The main driver is a SEPA outbound of €1,200 to FAKE_SEPA Recipient GmbH.',
    confidence: 'HIGH',
  },
  {
    keywords: ['unusual', 'suspicious', 'review', 'flag'],
    content:
      'I noticed one transaction flagged for compliance review: REF-REVIEW-001 for £9,800 to FAKE_Suspicious Corp on 08 Apr 2026. Our compliance team is reviewing it and will contact you within 2 business days.',
    confidence: 'HIGH',
  },
  {
    keywords: ['sepa', 'euro', 'europe', 'payment'],
    content:
      'To make a SEPA payment, go to Send Money and select a EUR wallet or enter a European IBAN. The SEPA rail will be automatically selected for EUR payments under €50,000. Standard processing is 1 business day within SEPA zone.',
    confidence: 'HIGH',
  },
  {
    keywords: ['balance', 'available', 'funds'],
    content:
      'Your available balances are: GBP £4,700.00 (£50 pending), EUR €2,100.00. Total available across wallets is approximately £6,497 at current exchange rates.',
    confidence: 'MEDIUM',
  },
]

function getResponse(query: string): { content: string; confidence: Confidence } {
  const q = query.toLowerCase()
  for (const r of MOCK_RESPONSES) {
    if (r.keywords.some((k) => q.includes(k))) {
      return { content: r.content, confidence: r.confidence }
    }
  }
  return {
    content:
      "I'm not certain about this. Please check your account details directly or contact support for specific account queries. I can help with questions about your transactions, balances, and how to use BANXE features.",
    confidence: 'UNCERTAIN',
  }
}

export function AIAssistant(): React.ReactElement {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [aiState, setAiState] = useState<AiState>('idle')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, aiState])

  const sendMessage = async (text: string) => {
    if (!text.trim() || aiState === 'thinking') return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setAiState('thinking')

    // Simulate AI response latency
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600))

    const { content, confidence } = getResponse(text)
    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content,
      confidence,
      timestamp: new Date(),
      feedback: null,
    }
    setMessages((prev) => [...prev, assistantMsg])
    setAiState('idle')
  }

  const handleFeedback = (id: string, vote: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: vote } : m)),
    )
  }

  const confidenceColor: Record<Confidence, string> = {
    HIGH: 'text-success',
    MEDIUM: 'text-warning',
    UNCERTAIN: 'text-error',
  }

  const confidenceLabel: Record<Confidence, string> = {
    HIGH: 'High confidence',
    MEDIUM: 'Medium confidence',
    UNCERTAIN: 'Uncertain — verify with account details',
  }

  return (
    <div className="flex flex-col h-screen bg-bg-base">
      {/* ── Header ── */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-border-subtle bg-surface">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ backgroundColor: 'var(--color-ai-accent, #7C3AED)' }}
            aria-hidden="true"
          >
            ✦
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">AI Assistant</h1>
            <p className="text-xs text-secondary">Powered by BANXE AI — all interactions are logged for audit</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-secondary bg-elevated rounded px-2 py-1 inline-block">
          ℹ AI cannot initiate payments or change account settings
        </p>
      </header>

      {/* ── Active insights (when no conversation) ── */}
      {messages.length === 0 && (
        <div className="flex-shrink-0 px-6 pt-4">
          <AIInsightCard
            insight="Your FX spending increased 34% this month vs. your 3-month average."
            confidence="HIGH"
            explanation="Based on 12 outbound EUR transactions totalling £2,340 vs. £1,750 average."
            actionLabel="Ask about this"
            onAction={() => sendMessage('Tell me more about my FX spending this month')}
          />
        </div>
      )}

      {/* ── Message list ── */}
      <div
        className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"
        role="log"
        aria-label="AI assistant conversation"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 py-8">
            <p className="text-secondary text-sm">Ask me about your finances</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-sm text-secondary hover:text-primary hover:border-brand-primary transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'user' ? (
              <div className="max-w-xs lg:max-w-md bg-brand-subtle rounded-2xl rounded-tr-sm px-4 py-3">
                <p className="text-primary text-sm">{msg.content}</p>
                <p className="text-secondary text-xs mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ) : (
              <div className="max-w-sm lg:max-w-lg">
                {/* AI badge — mandatory */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: 'var(--color-ai-subtle, #1A0F2B)',
                      color: 'var(--color-ai-accent, #7C3AED)',
                    }}
                    aria-label="AI-generated content"
                  >
                    ✦ AI
                  </span>
                  {msg.confidence && (
                    <span className={`text-xs ${confidenceColor[msg.confidence]}`}>
                      {confidenceLabel[msg.confidence]}
                    </span>
                  )}
                </div>

                {/* Response content */}
                <div
                  className="bg-surface border border-border-subtle rounded-2xl rounded-tl-sm px-4 py-3"
                  aria-label="AI-generated content follows"
                >
                  <p className="text-primary text-sm leading-relaxed">{msg.content}</p>

                  {msg.confidence === 'UNCERTAIN' && (
                    <p className="mt-2 text-xs text-error bg-error-subtle rounded px-2 py-1">
                      ⚠ I am not certain about this. Please verify with your account details.
                    </p>
                  )}

                  {/* Feedback buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border-subtle">
                    <span className="text-xs text-secondary">Helpful?</span>
                    <button
                      onClick={() => handleFeedback(msg.id, 'up')}
                      className={`text-sm transition-colors ${
                        msg.feedback === 'up' ? 'text-success' : 'text-secondary hover:text-success'
                      }`}
                      aria-label="Thumbs up — helpful"
                      aria-pressed={msg.feedback === 'up'}
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'down')}
                      className={`text-sm transition-colors ${
                        msg.feedback === 'down' ? 'text-error' : 'text-secondary hover:text-error'
                      }`}
                      aria-label="Thumbs down — not helpful"
                      aria-pressed={msg.feedback === 'down'}
                    >
                      👎
                    </button>
                    <button className="ml-auto text-xs text-secondary hover:text-primary transition-colors">
                      Why this? ›
                    </button>
                  </div>
                </div>
                <p className="text-xs text-secondary mt-1 ml-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {aiState === 'thinking' && (
          <div className="flex justify-start" aria-live="assertive" aria-label="AI is thinking">
            <div className="bg-surface border border-border-subtle rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-secondary animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {aiState === 'error' && (
          <div className="flex justify-center">
            <p className="text-sm text-error bg-error-subtle rounded-lg px-3 py-2" role="alert">
              AI temporarily unavailable — try again
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-border-subtle bg-surface">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            placeholder="Ask about your finances…"
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl bg-elevated border border-border-default text-primary placeholder:text-secondary text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Message to AI assistant"
            aria-describedby="ai-notice"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || aiState === 'thinking'}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-brand-primary text-inverse hover:bg-brand-light disabled:opacity-50 transition-colors"
            aria-label="Send message"
          >
            ↑
          </button>
        </div>
        <p id="ai-notice" className="mt-2 text-xs text-secondary">
          AI responses are for informational purposes only and may contain errors.
        </p>
      </div>
    </div>
  )
}
