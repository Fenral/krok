import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OATH_PHRASE } from '../config'
import { useLibrary } from '../lib/library'

function normaliserEd(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!«»"'’]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function Inngang() {
  const { ready, oathPassed, passOath } = useLibrary()
  const navigate = useNavigate()
  const [tekst, setTekst] = useState('')
  const [feil, setFeil] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  // Var eden alt avlagt da siden lastet? Da er dette et gjenbesøk → rett til hylla,
  // uten å tvinge den cinematiske inngangen hver gang.
  const startTilstand = useRef<boolean | null>(null)

  useEffect(() => {
    if (!ready) return
    if (startTilstand.current === null) startTilstand.current = oathPassed
    if (startTilstand.current === true) navigate('/bibliotek', { replace: true })
  }, [ready, oathPassed, navigate])

  const provEden = async (kandidat: string) => {
    if (normaliserEd(kandidat) === normaliserEd(OATH_PHRASE)) {
      await passOath()
      navigate('/portal') // fersk ed → den cinematiske døråpningen
    } else {
      setFeil(true)
      setTimeout(() => setFeil(false), 1800)
    }
  }

  return (
    <main className="pergament-flate flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl text-center">
        <h1 className="font-tittel text-2xl tracking-[0.2em] text-pergament-blekk/80">
          {ready ? 'Dette pergamentet er tomt.' : '…'}
        </h1>
        <p className="mt-3 font-broedtekst italic text-pergament-blekk/60">
          Hvis du vil inn, må du avlegge eden.
        </p>
        <form
          className="mt-10"
          onSubmit={(e) => {
            e.preventDefault()
            void provEden(tekst)
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            placeholder="Skriv eden her …"
            autoFocus
            aria-label="Skriv eden"
            className={`w-full border-b-2 bg-transparent pb-2 text-center font-tittel text-xl text-pergament-blekk outline-none transition-colors placeholder:text-pergament-blekk/30 ${
              feil ? 'skjelv border-red-900/60' : 'border-pergament-blekk/40 focus:border-pergament-blekk'
            }`}
          />
          {feil && (
            <p className="mt-3 font-broedtekst text-sm italic text-red-900/70" role="alert">
              Pergamentet forblir tomt. Det var visst ikke helt riktig …
            </p>
          )}
          <button
            type="submit"
            className="mt-8 rounded-full border border-pergament-blekk/50 bg-pergament-dyp/40 px-8 py-3 font-tittel text-lg tracking-wide text-pergament-blekk transition-colors hover:bg-pergament-dyp/70 active:bg-pergament-dyp"
          >
            Avlegg eden
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setTekst(OATH_PHRASE)
            inputRef.current?.focus()
          }}
          className="mt-8 font-broedtekst text-sm italic text-pergament-blekk/40 underline decoration-dotted hover:text-pergament-blekk/70"
        >
          hvisk eden til meg
        </button>
      </div>
    </main>
  )
}
