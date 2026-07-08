/** Én importert .docx-fil. `id` er sha256-hex av filbytene — identisk fil = identisk id. */
export interface DocRecord {
  id: string
  fileName: string
  byteSize: number
  /** dcterms:modified fra docProps/core.xml, eller null om docx-en mangler den */
  modifiedDocx: number | null
  /** File.lastModified fra dra-og-slipp (upålitelig etter OS-kopiering) */
  modifiedFile: number
  importedAt: number
  normalizedKey: string
  /** Første ~2000 tegn av teksten, for innholdssammenligning uten å laste fulltekst */
  textSample: string
  wordCount: number
}

/** Effektiv redigeringsdato: docx-intern vinner over filsystemets. */
export function modifiedAt(doc: Pick<DocRecord, 'modifiedDocx' | 'modifiedFile'>): number {
  return doc.modifiedDocx ?? doc.modifiedFile
}

export interface DocText {
  id: string
  text: string
  html: string
}

/** Et verk («bok på hylla») — utledet ved gruppering, aldri persistert. */
export interface Work {
  /** Stabil: laveste medlems-docId */
  id: string
  title: string
  /** Sortert nyeste først etter modifiedAt */
  versions: WorkVersion[]
}

export interface WorkVersion {
  doc: DocRecord
  /** Nesten identisk (ordantall + ≥98 % likhet) med en nyere versjon */
  probableDuplicate: boolean
}

/** Manuelle korrigeringer av grupperingen (UI kommer senere; motoren støtter dem nå). */
export interface WorkOverrides {
  /** Grupper av docId-er som skal tvinges sammen */
  merge: string[][]
  /** docId → tving til eget verk */
  split: Record<string, true>
  /** workId → egendefinert tittel */
  titles: Record<string, string>
}

export const EMPTY_OVERRIDES: WorkOverrides = { merge: [], split: {}, titles: {} }

export type ImportFileStatus =
  | { state: 'venter' }
  | { state: 'leses' }
  | { state: 'ferdig'; docId: string }
  | { state: 'duplikat'; avFileName: string }
  | { state: 'hoppet-over'; grunn: string }
  | { state: 'feil'; grunn: string }

export interface ImportProgress {
  fileName: string
  status: ImportFileStatus
}

export interface ImportSummary {
  imported: number
  duplicates: number
  skipped: number
  failed: number
  workCount: number
}
