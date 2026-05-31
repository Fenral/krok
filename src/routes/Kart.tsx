import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type View = 'map' | 'list'

export default function Kart() {
  useDocumentTitle('Fangstkart — Krok')
  const [view, setView] = useState<View>('map')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="kart-title"
        title="Fangstkart"
        description="Se hvor fangstene er gjort. Bytt til Liste for full tilgjengelighet med skjermleser eller tastatur."
      />

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
        <div
          role="tablist"
          aria-label="Visningstype"
          className="absolute right-3 top-3 z-10 inline-flex rounded-md border border-slate-700 bg-slate-950/80 p-1 backdrop-blur"
        >
          <button
            id="tab-kart"
            role="tab"
            type="button"
            aria-selected={view === 'map'}
            aria-controls="kart-panel"
            onClick={() => setView('map')}
            className={[
              'rounded px-3 py-1.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
              view === 'map'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-300 hover:text-slate-100',
            ].join(' ')}
          >
            Kart
          </button>
          <button
            id="tab-liste"
            role="tab"
            type="button"
            aria-selected={view === 'list'}
            aria-controls="liste-panel"
            onClick={() => setView('list')}
            className={[
              'rounded px-3 py-1.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
              view === 'list'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-300 hover:text-slate-100',
            ].join(' ')}
          >
            Liste
          </button>
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
            aria-label="Interaktivt kart — tomt, ingen fangster &aring; vise enn&aring;"
            className="relative h-[420px] overflow-hidden bg-slate-950"
          >
            {/* Topografisk SVG-tekstur som signaliserer "kart" uten å love tiles vi ikke har enda. */}
            <svg
              aria-hidden="true"
              focusable="false"
              className="absolute inset-0 h-full w-full opacity-40"
              viewBox="0 0 400 280"
              preserveAspectRatio="none"
              fill="none"
              stroke="rgb(56,189,248)"
              strokeWidth="0.6"
            >
              <path d="M-20 60 Q 80 30 170 80 T 420 60" strokeOpacity="0.35" />
              <path d="M-20 110 Q 100 80 180 130 T 420 110" strokeOpacity="0.35" />
              <path d="M-20 160 Q 110 130 200 180 T 420 160" strokeOpacity="0.35" />
              <path d="M-20 210 Q 130 180 220 230 T 420 210" strokeOpacity="0.35" />
              <path d="M-20 260 Q 150 230 240 280 T 420 260" strokeOpacity="0.35" />
              <path d="M-20 30 Q 70 0 160 50 T 420 30" strokeOpacity="0.2" />
            </svg>
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 40%, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at 70% 70%, rgba(16,185,129,0.12), transparent 55%)',
              }}
            />
            <div className="relative flex h-full items-center justify-center p-6 text-center">
              <div className="max-w-sm rounded-xl bg-slate-950/70 px-5 py-4 ring-1 ring-slate-800/80 backdrop-blur">
                <p className="text-base font-semibold text-slate-100">
                  Ingen fangster &aring; vise enn&aring;
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Logg din f&oslash;rste fangst, s&aring; dukker den opp her med pin og
                  detaljer.
                </p>
                <a
                  href="/logg/ny"
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Logg fangst
                </a>
              </div>
            </div>
          </div>
          {/* sr-only fallback — visuelle brukere ser allerede Liste-fanen øverst i kortet. */}
          <p className="sr-only">
            Kartet er ikke tilgjengelig for skjermleser. Bytt til Liste-fanen for et
            tilgjengelig alternativ.
          </p>
        </section>

        <section
          id="liste-panel"
          role="tabpanel"
          aria-labelledby="tab-liste"
          hidden={view !== 'list'}
        >
          <h2 className="sr-only">Fangster (listevisning)</h2>
          <div className="overflow-x-auto p-4 md:p-6">
            <table className="w-full text-left text-sm text-slate-200">
              <caption className="mb-3 text-left text-base font-semibold text-slate-100">
                Fangster (listevisning)
                <span className="ml-2 text-sm font-normal text-slate-400">
                  — ingen fangster enn&aring;
                </span>
              </caption>
              <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Dato
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Art
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Sted
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Vekt
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    Logg din f&oslash;rste fangst — s&aring; bygges listen automatisk.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
