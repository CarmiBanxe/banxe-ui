/**
 * BANXE AI BANK — Design Tokens
 * Typed constants per DESIGN-SYSTEM.md
 */
export const colors = {
  navy: '#0D1B2A',
  electricBlue: '#2563EB',
  gold: '#F59E0B',
  surface: '#1B2838',
  surfaceHover: '#243447',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  success: '#10B981',
  error: '#EF4444',
  border: '#334155',
} as const

export const typography = {
  fontFamily: {
    ui: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '0.75rem', sm: '0.875rem', base: '1rem',
    lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem',
    '3xl': '1.875rem', '4xl': '2rem',
  },
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
} as const

export const spacing = {
  0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem',
  4: '1rem', 5: '1.25rem', 6: '1.5rem', 8: '2rem',
  10: '2.5rem', 12: '3rem', 16: '4rem',
} as const

export const borderRadius = {
  sm: '0.25rem', md: '0.5rem', lg: '0.75rem',
  xl: '1rem', full: '9999px',
} as const

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency', currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount)
}

export type ColorToken = keyof typeof colors
export type SpacingToken = keyof typeof spacing
