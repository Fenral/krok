import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useLibrary } from '../../lib/library'

// Hele biblioteksskjermen er slippsone: dra .docx-filer hvor som helst.
export function SlippSone({ children }: { children: ReactNode }) {
  const { importDroppedFiles, importing } = useLibrary()
  const [drar, setDrar] = useState(false)

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDrar(false)
      const filer = [...(e.dataTransfer?.files ?? [])]
      if (filer.length) void importDroppedFiles(filer)
    },
    [importDroppedFiles],
  )

  useEffect(() => {
    let dybde = 0
    const onDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dybde++
      setDrar(true)
    }
    const onDragOver = (e: DragEvent) => e.preventDefault()
    const onDragLeave = () => {
      dybde = Math.max(0, dybde - 1)
      if (dybde === 0) setDrar(false)
    }
    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [onDrop])

  return (
    <div className="relative min-h-screen">
      {children}
      {drar && !importing && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-natt-900/80 backdrop-blur-[2px]">
          <div className="rounded-lg border-2 border-dashed border-lys/70 bg-natt-800/90 px-12 py-10 text-center shadow-[0_0_40px_rgba(232,182,76,0.25)]">
            <p className="font-tittel text-2xl text-lys">Slipp manuskriptene</p>
            <p className="mt-2 font-broedtekst italic text-pergament/70">Biblioteket sorterer dem for deg</p>
          </div>
        </div>
      )}
    </div>
  )
}
