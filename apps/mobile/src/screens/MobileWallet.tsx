import React from 'react'
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native'

const FIAT = [
  { currency: 'EUR', balance: '€12,500.00', iban: 'DE89****5678' },
  { currency: 'GBP', balance: '£3,200.00',  iban: 'GB29****1234' },
]

const CRYPTO = [
  { currency: 'BTC', balance: '≈€8,900.00', address: '1A2B...9Z' },
  { currency: 'ETH', balance: '≈€4,200.00', address: '0x4a...9f' },
]

function WalletCard({ currency, balance, sub }: { currency: string; balance: string; sub: string }) {
  return (
    <View style={s.card}>
      <Text style={s.currency}>{currency}</Text>
      <Text style={s.balance}>{balance}</Text>
      <Text style={s.sub}>{sub}</Text>
    </View>
  )
}

export function MobileWallet(): React.ReactElement {
  return (
    <SafeAreaView style={s.root}>
      <ScrollView>
        <Text style={s.section}>Fiat Wallets</Text>
        {FIAT.map((w) => (
          <WalletCard key={w.currency} currency={w.currency} balance={w.balance} sub={w.iban} />
        ))}

        <Text style={s.section}>Crypto Wallets</Text>
        {CRYPTO.map((w) => (
          <WalletCard key={w.currency} currency={w.currency} balance={w.balance} sub={w.address} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1B2A', padding: 16 },
  section: { color: '#94A3B8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginTop: 20, marginBottom: 10 },
  card: { backgroundColor: '#1B2838', borderRadius: 12, padding: 20, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  currency: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  balance: { color: '#F8FAFC', fontSize: 28, fontFamily: 'monospace', fontWeight: '700' },
  sub: { color: '#94A3B8', fontSize: 12, marginTop: 4, fontFamily: 'monospace' },
})
