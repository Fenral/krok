import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import HookIcon from '../components/HookIcon'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type View = 'map' | 'list'

// Demo: ingen fangster i denne runden. Vi viser eksplisitt empty-state
// uten kart-shell — Sivert + reviewer-feedback: tom kart-canvas konkurrerer
// med modalet og lurer brukeren til å lete etter pins som ikke finnes.
const fangster: Array<{
  id: string
  dato: string
  art: string
  sted: string
  vekt: string
}> = []

export default function Kart() {
  useDocumentTitle('Fangstkart — Krok')
  const [view, setView] = useState<View>('map')
  const harFangster = fangster.length > 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="kart-title"
        title="Fangstkart"
        description="Se hvor fangstene er gjort."
      />
      {/* A11y-jargon skjult fra synlige brukere — kommuniseres til skjermleser
          via sr-only-tekst lenger ned + selve tab-mønsteret. */}
      <p className="sr-only">
        Bytt til Liste-fanen for et tilgjengelig alternativ via skjermleser
        eller tastatur.
      </p>

      {harFangster ? (
        // Med data: kart-shell + tabs som primær-IA rett under h1 (ikke gjemt
        // i hjørnet av kart-chrome).
        <div className="space-y-4">
          <div
            role="tablist"
            aria-label="Visningstype"
            className="inline-flex rounded-md border border-slate-700 bg-slate-900/60 p-1"
          >
            <Tab id="tab-kart" active={view === 'map'} controls="kart-panel" onClick={() => setView('map')}>
              Kart
            </Tab>
            <Tab id="tab-liste" active={view === 'list'} controls="liste-panel" onClick={() => setView('list')}>
              Liste
            </Tab>
          </div>

          <section
            id="kart-panel"
            role="tabpanel"
            aria-labelledby="tab-kart"
            hidden={view !== 'map'}
          >
            <h2 className="sr-only">Kartvisning</h2>
            <div
              role="application"
              aria-label={`Interaktivt kart med ${fangster.length} fangst-pins`}
              className="h-[420px] rounded-2xl border border-slate-800 bg-slate-900/40"
            />
          </section>

          <section
            id="liste-panel"
            role="tabpanel"
            aria-labelledby="tab-liste"
            hidden={view !== 'list'}
          >
            <h2 className="sr-only">Fangster (listevisning)</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-sm text-slate-200">
                <caption className="sr-only">
                  {fangster.length} fangster sortert etter dato
                </caption>
                <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">Dato</th>
                    <th scope="col" className="px-4 py-3 font-medium">Art</th>
                    <th scope="col" className="px-4 py-3 font-medium">Sted</th>
                    <th scope="col" className="px-4 py-3 font-medium">Vekt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {fangster.map((f) => (
                    <tr key={f.id}>
                      <td className="px-4 py-3">{f.dato}</td>
                      <td className="px-4 py-3 text-slate-100">{f.art}</td>
                      <td className="px-4 py-3">{f.sted}</td>
                      <td className="px-4 py-3">{f.vekt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        // Empty-state: ren, sentrert, ingen falsk kart-canvas under.
        <section
          aria-labelledby="kart-empty-tittel"
          className="rounded-2xl border border-dashed border-sky-900/60 bg-slate-900/30 p-10 text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 ring-1 ring-sky-500/30">
            <KartPinIkon className="h-9 w-9 text-sky-300" />
          </div>
          <h2
            id="kart-empty-tittel"
            className="mt-5 text-xl font-semibold text-slate-100"
          >
            Ingen fangster &aring; vise enn&aring;
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
            Logg din f&oslash;rste fangst, s&aring; dukker den opp her med pin og
            detaljer. Kartet aktiveres automatisk n&aring;r du har minst &eacute;n
            fangst med posisjon.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/logg/ny"
              className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 active:translate-y-px active:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <HookIcon className="h-4 w-4" />
              Logg f&oslash;rste fangst
            </Link>
            <Link
              to="/arter"
              className="text-sm font-medium text-slate-300 underline-offset-4 hover:text-slate-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Eller bla i artsdatabasen &rarr;
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

type TabProps = {
  id: string
  active: boolean
  controls: string
  onClick: () => void
  children: React.ReactNode
}

function Tab({ id, active, controls, onClick, children }: TabProps) {
  return (
    <button
      id={id}
      role="tab"
      type="button"
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={[
        'rounded px-4 py-1.5 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        active
          ? 'bg-slate-800 text-sky-300 ring-1 ring-inset ring-sky-400/40'
          : 'text-slate-300 hover:text-slate-100',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function KartPinIkon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}
