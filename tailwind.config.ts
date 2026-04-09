import type { Config } from 'tailwindcss'

/**
 * tailwind.config.ts — BANXE AI BANK Design Token → Tailwind mapping
 * Source of truth: packages/design-tokens/tokens/
 * IL-061 / IL-062 | Developer Plane | banxe-ui
 */

const config: Config = {
  content: [
    './apps/web/src/**/*.{ts,tsx}',
    './packages/ui/src/**/*.{ts,tsx}',
    './storybook/stories/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background layers
        'bg-base':     '#080C14',
        'bg-surface':  '#0F1520',
        'bg-elevated': '#16202E',
        'bg-overlay':  '#1E2A3A',
        // Borders
        'border-subtle':  '#1F2D3D',
        'border-default': '#2A3D52',
        'border-strong':  '#3D5570',
        // Text
        'primary':   '#E8EDF5',
        'secondary': '#8DA0B5',
        'disabled':  '#4A5F72',
        'inverse':   '#080C14',
        // Brand
        'brand-primary': '#1A7FD4',
        'brand-light':   '#3A9FE8',
        'brand-subtle':  '#1A3A5C',
        // Status
        'success':        '#22C55E',
        'success-subtle': '#0F2B1A',
        'warning':        '#F59E0B',
        'warning-subtle': '#2B1F08',
        'error':          '#EF4444',
        'error-subtle':   '#2B0F0F',
        'info':           '#60A5FA',
        'info-subtle':    '#0F1F3A',
        'pending':        '#6B7280',
        // AI
        'ai-accent': '#7C3AED',
        'ai-subtle': '#1A0F2B',
        // Compliance
        'compliance': '#F59E0B',
        // Semantic aliases
        'surface': '#0F1520',
        'elevated': '#16202E',
        'overlay': '#1E2A3A',
      },
      borderColor: {
        DEFAULT: '#2A3D52',
        subtle: '#1F2D3D',
        default: '#2A3D52',
        strong: '#3D5570',
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs:   ['11px', { lineHeight: '1.4' }],
        sm:   ['13px', { lineHeight: '1.4' }],
        base: ['15px', { lineHeight: '1.6' }],
        md:   ['16px', { lineHeight: '1.5' }],
        lg:   ['18px', { lineHeight: '1.4' }],
        xl:   ['22px', { lineHeight: '1.3' }],
        '2xl':['28px', { lineHeight: '1.2' }],
        '3xl':['36px', { lineHeight: '1.1' }],
      },
      spacing: {
        '1':  '4px',
        '2':  '8px',
        '3':  '12px',
        '4':  '16px',
        '5':  '20px',
        '6':  '24px',
        '8':  '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        sm:   '4px',
        DEFAULT: '8px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'20px',
        full: '9999px',
      },
      boxShadow: {
        card:    '0 2px 8px rgba(0, 0, 0, 0.4)',
        modal:   '0 8px 32px rgba(0, 0, 0, 0.6)',
        tooltip: '0 2px 4px rgba(0, 0, 0, 0.5)',
      },
      transitionDuration: {
        fast:   '100ms',
        normal: '200ms',
        slow:   '300ms',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
      animation: {
        shimmer:   'shimmer 2s linear infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'slide-in':'slide-in 250ms ease-out',
      },
    },
  },
  plugins: [],
}

export default config
