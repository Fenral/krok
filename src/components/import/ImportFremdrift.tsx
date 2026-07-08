import { useEffect } from 'react'
import { useLibrary } from '../../lib/library'

export function ImportFremdrift() {
  const { importing, importEvents, lastSummary, dismissSummary } = useLibrary()

  // Oppsummeringen forsvinner av seg selv så den ikke blir liggende over footeren
  useEffect(() => {
    if (!lastSummary) return
    const t = setTimeout(dismissSummary, 8000)
    return () => clearTimeout(t)
  }, [lastSummary, dismissSummary])

  if (importing && importEvents.length) {
    const ferdig = importEvents.filter((e) => e.status.state !== 'venter' && e.status.state !== 'leses').length
    const aktiv = importEvents.find((e) => e.status.state === 'leses')
    return (
      <div className="fixed bottom-6 left-1/2 z-40 w-[min(92vw,420px)] -translate-x-1/2 rounded-md border border-lys/25 bg-natt-800/95 p-4 shadow-xl">
        <p className="font-tittel text-sm tracking-wide text-lys">
          Fjærpennen skriver … {ferdig}/{importEvents.length}
        </p>
        {aktiv && <p className="mt-1 truncate font-broedtekst text-xs italic text-pergament/60">{aktiv.fileName}</p>}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-natt-900">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lys-dim to-lys transition-[width] duration-300"
            style={{ width: `${(ferdig / importEvents.length) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  if (lastSummary) {
    const { imported, duplicates, skipped, failed, workCount } = lastSummary
    return (
      <div className="fixed bottom-6 left-1/2 z-40 w-[min(92vw,460px)] -translate-x-1/2 rounded-md border border-lys/25 bg-natt-800/95 p-4 shadow-xl">
        <p className="font-tittel text-sm text-lys">
          {imported} fil{imported === 1 ? '' : 'er'} importert
          {duplicates > 0 && `, ${duplicates} duplikat${duplicates === 1 ? '' : 'er'}`}
          {skipped > 0 && `, ${skipped} hoppet over`}
          {failed > 0 && `, ${failed} kunne ikke leses`}
          {` — ${workCount} verk på hylla`}
        </p>
        <button
          type="button"
          onClick={dismissSummary}
          className="mt-2 font-broedtekst text-xs italic text-pergament/50 underline decoration-dotted hover:text-pergament/80"
        >
          lukk
        </button>
      </div>
    )
  }

  return null
}
