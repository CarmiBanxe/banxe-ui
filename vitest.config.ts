import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// Root vitest config — runs ALL tests: packages/ui + tests/unit + tests/a11y
// IL-064 | Developer Plane | BANXE AI BANK
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Deduplicate React — prevents "cannot read useState of null" in monorepo
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: '@banxe/ui', replacement: path.resolve(__dirname, 'packages/ui/src') },
      { find: '@banxe/design-tokens', replacement: path.resolve(__dirname, 'packages/design-tokens') },
      { find: '@', replacement: path.resolve(__dirname, 'apps/web/src') },
      // Screens use relative paths like ../../../../mocks/ (one level short) — redirect to root mocks/
      { find: /^(\.\.\/)*mocks\//, replacement: path.resolve(__dirname, 'mocks') + '/' },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./packages/ui/src/test-setup.ts'],
    // packages/ui has its own vitest.config.ts — run separately via npm run test -w @banxe/ui
    // Root config covers integration-level tests in tests/
    include: [
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
