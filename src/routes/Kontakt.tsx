import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Kontakt() {
  useDocumentTitle('Kontakt — Krok')
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="kontakt-title"
        eyebrow="Kontakt"
        title="Kontakt oss"
        description="Sp&oslash;rsm&aring;l, feilmeldinger eller forslag — vi h&oslash;rer gjerne fra deg."
      />

      <section
        aria-labelledby="kontakt-info-tittel"
        className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 md:p-8"
      >
        <h2
          id="kontakt-info-tittel"
          className="text-lg font-semibold tracking-tight text-slate-100"
        >
          E-post
        </h2>
        <p className="mt-3 text-slate-300">
          Send oss en e-post p&aring;{' '}
          <a
            className="text-sky-300 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            href="mailto:hei@krok.no"
          >
            hei@krok.no
          </a>
          . Vi pr&oslash;ver &aring; svare innen et par dager.
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Telefon og chat kommer ikke i denne tidlige versjonen.
        </p>
      </section>
    </div>
  )
}
