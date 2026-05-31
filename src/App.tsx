import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { Fragment } from 'react'
import Hjem from './routes/Hjem'
import Login from './routes/Login'
import Logg from './routes/Logg'
import Kart from './routes/Kart'
import Arter from './routes/Arter'
import Profil from './routes/Profil'
import NyFangst from './routes/NyFangst'
import Om from './routes/Om'
import Personvern from './routes/Personvern'
import Vilkar from './routes/Vilkar'
import Kontakt from './routes/Kontakt'
import IkkeFunnet from './routes/IkkeFunnet'
import HookIcon from './components/HookIcon'

const navItems = [
  { to: '/', label: 'Hjem', end: true },
  { to: '/kart', label: 'Kart', end: false },
  { to: '/logg', label: 'Logg', end: false },
  { to: '/arter', label: 'Arter', end: false },
  { to: '/profil', label: 'Profil', end: false },
]

const footerItems = [
  { to: '/om', label: 'Om' },
  { to: '/personvern', label: 'Personvern' },
  { to: '/vilkar', label: 'Vilkår' },
  { to: '/kontakt', label: 'Kontakt' },
]

export default function App() {
  const location = useLocation()
  const isLoginRoute = location.pathname.startsWith('/login')

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <a
        href="#main"
        className="sr-only z-50 focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-sky-500 focus:px-3 focus:py-2 focus:text-slate-950"
      >
        Hopp til hovedinnhold
      </a>
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 md:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 rounded text-slate-100 transition-colors hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            aria-label="Krok — til forsiden"
          >
            <HookIcon className="h-6 w-6 text-sky-400" />
            <span className="text-lg font-semibold tracking-tight">Krok</span>
          </Link>
          <nav
            aria-label="Hovedmeny"
            className="hidden flex-1 justify-center md:flex"
          >
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        'border-b-2',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                        isActive
                          ? 'border-sky-400 text-sky-300'
                          : 'border-transparent text-slate-300 hover:border-slate-600 hover:text-slate-100',
                      ].join(' ')
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            {!isLoginRoute && (
              <Link
                to="/login"
                className="rounded-md border border-sky-400/60 bg-transparent px-3 py-2 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-500/10 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Logg inn
              </Link>
            )}
          </div>
        </div>
        <nav
          aria-label="Hovedmeny mobil"
          className="border-t border-slate-800/70 md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-2 py-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                      'border-b-2',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                      isActive
                        ? 'border-sky-400 text-sky-300'
                        : 'border-transparent text-slate-300 hover:border-slate-600 hover:text-slate-100',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Hjem />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logg" element={<Logg />} />
          <Route path="/logg/ny" element={<NyFangst />} />
          <Route path="/kart" element={<Kart />} />
          <Route path="/arter" element={<Arter />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/om" element={<Om />} />
          <Route path="/personvern" element={<Personvern />} />
          <Route path="/vilkar" element={<Vilkar />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="*" element={<IkkeFunnet />} />
        </Routes>
      </main>
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-300 md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            &copy; 2026{' '}
            <span className="font-semibold text-slate-100">Krok</span> — norsk
            fiskedagbok
          </p>
          <nav aria-label="Sekundær">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {footerItems.map((item, idx) => (
                <Fragment key={item.to}>
                  {idx > 0 && (
                    <li aria-hidden="true" className="text-slate-600">
                      &middot;
                    </li>
                  )}
                  <li>
                    <Link
                      to={item.to}
                      className="rounded text-slate-300 underline-offset-4 transition-colors hover:text-slate-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      {item.label}
                    </Link>
                  </li>
                </Fragment>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}
