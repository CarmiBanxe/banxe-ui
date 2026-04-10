/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1A2B6B",
        "primary-light": "#2E4494",
        "primary-subtle": "#EEF1FA",
        accent: "#00C6AE",
        "accent-light": "#00DFC5",
        "bg-page": "#F5F7FA",
        "bg-surface": "#FFFFFF",
        "bg-elevated": "#F0F3F8",
        "text-primary": "#1A1A2E",
        "text-secondary": "#4A5568",
        "text-disabled": "#A0AEC0",
        "border-subtle": "#E4E8F0",
        "border-default": "#CBD3E0",
        success: "#38A169",
        "success-subtle": "#F0FFF4",
        warning: "#D69E2E",
        "warning-subtle": "#FFFFF0",
        error: "#E53E3E",
        "error-subtle": "#FFF5F5",
        pending: "#718096",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "9999px",
      },
    },
  },
  plugins: [],
}
