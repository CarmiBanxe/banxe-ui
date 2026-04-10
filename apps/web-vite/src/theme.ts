/**
 * BANXE AI BANK — Tailwind Theme Extension
 */
import { colors, typography } from './design-tokens'

export const banxeTheme = {
  extend: {
    colors: {
      banxe: {
        navy: colors.navy, blue: colors.electricBlue,
        gold: colors.gold, surface: colors.surface,
        'surface-hover': colors.surfaceHover,
        success: colors.success, error: colors.error,
        border: colors.border,
      },
    },
    fontFamily: {
      sans: [typography.fontFamily.ui],
      mono: [typography.fontFamily.mono],
    },
  },
} as const
export default banxeTheme
