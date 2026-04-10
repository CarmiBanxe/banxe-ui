# apps/mobile — BANXE Mobile App

## Stack
- Expo SDK 53 (managed workflow)
- Expo Router (file-based navigation)
- NativeWind v4 (Tailwind for React Native)
- gluestack-ui (component library)
- Reanimated 3 (animations)
- Zustand (state management)

## Styling rules
```tsx
// Use NativeWind className — NEVER StyleSheet.create()
<View className="flex-1 bg-bg-page px-4">
  <Text className="text-text-primary font-semibold">Hello</Text>
</View>

// Colors from tailwind.config.js (mirrored from @banxe/design-tokens)
// primary, accent, bg-page, bg-surface, text-primary, error, success...
```

## Animation rules
- Use Reanimated 3 — NEVER the legacy `Animated` API
- Gesture handling via `react-native-gesture-handler`
- Haptic feedback: `expo-haptics` (light for taps, medium for confirmations)

## Layout
- Always wrap screens in `<SafeAreaView>` from `react-native-safe-area-context`
- Icons: SF Symbols on iOS, Material Design 3 on Android

## Navigation (Expo Router)
```
app/
  _layout.tsx                — root layout, GluestackUIProvider
  auth/onboarding.tsx        — 3-slide intro, Reanimated 3
  (tabs)/_layout.tsx         — tab bar (dashboard, transfers, settings)
  (tabs)/dashboard.tsx       — balance, transactions, quick actions
  (tabs)/transfers.tsx       — IBAN input + PSD2 SCA
  (tabs)/settings.tsx        — biometric, security, GDPR
  kyc/index.tsx              — KYC: document → selfie → liveness
```

## Banking constraints (non-negotiable)
- **I-05:** All amounts as Decimal strings. Never `parseFloat()`.
- **PSD2 SCA:** 2-step confirmation for every payment (review → biometric confirm)
- **Biometric:** `expo-local-authentication` — required for all payments
- **Secure storage:** `expo-secure-store` only — never AsyncStorage for sensitive data
- **KYC flow** must match regulatory-approved sequence
- **Accessibility:** All touchable elements need `accessibilityLabel`

## Do NOT
- Use `StyleSheet.create()` — use NativeWind
- Use the legacy `Animated` API — use Reanimated 3
- Use `AsyncStorage` for tokens or sensitive data
- Store card numbers or secrets in state or logs
