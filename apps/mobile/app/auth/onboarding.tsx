import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ListRenderItemInfo,
  Switch,
  Linking,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface Slide {
  id: string
  emoji: string
  title: string
  description: string
}

const SLIDES: Slide[] = [
  {
    id: '1',
    emoji: '🏦',
    title: 'FCA-Authorised Banking',
    description:
      'Your funds are safeguarded under FCA CASS 7.15. BANXE is a fully regulated Electronic Money Institution.',
  },
  {
    id: '2',
    emoji: '🔒',
    title: 'PSD2 Strong Authentication',
    description:
      'Every payment is protected by two-factor SCA under PSD2. Biometric confirmation keeps your money safe.',
  },
  {
    id: '3',
    emoji: '✅',
    title: 'Instant Verification',
    description:
      'Complete KYC in minutes. Your identity is verified once — all transfers are instant thereafter.',
  },
]

// ── Dot indicator ──────────────────────────────────────────────────────────────

function PaginationDot({
  index,
  scrollX,
  totalSlides,
}: {
  index: number
  scrollX: Animated.SharedValue<number>
  totalSlides: number
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ]
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolation.CLAMP
    )
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    )
    return { width, opacity }
  })

  return (
    <Animated.View
      style={animatedStyle}
      className="h-2 rounded-pill bg-primary mx-1"
      accessibilityLabel={`Step ${index + 1} of ${totalSlides}`}
    />
  )
}

// ── Onboarding slide ───────────────────────────────────────────────────────────

function OnboardingSlide({ item }: { item: Slide }) {
  return (
    <View
      style={{ width: SCREEN_WIDTH }}
      className="flex-1 items-center justify-center px-8"
      accessibilityLabel={`Slide: ${item.title}`}
    >
      <Text style={{ fontSize: 80 }} accessible={false}>
        {item.emoji}
      </Text>
      <Text className="text-2xl font-bold text-text-primary text-center mt-6 mb-3">
        {item.title}
      </Text>
      <Text className="text-base text-text-secondary text-center leading-relaxed">
        {item.description}
      </Text>
    </View>
  )
}

// ── GDPR Consent screen (step 4) ───────────────────────────────────────────────

function GdprConsentSlide({
  gdprConsented,
  onToggle,
}: {
  gdprConsented: boolean
  onToggle: (v: boolean) => void
}) {
  return (
    <View
      style={{ width: SCREEN_WIDTH }}
      className="flex-1 justify-center px-8"
      accessibilityLabel="Privacy and data consent"
    >
      <Text
        style={{ fontSize: 48, textAlign: 'center' }}
        accessible={false}
      >
        🔐
      </Text>

      <Text className="text-2xl font-bold text-text-primary text-center mt-6 mb-2">
        Your data, your rights
      </Text>
      <Text className="text-sm text-text-secondary text-center leading-relaxed mb-6">
        BANXE processes your personal data to provide banking services under{' '}
        <Text className="font-semibold">GDPR Art. 6(1)(b)</Text> (contract performance)
        and FCA regulatory requirements.
      </Text>

      {/* Consent toggle */}
      <View
        className="bg-bg-surface border border-border-subtle rounded-xl p-4 mb-3"
        accessible
        accessibilityLabel={`Privacy Policy consent, ${gdprConsented ? 'accepted' : 'not accepted'}`}
      >
        <View className="flex-row items-start gap-3">
          <Switch
            value={gdprConsented}
            onValueChange={onToggle}
            trackColor={{ false: '#CBD5E0', true: '#00C6AE' }}
            thumbColor="#FFFFFF"
            accessibilityLabel="I agree to the Privacy Policy and Terms of Service"
            accessibilityRole="switch"
          />
          <View className="flex-1">
            <Text className="text-text-primary text-sm font-semibold mb-0.5">
              Privacy Policy &amp; Terms of Service
            </Text>
            <Text className="text-text-secondary text-xs leading-relaxed">
              I agree that BANXE may process my personal data for account
              management, transaction processing, and regulatory compliance.
            </Text>
            <TouchableOpacity
              onPress={() => void Linking.openURL('https://banxe.com/legal/privacy')}
              accessibilityLabel="Read full Privacy Policy"
              accessibilityRole="link"
              className="mt-1"
            >
              <Text className="text-primary text-xs font-semibold">
                Read full Privacy Policy →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Regulatory notice */}
      <View className="bg-[#EBF8FF] border border-[#BEE3F8] rounded-xl p-3">
        <Text className="text-[#2C5282] text-xs leading-relaxed">
          <Text className="font-semibold">FCA authorised EMI.</Text>{' '}
          Your funds are safeguarded under FCA CASS 7.15. FSCS does not apply to
          e-money. You may withdraw consent at any time — this will not affect
          services already provided.
        </Text>
      </View>

      {!gdprConsented && (
        <Text
          className="text-error text-xs text-center mt-3"
          accessibilityRole="alert"
        >
          You must accept the Privacy Policy to continue
        </Text>
      )}
    </View>
  )
}

// ── Onboarding screen ─────────────────────────────────────────────────────────

const ALL_STEP_IDS = [...SLIDES.map((s) => s.id), 'gdpr']
const TOTAL_STEPS = ALL_STEP_IDS.length  // 4: slides 1–3 + GDPR consent

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList<string>>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gdprConsented, setGdprConsented] = useState(false)
  const scrollX = useSharedValue(0)

  const buttonScale = useSharedValue(1)
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const isGdprStep = currentIndex === TOTAL_STEPS - 1

  function handleNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    if (isGdprStep) {
      if (!gdprConsented) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        return
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.replace('/(tabs)')
      return
    }

    const nextIndex = currentIndex + 1
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
    setCurrentIndex(nextIndex)
    scrollX.value = nextIndex * SCREEN_WIDTH
  }

  function handlePressIn() { buttonScale.value = withSpring(0.96) }
  function handlePressOut() { buttonScale.value = withSpring(1) }

  const ctaDisabled = isGdprStep && !gdprConsented
  const ctaLabel = isGdprStep ? 'Get started' : 'Next'

  return (
    <SafeAreaView className="flex-1 bg-bg-page">
      <FlatList
        ref={flatListRef}
        data={ALL_STEP_IDS}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({ item, index }: ListRenderItemInfo<string>) => {
          if (item === 'gdpr') {
            return (
              <GdprConsentSlide
                gdprConsented={gdprConsented}
                onToggle={(v) => {
                  setGdprConsented(v)
                  if (v) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }}
              />
            )
          }
          const slide = SLIDES[index]
          return slide ? <OnboardingSlide item={slide} /> : null
        }}
        onScroll={(e) => {
          scrollX.value = e.nativeEvent.contentOffset.x
        }}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      />

      {/* Pagination dots */}
      <View className="flex-row justify-center items-center mb-8">
        {ALL_STEP_IDS.map((_, i) => (
          <PaginationDot
            key={i}
            index={i}
            scrollX={scrollX}
            totalSlides={TOTAL_STEPS}
          />
        ))}
      </View>

      {/* CTA */}
      <View className="px-6 pb-8">
        <Animated.View style={buttonStyle}>
          <TouchableOpacity
            onPress={handleNext}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="rounded-md py-4 items-center"
            style={{ backgroundColor: ctaDisabled ? '#9AA5B4' : '#1A2B6B' }}
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}
            accessibilityState={{ disabled: ctaDisabled }}
          >
            <Text className="text-white font-semibold text-base">{ctaLabel}</Text>
          </TouchableOpacity>
        </Animated.View>

        {currentIndex === 0 && (
          <TouchableOpacity
            onPress={() => {
              // Skip → jump to GDPR consent (cannot bypass it)
              const gdprIdx = TOTAL_STEPS - 1
              flatListRef.current?.scrollToIndex({ index: gdprIdx, animated: true })
              setCurrentIndex(gdprIdx)
              scrollX.value = gdprIdx * SCREEN_WIDTH
            }}
            className="mt-3 items-center py-2"
            accessibilityRole="button"
            accessibilityLabel="Skip to consent screen"
          >
            <Text className="text-text-secondary text-sm">Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}
