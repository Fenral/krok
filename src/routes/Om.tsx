import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Om() {
  useDocumentTitle('Om Krok — Krok')
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="om-title"
        eyebrow="Om oss"
        title="Om Krok"
        description="En norsk fiskedagbok bygget for norske vann, regler og spr&aring;k."
      />
      <section
        aria-labelledby="om-tekst-tittel"
        className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 md:p-8"
      >
        <h2
          id="om-tekst-tittel"
          className="text-lg font-semibold tracking-tight text-slate-100"
        >
          Hvorfor finnes Krok?
        </h2>
        <p className="mt-3 text-slate-300">
          Krok er bygget for norske sportsfiskere som vil holde orden p&aring;
          fangstene sine uten &aring; lese engelske app-er eller dele data med
          globale plattformer. Vi prioriterer personvern, tilgjengelighet og
          riktig informasjon om norske arter og regler.
        </p>
        <p className="mt-3 text-slate-300">
          Appen er i tidlig versjon. Vi bygger sammen med fellesskapet — har du
          innspill, send dem til oss via{' '}
          <a
            className="text-sky-300 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            href="mailto:hei@krok.no"
          >
            hei@krok.no
          </a>
          .
        </p>
      </section>
    </div>
  )
}
