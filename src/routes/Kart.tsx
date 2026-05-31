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
        eyebrow="Kart"
        title="Fangstkart"
        description="Se hvor fangstene er gjort. Bytt til Liste for full tilgjengelighet med skjermleser eller tastatur."
      />

      <div
        role="tablist"
        aria-label="Visningstype"
        className="mb-4 inline-flex rounded-md border border-slate-700 bg-slate-900/50 p-1"
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
          aria-label="Interaktivt kart med 0 fangst-pins (kommer)"
          className="relative h-[420px] overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 40%, rgba(56,189,248,0.25), transparent 55%), radial-gradient(circle at 70% 70%, rgba(16,185,129,0.18), transparent 55%)',
            }}
          />
          <div className="relative flex h-full items-center justify-center p-6 text-center">
            <div>
              <p className="text-base font-semibold text-slate-100">
                Kartet kobles til Kartverket og NVE
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-300">
                F&aring; minutt unna: norske toposkjema-fliser, pin per fangst og
                klikk-til-detalj.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Bytt til{' '}
          <button
            type="button"
            onClick={() => setView('list')}
            className="rounded underline decoration-slate-500 underline-offset-2 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Liste
          </button>{' '}
          for et tilgjengelig alternativ.
        </p>
      </section>

      <section
        id="liste-panel"
        role="tabpanel"
        aria-labelledby="tab-liste"
        hidden={view !== 'list'}
      >
        <h2 className="text-lg font-semibold text-slate-100">
          Fangster (listevisning)
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm text-slate-200">
            <caption className="sr-only">
              Fangster sortert etter dato — tom liste i denne runden.
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
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  Ingen fangster &aring; vise enn&aring;.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
