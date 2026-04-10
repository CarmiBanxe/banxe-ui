import React from 'react'
import { Tabs } from 'expo-router'
import { Text } from 'react-native'

/**
 * BANXE Mobile Tab Navigator — light theme
 * Brand: Primary #1A2B6B | Accent #00C6AE | Background #F5F7FA
 * Active tabs: Home, Send (transfers), History (transactions), Settings
 * Hidden tabs (legacy, accessible via router.push): wallets, assistant, profile, send
 */

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E4E8F0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#1A2B6B',
        tabBarInactiveTintColor: '#9DAABF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      {/* Active tabs */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }} accessibilityLabel="Home">⌂</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: 'Send',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }} accessibilityLabel="Send money">↑</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }} accessibilityLabel="Transaction history">≡</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }} accessibilityLabel="Settings">◎</Text>
          ),
        }}
      />

      {/* Hidden legacy screens — accessible via router.push, not shown in tab bar */}
      <Tabs.Screen name="send"      options={{ href: null }} />
      <Tabs.Screen name="wallets"   options={{ href: null }} />
      <Tabs.Screen name="profile"   options={{ href: null }} />
      <Tabs.Screen name="assistant" options={{ href: null }} />
    </Tabs>
  )
}
