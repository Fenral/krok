import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ImportSummary, Work } from '../types'
import { groupWorks } from './grouping/groupWorks'
import { importFiles, type ImportEvent } from './import/importPipeline'
import { SearchIndex, type SearchHit } from './search/searchIndex'
import { DEMO_ID_PREFIX, removeDemoLibrary, seedDemoLibrary } from './demo'
import { storage } from './storage'

interface LibraryState {
  ready: boolean
  works: Work[]
  oathPassed: boolean
  importing: boolean
  importEvents: ImportEvent[]
  lastSummary: ImportSummary | null
  passOath: () => Promise<void>
  resetOath: () => Promise<void>
  importDroppedFiles: (files: File[]) => Promise<void>
  search: (query: string) => SearchHit[]
  downloadVersion: (docId: string, fileName: string) => Promise<void>
  getVersionText: (docId: string) => Promise<{ text: string; html: string } | undefined>
  dismissSummary: () => void
  demoActive: boolean
  seedDemo: () => Promise<void>
  removeDemo: () => Promise<void>
}

const LibraryContext = createContext<LibraryState | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [works, setWorks] = useState<Work[]>([])
  const [oathPassed, setOathPassed] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importEvents, setImportEvents] = useState<ImportEvent[]>([])
  const [lastSummary, setLastSummary] = useState<ImportSummary | null>(null)
  const indexRef = useRef(new SearchIndex())

  const reload = useCallback(async (): Promise<Work[]> => {
    const [metas, overrides] = await Promise.all([storage.listDocMetas(), storage.getWorkOverrides()])
    const grouped = groupWorks(metas, overrides)
    setWorks(grouped)
    await indexRef.current.build(grouped, storage)
    return grouped
  }, [])

  useEffect(() => {
    let aktiv = true
    ;(async () => {
      await storage.init()
      const oath = await storage.getOathPassedAt()
      if (!aktiv) return
      setOathPassed(oath !== null)
      await reload()
      if (aktiv) setReady(true)
    })()
    return () => {
      aktiv = false
    }
  }, [reload])

  const passOath = useCallback(async () => {
    await storage.setOathPassedAt(Date.now())
    setOathPassed(true)
  }, [])

  const resetOath = useCallback(async () => {
    await storage.setOathPassedAt(null)
    setOathPassed(false)
  }, [])

  const importDroppedFiles = useCallback(
    async (files: File[]) => {
      if (!files.length || importing) return
      setImporting(true)
      setImportEvents(files.map((f, i) => ({ fileIndex: i, fileName: f.name, status: { state: 'venter' } })))
      const events = new Map<number, ImportEvent>()
      try {
        await importFiles(files, storage, (e) => {
          events.set(e.fileIndex, e)
          setImportEvents((prev) => prev.map((p) => (p.fileIndex === e.fileIndex ? e : p)))
        })
        // Be nettleseren verne lagringen mot eviction etter første ekte import
        void navigator.storage?.persist?.()
        const grouped = await reload()
        const alle = [...events.values()]
        setLastSummary({
          imported: alle.filter((e) => e.status.state === 'ferdig').length,
          duplicates: alle.filter((e) => e.status.state === 'duplikat').length,
          skipped: alle.filter((e) => e.status.state === 'hoppet-over').length,
          failed: alle.filter((e) => e.status.state === 'feil').length,
          workCount: grouped.length,
        })
      } finally {
        setImporting(false)
        setImportEvents([])
      }
    },
    [importing, reload],
  )

  const search = useCallback((query: string) => indexRef.current.search(query), [])

  const downloadVersion = useCallback(async (docId: string, fileName: string) => {
    const blob = await storage.getDocBlob(docId)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const getVersionText = useCallback(async (docId: string) => storage.getDocText(docId), [])

  const dismissSummary = useCallback(() => setLastSummary(null), [])

  const seedDemo = useCallback(async () => {
    await seedDemoLibrary(storage)
    await reload()
  }, [reload])

  const removeDemo = useCallback(async () => {
    await removeDemoLibrary(storage)
    await reload()
  }, [reload])

  const demoActive = works.some((w) => w.versions.some((v) => v.doc.id.startsWith(DEMO_ID_PREFIX)))

  const value = useMemo<LibraryState>(
    () => ({
      ready,
      works,
      oathPassed,
      importing,
      importEvents,
      lastSummary,
      passOath,
      resetOath,
      importDroppedFiles,
      search,
      downloadVersion,
      getVersionText,
      dismissSummary,
      demoActive,
      seedDemo,
      removeDemo,
    }),
    [
      ready,
      works,
      oathPassed,
      importing,
      importEvents,
      lastSummary,
      passOath,
      resetOath,
      importDroppedFiles,
      search,
      downloadVersion,
      getVersionText,
      dismissSummary,
      demoActive,
      seedDemo,
      removeDemo,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary(): LibraryState {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary må brukes innenfor LibraryProvider')
  return ctx
}
