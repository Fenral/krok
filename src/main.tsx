import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { App } from './App'
import './index.css'
import { LibraryProvider } from './lib/library'

// GitHub Pages har ingen SPA-rewrite → bruk HashRouter der (satt av workflowen).
// Vercel/lokalt bruker BrowserRouter for rene URL-er.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter

createRoot(document.getElementById('rot')!).render(
  <StrictMode>
    <Router>
      <LibraryProvider>
        <App />
      </LibraryProvider>
    </Router>
  </StrictMode>,
)
