import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * vite.config.ts — BANXE Web App (Developer Plane)
 * IL-062 | banxe-ui
 */

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@banxe/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@banxe/design-tokens': path.resolve(__dirname, '../../packages/design-tokens'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
