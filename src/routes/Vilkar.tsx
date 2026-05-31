import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Vilkar() {
  useDocumentTitle('Vilkår — Krok')
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="vilkar-title"
        eyebrow="Vilk&aring;r"
        title="Vilk&aring;r for bruk"
        description="Reglene for &aring; bruke Krok. Kort og enkelt."
      />

      <section
        aria-labelledby="vilkar-tekst-tittel"
        className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 md:p-8"
      >
        <h2
          id="vilkar-tekst-tittel"
          className="text-lg font-semibold tracking-tight text-slate-100"
        >
          Hovedpunkter
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Du eier fangstene og bildene du legger inn. Vi lagrer dem for &aring;
            vise dem til deg.
          </li>
          <li>
            F&oslash;lg norske fiskeregler — fiskeravgift, fredningstid og
            minstem&aring;l per fylke. Krok er ikke en juridisk r&aring;dgiver.
          </li>
          <li>
            Vi kan stenge kontoen din ved misbruk eller brudd p&aring; norsk
            lov.
          </li>
        </ul>
        <p className="mt-4 text-sm text-slate-400">
          Fullstendige vilk&aring;r kommer ved offentlig lansering.
        </p>
      </section>
    </div>
  )
}
