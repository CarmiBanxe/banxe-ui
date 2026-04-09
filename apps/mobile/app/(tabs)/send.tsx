import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

/**
 * Mobile Send Flow — M-04
 *
 * Differences from W-04:
 * - Step-by-step full-screen flow (no sidebar)
 * - Beneficiary: searchable list with initials avatar
 * - Amount: large numpad (calculator style)
 * - Biometric or PIN for SCA (not TOTP on mobile) — mocked as PIN entry
 * - Bottom sheet confirmation (not modal)
 *
 * Per BANXE-SCREEN-INVENTORY.md M-04 spec.
 */

type Step = 'recipient' | 'amount' | 'confirm' | 'processing' | 'success' | 'blocked'

const MOCK_BENEFICIARIES = [
  { id: 'b1', name: 'Alice Johnson', iban: 'GB29NWBK****6819', currency: 'GBP' },
  { id: 'b2', name: 'Bob Müller GmbH', iban: 'DE89****3000', currency: 'EUR' },
  { id: 'b3', name: 'ACME Corp Ltd', iban: 'GB29NWBK****0001', currency: 'GBP' },
]

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

const NUMPAD_KEYS = ['1','2','3','4','5','6','7','8','9','.','0','⌫'] as const

export default function MobileSend() {
  const [step, setStep] = useState<Step>('recipient')
  const [beneficiary, setBeneficiary] = useState<(typeof MOCK_BENEFICIARIES)[0] | null>(null)
  const [search, setSearch] = useState('')
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [reference, setReference] = useState('')

  const numAmount = parseFloat(amount || '0')
  const requiresPin = numAmount > 30

  const filteredBeneficiaries = MOCK_BENEFICIARIES.filter(
    (b) =>
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleNumpad = (key: string) => {
    if (key === '⌫') {
      setAmount((a) => a.slice(0, -1))
    } else if (key === '.' && amount.includes('.')) {
      return
    } else if (amount.replace('.', '').length >= 8) {
      return
    } else {
      setAmount((a) => {
        // Don't allow leading zeros except before decimal
        if (a === '0' && key !== '.') return key
        return a + key
      })
    }
  }

  const handleConfirm = async () => {
    if (requiresPin && pin.length < 4) {
      setPinError('Enter your 4-digit PIN to confirm')
      return
    }
    setStep('processing')
    await new Promise((r) => setTimeout(r, 1800))
    const ref = `REF-${Date.now().toString().slice(-8)}`
    setReference(ref)
    setStep('success')
  }

  const reset = () => {
    setStep('recipient')
    setBeneficiary(null)
    setSearch('')
    setAmount('')
    setPin('')
    setPinError('')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Progress bar ── */}
      {!['processing', 'success', 'blocked'].includes(step) && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: step === 'recipient' ? '33%' : step === 'amount' ? '66%' : '100%' }]} />
        </View>
      )}

      {/* ── Step: Recipient ── */}
      {step === 'recipient' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Send money to</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search beneficiary…"
            placeholderTextColor="#4A5F72"
            style={styles.searchInput}
            accessibilityLabel="Search beneficiaries"
          />
          <ScrollView style={styles.beneficiaryList}>
            {filteredBeneficiaries.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={styles.beneficiaryRow}
                onPress={() => { setBeneficiary(b); setStep('amount') }}
                accessibilityLabel={`Send to ${b.name}, IBAN ${b.iban}`}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(b.name)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bName}>{b.name}</Text>
                  <Text style={styles.bIban}>{b.iban}</Text>
                </View>
                <Text style={styles.bCurrency}>{b.currency}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Step: Amount (numpad) ── */}
      {step === 'amount' && beneficiary && (
        <View style={styles.stepContainer}>
          <TouchableOpacity onPress={() => setStep('recipient')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.stepTitle}>How much to {beneficiary.name.split(' ')[0]}?</Text>

          {/* Amount display */}
          <View
            style={styles.amountDisplay}
            accessibilityLabel={`Amount: ${amount || '0'} ${beneficiary.currency}`}
          >
            <Text style={[styles.amountText, amount ? styles.amountFilled : styles.amountPlaceholder]}>
              {amount || '0'}
            </Text>
            <Text style={styles.currencyLabel}>{beneficiary.currency}</Text>
          </View>

          {/* Numpad */}
          <View style={styles.numpad}>
            {NUMPAD_KEYS.map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.numKey}
                onPress={() => handleNumpad(key)}
                accessibilityLabel={key === '⌫' ? 'Delete' : key}
              >
                <Text style={[styles.numKeyText, key === '⌫' && styles.numKeyDelete]}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, (!amount || numAmount <= 0) && styles.primaryBtnDisabled]}
            disabled={!amount || numAmount <= 0}
            onPress={() => setStep('confirm')}
            accessibilityLabel="Review payment"
          >
            <Text style={styles.primaryBtnText}>Review →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Step: Confirm ── */}
      {step === 'confirm' && beneficiary && (
        <ScrollView style={styles.stepContainer} contentContainerStyle={{ paddingBottom: 40 }}>
          <TouchableOpacity onPress={() => setStep('amount')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Confirm payment</Text>

          <View style={styles.summaryCard}>
            {[
              ['To', beneficiary.name],
              ['IBAN', beneficiary.iban],
              ['Amount', `${amount} ${beneficiary.currency}`],
              ['Fee', 'Free (FPS)'],
            ].map(([label, value]) => (
              <View key={label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{label}</Text>
                <Text style={[styles.summaryValue, label === 'Amount' && styles.summaryAmount]}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          {requiresPin && (
            <View style={styles.pinSection}>
              <Text style={styles.pinLabel}>Enter your PIN to confirm</Text>
              <View style={styles.pinDots}>
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[styles.pinDot, i < pin.length && styles.pinDotFilled]}
                  />
                ))}
              </View>
              <View style={styles.numpad}>
                {NUMPAD_KEYS.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.numKey}
                    onPress={() => {
                      setPinError('')
                      if (key === '⌫') setPin((p) => p.slice(0, -1))
                      else if (key !== '.' && pin.length < 4) setPin((p) => p + key)
                    }}
                    accessibilityLabel={key === '⌫' ? 'Delete' : `PIN digit ${key}`}
                  >
                    <Text style={[styles.numKeyText, key === '⌫' && styles.numKeyDelete]}>
                      {key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {pinError ? <Text style={styles.errorText} accessibilityRole="alert">{pinError}</Text> : null}
            </View>
          )}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleConfirm}>
            <Text style={styles.primaryBtnText}>Confirm payment</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ── Processing ── */}
      {step === 'processing' && (
        <View style={styles.centeredState} accessibilityLiveRegion="assertive">
          <View style={styles.processingSpinner} />
          <Text style={styles.resultTitle}>Processing…</Text>
          <Text style={styles.resultSubtitle}>Please keep this screen open</Text>
        </View>
      )}

      {/* ── Success ── */}
      {step === 'success' && (
        <View style={styles.centeredState} accessibilityLiveRegion="polite">
          <View style={styles.successIcon}>
            <Text style={{ fontSize: 36 }}>✓</Text>
          </View>
          <Text style={styles.resultTitle}>Payment sent!</Text>
          <Text style={styles.resultRef}>Reference: {reference}</Text>
          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 32, width: '80%' }]} onPress={reset}>
            <Text style={styles.primaryBtnText}>New payment</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080C14' },
  progressBar: { height: 3, backgroundColor: '#1F2D3D', marginTop: 56 },
  progressFill: { height: 3, backgroundColor: '#1A7FD4' },
  stepContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  backBtn: { marginBottom: 16 },
  backBtnText: { fontSize: 14, color: '#1A7FD4' },
  stepTitle: { fontSize: 22, fontWeight: '700', color: '#E8EDF5', marginBottom: 20 },
  searchInput: { backgroundColor: '#0F1520', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#E8EDF5', borderWidth: 1, borderColor: '#1F2D3D', marginBottom: 12 },
  beneficiaryList: { flex: 1 },
  beneficiaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1F2D3D', gap: 12 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1A3A5C', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#1A7FD4' },
  bName: { fontSize: 14, fontWeight: '600', color: '#E8EDF5' },
  bIban: { fontSize: 11, fontFamily: 'monospace', color: '#8DA0B5' },
  bCurrency: { fontSize: 13, color: '#8DA0B5', fontWeight: '600' },
  amountDisplay: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8, paddingVertical: 24 },
  amountText: { fontSize: 48, fontWeight: '700', fontFamily: 'monospace' },
  amountFilled: { color: '#E8EDF5' },
  amountPlaceholder: { color: '#2A3D52' },
  currencyLabel: { fontSize: 20, color: '#8DA0B5', fontWeight: '600' },
  numpad: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
  numKey: { width: '30%', aspectRatio: 1.6, backgroundColor: '#0F1520', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1F2D3D' },
  numKeyText: { fontSize: 20, fontWeight: '600', color: '#E8EDF5' },
  numKeyDelete: { color: '#8DA0B5' },
  primaryBtn: { backgroundColor: '#1A7FD4', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryBtnDisabled: { opacity: 0.4 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#080C14' },
  summaryCard: { backgroundColor: '#0F1520', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#1F2D3D', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1F2D3D' },
  summaryLabel: { fontSize: 13, color: '#8DA0B5' },
  summaryValue: { fontSize: 13, color: '#E8EDF5', fontWeight: '500' },
  summaryAmount: { fontSize: 16, fontWeight: '700', fontFamily: 'monospace', color: '#E8EDF5' },
  pinSection: { marginBottom: 16 },
  pinLabel: { fontSize: 14, color: '#8DA0B5', textAlign: 'center', marginBottom: 16 },
  pinDots: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 16 },
  pinDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#2A3D52' },
  pinDotFilled: { backgroundColor: '#1A7FD4', borderColor: '#1A7FD4' },
  errorText: { color: '#EF4444', fontSize: 12, textAlign: 'center', marginTop: 8 },
  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  processingSpinner: { width: 56, height: 56, borderRadius: 28, borderWidth: 4, borderColor: '#1A7FD4', borderTopColor: 'transparent', marginBottom: 20 },
  successIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#0F2B1A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  resultTitle: { fontSize: 24, fontWeight: '700', color: '#E8EDF5', marginBottom: 8 },
  resultSubtitle: { fontSize: 14, color: '#8DA0B5' },
  resultRef: { fontSize: 13, fontFamily: 'monospace', color: '#8DA0B5', marginTop: 8 },
})
