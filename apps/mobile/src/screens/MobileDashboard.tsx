import React from 'react'
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView,
} from 'react-native'

const RECENT_TXS = [
  { id: '1', name: 'Carrefour', amount: '-€45.30', date: 'Today' },
  { id: '2', name: 'Salary', amount: '+€3,200.00', date: 'Yesterday' },
  { id: '3', name: 'Spotify', amount: '-€9.99', date: 'Apr 7' },
]

const QUICK_ACTIONS = ['Send', 'Receive', 'Exchange']

export function MobileDashboard(): React.ReactElement {
  return (
    <SafeAreaView style={s.root}>
      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>Total Balance</Text>
        <Text style={s.balanceAmount}>€12,500.00</Text>
        <Text style={s.balanceSub}>+€320.00 this month</Text>
      </View>

      <View style={s.quickRow}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity key={action} style={s.quickBtn} accessibilityLabel={action}>
            <Text style={s.quickIcon}>{action === 'Send' ? '↑' : action === 'Receive' ? '↓' : '⇄'}</Text>
            <Text style={s.quickLabel}>{action}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={RECENT_TXS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={s.txRow}>
            <View>
              <Text style={s.txName}>{item.name}</Text>
              <Text style={s.txDate}>{item.date}</Text>
            </View>
            <Text style={[s.txAmount, item.amount.startsWith('+') ? s.positive : s.negative]}>
              {item.amount}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1B2A', padding: 16 },
  balanceCard: { backgroundColor: '#1B2838', borderRadius: 16, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  balanceLabel: { color: '#94A3B8', fontSize: 13, marginBottom: 4 },
  balanceAmount: { color: '#F8FAFC', fontSize: 36, fontFamily: 'monospace', fontWeight: '700' },
  balanceSub: { color: '#10B981', fontSize: 13, marginTop: 4 },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickBtn: { flex: 1, backgroundColor: '#1B2838', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  quickIcon: { color: '#2563EB', fontSize: 24, marginBottom: 4 },
  quickLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '500' },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  txName: { color: '#F8FAFC', fontSize: 14, fontWeight: '500' },
  txDate: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 14, fontFamily: 'monospace', fontWeight: '600' },
  positive: { color: '#10B981' },
  negative: { color: '#F8FAFC' },
})
