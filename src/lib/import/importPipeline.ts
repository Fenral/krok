import { IMPORT_CONCURRENCY, TEXT_SAMPLE_LENGTH } from '../../config'
import type { DocRecord, ImportFileStatus } from '../../types'
import { normalizeFilename } from '../grouping/normalizeFilename'
import { sha256Hex } from '../hash'
import type { StorageAdapter } from '../storage/StorageAdapter'
import type { WorkerRequest, WorkerResponse } from './docx.worker'

export interface ImportEvent {
  fileIndex: number
  fileName: string
  status: ImportFileStatus
}

type ParseResult = Extract<WorkerResponse, { ok: true }>

// Én worker gjenbrukes for hele batchen; svar rutes på sekvensnummer.
class DocxWorkerClient {
  private worker: Worker
  private seq = 0
  private pending = new Map<number, { resolve: (r: ParseResult) => void; reject: (e: Error) => void }>()

  constructor() {
    this.worker = new Worker(new URL('./docx.worker.ts', import.meta.url), { type: 'module' })
    this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const p = this.pending.get(e.data.seq)
      if (!p) return
      this.pending.delete(e.data.seq)
      if (e.data.ok) p.resolve(e.data)
      else p.reject(new Error(e.data.error))
    }
  }

  parse(buffer: ArrayBuffer): Promise<ParseResult> {
    const seq = ++this.seq
    return new Promise((resolve, reject) => {
      this.pending.set(seq, { resolve, reject })
      const req: WorkerRequest = { seq, buffer }
      // Transferable: bufferen flyttes, detaches på main thread — hash er alt beregnet
      this.worker.postMessage(req, [buffer])
    })
  }

  terminate() {
    this.worker.terminate()
  }
}

export async function importFiles(
  files: File[],
  storage: StorageAdapter,
  onEvent: (e: ImportEvent) => void,
): Promise<void> {
  const worker = new DocxWorkerClient()
  // Ids under behandling i denne batchen: to byte-identiske filer kjørt
  // parallelt ville ellers begge passere hasDoc-sjekken
  const paagaaende = new Map<string, string>()
  try {
    let next = 0
    const runners = Array.from({ length: Math.min(IMPORT_CONCURRENCY, files.length) }, async () => {
      // Begrenset samtidighet: aldri mer enn ~3 filbuffere i minnet samtidig
      while (next < files.length) {
        const i = next++
        await importOne(files[i], i, storage, worker, paagaaende, onEvent)
      }
    })
    await Promise.all(runners)
  } finally {
    worker.terminate()
  }
}

async function importOne(
  file: File,
  fileIndex: number,
  storage: StorageAdapter,
  worker: DocxWorkerClient,
  paagaaende: Map<string, string>,
  onEvent: (e: ImportEvent) => void,
): Promise<void> {
  const emit = (status: ImportFileStatus) => onEvent({ fileIndex, fileName: file.name, status })

  if (!/\.docx$/i.test(file.name)) {
    emit({ state: 'hoppet-over', grunn: 'ikke en .docx-fil' })
    return
  }
  emit({ state: 'leses' })
  try {
    const modifiedFile = file.lastModified
    const buffer = await file.arrayBuffer()
    const id = await sha256Hex(buffer)

    const alleredeIBatch = paagaaende.get(id)
    if (alleredeIBatch !== undefined) {
      emit({ state: 'duplikat', avFileName: alleredeIBatch })
      return
    }
    paagaaende.set(id, file.name)

    if (await storage.hasDoc(id)) {
      const eksisterende = (await storage.listDocMetas()).find((m) => m.id === id)
      emit({ state: 'duplikat', avFileName: eksisterende?.fileName ?? file.name })
      return
    }

    const parsed = await worker.parse(buffer) // buffer er detached etter dette

    const meta: DocRecord = {
      id,
      fileName: file.name,
      byteSize: file.size,
      modifiedDocx: parsed.modifiedDocx,
      modifiedFile,
      importedAt: Date.now(),
      normalizedKey: normalizeFilename(file.name),
      textSample: parsed.text.slice(0, TEXT_SAMPLE_LENGTH),
      wordCount: parsed.wordCount,
    }
    // Originalbytes fra File-objektet (en File ER en Blob) — ikke den detachede bufferen
    await storage.putDoc(meta, file, { id, text: parsed.text, html: parsed.html })
    emit({ state: 'ferdig', docId: id })
  } catch (err) {
    emit({ state: 'feil', grunn: err instanceof Error ? err.message : 'ukjent feil' })
  }
}
