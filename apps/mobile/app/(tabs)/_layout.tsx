import React from 'react'
import { Tabs } from 'expo-router'
import { Text } from 'react-native'

/**
 * BANXE Mobile Tab Navigator
 * M-01..M-06 — bottom tab navigation per BANXE-SCREEN-INVENTORY.md
 */

function TabIcon({ symbol, label }: { symbol: string; label: string }) {
  return (
    <Text style={{ fontSize: 20 }} accessibilityLabel={label}>
      {symbol}
    </Text>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F1520',
          borderTopColor: '#1F2D3D',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#1A7FD4',
        tabBarInactiveTintColor: '#8DA0B5',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>⌂</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>≡</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="wallets"
        options={{
          title: 'Wallets',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>◈</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          title: 'Send',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>↑</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'AI',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>✦</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>◎</Text>
          ),
        }}
      />
    </Tabs>
  )
}
