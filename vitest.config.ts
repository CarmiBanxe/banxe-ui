import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// Root vitest config — runs ALL tests: packages/ui + tests/unit + tests/a11y
// IL-064 | Developer Plane | BANXE AI BANK
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@banxe/ui': path.resolve(__dirname, 'packages/ui/src'),
      '@banxe/design-tokens': path.resolve(__dirname, 'packages/design-tokens'),
      '@': path.resolve(__dirname, 'apps/web/src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./packages/ui/src/test-setup.ts'],
    include: [
      'packages/ui/src/**/*.test.{ts,tsx}',
      'tests/unit/**/*.test.{ts,tsx}',
      'tests/a11y/**/*.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['packages/ui/src/**/*.{ts,tsx}', 'apps/web/src/**/*.{ts,tsx}'],
      exclude: ['**/*.stories.tsx', '**/*.test.{ts,tsx}', '**/index.ts'],
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
    },
  },
})
