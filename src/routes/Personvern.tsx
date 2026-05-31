import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Personvern() {
  useDocumentTitle('Personvern — Krok')
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="personvern-title"
        eyebrow="Personvern"
        title="Personvern"
        description="Hvilke data vi samler, hvorfor, og hvordan du f&aring;r dem ut igjen."
      />

      <section
        aria-labelledby="data-tittel"
        className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 md:p-8"
      >
        <h2
          id="data-tittel"
          className="text-lg font-semibold tracking-tight text-slate-100"
        >
          Hva vi lagrer
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>E-postadressen din — for innlogging via magisk lenke.</li>
          <li>Fangstene du logger — art, sted, vekt, lengde, bilder, notat.</li>
          <li>Statistikk for &aring; vise deg dine egne tall.</li>
        </ul>
        <p className="mt-4 text-slate-300">
          Vi selger ikke data. Vi bruker EU-hosting (Supabase EU-region). Du kan
          n&aring;r som helst be om eksport eller sletting via{' '}
          <a
            className="text-sky-300 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            href="mailto:hei@krok.no"
          >
            hei@krok.no
          </a>
          .
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Full personvern-erkl&aelig;ring kommer ved offentlig lansering.
        </p>
      </section>
    </div>
  )
}
