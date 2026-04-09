import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import wallets from '../../../../mocks/data/wallets.json'
import transactions from '../../../../mocks/data/transactions.json'

/**
 * Mobile Dashboard — M-01
 *
 * Differences from W-01:
 * - Bottom tab navigation (no sidebar)
 * - Horizontal swipe wallet cards
 * - Quick actions: 4-icon grid (Send | Add | Exchange | More)
 * - AI insight: compact strip
 * - Recent transactions: 5 items, "See all" link
 *
 * Per BANXE-SCREEN-INVENTORY.md M-01 spec.
 */

const QUICK_ACTIONS = [
  { label: 'Send', icon: '↑', href: '/send' },
  { label: 'Add', icon: '+', href: '/wallets' },
  { label: 'Exchange', icon: '⇄', href: '/wallets' },
  { label: 'More', icon: '•••', href: '/profile' },
] as const

const STATUS_COLOR: Record<string, string> = {
  COMPLETED: '#22C55E',
  PENDING: '#F59E0B',
  FAILED: '#EF4444',
  BLOCKED: '#EF4444',
  REVIEW: '#F59E0B',
}

export default function MobileDashboard() {
  const primaryWallet = wallets[0]
  const recentTransactions = transactions.slice(0, 5)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.name}>Moriel</Text>
        </View>
        <View style={styles.notifBadge}>
          <Text style={styles.notifIcon}>🔔</Text>
        </View>
      </View>

      {/* ── Wallet cards (horizontal scroll) ── */}
      <FlatList
        data={wallets}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.walletList}
        renderItem={({ item: wallet }) => (
          <View
            style={styles.walletCard}
            accessibilityLabel={`${wallet.currency} wallet, ${wallet.available} available`}
          >
            <View style={styles.walletCardHeader}>
              <Text style={styles.walletCurrency}>{wallet.currency}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{wallet.status}</Text>
              </View>
            </View>
            <Text style={styles.walletBalance}>{wallet.available}</Text>
            <Text style={styles.walletLabel}>Available</Text>
            {wallet.pending !== '0.00' && (
              <Text style={styles.pendingAmount}>{wallet.pending} pending</Text>
            )}
          </View>
        )}
      />

      {/* ── Quick actions ── */}
      <View
        style={styles.quickActions}
        accessibilityRole="toolbar"
        accessibilityLabel="Quick actions"
      >
        {QUICK_ACTIONS.map(({ label, icon }) => (
          <TouchableOpacity
            key={label}
            style={styles.quickAction}
            accessibilityLabel={label}
            accessibilityRole="button"
          >
            <Text style={styles.quickActionIcon}>{icon}</Text>
            <Text style={styles.quickActionLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── AI insight strip ── */}
      <View style={styles.aiStrip} accessibilityLabel="AI insight">
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>✦ AI</Text>
        </View>
        <Text style={styles.aiText} numberOfLines={2}>
          FX spending up 34% this month vs. your 3-month average.
        </Text>
        <TouchableOpacity accessibilityLabel="View AI insight details">
          <Text style={styles.aiAction}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ── Recent transactions ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent transactions</Text>
          <TouchableOpacity accessibilityLabel="See all transactions">
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {recentTransactions.map((tx) => (
          <View
            key={tx.id}
            style={styles.txRow}
            accessibilityLabel={`${tx.counterparty}, ${tx.direction === 'IN' ? 'received' : 'sent'} ${tx.amount} ${tx.currency}, ${tx.status}`}
          >
            <View style={styles.txLeft}>
              <View style={[styles.txDirection, { backgroundColor: tx.direction === 'IN' ? '#0F2B1A' : '#2B0F0F' }]}>
                <Text style={{ color: tx.direction === 'IN' ? '#22C55E' : '#EF4444', fontSize: 12 }}>
                  {tx.direction === 'IN' ? '↓' : '↑'}
                </Text>
              </View>
              <View>
                <Text style={styles.txCounterparty} numberOfLines={1}>{tx.counterparty}</Text>
                <Text style={styles.txRef} numberOfLines={1}>{tx.reference}</Text>
              </View>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, { color: tx.direction === 'IN' ? '#22C55E' : '#E8EDF5' }]}>
                {tx.direction === 'IN' ? '+' : '-'}{tx.amount} {tx.currency}
              </Text>
              <View style={styles.txStatusBadge}>
                <Text style={[styles.txStatus, { color: STATUS_COLOR[tx.status] ?? '#8DA0B5' }]}>
                  {tx.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080C14' },
  content: { paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  greeting: { fontSize: 13, color: '#8DA0B5' },
  name: { fontSize: 22, fontWeight: '700', color: '#E8EDF5' },
  notifBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0F1520', alignItems: 'center', justifyContent: 'center' },
  notifIcon: { fontSize: 18 },
  walletList: { paddingHorizontal: 20, paddingBottom: 8, gap: 12 },
  walletCard: { width: 220, backgroundColor: '#0F1520', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#1F2D3D' },
  walletCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  walletCurrency: { fontSize: 15, fontWeight: '700', color: '#E8EDF5' },
  statusBadge: { backgroundColor: '#0F2B1A', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  statusText: { fontSize: 10, color: '#22C55E', fontWeight: '600' },
  walletBalance: { fontSize: 26, fontWeight: '700', color: '#E8EDF5', fontFamily: 'monospace' },
  walletLabel: { fontSize: 12, color: '#8DA0B5', marginTop: 2 },
  pendingAmount: { fontSize: 11, color: '#F59E0B', marginTop: 6 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 16, backgroundColor: '#0F1520', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1F2D3D' },
  quickAction: { alignItems: 'center', flex: 1 },
  quickActionIcon: { fontSize: 22, marginBottom: 4, color: '#E8EDF5' },
  quickActionLabel: { fontSize: 12, color: '#8DA0B5' },
  aiStrip: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 12, backgroundColor: '#1A0F2B', borderRadius: 12, padding: 12, gap: 8, borderWidth: 1, borderColor: '#2A1A45' },
  aiBadge: { backgroundColor: '#2A1A45', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  aiBadgeText: { fontSize: 10, color: '#7C3AED', fontWeight: '700' },
  aiText: { flex: 1, fontSize: 12, color: '#8DA0B5' },
  aiAction: { fontSize: 18, color: '#7C3AED' },
  section: { marginHorizontal: 20, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#E8EDF5' },
  seeAll: { fontSize: 13, color: '#1A7FD4' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1F2D3D' },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  txDirection: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  txCounterparty: { fontSize: 13, fontWeight: '600', color: '#E8EDF5', maxWidth: 160 },
  txRef: { fontSize: 11, color: '#8DA0B5', maxWidth: 160 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 13, fontWeight: '700', fontFamily: 'monospace' },
  txStatusBadge: {},
  txStatus: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginTop: 2 },
})
