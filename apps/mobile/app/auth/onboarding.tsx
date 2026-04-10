import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ListRenderItemInfo,
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
}: {
  index: number
  scrollX: Animated.SharedValue<number>
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
    />
  )
}

// ── Slide ──────────────────────────────────────────────────────────────────────

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

// ── Onboarding screen ─────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList<Slide>>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useSharedValue(0)

  const buttonScale = useSharedValue(1)
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  function handleNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
      setCurrentIndex(nextIndex)
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.replace('/auth/login')
    }
  }

  function handlePressIn() {
    buttonScale.value = withSpring(0.96)
  }

  function handlePressOut() {
    buttonScale.value = withSpring(1)
  }

  const isLast = currentIndex === SLIDES.length - 1

  return (
    <SafeAreaView className="flex-1 bg-bg-page">
      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({ item }: ListRenderItemInfo<Slide>) => (
          <OnboardingSlide item={item} />
        )}
        onScroll={(e) => {
          scrollX.value = e.nativeEvent.contentOffset.x
        }}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      />

      {/* Pagination dots */}
      <View className="flex-row justify-center items-center mb-8">
        {SLIDES.map((_, i) => (
          <PaginationDot key={i} index={i} scrollX={scrollX} />
        ))}
      </View>

      {/* CTA button */}
      <View className="px-6 pb-8">
        <Animated.View style={buttonStyle}>
          <TouchableOpacity
            onPress={handleNext}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="bg-primary rounded-md py-4 items-center"
            accessibilityRole="button"
            accessibilityLabel={isLast ? 'Get started' : 'Next slide'}
          >
            <Text className="text-white font-semibold text-base">
              {isLast ? 'Get started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {currentIndex === 0 && (
          <TouchableOpacity
            onPress={() => router.replace('/auth/login')}
            className="mt-3 items-center py-2"
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >
            <Text className="text-text-secondary text-sm">Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}
