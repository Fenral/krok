import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import HookIcon from '../components/HookIcon'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Demo: ikke-innlogget tilstand i denne runden. Når auth er koblet til,
// veksler vi innholdet basert på faktisk auth-state fra Supabase.
const ER_INNLOGGET = false

export default function Profil() {
  useDocumentTitle('Profil — Krok')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="profil-title"
        title="Profil"
        description={
          ER_INNLOGGET
            ? 'Visningsnavn, statistikk og delbar profil.'
            : 'Logget inn som gjest — logg inn for å se streaks, favorittart og delbar profil.'
        }
      />

      {ER_INNLOGGET ? (
        <InnloggetProfil />
      ) : (
        <GjestProfil />
      )}
    </div>
  )
}

function GjestProfil() {
  return (
    <section
      aria-labelledby="gjest-tittel"
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:p-10"
    >
      <div className="flex flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 ring-1 ring-sky-500/20"
        >
          <HookIcon className="h-9 w-9 text-sky-300/80" />
        </div>
        <h2
          id="gjest-tittel"
          className="mt-5 text-2xl font-semibold tracking-tight text-slate-100"
        >
          Bygg din egen fiskedagbok
        </h2>
        <p className="mt-3 max-w-md text-base text-slate-300">
          Krok husker hver fangst, hver vannkant, hvert v&aelig;r. Logg inn for &aring;
          starte din dagbok — det er gratis.
        </p>
        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link
            to="/login"
            className="inline-flex min-w-[10rem] items-center justify-center rounded-md bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 active:translate-y-px active:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Logg inn
          </Link>
          <Link
            to="/login"
            className="inline-flex min-w-[10rem] items-center justify-center rounded-md border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Opprett konto
          </Link>
        </div>
      </div>
    </section>
  )
}

function InnloggetProfil() {
  return (
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
            S
          </div>
          <p className="mt-4 text-lg font-medium text-slate-100">Sivert</p>
          <p className="mt-1 text-sm text-slate-400">Medlem siden mai 2026</p>
        </div>
      </section>

      <section aria-labelledby="stats-tittel" className="md:col-span-2">
        <h2
          id="stats-tittel"
          className="text-lg font-semibold tracking-tight text-slate-100"
        >
          Statistikk
        </h2>
        {/* Flat grid — ingen ytre card-border for å unngå card-in-card-mønster. */}
        <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-3">
          <StatTile label="Totale fangster" verdi="0" tom />
          <StatTile label="Favorittart" verdi="Ingen ennå" tom />
          <StatTile label="Favorittvann" verdi="Ingen ennå" tom />
        </dl>
        <p className="mt-4 text-sm text-slate-400">
          Hver fangst du logger bygger statistikken.
        </p>
      </section>
    </div>
  )
}

type StatTileProps = { label: string; verdi: string; tom?: boolean }

function StatTile({ label, verdi, tom = false }: StatTileProps) {
  return (
    <div className="bg-slate-950/60 p-4">
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd
        className={[
          'mt-2 text-2xl font-semibold',
          tom ? 'text-slate-400' : 'text-slate-100',
        ].join(' ')}
      >
        {verdi}
      </dd>
    </div>
  )
}
