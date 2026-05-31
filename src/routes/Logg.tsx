import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import FishIcon from '../components/FishIcon'
import HookIcon from '../components/HookIcon'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Demo-data: tom liste i denne runden. Når listen er tom, vises empty-state
// med dens egen primær-CTA — top-right-knappen skjules for å unngå to
// konkurrerende primary-CTAs på samme skjerm.
const fangster: Array<{ id: string; art: string; sted: string; vekt: string; dato: string }> = []

export default function Logg() {
  useDocumentTitle('Mine fangster — Krok')
  const harFangster = fangster.length > 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="logg-title"
        eyebrow="Mine fangster"
        title="Mine fangster"
        description="Hold orden p&aring; fangstene dine — art, sted, vekt og bilder samlet p&aring; ett sted."
        actions={
          harFangster ? (
            <Link
              to="/logg/ny"
              className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 active:translate-y-px active:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <HookIcon className="h-4 w-4" />
              Ny fangst
            </Link>
          ) : undefined
        }
      />

      <section aria-labelledby="resultater-tittel">
        <h2 id="resultater-tittel" className="sr-only">
          Dine fangster
        </h2>
        {harFangster ? (
          <ul role="list" className="grid gap-3">
            {fangster.map((f) => (
              <li key={f.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <article aria-labelledby={`fangst-${f.id}-tittel`}>
                  <h3 id={`fangst-${f.id}-tittel`} className="text-base font-semibold text-slate-100">
                    {f.art}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {f.sted} &middot; {f.vekt} &middot; {f.dato}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-sky-900/60 bg-slate-900/30 p-10 text-center">
            <div className="mx-auto flex h-16 w-24 items-center justify-center rounded-full bg-slate-800/80 text-sky-300">
              <FishIcon className="h-9 w-16" />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-100">
              Ingen fangster enn&aring;
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-300">
              Registrer din f&oslash;rste fangst og bygg din egen historie. Vi
              tar vare p&aring; art, vekt, sted og bilder.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/logg/ny"
                className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 active:translate-y-px active:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <HookIcon className="h-4 w-4" />
                Registrer f&oslash;rste fangst
              </Link>
              <Link
                to="/kart"
                className="text-sm font-medium text-slate-300 underline-offset-4 hover:text-slate-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Eller utforsk kartet &rarr;
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
