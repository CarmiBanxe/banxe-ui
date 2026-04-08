import React from 'react'
import type { Preview } from '@storybook/react'

// Import BANXE design tokens (generated CSS variables)
// In CI: run `npm run build:tokens` before Storybook
// import '../../packages/design-tokens/build/css/variables.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'banxe-dark',
      values: [
        { name: 'banxe-dark',    value: '#080C14' },
        { name: 'banxe-surface', value: '#0F1520' },
        { name: 'light',         value: '#ffffff' },
      ],
    },
    a11y: {
      // axe-core config: run accessibility checks on every story
      config: { rules: [{ id: 'color-contrast', enabled: true }] },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
          color: '#E8EDF5',
          minWidth: 320,
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default preview
