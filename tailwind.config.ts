import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        natt: { 900: '#0b0a12', 800: '#141221', 700: '#1d1a2e' },
        tre: { 900: '#1a0f08', 700: '#2e1b0e', 500: '#4a2c17' },
        lys: { DEFAULT: '#e8b64c', dim: '#a97e2f', glow: '#ffd98a' },
        pergament: { DEFAULT: '#e9dcc3', dyp: '#d9c49a', blekk: '#3b2f1e' },
      },
      fontFamily: {
        tittel: ['Georgia', 'Times New Roman', 'serif'],
        broedtekst: ['Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
