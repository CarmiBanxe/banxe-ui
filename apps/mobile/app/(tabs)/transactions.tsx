import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native'
import transactions from '../../../../mocks/data/transactions.json'

/**
 * Mobile Transactions — M-02
 *
 * Differences from W-02:
 * - Card layout instead of table
 * - Filter via bottom sheet (full-screen modal)
 * - Detail: full-screen slide from right
 * - Export: share sheet (native mobile)
 *
 * Per BANXE-SCREEN-INVENTORY.md M-02 spec.
 */

type TxStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'BLOCKED' | 'REVIEW'

const STATUS_CONFIG: Record<TxStatus, { label: string; color: string; bg: string }> = {
  COMPLETED: { label: 'Completed', color: '#22C55E', bg: '#0F2B1A' },
  PENDING:   { label: 'Pending',   color: '#F59E0B', bg: '#2B1F08' },
  FAILED:    { label: 'Failed',    color: '#EF4444', bg: '#2B0F0F' },
  BLOCKED:   { label: 'Blocked',   color: '#EF4444', bg: '#2B0F0F' },
  REVIEW:    { label: 'Review',    color: '#F59E0B', bg: '#2B1F08' },
}

export default function MobileTransactions() {
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'ALL'>('ALL')
  const [selectedTx, setSelectedTx] = useState<(typeof transactions)[0] | null>(null)

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      !search ||
      tx.counterparty.toLowerCase().includes(search.toLowerCase()) ||
      tx.reference.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || tx.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity
          onPress={() => setFilterOpen(true)}
          style={styles.filterBtn}
          accessibilityLabel="Open filters"
        >
          <Text style={styles.filterBtnText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchBar}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search counterparty or reference…"
          placeholderTextColor="#4A5F72"
          style={styles.searchInput}
          accessibilityLabel="Search transactions"
          returnKeyType="search"
        />
      </View>

      {/* ── Transaction list ── */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState} accessibilityLiveRegion="polite">
          <Text style={styles.emptyText}>No transactions found</Text>
          {(search || statusFilter !== 'ALL') && (
            <TouchableOpacity onPress={() => { setSearch(''); setStatusFilter('ALL') }}>
              <Text style={styles.clearLink}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: tx }) => {
            const cfg = STATUS_CONFIG[tx.status as TxStatus] ?? STATUS_CONFIG.PENDING
            return (
              <TouchableOpacity
                style={styles.txCard}
                onPress={() => setSelectedTx(tx)}
                accessibilityLabel={`${tx.counterparty}, ${tx.direction === 'IN' ? 'received' : 'sent'} ${tx.amount} ${tx.currency}, ${cfg.label}`}
                accessibilityRole="button"
              >
                <View style={styles.txCardLeft}>
                  <View style={[styles.dirIcon, { backgroundColor: tx.direction === 'IN' ? '#0F2B1A' : '#2B0F0F' }]}>
                    <Text style={{ color: tx.direction === 'IN' ? '#22C55E' : '#EF4444', fontSize: 14 }}>
                      {tx.direction === 'IN' ? '↓' : '↑'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txCounterparty} numberOfLines={1}>{tx.counterparty}</Text>
                    <Text style={styles.txRef} numberOfLines={1}>{tx.reference}</Text>
                    <Text style={styles.txDate}>{tx.date} · {tx.rail}</Text>
                  </View>
                </View>
                <View style={styles.txCardRight}>
                  <Text style={[styles.txAmount, { color: tx.direction === 'IN' ? '#22C55E' : '#E8EDF5' }]}>
                    {tx.direction === 'IN' ? '+' : '-'}{tx.amount}
                  </Text>
                  <Text style={styles.txCurrency}>{tx.currency}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      )}

      {/* ── Filter bottom sheet ── */}
      <Modal
        visible={filterOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterOpen(false)}
        accessibilityViewIsModal
      >
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Filter transactions</Text>
            <Text style={styles.sheetLabel}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
              {(['ALL', 'COMPLETED', 'PENDING', 'REVIEW', 'BLOCKED', 'FAILED'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setStatusFilter(s)}
                  style={[styles.pill, statusFilter === s && styles.pillActive]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: statusFilter === s }}
                >
                  <Text style={[styles.pillText, statusFilter === s && styles.pillTextActive]}>
                    {s === 'ALL' ? 'All' : s}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setFilterOpen(false)}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Transaction detail ── */}
      <Modal
        visible={!!selectedTx}
        animationType="slide"
        onRequestClose={() => setSelectedTx(null)}
        accessibilityViewIsModal
      >
        {selectedTx && (
          <View style={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setSelectedTx(null)} accessibilityLabel="Close transaction detail">
                <Text style={styles.backBtn}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.detailTitle}>Transaction detail</Text>
              <View style={{ width: 60 }} />
            </View>
            <ScrollView contentContainerStyle={styles.detailContent}>
              <View style={styles.detailAmountBox}>
                <Text style={[styles.detailAmount, { color: selectedTx.direction === 'IN' ? '#22C55E' : '#E8EDF5' }]}>
                  {selectedTx.direction === 'IN' ? '+' : '-'}{selectedTx.amount} {selectedTx.currency}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_CONFIG[selectedTx.status as TxStatus]?.bg ?? '#1F2D3D' }]}>
                  <Text style={[styles.statusText, { color: STATUS_CONFIG[selectedTx.status as TxStatus]?.color ?? '#8DA0B5' }]}>
                    {selectedTx.status}
                  </Text>
                </View>
              </View>
              {[
                ['Counterparty', selectedTx.counterparty],
                ['Reference', selectedTx.reference],
                ['Date', selectedTx.date],
                ['Rail', selectedTx.rail],
                ['Direction', selectedTx.direction === 'IN' ? 'Incoming' : 'Outgoing'],
              ].map(([label, value]) => (
                <View key={label} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080C14' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#E8EDF5' },
  filterBtn: { backgroundColor: '#0F1520', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#2A3D52' },
  filterBtnText: { fontSize: 13, color: '#E8EDF5' },
  searchBar: { marginHorizontal: 20, marginBottom: 12 },
  searchInput: { backgroundColor: '#0F1520', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#E8EDF5', borderWidth: 1, borderColor: '#1F2D3D' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 14, color: '#8DA0B5' },
  clearLink: { fontSize: 14, color: '#1A7FD4' },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  txCard: { backgroundColor: '#0F1520', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#1F2D3D' },
  txCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  dirIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  txCounterparty: { fontSize: 13, fontWeight: '600', color: '#E8EDF5', maxWidth: 160 },
  txRef: { fontSize: 11, color: '#8DA0B5', marginTop: 1, maxWidth: 160 },
  txDate: { fontSize: 10, color: '#4A5F72', marginTop: 2 },
  txCardRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
  txCurrency: { fontSize: 10, color: '#8DA0B5', marginBottom: 4 },
  statusBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '600' },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#0F1520', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40, borderWidth: 1, borderColor: '#1F2D3D' },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#2A3D52', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: '#E8EDF5', marginBottom: 16 },
  sheetLabel: { fontSize: 12, color: '#8DA0B5', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  pillRow: { marginBottom: 20 },
  pill: { backgroundColor: '#16202E', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, borderWidth: 1, borderColor: '#2A3D52' },
  pillActive: { backgroundColor: '#1A3A5C', borderColor: '#1A7FD4' },
  pillText: { fontSize: 13, color: '#8DA0B5' },
  pillTextActive: { color: '#1A7FD4', fontWeight: '600' },
  applyBtn: { backgroundColor: '#1A7FD4', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  applyBtnText: { fontSize: 15, fontWeight: '700', color: '#080C14' },
  detailContainer: { flex: 1, backgroundColor: '#080C14' },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#1F2D3D' },
  backBtn: { fontSize: 14, color: '#1A7FD4', width: 60 },
  detailTitle: { fontSize: 16, fontWeight: '700', color: '#E8EDF5' },
  detailContent: { padding: 20 },
  detailAmountBox: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  detailAmount: { fontSize: 36, fontWeight: '700', fontFamily: 'monospace' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1F2D3D' },
  detailLabel: { fontSize: 13, color: '#8DA0B5' },
  detailValue: { fontSize: 13, color: '#E8EDF5', fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: 16 },
})
