import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import HookIcon from '../components/HookIcon'
import FishIcon from '../components/FishIcon'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Hjem() {
  useDocumentTitle('Krok — norsk fiskedagbok')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <PageHeader
        titleId="hjem-title"
        title="Krok — din norske fiskedagbok"
        description="Logg fangstene dine, se dem på kartet, og bli kjent med norske fiskearter. Bygget for norske vann, regler og språk."
        actions={
          <Link
            to="/logg/ny"
            className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <HookIcon className="h-4 w-4" />
            Ny fangst
          </Link>
        }
      />

      <section
        aria-labelledby="snarveier-tittel"
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <h2 id="snarveier-tittel" className="sr-only">
          Snarveier
        </h2>
        <Snarvei
          to="/logg"
          eyebrow="Logg"
          title="Min fangstlogg"
          description="Hold orden p&aring; alt du har dratt opp."
          icon={<FishIcon className="h-7 w-12" />}
        />
        <Snarvei
          to="/kart"
          eyebrow="Kart"
          title="Fangstkartet"
          description="Se hvor fangstene er gjort. Tabellvisning for skjermleser."
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" />
              <path d="M9 4v14M15 6v14" />
            </svg>
          }
        />
        <Snarvei
          to="/arter"
          eyebrow="Artsdatabase"
          title="Norske fiskearter"
          description="Bli kjent med vanlige arter i saltvann og ferskvann."
          icon={<FishIcon className="h-7 w-12" />}
        />
      </section>

      <section
        aria-labelledby="hvorfor-tittel"
        className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 md:p-8"
      >
        <h2
          id="hvorfor-tittel"
          className="text-xl font-semibold tracking-tight text-slate-100"
        >
          Hvorfor Krok?
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-2">
          <li>
            <span className="text-slate-100">Norsk f&oslash;rst.</span> Bokm&aring;l-UI, norske
            arter, og minstem&aring;l per fylke.
          </li>
          <li>
            <span className="text-slate-100">Outdoors-lesbar.</span> H&oslash;y kontrast og
            ber&oslash;rings-vennlige knapper.
          </li>
          <li>
            <span className="text-slate-100">Web-f&oslash;rst, app n&aelig;ste.</span> Full
            funksjon i nettleseren, PWA + Capacitor senere.
          </li>
          <li>
            <span className="text-slate-100">Tilgjengelig.</span> Skjermleser- og
            tastatur-vennlig fra dag &eacute;n.
          </li>
        </ul>
      </section>
    </div>
  )
}

type SnarveiProps = {
  to: string
  eyebrow: string
  title: string
  description: string
  icon: ReactNode
}

function Snarvei({ to, eyebrow, title, description, icon }: SnarveiProps) {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-slate-700 hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <span className="text-sky-300">{icon}</span>
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-300">
        {eyebrow}
      </span>
      <span className="text-lg font-semibold text-slate-100">{title}</span>
      <span className="text-sm text-slate-300">{description}</span>
      <span
        aria-hidden="true"
        className="mt-auto text-sm font-medium text-sky-300 transition-colors group-hover:text-sky-200"
      >
        &rarr;
      </span>
    </Link>
  )
}
