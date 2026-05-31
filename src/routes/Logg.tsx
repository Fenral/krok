import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import HookIcon from '../components/HookIcon'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Logg() {
  useDocumentTitle('Min fangstlogg — Krok')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="logg-title"
        eyebrow="Min fangstlogg"
        title="Min fangstlogg"
        description="Hold orden p&aring; fangstene dine — art, sted, vekt og bilder samlet p&aring; ett sted."
        actions={
          <Link
            to="/logg/ny"
            className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <HookIcon className="h-4 w-4" />
            Logg ny fangst
          </Link>
        }
      />

      <section aria-labelledby="resultater-tittel">
        <h2 id="resultater-tittel" className="sr-only">
          Dine fangster
        </h2>
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 text-sky-300">
            <HookIcon className="h-7 w-7" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-100">
            Ingen fangster enn&aring;
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-300">
            Logg din f&oslash;rste fangst og bygg din egen historie. Vi tar vare
            p&aring; art, vekt, sted og bilder.
          </p>
          <Link
            to="/logg/ny"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Logg din f&oslash;rste fangst
          </Link>
        </div>
      </section>
    </div>
  )
}
