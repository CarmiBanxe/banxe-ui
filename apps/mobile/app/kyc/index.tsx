import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'

/**
 * BANXE KYC Flow — M-06
 * Regulatory-approved sequence: ID Document → Selfie → Liveness check
 * UK AML Regulations 2017 | FCA CASS | GDPR Art. 9
 */

type KycStep = 'id-document' | 'selfie' | 'liveness' | 'submitted'

interface StepStatus {
  'id-document': 'pending' | 'done'
  selfie: 'pending' | 'done'
  liveness: 'pending' | 'done'
}

const STEPS: { id: KycStep; label: string; description: string; icon: string }[] = [
  {
    id: 'id-document',
    label: 'Identity document',
    description: 'Passport, driving licence, or national ID card',
    icon: '🪪',
  },
  {
    id: 'selfie',
    label: 'Selfie',
    description: 'A clear photo of your face for verification',
    icon: '🤳',
  },
  {
    id: 'liveness',
    label: 'Liveness check',
    description: 'A short video to confirm you are present',
    icon: '👁',
  },
]

function StepIndicator({
  step,
  current,
  status,
}: {
  step: KycStep
  current: KycStep
  status: StepStatus
}) {
  const isDone = step !== 'submitted' && status[step as keyof StepStatus] === 'done'
  const isCurrent = step === current
  return (
    <View className="flex-row items-center mb-3">
      <View
        className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
          isDone
            ? 'bg-success-subtle'
            : isCurrent
              ? 'bg-primary-subtle'
              : 'bg-bg-elevated'
        }`}
      >
        <Text
          style={{
            color: isDone ? '#38A169' : isCurrent ? '#1A2B6B' : '#9DAABF',
            fontSize: 14,
            fontWeight: '700',
          }}
        >
          {isDone ? '✓' : STEPS.findIndex((s) => s.id === step) + 1}
        </Text>
      </View>
      <Text
        className={`text-sm font-medium ${
          isDone
            ? 'text-success line-through'
            : isCurrent
              ? 'text-primary'
              : 'text-text-secondary'
        }`}
      >
        {STEPS.find((s) => s.id === step)?.label ?? step}
      </Text>
    </View>
  )
}

export default function KycScreen() {
  const [currentStep, setCurrentStep] = useState<KycStep>('id-document')
  const [status, setStatus] = useState<StepStatus>({
    'id-document': 'pending',
    selfie: 'pending',
    liveness: 'pending',
  })
  const [loading, setLoading] = useState(false)

  const stepData = STEPS.find((s) => s.id === currentStep)

  async function handleCapture() {
    const { status: permStatus } = await ImagePicker.requestCameraPermissionsAsync()
    if (permStatus !== 'granted') {
      Alert.alert(
        'Camera permission required',
        'Please allow camera access in settings to complete KYC.'
      )
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
    })

    if (result.canceled) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setLoading(true)

    // Simulate upload — replace with real API call
    await new Promise((r) => setTimeout(r, 1500))

    setStatus((prev) => ({
      ...prev,
      [currentStep]: 'done',
    }))
    setLoading(false)

    // Advance to next step
    const stepOrder: KycStep[] = ['id-document', 'selfie', 'liveness', 'submitted']
    const nextIndex = stepOrder.indexOf(currentStep) + 1
    setCurrentStep(stepOrder[nextIndex])
  }

  async function handleLiveness() {
    // Liveness check — in production: integrate liveness SDK (Onfido, Jumio, etc.)
    Alert.alert(
      'Liveness check',
      'In production this opens the liveness detection SDK. Simulating success.',
      [
        {
          text: 'Simulate success',
          onPress: async () => {
            setLoading(true)
            await new Promise((r) => setTimeout(r, 1500))
            setStatus((prev) => ({ ...prev, liveness: 'done' }))
            setLoading(false)
            setCurrentStep('submitted')
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  if (currentStep === 'submitted') {
    return (
      <SafeAreaView className="flex-1 bg-bg-page items-center justify-center px-5">
        <View className="items-center">
          <View className="w-16 h-16 rounded-full bg-success-subtle items-center justify-center mb-4">
            <Text style={{ fontSize: 32 }}>✅</Text>
          </View>
          <Text className="text-text-primary text-xl font-bold mb-2">KYC submitted</Text>
          <Text className="text-text-secondary text-sm text-center mb-2">
            Your documents are under review. This typically takes 1–2 business days.
          </Text>
          <Text className="text-text-secondary text-xs text-center mb-8">
            Regulated under UK AML Regulations 2017 and FCA guidance.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            className="bg-primary rounded-md py-3 px-8"
            accessibilityLabel="Return to dashboard"
            accessibilityRole="button"
          >
            <Text className="text-white font-semibold">Back to dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-page">
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4"
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text className="text-text-secondary text-sm">← Back</Text>
        </TouchableOpacity>

        <Text className="text-text-primary text-xl font-bold mb-1">Identity verification</Text>
        <Text className="text-text-secondary text-sm mb-6">
          Required by UK AML Regulations 2017 and FCA guidance.
        </Text>

        {/* Step indicators */}
        <View className="bg-bg-surface border border-border-subtle rounded-xl p-4 mb-6">
          {STEPS.map((s) => (
            <StepIndicator key={s.id} step={s.id} current={currentStep} status={status} />
          ))}
        </View>

        {/* Current step card */}
        {stepData && (
          <View className="bg-bg-surface border border-border-subtle rounded-xl p-5 mb-6">
            <Text style={{ fontSize: 40 }} accessible={false} className="mb-3">
              {stepData.icon}
            </Text>
            <Text className="text-text-primary text-lg font-bold mb-1">
              {stepData.label}
            </Text>
            <Text className="text-text-secondary text-sm mb-6">
              {stepData.description}
            </Text>

            {/* GDPR notice */}
            <View className="bg-info-subtle border border-blue-200 rounded-lg p-3 mb-4">
              <Text className="text-text-secondary text-xs leading-relaxed">
                Your document is processed securely under{' '}
                <Text className="font-semibold">GDPR Art. 9</Text> (special category data).
                It is encrypted at rest and in transit and retained only as required by law.
              </Text>
            </View>

            <TouchableOpacity
              onPress={currentStep === 'liveness' ? handleLiveness : handleCapture}
              disabled={loading}
              className="bg-primary rounded-md py-4 items-center"
              accessibilityLabel={
                currentStep === 'liveness'
                  ? 'Start liveness check'
                  : `Capture ${stepData.label}`
              }
              accessibilityRole="button"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold">
                  {currentStep === 'liveness' ? 'Start liveness check' : 'Open camera'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
