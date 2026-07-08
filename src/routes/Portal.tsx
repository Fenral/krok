import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { particles } from '../components/effects/particles'
import { useLibrary } from '../lib/library'

// Den cinematiske inngangen: du står foran biblioteket i mørke. Etter hvert som
// du scroller (eller trykker «Åpne dørene») tennes lysene og de store dørene
// glir opp — så slippes du inn på hylla. Bildene (public/portal/frame-1..5.png)
// genereres av Nano Banana Pro via scripts/generate-portal.mjs.

const FRAMES = ['frame-1', 'frame-2', 'frame-3', 'frame-4', 'frame-5'].map((f) => `/portal/${f}.webp`)
const SCROLL_HOYDER = 4 // hvor mange skjermhøyder scroll-sporet er (styrer tempoet)

// Opasitet for én frame gitt samlet fremdrift p ∈ [0,1]. Frames sitter jevnt
// fordelt på 0, .25, .5, .75, 1 og krysstoner inn/ut rundt sitt punkt.
function frameOpacity(index: number, p: number, antall: number): number {
  const senter = index / (antall - 1)
  const seg = 1 / (antall - 1)
  const avstand = Math.abs(p - senter)
  if (index === 0 && p <= senter) return 1
  if (index === antall - 1 && p >= senter) return 1
  return Math.max(0, 1 - avstand / seg)
}

export function Portal() {
  const navigate = useNavigate()
  const { ready, oathPassed } = useLibrary()
  const [p, setP] = useState(0)
  const [redusert] = useState(() => particles.reducedMotion)
  const gaattInn = useRef(false)
  const sisteEmber = useRef(0)

  // Uten avlagt ed hører man ikke hjemme her
  useEffect(() => {
    if (ready && !oathPassed) navigate('/', { replace: true })
  }, [ready, oathPassed, navigate])

  const gaaInn = useCallback(() => {
    if (gaattInn.current) return
    gaattInn.current = true
    navigate('/bibliotek')
  }, [navigate])

  // Scroll driver fremdriften
  useEffect(() => {
    if (redusert) return
    const track = document.documentElement
    const oppdater = () => {
      const maks = track.scrollHeight - window.innerHeight
      const ny = maks > 0 ? Math.min(1, Math.max(0, window.scrollY / maks)) : 0
      setP(ny)
    }
    oppdater()
    window.addEventListener('scroll', oppdater, { passive: true })
    return () => window.removeEventListener('scroll', oppdater)
  }, [redusert])

  // Partikler + terskel-effekter når lyset kommer og døren åpner seg
  useEffect(() => {
    if (redusert) return
    const w = window.innerWidth
    const h = window.innerHeight
    // dryss glør fra dørsprekken når det er lyst nok
    const naa = performance.now()
    if (p > 0.45 && naa - sisteEmber.current > 120) {
      sisteEmber.current = naa
      particles.emit('ember', w / 2 + (Math.random() - 0.5) * 60, h * 0.55, 1)
      if (p > 0.7) particles.emit('trail', w / 2, h * 0.5, 2)
    }
    // gå inn når dørene står helt åpne
    if (p >= 0.985) gaaInn()
  }, [p, redusert, gaaInn])

  const aapneDorene = () => {
    if (redusert) {
      gaaInn()
      return
    }
    // Myk auto-scroll til bunnen — driver samme fremdrift som manuell scroll
    const maks = document.documentElement.scrollHeight - window.innerHeight
    const start = window.scrollY
    const t0 = performance.now()
    const varighet = 4200
    const steg = (t: number) => {
      const k = Math.min(1, (t - t0) / varighet)
      const ease = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2 // easeInOutQuad
      window.scrollTo(0, start + (maks - start) * ease)
      if (k < 1) requestAnimationFrame(steg)
    }
    requestAnimationFrame(steg)
  }

  // Kamera skyver sakte innover mot døren
  const skala = 1 + p * 0.14
  const bloom = Math.max(0, (p - 0.4) / 0.6)

  if (redusert) {
    // Rolig variant: siste bilde + en enkel inngangsknapp, ingen animasjon
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-natt-900">
        <img src={FRAMES[4]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" aria-hidden />
        <button
          type="button"
          onClick={gaaInn}
          className="relative z-10 rounded-full border border-lys/50 bg-natt-900/70 px-8 py-3 font-tittel text-lg tracking-wide text-lys backdrop-blur hover:bg-natt-800/80"
        >
          Gå inn i biblioteket
        </button>
      </main>
    )
  }

  return (
    <div style={{ height: `${SCROLL_HOYDER * 100}vh` }} className="relative bg-natt-900">
      {/* fast «kameravindu» mens man scroller gjennom sporet */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* mørk bunn så det aldri blir hvitt før bildene er lastet */}
        <div className="absolute inset-0 bg-natt-900" />
        <div className="absolute inset-0 origin-center transition-transform" style={{ transform: `scale(${skala})` }}>
          {FRAMES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden
              loading="eager"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: frameOpacity(i, p, FRAMES.length) }}
            />
          ))}
        </div>

        {/* varmt lysgløs som vokser når dørene åpner seg */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: bloom,
            background: 'radial-gradient(circle at 50% 52%, rgba(255,217,138,0.55), rgba(232,182,76,0.12) 35%, transparent 65%)',
            mixBlendMode: 'screen',
          }}
        />

        {/* tekst + knapp, toner ut etter hvert som man går inn */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 pb-16 text-center"
          style={{ opacity: Math.max(0, 1 - p * 2.2) }}
        >
          <p className="font-tittel text-xl tracking-[0.25em] text-lys drop-shadow-[0_0_12px_rgba(0,0,0,0.8)]">
            Biblioteket ligger mørkt og venter
          </p>
          <p className="font-broedtekst text-sm italic text-pergament/70 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
            Scroll for å tenne lysene — eller be dørene åpne seg
          </p>
          <button
            type="button"
            onClick={aapneDorene}
            className="rounded-full border border-lys/50 bg-natt-900/50 px-8 py-3 font-tittel text-lg tracking-wide text-lys backdrop-blur transition-colors hover:bg-natt-800/70"
          >
            Åpne dørene
          </button>
        </div>

        {/* liten scroll-hint som forsvinner straks man begynner */}
        <div
          className="pointer-events-none absolute inset-x-0 top-8 flex justify-center"
          style={{ opacity: Math.max(0, 1 - p * 6) }}
        >
          <span className="animate-bounce font-broedtekst text-2xl text-lys/60" aria-hidden>
            ⌄
          </span>
        </div>
      </div>
    </div>
  )
}
