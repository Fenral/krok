import { useNavigate } from 'react-router-dom'
import { accioFly } from '../components/effects/accio'
import { ImportFremdrift } from '../components/import/ImportFremdrift'
import { SlippSone } from '../components/import/SlippSone'
import { Bokhylle } from '../components/shelf/Bokhylle'
import { Lys } from '../components/shelf/Lys'
import { Sokefelt } from '../components/search/Sokefelt'
import { useLibrary } from '../lib/library'
import type { SearchHit } from '../lib/search/searchIndex'
import type { Work } from '../types'

export function Bibliotek() {
  const { ready, works, resetOath } = useLibrary()
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
        <header className="relative z-10 px-6 pb-10 pt-12 text-center">
          <h1 className="font-tittel text-3xl tracking-[0.25em] text-lys drop-shadow-[0_0_12px_rgba(232,182,76,0.35)]">
            KROK-BIBLIOTEKET
          </h1>
          <p className="mt-2 font-broedtekst italic text-pergament/50">Dine manuskripter, trygt i mørket</p>
          <div className="mt-8">
            <Sokefelt onAccio={onAccio} />
          </div>
        </header>

        <section className="relative z-10 px-4">
          {!ready ? (
            <p className="text-center font-broedtekst italic text-pergament/50">Biblioteket vekkes …</p>
          ) : works.length === 0 ? (
            <div className="mx-auto max-w-md rounded-lg border border-dashed border-lys/25 px-8 py-14 text-center">
              <p className="font-tittel text-xl text-pergament/80">Hylla er tom.</p>
              <p className="mt-3 font-broedtekst italic text-pergament/50">
                Dra Word-dokumentene dine hit — slipp dem hvor som helst, så sorterer biblioteket dem i verk og
                versjoner.
              </p>
            </div>
          ) : (
            <Bokhylle works={works} onOpen={apne} />
          )}
        </section>

        <footer className="absolute bottom-4 left-0 right-0 z-10 text-center">
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
