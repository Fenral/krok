import { useRef, type ReactNode } from 'react'
import { useLibrary } from '../../lib/library'

// Trykk-for-å-velge-filer: mobilvennlig alternativ til dra-og-slipp.
export function VelgFiler({ className, children }: { className?: string; children?: ReactNode }) {
  const { importDroppedFiles, importing } = useLibrary()
  const ref = useRef<HTMLInputElement>(null)

  return (
    <>
      <button type="button" disabled={importing} onClick={() => ref.current?.click()} className={className}>
        {children ?? 'Velg filer'}
      </button>
      <input
        ref={ref}
        type="file"
        accept=".docx"
        multiple
        hidden
        onChange={(e) => {
          const filer = [...(e.target.files ?? [])]
          if (filer.length) void importDroppedFiles(filer)
          e.target.value = '' // så samme fil kan velges igjen senere
        }}
      />
    </>
  )
}
