import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as LocalAuthentication from 'expo-local-authentication'

/**
 * BANXE Settings — M-05
 * Biometric toggle (expo-local-authentication)
 * GDPR consent management
 */

function SettingRow({
  label,
  description,
  icon,
  children,
}: {
  label: string
  description?: string
  icon: string
  children?: React.ReactNode
}) {
  return (
    <View className="flex-row items-center py-4 border-b border-border-subtle last:border-0">
      <View className="w-9 h-9 rounded-md bg-primary-subtle items-center justify-center mr-3 flex-shrink-0">
        <Text style={{ fontSize: 18 }} accessible={false}>{icon}</Text>
      </View>
      <View className="flex-1 min-w-0 mr-3">
        <Text className="text-text-primary text-sm font-medium">{label}</Text>
        {description && (
          <Text className="text-text-secondary text-xs mt-0.5" numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
      {children}
    </View>
  )
}

export default function SettingsScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [paymentAlerts, setPaymentAlerts] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)

  async function handleBiometricToggle(value: boolean) {
    if (value) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Biometrics unavailable',
          'Please set up Face ID or fingerprint in device settings first.'
        )
        return
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication for BANXE (PSD2 SCA)',
      })
      if (!result.success) return
    }
    setBiometricEnabled(value)
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-page">
      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="text-text-primary text-xl font-bold mb-6">Settings</Text>

        {/* Security */}
        <Text className="text-text-secondary text-xs font-semibold uppercase mb-2 tracking-wider">
          Security
        </Text>
        <View className="bg-bg-surface border border-border-subtle rounded-xl px-4 mb-4">
          <SettingRow
            icon="🔒"
            label="Biometric authentication"
            description="Face ID / fingerprint for PSD2 SCA payments"
          >
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: '#CBD3E0', true: '#1A2B6B' }}
              thumbColor="#FFFFFF"
              accessibilityLabel="Biometric authentication toggle"
              accessibilityRole="switch"
            />
          </SettingRow>

          <SettingRow
            icon="⏱"
            label="Session timeout"
            description="Auto-logout after 5 minutes of inactivity"
          >
            <Text className="text-text-secondary text-sm">5 min</Text>
          </SettingRow>

          <SettingRow
            icon="🔑"
            label="Change PIN"
            description="Update your 6-digit authentication PIN"
          >
            <TouchableOpacity
              className="border border-border-default rounded-md px-3 py-1.5"
              accessibilityLabel="Change PIN"
              accessibilityRole="button"
            >
              <Text className="text-text-primary text-sm font-medium">Change</Text>
            </TouchableOpacity>
          </SettingRow>
        </View>

        {/* Notifications */}
        <Text className="text-text-secondary text-xs font-semibold uppercase mb-2 tracking-wider">
          Notifications
        </Text>
        <View className="bg-bg-surface border border-border-subtle rounded-xl px-4 mb-4">
          <SettingRow
            icon="🔔"
            label="Payment alerts"
            description="Notify me of all incoming and outgoing payments"
          >
            <Switch
              value={paymentAlerts}
              onValueChange={setPaymentAlerts}
              trackColor={{ false: '#CBD3E0', true: '#1A2B6B' }}
              thumbColor="#FFFFFF"
              accessibilityLabel="Payment alerts toggle"
              accessibilityRole="switch"
            />
          </SettingRow>

          <SettingRow
            icon="⚠️"
            label="Security alerts"
            description="New login from unknown device, suspicious activity"
          >
            <Switch
              value={securityAlerts}
              onValueChange={setSecurityAlerts}
              trackColor={{ false: '#CBD3E0', true: '#1A2B6B' }}
              thumbColor="#FFFFFF"
              accessibilityLabel="Security alerts toggle"
              accessibilityRole="switch"
            />
          </SettingRow>
        </View>

        {/* GDPR */}
        <Text className="text-text-secondary text-xs font-semibold uppercase mb-2 tracking-wider">
          Data &amp; Privacy (GDPR)
        </Text>
        <View className="bg-bg-surface border border-border-subtle rounded-xl px-4 mb-4">
          <SettingRow
            icon="🌍"
            label="Data processing consent"
            description="Manage your GDPR consent preferences"
          >
            <TouchableOpacity
              className="border border-border-default rounded-md px-3 py-1.5"
              accessibilityLabel="Manage GDPR consent"
              accessibilityRole="button"
            >
              <Text className="text-text-primary text-sm font-medium">Manage</Text>
            </TouchableOpacity>
          </SettingRow>

          <SettingRow
            icon="📄"
            label="Download my data"
            description="Request a copy of all data we hold (GDPR Art. 20)"
          >
            <TouchableOpacity
              className="border border-border-default rounded-md px-3 py-1.5"
              accessibilityLabel="Request data export"
              accessibilityRole="button"
            >
              <Text className="text-text-primary text-sm font-medium">Request</Text>
            </TouchableOpacity>
          </SettingRow>

          <SettingRow
            icon="📊"
            label="Account statement"
            description="Download PDF statement (FCA PS7/24)"
          >
            <TouchableOpacity
              className="border border-border-default rounded-md px-3 py-1.5"
              accessibilityLabel="Download statement"
              accessibilityRole="button"
            >
              <Text className="text-text-primary text-sm font-medium">Download</Text>
            </TouchableOpacity>
          </SettingRow>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          className="border border-error rounded-md py-4 items-center"
          accessibilityLabel="Sign out"
          accessibilityRole="button"
          onPress={() =>
            Alert.alert('Sign out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign out', style: 'destructive' },
            ])
          }
        >
          <Text className="text-error font-semibold">Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
