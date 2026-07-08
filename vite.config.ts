import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // '/' for Vercel/lokalt, '/krok/' for GitHub Pages (satt av deploy-workflowen)
  base: process.env.PAGES_BASE || '/',
  plugins: [react()],
  appType: 'spa',
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
} as any)
