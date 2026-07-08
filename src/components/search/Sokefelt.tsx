import { useEffect, useMemo, useRef, useState } from 'react'
import { useLibrary } from '../../lib/library'
import type { SearchHit } from '../../lib/search/searchIndex'

interface Props {
  onAccio: (hit: SearchHit) => void
}

export function Sokefelt({ onAccio }: Props) {
  const { search, works } = useLibrary()
  const [query, setQuery] = useState('')
  const [apen, setApen] = useState(false)
  const boks = useRef<HTMLDivElement>(null)

  // works i avhengighetslista: indeksen bygges om etter import
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hits = useMemo(() => search(query), [query, search, works])

  useEffect(() => {
    const lukk = (e: PointerEvent) => {
      if (!boks.current?.contains(e.target as Node)) setApen(false)
    }
    window.addEventListener('pointerdown', lukk)
    return () => window.removeEventListener('pointerdown', lukk)
  }, [])

  const velg = (hit: SearchHit) => {
    setApen(false)
    setQuery('')
    onAccio(hit)
  }

  return (
    <div ref={boks} className="relative mx-auto w-full max-w-md">
      <div className="flex items-center gap-2 rounded-full border border-lys/30 bg-natt-800/80 px-4 py-2 shadow-[0_0_16px_rgba(232,182,76,0.12)] focus-within:border-lys/60">
        <span className="text-lys/70" aria-hidden>✦</span>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setApen(true)
          }}
          onFocus={() => setApen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && hits[0]) velg(hits[0])
          }}
          placeholder="Accio bok … søk i titler og tekst"
          aria-label="Søk i biblioteket"
          className="w-full bg-transparent font-broedtekst text-sm text-pergament outline-none placeholder:text-pergament/35"
        />
      </div>
      {apen && query.trim() && (
        <ul className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-md border border-lys/20 bg-natt-800/95 shadow-xl backdrop-blur">
          {hits.length === 0 && (
            <li className="px-4 py-3 font-broedtekst text-sm italic text-pergament/50">
              Ingen bok svarer på det kallet.
            </li>
          )}
          {hits.map((hit) => (
            <li key={hit.workId}>
              <button
                type="button"
                onClick={() => velg(hit)}
                className="block w-full px-4 py-2.5 text-left hover:bg-natt-700/80"
              >
                <span className="font-tittel text-sm text-lys">{hit.title}</span>
                {hit.snippet && (
                  <span className="mt-0.5 block truncate font-broedtekst text-xs italic text-pergament/55">
                    {hit.snippet}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
