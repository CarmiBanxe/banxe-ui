import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native'

/**
 * Mobile Profile — M-06
 *
 * Differences from W-06:
 * - Grouped settings list (iOS/Material style)
 * - KYC status card at top
 * - Biometric toggle prominent
 * - Notification settings: per channel (push, email, SMS)
 *
 * Per BANXE-SCREEN-INVENTORY.md M-06 spec.
 */

interface ToggleRowProps {
  label: string
  description?: string
  value: boolean
  onChange: (v: boolean) => void
  accessibilityLabel?: string
}

function ToggleRow({ label, description, value, onChange, accessibilityLabel }: ToggleRowProps) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description && <Text style={styles.rowDesc}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#2A3D52', true: '#1A7FD4' }}
        thumbColor={value ? '#E8EDF5' : '#8DA0B5'}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      />
    </View>
  )
}

function NavRow({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.navRow} onPress={onPress} accessibilityRole="button">
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.navRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>
}

function Section({ children }: { children: React.ReactNode }) {
  return <View style={styles.section}>{children}</View>
}

export default function MobileProfile() {
  const [twoFa, setTwoFa] = useState(true)
  const [biometric, setBiometric] = useState(false)
  const [pushNotif, setPushNotif] = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Profile hero ── */}
      <View style={styles.profileHero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>MC</Text>
        </View>
        <Text style={styles.name}>Moriel Carmi</Text>
        <Text style={styles.email}>m.carmi@banxe.com</Text>
      </View>

      {/* ── KYC status card ── */}
      <View style={styles.kycCard} accessibilityLabel="KYC status: Approved">
        <View style={styles.kycLeft}>
          <Text style={styles.kycTitle}>Identity verified</Text>
          <Text style={styles.kycSubtitle}>FCA KYC · Individual account</Text>
        </View>
        <View style={styles.kycBadge}>
          <Text style={styles.kycBadgeText}>✓ APPROVED</Text>
        </View>
      </View>

      {/* ── Security ── */}
      <SectionHeader title="Security" />
      <Section>
        <ToggleRow
          label="Two-factor authentication"
          description="Required for payments over £30"
          value={twoFa}
          onChange={setTwoFa}
          accessibilityLabel="Toggle two-factor authentication"
        />
        <View style={styles.separator} />
        <ToggleRow
          label="Biometric login"
          description="Face ID / Fingerprint"
          value={biometric}
          onChange={(v) => {
            if (v) Alert.alert('Biometric login', 'Biometric authentication is not configured on this device yet.')
            setBiometric(v)
          }}
          accessibilityLabel="Toggle biometric login"
        />
        <View style={styles.separator} />
        <NavRow label="Active sessions" onPress={() => Alert.alert('Sessions', '1 active session: Legion WSL2')} />
        <View style={styles.separator} />
        <NavRow label="Change PIN" />
      </Section>

      {/* ── Notifications ── */}
      <SectionHeader title="Notifications" />
      <Section>
        <ToggleRow
          label="Push notifications"
          description="Real-time transaction alerts"
          value={pushNotif}
          onChange={setPushNotif}
        />
        <View style={styles.separator} />
        <ToggleRow
          label="Email notifications"
          description="Transaction confirmations, statements"
          value={emailNotif}
          onChange={setEmailNotif}
        />
        <View style={styles.separator} />
        <ToggleRow
          label="SMS alerts"
          description="Security alerts, payment received"
          value={smsNotif}
          onChange={setSmsNotif}
        />
      </Section>

      {/* ── Account ── */}
      <SectionHeader title="Account" />
      <Section>
        <NavRow label="Personal details" value="Moriel Carmi" />
        <View style={styles.separator} />
        <NavRow label="Account type" value="Individual" />
        <View style={styles.separator} />
        <NavRow label="Download statements" />
        <View style={styles.separator} />
        <NavRow
          label="API access"
          value="Not enabled"
          onPress={() => Alert.alert('API Access', 'Available for business accounts. Contact support to upgrade.')}
        />
      </Section>

      {/* ── Support ── */}
      <SectionHeader title="Support" />
      <Section>
        <NavRow label="Contact support" onPress={() => Alert.alert('Support', 'support@banxe.com')} />
        <View style={styles.separator} />
        <NavRow label="FCA regulatory info" />
        <View style={styles.separator} />
        <NavRow label="Privacy policy" />
        <View style={styles.separator} />
        <NavRow label="Terms of service" />
      </Section>

      {/* ── Sign out ── */}
      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={() => Alert.alert('Sign out', 'Are you sure you want to sign out?')}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>BANXE v1.0 · FCA authorised EMI</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080C14' },
  content: { paddingBottom: 40 },
  profileHero: { alignItems: 'center', paddingTop: 56, paddingBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1A3A5C', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#1A7FD4' },
  name: { fontSize: 20, fontWeight: '700', color: '#E8EDF5' },
  email: { fontSize: 13, color: '#8DA0B5', marginTop: 2 },
  kycCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 24, backgroundColor: '#0F2B1A', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#22C55E' },
  kycLeft: {},
  kycTitle: { fontSize: 14, fontWeight: '700', color: '#22C55E' },
  kycSubtitle: { fontSize: 11, color: '#8DA0B5', marginTop: 2 },
  kycBadge: { backgroundColor: '#0F2B1A', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#22C55E' },
  kycBadgeText: { fontSize: 10, color: '#22C55E', fontWeight: '700' },
  sectionHeader: { fontSize: 11, fontWeight: '600', color: '#8DA0B5', textTransform: 'uppercase', letterSpacing: 0.5, marginHorizontal: 20, marginTop: 24, marginBottom: 8 },
  section: { backgroundColor: '#0F1520', marginHorizontal: 20, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#1F2D3D' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowLabel: { fontSize: 14, color: '#E8EDF5' },
  rowDesc: { fontSize: 11, color: '#8DA0B5', marginTop: 1 },
  rowValue: { fontSize: 13, color: '#8DA0B5' },
  chevron: { fontSize: 18, color: '#4A5F72' },
  separator: { height: 1, backgroundColor: '#1F2D3D', marginLeft: 16 },
  signOutBtn: { marginHorizontal: 20, marginTop: 28, paddingVertical: 14, backgroundColor: '#0F1520', borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2A3D52' },
  signOutText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
  version: { textAlign: 'center', fontSize: 11, color: '#4A5F72', marginTop: 20 },
})
