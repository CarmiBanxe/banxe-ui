import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import '../global.css'

/**
 * Root layout — wraps all routes
 * NativeWind: global.css imported here
 * SafeAreaProvider: required for react-native-safe-area-context
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#F5F7FA" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="kyc/index" />
      </Stack>
    </SafeAreaProvider>
  )
}
