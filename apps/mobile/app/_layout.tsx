import React, { useEffect, useCallback } from 'react'
import { AppState, Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Stack, router } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store'
import { useSessionTimeout } from '@banxe/shared/hooks'
import '../global.css'

/**
 * Root layout — wraps all routes.
 * NativeWind: global.css imported here.
 * SafeAreaProvider: required for react-native-safe-area-context.
 * Session timeout: 5 min inactivity → warning modal → auto-logout.
 */

const AUTH_KEY = 'banxe_token'

// ── Session warning modal ─────────────────────────────────────────────────────

function SessionWarningModal({
  visible,
  remainingSecs,
  onStay,
}: {
  visible: boolean
  remainingSecs: number
  onStay: () => void
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      accessibilityViewIsModal
    >
      <View style={styles.modalOverlay}>
        <View
          style={styles.modalCard}
          accessible
          accessibilityRole="alert"
          accessibilityLabel={`Session expiring in ${remainingSecs} seconds. Tap Stay signed in to continue.`}
        >
          <Text style={styles.modalIcon} accessibilityElementsHidden>⏱</Text>
          <Text style={styles.modalTitle}>Session expiring soon</Text>
          <Text style={styles.modalBody}>
            For your security, you will be signed out in{' '}
            <Text style={styles.countdown}>{remainingSecs}s</Text>
            {' '}due to inactivity.
          </Text>
          <TouchableOpacity
            style={styles.stayBtn}
            onPress={onStay}
            accessibilityLabel="Stay signed in"
            accessibilityRole="button"
          >
            <Text style={styles.stayBtnText}>Stay signed in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

// ── Root layout ───────────────────────────────────────────────────────────────

export default function RootLayout() {
  const handleTimeout = useCallback(async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY).catch(() => null)
    router.replace('/auth/onboarding')
  }, [])

  const { resetTimer, showWarning, remainingSecs, extendSession } =
    useSessionTimeout({
      timeoutMs: 5 * 60 * 1000,  // 5 minutes
      warningMs: 60 * 1000,       // warn 1 minute before
      onTimeout: handleTimeout,
    })

  useEffect(() => {
    // Start timer on app launch
    resetTimer()

    // Reset timer when app returns to foreground
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') resetTimer()
    })

    return () => { sub.remove() }
  }, [resetTimer])

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#F5F7FA" />

      {/* Touch capture: any touch anywhere resets the session timer */}
      <View
        style={{ flex: 1 }}
        onStartShouldSetResponderCapture={() => {
          resetTimer()
          return false  // don't consume — pass through to children
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="kyc/index" />
        </Stack>
      </View>

      <SessionWarningModal
        visible={showWarning}
        remainingSecs={remainingSecs}
        onStay={extendSession}
      />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  modalIcon: { fontSize: 40, marginBottom: 12 },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  countdown: { color: '#D69E2E', fontWeight: '700' },
  stayBtn: {
    width: '100%',
    backgroundColor: '#1A2B6B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  stayBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
})
