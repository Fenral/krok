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
  it('/ viser h1 "Krok — din norske fiskedagbok"', () => {
    renderAt('/')
    expect(
      screen.getByRole('heading', { level: 1, name: /krok — din norske fiskedagbok/i }),
    ).toBeInTheDocument()
  })

  it('/login viser h1 "Logg inn på Krok"', () => {
    renderAt('/login')
    expect(
      screen.getByRole('heading', { level: 1, name: /logg inn på krok/i }),
    ).toBeInTheDocument()
  })

  it('/logg viser h1 "Mine fangster"', () => {
    renderAt('/logg')
    expect(
      screen.getByRole('heading', { level: 1, name: /mine fangster/i }),
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

  it('/om viser h1 "Om Krok"', () => {
    renderAt('/om')
    expect(
      screen.getByRole('heading', { level: 1, name: /om krok/i }),
    ).toBeInTheDocument()
  })

  it('/personvern viser h1 "Personvern"', () => {
    renderAt('/personvern')
    expect(
      screen.getByRole('heading', { level: 1, name: /^personvern$/i }),
    ).toBeInTheDocument()
  })

  it('/vilkar viser h1 "Vilkår for bruk"', () => {
    renderAt('/vilkar')
    expect(
      screen.getByRole('heading', { level: 1, name: /vilkår for bruk/i }),
    ).toBeInTheDocument()
  })

  it('/kontakt viser h1 "Kontakt oss"', () => {
    renderAt('/kontakt')
    expect(
      screen.getByRole('heading', { level: 1, name: /kontakt oss/i }),
    ).toBeInTheDocument()
  })

  it('ukjent rute viser h1 "Siden finnes ikke"', () => {
    renderAt('/finnes-ikke-12345')
    expect(
      screen.getByRole('heading', { level: 1, name: /siden finnes ikke/i }),
    ).toBeInTheDocument()
  })
})

describe('navigasjon-aktiv-state', () => {
  it('aktiv NavLink på /kart får aria-current="page"', () => {
    renderAt('/kart')
    const kartLinks = screen.getAllByRole('link', { name: /^kart$/i })
    const aktiv = kartLinks.find((l) => l.getAttribute('aria-current') === 'page')
    expect(aktiv).toBeDefined()
  })

  it('Hjem-link er aktiv på /', () => {
    renderAt('/')
    const hjemLinks = screen.getAllByRole('link', { name: /^hjem$/i })
    const aktiv = hjemLinks.find((l) => l.getAttribute('aria-current') === 'page')
    expect(aktiv).toBeDefined()
  })

  it('Fangster-link er aktiv på /logg', () => {
    renderAt('/logg')
    const links = screen.getAllByRole('link', { name: /^fangster$/i })
    const aktiv = links.find((l) => l.getAttribute('aria-current') === 'page')
    expect(aktiv).toBeDefined()
  })
})

describe('footer-lenker peker til reelle ruter', () => {
  it('Om-link peker til /om', () => {
    renderAt('/logg')
    const link = screen.getByRole('link', { name: /^om$/i })
    expect(link).toHaveAttribute('href', '/om')
  })

  it('Personvern-link peker til /personvern', () => {
    renderAt('/logg')
    const link = screen.getByRole('link', { name: /^personvern$/i })
    expect(link).toHaveAttribute('href', '/personvern')
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
