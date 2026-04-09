import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native'
import wallets from '../../../../mocks/data/wallets.json'

/**
 * Mobile Wallets — M-03
 *
 * Differences from W-03:
 * - Full-screen per wallet (tap to enter wallet detail)
 * - IBAN: tap to copy, accessible announcement
 * - Deposit / Withdraw: full-screen flow
 * - Exchange: bottom sheet widget
 *
 * Per BANXE-SCREEN-INVENTORY.md M-03 spec.
 */

export default function MobileWallets() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = wallets.find((w) => w.id === selectedId)

  const copyIban = async (iban: string) => {
    // Expo Clipboard.setStringAsync in real app; mock alert here
    Alert.alert('IBAN copied', iban)
  }

  return (
    <View style={styles.container}>
      {/* ── Wallet list ── */}
      {!selected ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Wallets</Text>
          </View>
          <ScrollView contentContainerStyle={styles.list}>
            {wallets.map((wallet) => (
              <TouchableOpacity
                key={wallet.id}
                style={styles.walletCard}
                onPress={() => setSelectedId(wallet.id)}
                accessibilityLabel={`${wallet.currency} wallet, ${wallet.available} available, ${wallet.status}`}
                accessibilityRole="button"
              >
                <View style={styles.walletCardTop}>
                  <Text style={styles.currency}>{wallet.currency}</Text>
                  <View style={[styles.statusBadge, wallet.status !== 'ACTIVE' && styles.statusBadgeWarn]}>
                    <Text style={[styles.statusText, wallet.status !== 'ACTIVE' && styles.statusTextWarn]}>
                      {wallet.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.balance}>{wallet.available}</Text>
                <Text style={styles.balanceLabel}>Available</Text>
                {wallet.pending !== '0.00' && (
                  <Text style={styles.pending}>{wallet.pending} pending</Text>
                )}
                <Text style={styles.iban} numberOfLines={1}>{wallet.iban}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.newWalletBtn} accessibilityLabel="Open new wallet">
              <Text style={styles.newWalletText}>+ Open new wallet</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      ) : (
        /* ── Wallet detail (full screen) ── */
        <View style={{ flex: 1 }}>
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={() => setSelectedId(null)} accessibilityLabel="Back to wallets">
              <Text style={styles.backBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.detailTitle}>{selected.currency} Wallet</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView contentContainerStyle={styles.detailContent}>
            {/* Balance hero */}
            <View style={styles.balanceHero}>
              <Text style={styles.heroLabel}>Available</Text>
              <Text style={styles.heroBalance}>{selected.available}</Text>
              <Text style={styles.heroCurrency}>{selected.currency}</Text>
              {selected.pending !== '0.00' && (
                <Text style={styles.heroPending}>{selected.pending} pending</Text>
              )}
            </View>

            {/* IBAN */}
            <View style={styles.ibanRow}>
              <View>
                <Text style={styles.ibanLabel}>IBAN</Text>
                <Text style={styles.ibanValue} accessibilityLabel={`IBAN: ${selected.iban}`}>
                  {selected.iban}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => copyIban(selected.iban)}
                accessibilityLabel="Copy IBAN"
                style={styles.copyBtn}
              >
                <Text style={styles.copyBtnText}>Copy</Text>
              </TouchableOpacity>
            </View>

            {/* Actions grid */}
            <View style={styles.actionsGrid}>
              {[
                { icon: '↓', label: 'Deposit' },
                { icon: '↑', label: 'Withdraw' },
                { icon: '⇄', label: 'Exchange' },
                { icon: '◎', label: 'Details' },
              ].map(({ icon, label }) => (
                <TouchableOpacity
                  key={label}
                  style={styles.actionBtn}
                  accessibilityLabel={`${label} from ${selected.currency} wallet`}
                >
                  <Text style={styles.actionIcon}>{icon}</Text>
                  <Text style={styles.actionLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Restricted banner */}
            {selected.status !== 'ACTIVE' && (
              <View style={styles.restrictedBanner} accessibilityRole="alert">
                <Text style={styles.restrictedText}>
                  ⚠ Wallet {selected.status.toLowerCase()} — contact support
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080C14' },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#E8EDF5' },
  list: { paddingHorizontal: 20, paddingBottom: 32, gap: 10 },
  walletCard: { backgroundColor: '#0F1520', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#1F2D3D', position: 'relative' },
  walletCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  currency: { fontSize: 16, fontWeight: '700', color: '#E8EDF5' },
  statusBadge: { backgroundColor: '#0F2B1A', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  statusBadgeWarn: { backgroundColor: '#2B1F08' },
  statusText: { fontSize: 10, color: '#22C55E', fontWeight: '600' },
  statusTextWarn: { color: '#F59E0B' },
  balance: { fontSize: 28, fontWeight: '700', color: '#E8EDF5', fontFamily: 'monospace' },
  balanceLabel: { fontSize: 12, color: '#8DA0B5', marginBottom: 4 },
  pending: { fontSize: 11, color: '#F59E0B', marginBottom: 4 },
  iban: { fontSize: 11, color: '#8DA0B5', fontFamily: 'monospace', marginTop: 8 },
  chevron: { position: 'absolute', right: 16, top: '50%', fontSize: 20, color: '#2A3D52' },
  newWalletBtn: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#2A3D52', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  newWalletText: { fontSize: 14, color: '#8DA0B5' },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#1F2D3D' },
  backBtn: { fontSize: 14, color: '#1A7FD4', width: 60 },
  detailTitle: { fontSize: 16, fontWeight: '700', color: '#E8EDF5' },
  detailContent: { padding: 20, paddingBottom: 40 },
  balanceHero: { alignItems: 'center', paddingVertical: 32 },
  heroLabel: { fontSize: 13, color: '#8DA0B5', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroBalance: { fontSize: 42, fontWeight: '700', color: '#E8EDF5', fontFamily: 'monospace', marginTop: 4 },
  heroCurrency: { fontSize: 18, color: '#8DA0B5' },
  heroPending: { fontSize: 13, color: '#F59E0B', marginTop: 8 },
  ibanRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0F1520', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1F2D3D', marginBottom: 16 },
  ibanLabel: { fontSize: 11, color: '#8DA0B5', marginBottom: 4 },
  ibanValue: { fontSize: 13, fontFamily: 'monospace', color: '#E8EDF5' },
  copyBtn: { backgroundColor: '#1A3A5C', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  copyBtnText: { fontSize: 13, color: '#1A7FD4', fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionBtn: { flex: 1, backgroundColor: '#0F1520', borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1F2D3D' },
  actionIcon: { fontSize: 22, color: '#E8EDF5', marginBottom: 4 },
  actionLabel: { fontSize: 12, color: '#8DA0B5' },
  restrictedBanner: { backgroundColor: '#2B1F08', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#F59E0B' },
  restrictedText: { fontSize: 13, color: '#F59E0B' },
})
