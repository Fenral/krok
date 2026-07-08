import { useNavigate } from 'react-router-dom'
import { accioFly } from '../components/effects/accio'
import { ImportFremdrift } from '../components/import/ImportFremdrift'
import { SlippSone } from '../components/import/SlippSone'
import { VelgFiler } from '../components/import/VelgFiler'
import { Bokhylle } from '../components/shelf/Bokhylle'
import { Lys } from '../components/shelf/Lys'
import { Sokefelt } from '../components/search/Sokefelt'
import { useLibrary } from '../lib/library'
import type { SearchHit } from '../lib/search/searchIndex'
import type { Work } from '../types'

export function Bibliotek() {
  const { ready, works, resetOath, seedDemo, removeDemo, demoActive } = useLibrary()
  const navigate = useNavigate()

  const apne = (work: Work, spineEl: HTMLElement | null) => {
    accioFly(spineEl, () => navigate(`/bok/${work.id}`))
  }

  const onAccio = (hit: SearchHit) => {
    const spine = document.querySelector<HTMLElement>(`[data-work-id="${hit.workId}"]`)
    accioFly(spine, () => navigate(`/bok/${hit.workId}`))
  }

  return (
    <SlippSone>
      <main className="relative min-h-screen overflow-hidden pb-24">
        <Lys />
        {/* z-20 over hylla, ellers legger bokseksjonen seg over søkeresultatene */}
        <header className="relative z-20 px-6 pb-10 pt-12 text-center">
          <h1 className="font-tittel text-3xl tracking-[0.25em] text-lys drop-shadow-[0_0_12px_rgba(232,182,76,0.35)]">
            KROK-BIBLIOTEKET
          </h1>
          <p className="mt-2 font-broedtekst italic text-pergament/50">Dine manuskripter, trygt i mørket</p>
          <div className="mt-8">
            <Sokefelt onAccio={onAccio} />
          </div>
          {ready && works.length > 0 && (
            <VelgFiler className="mt-4 rounded-full border border-lys/30 bg-natt-800/60 px-5 py-1.5 font-broedtekst text-sm text-lys/90 transition-colors hover:bg-natt-700/70 disabled:opacity-50">
              ＋ Legg til bøker
            </VelgFiler>
          )}
        </header>

        <section className="relative z-10 px-4">
          {!ready ? (
            <p className="text-center font-broedtekst italic text-pergament/50">Biblioteket vekkes …</p>
          ) : works.length === 0 ? (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-lys/25 px-8 py-14 text-center">
              <p className="font-tittel text-xl text-pergament/80">Hylla er tom.</p>
              <p className="mt-3 font-broedtekst italic text-pergament/50">
                Dra Word-dokumentene dine hit, eller trykk under for å velge dem — så sorterer biblioteket dem i verk
                og versjoner.
              </p>
              <VelgFiler className="mt-6 rounded-full border border-lys/40 bg-natt-800/70 px-7 py-2.5 font-tittel tracking-wide text-lys transition-colors hover:bg-natt-700/80 disabled:opacity-50">
                Velg Word-filer
              </VelgFiler>
              <p className="mt-6 font-broedtekst text-sm text-pergament/40">Bare vil se hvordan det ser ut?</p>
              <button
                type="button"
                onClick={() => void seedDemo()}
                className="mt-2 font-broedtekst text-sm italic text-lys/70 underline decoration-dotted hover:text-lys"
              >
                Vis 10 demobøker
              </button>
            </div>
          ) : (
            <Bokhylle works={works} onOpen={apne} />
          )}
        </section>

        <footer className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-4 text-center">
          {demoActive && (
            <button
              type="button"
              onClick={() => void removeDemo()}
              className="font-broedtekst text-xs italic text-pergament/30 underline decoration-dotted hover:text-pergament/60"
            >
              Fjern demobøker
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              void resetOath().then(() => navigate('/'))
            }}
            className="font-broedtekst text-xs italic text-pergament/30 underline decoration-dotted hover:text-pergament/60"
          >
            Ugagn utført
          </button>
        </footer>

        <ImportFremdrift />
      </main>
    </SlippSone>
  )
}
