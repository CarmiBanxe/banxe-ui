/**
 * S7 acceptance (b): the chat shell renders and accepts input.
 * S7 acceptance (c): a reused UI component is mounted under the chat shell.
 * Also verifies an agent response can render a DecisionView inline.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatShell } from '../../apps/web-vite/src/components/ChatShell'
import type { ChatMessage } from '../../apps/web-vite/src/components/ChatShell'
import { makeDecisionRecord } from './fixtures/agentDecisionRecord'

describe('ChatShell (S7-b)', () => {
  it('renders the chat surface', () => {
    render(<ChatShell />)
    expect(screen.getByTestId('chat-shell')).toBeTruthy()
    expect(screen.getByRole('log', { name: /conversation/i })).toBeTruthy()
  })

  it('accepts text input and fires onSubmit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ChatShell onSubmit={onSubmit} />)

    const input = screen.getByRole('textbox', { name: /message to banxe ai/i })
    await user.type(input, 'Approve my SEPA payment')
    expect((input as HTMLTextAreaElement).value).toBe('Approve my SEPA payment')

    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(onSubmit).toHaveBeenCalledWith('Approve my SEPA payment')
    // input clears after submit
    expect((input as HTMLTextAreaElement).value).toBe('')
  })

  it('submits on Enter and renders the user message', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ChatShell onSubmit={onSubmit} />)
    const input = screen.getByRole('textbox', { name: /message to banxe ai/i })
    await user.type(input, 'What is my balance?{Enter}')
    expect(onSubmit).toHaveBeenCalledWith('What is my balance?')
    expect(screen.getByText('What is my balance?')).toBeTruthy()
  })

  it('does not fire onSubmit for empty input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ChatShell onSubmit={onSubmit} />)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

describe('ChatShell reuse (S7-c)', () => {
  it('mounts a reused AIInsightCard in the empty state', () => {
    render(<ChatShell />)
    const insight = screen.getByRole('region', { name: /ai-generated insight/i })
    expect(insight).toBeTruthy()
    // The reused AIInsightCard always shows its provenance badge.
    expect(within(insight).getByText('BANXE AI')).toBeTruthy()
  })

  it('mounts a reused AIInsightCard as an agent response', () => {
    const messages: ChatMessage[] = [
      {
        id: 'a-1',
        role: 'agent',
        kind: 'insight',
        insight: { insight: 'Your FX spend is up 34% this month.', confidence: 'MEDIUM' },
      },
    ]
    render(<ChatShell messages={messages} />)
    expect(screen.getByRole('region', { name: /ai-generated insight/i })).toBeTruthy()
    expect(screen.getByText(/FX spend is up 34%/)).toBeTruthy()
  })

  it('renders a DecisionView inline as an agent decision response', () => {
    const messages: ChatMessage[] = [
      { id: 'u-1', role: 'user', kind: 'text', text: 'Approve payment pay_8821' },
      { id: 'a-1', role: 'agent', kind: 'decision', decision: makeDecisionRecord() },
    ]
    render(<ChatShell messages={messages} />)
    const decision = screen.getByTestId('decision-view')
    expect(decision).toBeTruthy()
    expect(within(decision).getByText('APPROVE_PAYMENT')).toBeTruthy()
  })
})
