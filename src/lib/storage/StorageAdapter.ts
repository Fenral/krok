import type { DocRecord, DocText, WorkOverrides } from '../../types'

// Sømmen mot fremtidig skylagring: implementer dette grensesnittet mot
// Supabase (Storage + Postgres) og bytt eksporten i ./index.ts — resten av
// appen er uvitende om hvor bøkene bor.
export interface StorageAdapter {
  init(): Promise<void>
  /** Persisterer metadata, originalbytes og ekstrahert tekst atomisk. */
  putDoc(meta: DocRecord, fileBytes: Blob, text: DocText): Promise<void>
  listDocMetas(): Promise<DocRecord[]>
  hasDoc(id: string): Promise<boolean>
  /** Lazy — originalfilen lastes kun ved nedlasting. */
  getDocBlob(id: string): Promise<Blob | undefined>
  /** Lazy — fulltekst lastes kun i leseren/søkeindeksering. */
  getDocText(id: string): Promise<DocText | undefined>
  deleteDoc(id: string): Promise<void>
  getWorkOverrides(): Promise<WorkOverrides>
  putWorkOverrides(overrides: WorkOverrides): Promise<void>
  getOathPassedAt(): Promise<number | null>
  setOathPassedAt(ts: number | null): Promise<void>
}
