import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { createApiClient, createBanxeApi, ApiError } from '@banxe/shared/api'
import type { Account, Transaction } from '@banxe/shared/types'

/**
 * BANXE Mobile Dashboard — M-01
 * Light theme + NativeWind
 * I-05: amounts displayed as strings, never parsed as float
 *
 * Data: fetched from banxe-emi-stack (http://localhost:8000)
 * Fallback: mock JSON when backend is unreachable
 */

// ── Config ────────────────────────────────────────────────────────────────────

const BANXE_API_URL = process.env.EXPO_PUBLIC_BANXE_API_URL ?? 'http://localhost:8000'
const AUTH_KEY = 'banxe_token'

// ── Mock fallback (used when backend is unreachable) ──────────────────────────

interface MobileWallet {
  id: string
  currency: string
  available: string   // I-05 Decimal string
  pending: string     // I-05 Decimal string
  status: string
  iban?: string
}

interface MobileTransaction {
  id: string
  counterparty: string
  reference: string
  amount: string      // I-05 Decimal string
  currency: string
  direction: 'IN' | 'OUT'
  status: string
  date: string
}

const MOCK_WALLETS: MobileWallet[] = [
  { id: 'wallet-gbp', currency: 'GBP', available: '4700.00', pending: '50.00', status: 'ACTIVE', iban: 'GB29****1234' },
  { id: 'wallet-eur', currency: 'EUR', available: '2100.00', pending: '0.00', status: 'ACTIVE', iban: 'DE89****5678' },
]

const MOCK_TRANSACTIONS: MobileTransaction[] = [
  { id: 'txn-001', counterparty: 'Amazon UK', reference: 'REF-20260408-001', amount: '49.99', currency: 'GBP', direction: 'OUT', status: 'COMPLETED', date: '2026-04-08' },
  { id: 'txn-002', counterparty: 'Employer Ltd', reference: 'SALARY-APR-2026', amount: '3500.00', currency: 'GBP', direction: 'IN', status: 'COMPLETED', date: '2026-04-07' },
  { id: 'txn-003', counterparty: 'SEPA Recipient GmbH', reference: 'INV-2026-0412', amount: '1200.00', currency: 'EUR', direction: 'OUT', status: 'PENDING', date: '2026-04-06' },
  { id: 'txn-004', counterparty: 'Grocery Store', reference: 'POS-REF-001', amount: '87.45', currency: 'GBP', direction: 'OUT', status: 'COMPLETED', date: '2026-04-05' },
  { id: 'txn-005', counterparty: 'Interest Credit', reference: 'INT-APR', amount: '12.30', currency: 'GBP', direction: 'IN', status: 'COMPLETED', date: '2026-04-04' },
]

// Adapters — convert shared Account/Transaction types to mobile display types

function accountToWallet(acc: Account): MobileWallet {
  return {
    id: acc.id,
    currency: acc.currency,
    available: acc.balance,  // I-05: keep as Decimal string
    pending: '0.00',
    status: acc.status,
    iban: acc.iban,
  }
}

function txToMobileTx(tx: Transaction): MobileTransaction {
  return {
    id: tx.id,
    counterparty: tx.description,
    reference: tx.reference,
    amount: tx.credit ?? tx.debit ?? '0.00',  // I-05: Decimal string
    currency: 'GBP',  // TODO: account currency when multi-currency endpoint available
    direction: tx.direction === 'credit' ? 'IN' : 'OUT',
    status: tx.status,
    date: tx.date,
  }
}

// ── Quick actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'Send', icon: '↑', route: '/transfers' as const },
  { label: 'Request', icon: '↓', route: '/(tabs)/transactions' as const },
  { label: 'History', icon: '≡', route: '/(tabs)/transactions' as const },
  { label: 'KYC', icon: '✓', route: '/kyc' as const },
] as const

const STATUS_COLOR: Record<string, string> = {
  COMPLETED: '#38A169',
  PENDING:   '#D69E2E',
  FAILED:    '#E53E3E',
  BLOCKED:   '#E53E3E',
  REVIEW:    '#D69E2E',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function WalletCard({ wallet }: { wallet: MobileWallet }) {
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
      {/* I-05: balance displayed as Decimal string, never parseFloat */}
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

function TransactionRow({ tx }: { tx: MobileTransaction }) {
  const isIn = tx.direction === 'IN'
  return (
    <View
      className="flex-row items-center py-3 border-b border-border-subtle"
      accessibilityLabel={`${tx.counterparty}, ${isIn ? 'received' : 'sent'} ${tx.currency} ${tx.amount}, ${tx.status}`}
    >
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

      <View className="flex-1 min-w-0">
        <Text className="text-text-primary text-sm font-semibold" numberOfLines={1}>
          {tx.counterparty}
        </Text>
        <Text className="text-text-secondary text-xs" numberOfLines={1}>
          {tx.reference}
        </Text>
      </View>

      <View className="items-end">
        {/* I-05: amount displayed as Decimal string */}
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

// ── Dashboard screen ──────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const [wallets, setWallets] = useState<MobileWallet[]>(MOCK_WALLETS)
  const [transactions, setTransactions] = useState<MobileTransaction[]>(MOCK_TRANSACTIONS)
  const [isMock, setIsMock] = useState(true)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync(AUTH_KEY)

      const client = createApiClient({
        baseUrl: BANXE_API_URL,
        getToken: () => token,
        onUnauthorized: () => {
          router.replace('/auth/onboarding')
        },
      })

      const api = createBanxeApi(client)

      // Fetch accounts (wallets)
      const accounts = await api.accounts.list()
      if (accounts.length > 0) {
        setWallets(accounts.map(accountToWallet))

        // Fetch transactions for first account
        const primaryAccountId = accounts[0]?.id
        if (primaryAccountId) {
          const txList = await api.transactions.list({
            account_id: primaryAccountId,
            limit: 10,
          })
          setTransactions(txList.map(txToMobileTx))
        }

        setIsMock(false)
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace('/auth/onboarding')
        return
      }
      // Backend unreachable — keep mock data, do not throw
      setIsMock(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    void fetchData()
  }, [fetchData])

  const recentTxs = transactions.slice(0, 5)

  return (
    <SafeAreaView className="flex-1 bg-bg-page">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1A2B6B"
            accessibilityLabel="Pull to refresh dashboard"
          />
        }
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pt-4 pb-3">
          <View>
            <Text className="text-text-secondary text-sm">Good morning</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-text-primary text-xl font-bold">BANXE</Text>
              {isMock && (
                <View className="bg-yellow-100 rounded px-1.5 py-0.5">
                  <Text style={{ color: '#D69E2E', fontSize: 9, fontWeight: '700' }}>MOCK</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-bg-surface border border-border-subtle items-center justify-center"
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Loading state */}
        {loading ? (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#1A2B6B" accessibilityLabel="Loading account data" />
          </View>
        ) : (
          <>
            {/* Wallet cards */}
            <FlatList
              data={wallets}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(w) => w.id}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
              renderItem={({ item }: ListRenderItemInfo<MobileWallet>) => (
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
                {recentTxs.length === 0 ? (
                  <Text className="text-text-secondary text-sm text-center py-6">
                    No recent transactions
                  </Text>
                ) : (
                  recentTxs.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
