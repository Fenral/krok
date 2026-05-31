import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function IkkeFunnet() {
  useDocumentTitle('Siden finnes ikke — Krok')
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-16">
      <PageHeader
        titleId="ikkefunnet-title"
        eyebrow="404"
        title="Siden finnes ikke"
        description="Lenken er kanskje feil, eller siden er flyttet."
      />
      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Til forsiden
        </Link>
        <Link
          to="/logg"
          className="inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Til fangstene
        </Link>
      </div>
    </div>
  )
}
