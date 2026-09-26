/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        legal: {
          50: '#f4f7fa',
          100: '#e6edf4',
          200: '#d1dee9',
          300: '#b0c7db',
          400: '#89abcb',
          500: '#698ebd',
          600: '#5272a8',
          700: '#445c8c',
          800: '#3a4e74',
          900: '#324260',
          950: '#1e283c',
        },
        brand: {
          navy: '#0f172a',
          gold: '#d97706',
          teal: '#0d9488',
          crimson: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
