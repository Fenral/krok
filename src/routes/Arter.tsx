import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { arter, type HabitatFilter } from '../lib/arter'

const filters: { value: HabitatFilter; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  { value: 'saltvann', label: 'Saltvann' },
  { value: 'ferskvann', label: 'Ferskvann' },
]

export default function Arter() {
  useDocumentTitle('Norske fiskearter — Krok')
  const [habitat, setHabitat] = useState<HabitatFilter>('alle')
  const [query, setQuery] = useState('')

  const filtrert = useMemo(() => {
    const q = query.trim().toLowerCase()
    return arter.filter((a) => {
      const matchesHabitat = habitat === 'alle' || a.habitat === habitat
      const matchesQuery =
        q === '' ||
        a.norsk.toLowerCase().includes(q) ||
        a.latin.toLowerCase().includes(q)
      return matchesHabitat && matchesQuery
    })
  }, [habitat, query])

  const saltvann = filtrert.filter((a) => a.habitat === 'saltvann')
  const ferskvann = filtrert.filter((a) => a.habitat === 'ferskvann')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <PageHeader
        titleId="arter-title"
        title="Norske fiskearter"
        description="Bli kjent med vanlige fiskearter i norske vann og langs kysten."
      />

      <section aria-labelledby="filter-tittel" className="mb-8">
        <h2 id="filter-tittel" className="sr-only">
          Filtrer og s&oslash;k
        </h2>
        <form role="search" className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="art-sok"
              className="block text-sm font-medium text-slate-100"
            >
              S&oslash;k etter art
            </label>
            <input
              id="art-sok"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="F.eks. &oslash;rret, makrell, Salmo"
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            />
          </div>
          <fieldset className="shrink-0">
            <legend className="block text-sm font-medium text-slate-100">
              Habitat
            </legend>
            <div className="mt-1 inline-flex rounded-md border border-slate-700 bg-slate-900/50 p-1">
              {filters.map((f) => (
                <label
                  key={f.value}
                  className={[
                    'cursor-pointer rounded px-3 py-1.5 text-sm font-medium transition-colors',
                    habitat === f.value
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-300 hover:text-slate-100',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="habitat"
                    value={f.value}
                    checked={habitat === f.value}
                    onChange={() => setHabitat(f.value)}
                    className="sr-only"
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </fieldset>
        </form>
      </section>

      <div role="status" aria-live="polite" className="sr-only">
        {filtrert.length} arter vist
      </div>

      {(habitat === 'alle' || habitat === 'saltvann') && saltvann.length > 0 && (
        <ArtsSeksjon
          tittel="Saltvann"
          tittelId="saltvann-tittel"
          arter={saltvann}
        />
      )}
      {(habitat === 'alle' || habitat === 'ferskvann') && ferskvann.length > 0 && (
        <ArtsSeksjon
          tittel="Ferskvann"
          tittelId="ferskvann-tittel"
          arter={ferskvann}
        />
      )}

      {filtrert.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-6 text-center text-sm text-slate-300">
          Fant ingen arter som matcher s&oslash;ket.
        </p>
      )}
    </div>
  )
}

type ArtsSeksjonProps = {
  tittel: string
  tittelId: string
  arter: typeof arter
}

function ArtsSeksjon({ tittel, tittelId, arter }: ArtsSeksjonProps) {
  return (
    <section aria-labelledby={tittelId} className="mb-10">
      <h2
        id={tittelId}
        className="mb-4 text-xl font-semibold tracking-tight text-slate-100"
      >
        {tittel}
      </h2>
      <ul
        role="list"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {arter.map((a) => (
          <li
            key={a.id}
            className="group rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-colors hover:border-slate-700"
          >
            <article aria-labelledby={`art-${a.id}-tittel`}>
              <div
                aria-hidden="true"
                className="mb-3 flex h-20 w-full items-center justify-center rounded-md bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500"
              >
                <svg
                  viewBox="0 0 64 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.25}
                  className="h-10 w-16"
                  focusable="false"
                >
                  <path d="M2 16 Q 18 2 38 16 Q 18 30 2 16 Z" />
                  <path d="M38 16 L 56 6 L 50 16 L 56 26 Z" />
                  <circle cx="14" cy="14" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <h3
                id={`art-${a.id}-tittel`}
                className="text-sm font-semibold text-slate-100"
              >
                {a.norsk}
              </h3>
              <p className="mt-0.5 text-xs italic text-slate-400">{a.latin}</p>
              {a.minstemaal && (
                <p className="mt-2 text-xs text-slate-300">
                  Minstem&aring;l:{' '}
                  <span className="text-slate-100">{a.minstemaal}</span>
                </p>
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
