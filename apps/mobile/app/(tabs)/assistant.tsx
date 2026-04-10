import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native'

/**
 * Mobile AI Assistant — M-05
 *
 * Differences from W-05:
 * - Full screen from bottom tab
 * - Keyboard-aware layout (KeyboardAvoidingView)
 * - Suggestion chips pre-loaded
 * - Pull to refresh insight list
 *
 * Per BANXE-SCREEN-INVENTORY.md M-05 spec.
 */

type Confidence = 'HIGH' | 'MEDIUM' | 'UNCERTAIN'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  confidence?: Confidence
  feedback?: 'up' | 'down' | null
}

const SUGGESTIONS = [
  "What's my balance?",
  'Any unusual activity?',
  'How to make SEPA payment?',
]

const MOCK_RESPONSES: Array<{ keywords: string[]; content: string; confidence: Confidence }> = [
  {
    keywords: ['balance', 'available'],
    content: 'Your available balances: GBP £4,700 (£50 pending), EUR €2,100. Total ≈ £6,497.',
    confidence: 'HIGH',
  },
  {
    keywords: ['unusual', 'suspicious', 'activity'],
    content: 'One transaction is under review: REF-REVIEW-001 for £9,800. Compliance team will respond within 2 business days.',
    confidence: 'HIGH',
  },
  {
    keywords: ['sepa', 'euro', 'europe'],
    content: 'For SEPA: go to Send, enter a European IBAN. EUR rail is selected automatically. Processing: 1 business day.',
    confidence: 'HIGH',
  },
]

function getResponse(query: string): { content: string; confidence: Confidence } {
  const q = query.toLowerCase()
  for (const r of MOCK_RESPONSES) {
    if (r.keywords.some((k) => q.includes(k))) return { content: r.content, confidence: r.confidence }
  }
  return {
    content: "I'm not certain about this. Please verify with your account details or contact support.",
    confidence: 'UNCERTAIN',
  }
}

const CONFIDENCE_COLOR: Record<Confidence, string> = {
  HIGH: '#22C55E',
  MEDIUM: '#F59E0B',
  UNCERTAIN: '#EF4444',
}

export default function MobileAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 500))

    const { content, confidence } = getResponse(text)
    setMessages((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, role: 'assistant', content, confidence, feedback: null },
    ])
    setIsThinking(false)
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  const handleFeedback = (id: string, vote: 'up' | 'down') => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedback: vote } : m)))
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.aiBadgeContainer}>
          <Text style={styles.aiIcon}>✦</Text>
        </View>
        <View>
          <Text style={styles.title}>AI Assistant</Text>
          <Text style={styles.subtitle}>All interactions are logged for audit</Text>
        </View>
      </View>
      <View style={styles.notice}>
        <Text style={styles.noticeText}>ℹ AI cannot initiate payments or change account settings</Text>
      </View>

      {/* ── Messages ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        accessibilityLabel="AI assistant conversation"
        accessibilityLiveRegion="polite"
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Ask me about your finances</Text>
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.chip}
                  onPress={() => sendMessage(s)}
                  accessibilityRole="button"
                >
                  <Text style={styles.chipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageRow, msg.role === 'user' ? styles.messageRowUser : styles.messageRowAI]}
          >
            {msg.role === 'user' ? (
              <View style={styles.userBubble}>
                <Text style={styles.userText}>{msg.content}</Text>
              </View>
            ) : (
              <View style={styles.aiBubbleContainer}>
                {/* AI badge — mandatory */}
                <View style={styles.aiMsgBadge}>
                  <Text style={styles.aiMsgBadgeText}>✦ AI</Text>
                  {msg.confidence && (
                    <Text style={[styles.confidenceText, { color: CONFIDENCE_COLOR[msg.confidence] }]}>
                      {msg.confidence}
                    </Text>
                  )}
                </View>
                <View style={styles.aiBubble} accessibilityLabel="AI-generated content follows">
                  <Text style={styles.aiText}>{msg.content}</Text>
                  {msg.confidence === 'UNCERTAIN' && (
                    <View style={styles.uncertainWarning}>
                      <Text style={styles.uncertainText}>⚠ I am not certain — please verify</Text>
                    </View>
                  )}
                  <View style={styles.feedbackRow}>
                    <Text style={styles.feedbackLabel}>Helpful?</Text>
                    {(['up', 'down'] as const).map((vote) => (
                      <TouchableOpacity
                        key={vote}
                        onPress={() => handleFeedback(msg.id, vote)}
                        accessibilityLabel={vote === 'up' ? 'Thumbs up' : 'Thumbs down'}
                        accessibilityState={{ checked: msg.feedback === vote }}
                      >
                        <Text style={[
                          styles.feedbackIcon,
                          msg.feedback === vote && { opacity: 1 },
                          msg.feedback !== null && msg.feedback !== vote && { opacity: 0.3 },
                        ]}>
                          {vote === 'up' ? '👍' : '👎'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}

        {isThinking && (
          <View style={styles.messageRowAI} accessibilityLiveRegion="assertive" accessibilityLabel="AI is thinking">
            <View style={styles.aiBubble}>
              <View style={styles.thinkingDots}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={[styles.dot, { opacity: 0.3 + i * 0.3 }]} />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ── Input ── */}
      <View style={styles.inputArea}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your finances…"
          placeholderTextColor="#4A5F72"
          style={styles.textInput}
          multiline
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={() => sendMessage(input)}
          accessibilityLabel="Message to AI assistant"
          editable={!isThinking}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || isThinking) && styles.sendBtnDisabled]}
          disabled={!input.trim() || isThinking}
          onPress={() => sendMessage(input)}
          accessibilityLabel="Send message"
        >
          <Text style={styles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080C14' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1F2D3D' },
  aiBadgeContainer: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED' },
  aiIcon: { fontSize: 18, color: '#FFF' },
  title: { fontSize: 17, fontWeight: '700', color: '#E8EDF5' },
  subtitle: { fontSize: 11, color: '#8DA0B5' },
  notice: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#16202E' },
  noticeText: { fontSize: 11, color: '#8DA0B5' },
  messageList: { flex: 1 },
  messageListContent: { padding: 16, paddingBottom: 8, gap: 12 },
  emptyState: { alignItems: 'center', paddingTop: 40, gap: 16 },
  emptyText: { fontSize: 14, color: '#8DA0B5' },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: { backgroundColor: '#0F1520', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#1F2D3D' },
  chipText: { fontSize: 13, color: '#8DA0B5' },
  messageRow: { flexDirection: 'row', marginVertical: 2 },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowAI: { justifyContent: 'flex-start' },
  userBubble: { backgroundColor: '#1A3A5C', borderRadius: 18, borderBottomRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '80%' },
  userText: { fontSize: 14, color: '#E8EDF5' },
  aiBubbleContainer: { maxWidth: '85%' },
  aiMsgBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  aiMsgBadgeText: { fontSize: 10, fontWeight: '700', color: '#7C3AED', backgroundColor: '#1A0F2B', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  confidenceText: { fontSize: 10 },
  aiBubble: { backgroundColor: '#0F1520', borderRadius: 18, borderTopLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#1F2D3D' },
  aiText: { fontSize: 14, color: '#E8EDF5', lineHeight: 20 },
  uncertainWarning: { backgroundColor: '#2B0F0F', borderRadius: 6, padding: 8, marginTop: 8 },
  uncertainText: { fontSize: 11, color: '#EF4444' },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1F2D3D' },
  feedbackLabel: { fontSize: 11, color: '#8DA0B5', marginRight: 4 },
  feedbackIcon: { fontSize: 16, opacity: 0.5 },
  thinkingDots: { flexDirection: 'row', gap: 6, padding: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#8DA0B5' },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 12, borderTopWidth: 1, borderTopColor: '#1F2D3D', backgroundColor: '#0F1520' },
  textInput: { flex: 1, backgroundColor: '#16202E', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#E8EDF5', maxHeight: 100, borderWidth: 1, borderColor: '#1F2D3D' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A7FD4', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { fontSize: 18, color: '#080C14', fontWeight: '700' },
})
