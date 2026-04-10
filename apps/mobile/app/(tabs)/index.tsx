import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import walletsData from '../../../../mocks/data/wallets.json'
import transactionsData from '../../../../mocks/data/transactions.json'

/**
 * BANXE Mobile Dashboard — M-01
 * Light theme + NativeWind
 * I-05: amounts displayed as strings, never parsed as float
 */

interface Wallet {
  id: string
  currency: string
  available: string  // Decimal string — I-05
  pending: string    // Decimal string — I-05
  status: string
}

interface Transaction {
  id: string
  counterparty: string
  reference: string
  amount: string     // Decimal string — I-05
  currency: string
  direction: 'IN' | 'OUT'
  status: string
  date: string
}

const wallets = walletsData as Wallet[]
const transactions = transactionsData as Transaction[]

const QUICK_ACTIONS = [
  { label: 'Send', icon: '↑', route: '/transfers' as const },
  { label: 'Request', icon: '↓', route: '/(tabs)/transactions' as const },
  { label: 'History', icon: '≡', route: '/(tabs)/transactions' as const },
  { label: 'KYC', icon: '✓', route: '/kyc/index' as const },
] as const

const STATUS_COLOR: Record<string, string> = {
  COMPLETED: '#38A169',
  PENDING: '#D69E2E',
  FAILED: '#E53E3E',
  BLOCKED: '#E53E3E',
  REVIEW: '#D69E2E',
}

// ── Wallet card ────────────────────────────────────────────────────────────────

function WalletCard({ wallet }: { wallet: Wallet }) {
  return (
    <View
      className="w-56 bg-primary rounded-xl p-4 mr-3"
      accessibilityLabel={`${wallet.currency} wallet, ${wallet.available} available`}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white font-bold text-base">{wallet.currency}</Text>
        <View className="bg-white/20 rounded px-2 py-0.5">
          <Text className="text-white text-xs font-semibold">{wallet.status}</Text>
        </View>
      </View>
      <Text className="text-white text-2xl font-bold font-mono">
        {wallet.available}
      </Text>
      <Text className="text-white/70 text-xs mt-0.5">Available</Text>
      {wallet.pending !== '0.00' && (
        <Text className="text-yellow-200 text-xs mt-2">
          {wallet.pending} pending
        </Text>
      )}
    </View>
  )
}

// ── Transaction row ────────────────────────────────────────────────────────────

function TransactionRow({ tx }: { tx: Transaction }) {
  const isIn = tx.direction === 'IN'
  return (
    <View
      className="flex-row items-center py-3 border-b border-border-subtle"
      accessibilityLabel={`${tx.counterparty}, ${isIn ? 'received' : 'sent'} ${tx.currency} ${tx.amount}, ${tx.status}`}
    >
      {/* Direction badge */}
      <View
        className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
          isIn ? 'bg-success-subtle' : 'bg-error-subtle'
        }`}
        accessible={false}
      >
        <Text style={{ color: isIn ? '#38A169' : '#E53E3E', fontSize: 14 }}>
          {isIn ? '↓' : '↑'}
        </Text>
      </View>

      {/* Counterparty + reference */}
      <View className="flex-1 min-w-0">
        <Text
          className="text-text-primary text-sm font-semibold"
          numberOfLines={1}
        >
          {tx.counterparty}
        </Text>
        <Text className="text-text-secondary text-xs" numberOfLines={1}>
          {tx.reference}
        </Text>
      </View>

      {/* Amount + status */}
      <View className="items-end">
        <Text
          className="text-sm font-bold font-mono"
          style={{ color: isIn ? '#38A169' : '#1A1A2E' }}
        >
          {isIn ? '+' : '−'}{tx.currency} {tx.amount}
        </Text>
        <Text
          className="text-xs font-semibold mt-0.5"
          style={{ color: STATUS_COLOR[tx.status] ?? '#718096' }}
        >
          {tx.status}
        </Text>
      </View>
    </View>
  )
}

// ── Dashboard screen ───────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const recentTxs = transactions.slice(0, 5) as Transaction[]

  return (
    <SafeAreaView className="flex-1 bg-bg-page">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pt-4 pb-3">
          <View>
            <Text className="text-text-secondary text-sm">Good morning</Text>
            <Text className="text-text-primary text-xl font-bold">BANXE</Text>
          </View>
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-bg-surface border border-border-subtle items-center justify-center"
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet cards */}
        <FlatList
          data={wallets}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(w) => w.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
          renderItem={({ item }: ListRenderItemInfo<Wallet>) => (
            <WalletCard wallet={item} />
          )}
        />

        {/* Quick actions */}
        <View
          className="mx-5 mt-4 bg-bg-surface border border-border-subtle rounded-xl p-4"
          accessibilityRole="toolbar"
          accessibilityLabel="Quick actions"
        >
          <View className="flex-row justify-between">
            {QUICK_ACTIONS.map(({ label, icon, route }) => (
              <TouchableOpacity
                key={label}
                className="items-center flex-1"
                onPress={() => router.push(route)}
                accessibilityLabel={label}
                accessibilityRole="button"
              >
                <View className="w-11 h-11 rounded-full bg-primary-subtle items-center justify-center mb-1.5">
                  <Text style={{ fontSize: 20, color: '#1A2B6B' }}>{icon}</Text>
                </View>
                <Text className="text-text-secondary text-xs font-medium">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Insight strip */}
        <View className="mx-5 mt-3 bg-[#F5F0FF] border border-[#E9D8FD] rounded-xl p-3 flex-row items-center gap-2">
          <View className="bg-[#EDE0FF] rounded px-1.5 py-0.5">
            <Text style={{ color: '#7C3AED', fontSize: 10, fontWeight: '700' }}>✦ AI</Text>
          </View>
          <Text className="flex-1 text-xs text-text-secondary" numberOfLines={2}>
            FX spending up 34% this month vs. your 3-month average.
          </Text>
          <Text style={{ color: '#7C3AED', fontSize: 18 }}>›</Text>
        </View>

        {/* Recent transactions */}
        <View className="mx-5 mt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-text-primary text-base font-bold">Recent transactions</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/transactions')}
              accessibilityLabel="See all transactions"
            >
              <Text className="text-primary text-sm">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-bg-surface border border-border-subtle rounded-xl px-4">
            {recentTxs.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
