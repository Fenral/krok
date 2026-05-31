import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('route → h1 smoke-tests', () => {
  it('/login viser h1 "Logg inn på Krok"', () => {
    renderAt('/login')
    expect(
      screen.getByRole('heading', { level: 1, name: /logg inn på krok/i }),
    ).toBeInTheDocument()
  })

  it('/logg viser h1 "Min fangstlogg"', () => {
    renderAt('/logg')
    expect(
      screen.getByRole('heading', { level: 1, name: /min fangstlogg/i }),
    ).toBeInTheDocument()
  })

  it('/logg/ny viser h1 "Ny fangst"', () => {
    renderAt('/logg/ny')
    expect(
      screen.getByRole('heading', { level: 1, name: /ny fangst/i }),
    ).toBeInTheDocument()
  })

  it('/kart viser h1 "Fangstkart"', () => {
    renderAt('/kart')
    expect(
      screen.getByRole('heading', { level: 1, name: /fangstkart/i }),
    ).toBeInTheDocument()
  })

  it('/arter viser h1 "Norske fiskearter"', () => {
    renderAt('/arter')
    expect(
      screen.getByRole('heading', { level: 1, name: /norske fiskearter/i }),
    ).toBeInTheDocument()
  })

  it('/profil viser h1 "Profil"', () => {
    renderAt('/profil')
    expect(
      screen.getByRole('heading', { level: 1, name: /^profil$/i }),
    ).toBeInTheDocument()
  })
})

describe('global layout', () => {
  it('viser skip-link til #main', () => {
    renderAt('/logg')
    const link = screen.getByRole('link', { name: /hopp til hovedinnhold/i })
    expect(link).toHaveAttribute('href', '#main')
  })

  it('viser Krok-wordmark og hovedmeny', () => {
    renderAt('/logg')
    expect(screen.getByRole('link', { name: /krok — til forsiden/i })).toBeInTheDocument()
    // Hovedmeny er rendret to ganger (desktop + mobil)
    const menus = screen.getAllByRole('navigation', { name: /hovedmeny/i })
    expect(menus.length).toBeGreaterThanOrEqual(1)
  })

  it('viser footer med lenker', () => {
    renderAt('/logg')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
