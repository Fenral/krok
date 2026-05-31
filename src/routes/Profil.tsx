import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Profil() {
  useDocumentTitle('Profil — Krok')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="profil-title"
        eyebrow="Min konto"
        title="Profil"
        description="Personlig informasjon og statistikk om fangstene dine."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <section
          aria-labelledby="info-tittel"
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:col-span-1"
        >
          <h2
            id="info-tittel"
            className="text-lg font-semibold tracking-tight text-slate-100"
          >
            Min info
          </h2>
          <div className="mt-5 flex flex-col items-center text-center">
            <div
              aria-hidden="true"
              className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 text-3xl font-semibold text-sky-300"
            >
              K
            </div>
            <p className="mt-4 text-lg font-medium text-slate-100">Gjest</p>
            <p className="mt-1 text-sm text-slate-400">
              Ikke logget inn enn&aring;
            </p>
            <a
              href="/login"
              className="mt-5 inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Logg inn
            </a>
          </div>
        </section>

        <section
          aria-labelledby="stats-tittel"
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:col-span-2"
        >
          <h2
            id="stats-tittel"
            className="text-lg font-semibold tracking-tight text-slate-100"
          >
            Statistikk
          </h2>
          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Totale fangster" verdi="0" />
            <StatCard label="Favorittart" verdi="—" />
            <StatCard label="Favorittvann" verdi="—" />
          </dl>
          <p className="mt-6 text-sm text-slate-400">
            Statistikken oppdateres automatisk n&aring;r du logger fangster.
          </p>
        </section>
      </div>
    </div>
  )
}

type StatCardProps = { label: string; verdi: string }

function StatCard({ label, verdi }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-slate-100">{verdi}</dd>
    </div>
  )
}
