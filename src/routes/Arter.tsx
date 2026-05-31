import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ArtSilhouette from '../components/ArtSilhouette'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { arter, type Art, type HabitatFilter } from '../lib/arter'

const filters: { value: HabitatFilter; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  { value: 'saltvann', label: 'Saltvann' },
  { value: 'ferskvann', label: 'Ferskvann' },
]

const saltvannTotal = arter.filter((a) => a.habitat === 'saltvann').length
const ferskvannTotal = arter.filter((a) => a.habitat === 'ferskvann').length

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

  function antall(value: HabitatFilter) {
    if (value === 'alle') return arter.length
    if (value === 'saltvann') return saltvannTotal
    return ferskvannTotal
  }

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
              placeholder="f.eks. &oslash;rret, makrell, salmo trutta"
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            />
          </div>
          <div role="group" aria-labelledby="habitat-label" className="shrink-0">
            <span
              id="habitat-label"
              className="mb-1 block text-sm font-medium text-slate-100"
            >
              Habitat
            </span>
            <div className="inline-flex rounded-md border border-slate-700 bg-slate-900/60 p-1">
              {filters.map((f) => {
                const isActive = habitat === f.value
                return (
                  <button
                    key={f.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setHabitat(f.value)}
                    className={[
                      'rounded px-3 py-1.5 text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                      isActive
                        ? 'bg-slate-800 text-sky-300 ring-1 ring-inset ring-sky-400/40'
                        : 'text-slate-300 hover:text-slate-100',
                    ].join(' ')}
                  >
                    {f.label}{' '}
                    <span className="text-slate-400">{antall(f.value)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </form>
      </section>

      <div role="status" aria-live="polite" className="sr-only">
        {filtrert.length} arter vist
      </div>

      <section aria-labelledby="resultater-tittel">
        <div className="mb-4 flex items-end gap-3">
          <h2
            id="resultater-tittel"
            className="text-xl font-semibold tracking-tight text-slate-100"
          >
            <span className="mr-3 inline-block h-5 w-1 align-[-2px] rounded bg-sky-400/70" />
            Resultater
          </h2>
          <p className="pb-0.5 text-sm text-slate-400">
            {filtrert.length} {filtrert.length === 1 ? 'art' : 'arter'}
          </p>
        </div>

        {filtrert.length > 0 ? (
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
          >
            {filtrert.map((a) => (
              <li key={a.id}>
                <ArtKort art={a} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-6 text-center text-sm text-slate-300">
            Fant ingen arter som matcher s&oslash;ket.
          </p>
        )}
      </section>
    </div>
  )
}

type ArtKortProps = { art: Art }

/**
 * Flatt art-kort — én beholder per art (ingen card-in-card).
 * Silhuett-bildet ER selve "kortet"; tekst sitter direkte under på samme bg-slate-950.
 * Habitat-token gir tone-on-tone aksent (sky vs emerald) for visuell rytme i grid.
 */
function ArtKort({ art }: ArtKortProps) {
  const habitatTone =
    art.habitat === 'saltvann'
      ? 'from-sky-500/15 to-slate-900 text-sky-200/80'
      : 'from-emerald-500/12 to-slate-900 text-emerald-200/80'
  const habitatChipTone =
    art.habitat === 'saltvann'
      ? 'bg-sky-500/15 text-sky-200 ring-sky-400/30'
      : 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/30'

  return (
    <article aria-labelledby={`art-${art.id}-tittel`} className="group">
      <div
        className={[
          'relative overflow-hidden rounded-lg bg-gradient-to-br',
          habitatTone,
        ].join(' ')}
      >
        <span
          className={[
            'absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1',
            habitatChipTone,
          ].join(' ')}
        >
          {art.habitat === 'saltvann' ? 'Salt' : 'Fersk'}
        </span>
        <ArtSilhouette
          shape={art.shape}
          className="mx-auto block h-20 w-full max-w-[140px] py-3"
        />
      </div>

      <h3
        id={`art-${art.id}-tittel`}
        className="mt-3 text-sm font-semibold text-slate-100"
      >
        {art.norsk}
      </h3>
      <p className="mt-0.5 text-xs italic text-slate-400">{art.latin}</p>

      <dl className="mt-2 space-y-1 text-xs text-slate-300">
        <div className="flex gap-1">
          <dt className="text-slate-400">Minstem&aring;l:</dt>
          <dd
            className={
              art.minstemaalKind === 'ingen'
                ? 'text-slate-400'
                : 'text-slate-100'
            }
          >
            {art.minstemaal}
            {art.minstemaalKind === 'varierer' && (
              <span className="ml-1 text-slate-400">&middot; varierer per fylke</span>
            )}
          </dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-slate-400">Fredet:</dt>
          <dd
            className={art.fredning ? 'text-slate-100' : 'text-slate-400'}
          >
            {art.fredning ?? 'Ingen nasjonal fredning'}
          </dd>
        </div>
      </dl>
    </article>
  )
}
