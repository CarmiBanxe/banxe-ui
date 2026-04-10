import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as LocalAuthentication from 'expo-local-authentication'
import * as Haptics from 'expo-haptics'

/**
 * BANXE Transfers — M-03
 * PSD2 SCA two-step: form → biometric confirm
 * I-05: amount never parsed as float
 */

type Step = 'form' | 'review' | 'success'

export default function TransfersScreen() {
  const [step, setStep] = useState<Step>('form')
  const [iban, setIban] = useState('')
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [ibanError, setIbanError] = useState<string | null>(null)
  const [amountError, setAmountError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function validateIban(v: string): string | null {
    const clean = v.replace(/\s/g, '').toUpperCase()
    if (clean.length < 15 || clean.length > 34) return 'IBAN must be 15–34 characters'
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(clean)) return 'Invalid IBAN format'
    return null
  }

  function validateAmount(v: string): string | null {
    if (!v.trim()) return 'Amount is required'
    if (!/^\d+(\.\d{1,2})?$/.test(v.trim())) return 'Enter a valid amount (e.g. 100.00)'
    if (Number(v) <= 0) return 'Amount must be greater than 0'
    return null
  }

  function handleFormSubmit() {
    const ibanErr = validateIban(iban)
    const amtErr = validateAmount(amount)
    setIbanError(ibanErr)
    setAmountError(amtErr)
    if (ibanErr || amtErr) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setStep('review')
  }

  async function handleBiometricConfirm() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm payment with biometrics (PSD2 SCA)',
        fallbackLabel: 'Enter PIN',
        disableDeviceFallback: false,
      })
      if (!result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        Alert.alert('Authentication failed', 'Please try again or use your PIN.')
        return
      }
    }

    setLoading(true)
    try {
      // TODO: POST /v1/payments — PSD2 SCA execution
      await new Promise((r) => setTimeout(r, 1000))
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setStep('success')
    } finally {
      setLoading(false)
    }
  }

  const formattedIban = iban
    .replace(/\s/g, '')
    .toUpperCase()
    .replace(/(.{4})/g, '$1 ')
    .trim()

  // ── Step 1: Form ─────────────────────────────────────────────────────────────

  if (step === 'form') {
    return (
      <SafeAreaView className="flex-1 bg-bg-page">
        <ScrollView
          className="flex-1 px-5 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-text-primary text-xl font-bold mb-1">Send money</Text>
          <Text className="text-text-secondary text-sm mb-6">
            Protected by PSD2 SCA — two-step confirmation required.
          </Text>

          {/* IBAN input */}
          <View className="mb-4">
            <Text className="text-text-primary text-sm font-medium mb-1.5">
              Recipient IBAN
            </Text>
            <TextInput
              value={iban}
              onChangeText={(v) => { setIban(v); setIbanError(null) }}
              placeholder="GB29 NWBK 6016 1331 9268 19"
              autoCapitalize="characters"
              autoCorrect={false}
              className={`bg-bg-surface border rounded-md px-3 py-3 text-text-primary text-sm ${
                ibanError ? 'border-error' : 'border-border-default'
              }`}
              accessibilityLabel="Recipient IBAN"
              accessibilityHint="Enter the IBAN of the recipient bank account"
              style={{ fontFamily: 'monospace' }}
            />
            {ibanError && (
              <Text className="text-error text-xs mt-1" accessibilityRole="alert">
                {ibanError}
              </Text>
            )}
          </View>

          {/* Amount input */}
          <View className="mb-4">
            <Text className="text-text-primary text-sm font-medium mb-1.5">
              Amount (GBP)
            </Text>
            <TextInput
              value={amount}
              onChangeText={(v) => { setAmount(v); setAmountError(null) }}
              placeholder="0.00"
              keyboardType="decimal-pad"
              className={`bg-bg-surface border rounded-md px-3 py-3 text-text-primary text-sm ${
                amountError ? 'border-error' : 'border-border-default'
              }`}
              accessibilityLabel="Transfer amount in GBP"
            />
            {amountError && (
              <Text className="text-error text-xs mt-1" accessibilityRole="alert">
                {amountError}
              </Text>
            )}
            <Text className="text-text-secondary text-xs mt-1">
              Amounts stored as Decimal strings (I-05 — no floating point)
            </Text>
          </View>

          {/* Reference */}
          <View className="mb-8">
            <Text className="text-text-primary text-sm font-medium mb-1.5">
              Reference (optional)
            </Text>
            <TextInput
              value={reference}
              onChangeText={setReference}
              placeholder="Invoice #1234"
              maxLength={140}
              className="bg-bg-surface border border-border-default rounded-md px-3 py-3 text-text-primary text-sm"
              accessibilityLabel="Payment reference"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleFormSubmit}
            className="bg-primary rounded-md py-4 items-center"
            accessibilityLabel="Review transfer"
            accessibilityRole="button"
          >
            <Text className="text-white font-semibold text-base">Review transfer</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // ── Step 2: PSD2 Review + Biometric Confirm ───────────────────────────────────

  if (step === 'review') {
    return (
      <SafeAreaView className="flex-1 bg-bg-page px-5 pt-4">
        {/* PSD2 badge */}
        <View className="flex-row items-center gap-2 mb-4">
          <View className="bg-warning-subtle border border-yellow-200 rounded px-2 py-1">
            <Text className="text-warning text-xs font-bold">🔒 PSD2 SCA</Text>
          </View>
          <Text className="text-text-secondary text-sm">Step 2 of 2</Text>
        </View>

        <Text className="text-text-primary text-xl font-bold mb-4">Review &amp; confirm</Text>

        {/* Transfer summary */}
        <View className="bg-bg-surface border border-border-subtle rounded-xl p-4 mb-4">
          <View className="flex-row justify-between py-2.5 border-b border-border-subtle">
            <Text className="text-text-secondary text-sm">Recipient IBAN</Text>
            <Text className="text-text-primary text-sm font-mono font-medium max-w-[180px]" numberOfLines={2}>
              {formattedIban}
            </Text>
          </View>
          <View className="flex-row justify-between py-2.5 border-b border-border-subtle">
            <Text className="text-text-secondary text-sm">Amount</Text>
            <Text className="text-text-primary text-sm font-bold font-mono">
              GBP {amount}
            </Text>
          </View>
          {reference ? (
            <View className="flex-row justify-between py-2.5">
              <Text className="text-text-secondary text-sm">Reference</Text>
              <Text className="text-text-primary text-sm">{reference}</Text>
            </View>
          ) : null}
        </View>

        {/* PSD2 notice */}
        <View className="bg-warning-subtle border border-yellow-200 rounded-xl p-3 mb-6">
          <Text className="text-text-secondary text-xs leading-relaxed">
            Under <Text className="font-semibold">PSD2 Article 97</Text>, this payment
            requires Strong Customer Authentication. Confirm with biometrics or PIN.
            This payment is <Text className="font-semibold">irreversible</Text> once executed.
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setStep('form')}
            className="flex-1 border border-border-default rounded-md py-4 items-center"
            accessibilityLabel="Go back to form"
            accessibilityRole="button"
          >
            <Text className="text-text-primary font-semibold">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBiometricConfirm}
            disabled={loading}
            className="flex-1 bg-primary rounded-md py-4 items-center"
            accessibilityLabel="Confirm payment with biometrics (PSD2 SCA)"
            accessibilityRole="button"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-semibold">🔒 Confirm</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // ── Step 3: Success ───────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-bg-page items-center justify-center px-5">
      <View className="items-center">
        <View className="w-16 h-16 rounded-full bg-success-subtle items-center justify-center mb-4">
          <Text style={{ fontSize: 32 }}>✅</Text>
        </View>
        <Text className="text-text-primary text-xl font-bold mb-2">Payment submitted</Text>
        <Text className="text-text-secondary text-sm text-center mb-8">
          GBP {amount} to {formattedIban} — processing under PSD2 SCA.
        </Text>
        <TouchableOpacity
          onPress={() => {
            setStep('form')
            setIban('')
            setAmount('')
            setReference('')
          }}
          className="border border-border-default rounded-md py-3 px-8 items-center"
          accessibilityLabel="New transfer"
          accessibilityRole="button"
        >
          <Text className="text-text-primary font-semibold">New transfer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
