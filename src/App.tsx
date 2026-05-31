import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Login from './routes/Login'
import Logg from './routes/Logg'
import Kart from './routes/Kart'
import Arter from './routes/Arter'
import Profil from './routes/Profil'
import NyFangst from './routes/NyFangst'
import HookIcon from './components/HookIcon'

const navItems = [
  { to: '/logg', label: 'Logg' },
  { to: '/kart', label: 'Kart' },
  { to: '/arter', label: 'Arter' },
  { to: '/profil', label: 'Profil' },
]

export default function App() {
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
                    end={item.to === '/logg'}
                    className={({ isActive }) =>
                      [
                        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                        isActive
                          ? 'bg-slate-800/80 text-sky-300'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100',
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
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Logg inn
            </Link>
            <Link
              to="/login"
              className="hidden rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:inline-flex"
            >
              Opprett konto
            </Link>
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
                  end={item.to === '/logg'}
                  className={({ isActive }) =>
                    [
                      'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                      isActive
                        ? 'bg-slate-800/80 text-sky-300'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100',
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
          <Route path="/" element={<Logg />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logg" element={<Logg />} />
          <Route path="/logg/ny" element={<NyFangst />} />
          <Route path="/kart" element={<Kart />} />
          <Route path="/arter" element={<Arter />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </main>
      <footer className="mt-12 border-t border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:px-6">
          <p>&copy; 2026 Krok — norsk fiskedagbok</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <a
                href="#om"
                className="rounded transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Om
              </a>
            </li>
            <li>
              <a
                href="#personvern"
                className="rounded transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Personvern
              </a>
            </li>
            <li>
              <a
                href="#vilkar"
                className="rounded transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Vilk&aring;r
              </a>
            </li>
            <li>
              <a
                href="mailto:hei@krok.no"
                className="rounded transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Kontakt
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
