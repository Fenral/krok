import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { DocRecord, DocText, WorkOverrides } from '../../types'
import { EMPTY_OVERRIDES } from '../../types'
import type { StorageAdapter } from './StorageAdapter'

// Fire stores slik at hyllevisningen aldri laster megabyte-blobs:
// metadata er små records, originalbytes og fulltekst hentes lazy per bok.
interface KrokDB extends DBSchema {
  docMeta: { key: string; value: DocRecord }
  docBlob: { key: string; value: { id: string; blob: Blob } }
  docText: { key: string; value: DocText }
  meta: { key: string; value: { k: string; v: unknown } }
}

export class IndexedDbAdapter implements StorageAdapter {
  private db!: IDBPDatabase<KrokDB>

  constructor(private dbName = 'krok-bibliotek') {}

  async init(): Promise<void> {
    this.db = await openDB<KrokDB>(this.dbName, 1, {
      upgrade(db) {
        db.createObjectStore('docMeta', { keyPath: 'id' })
        db.createObjectStore('docBlob', { keyPath: 'id' })
        db.createObjectStore('docText', { keyPath: 'id' })
        db.createObjectStore('meta', { keyPath: 'k' })
      },
    })
  }

  async putDoc(meta: DocRecord, fileBytes: Blob, text: DocText): Promise<void> {
    const tx = this.db.transaction(['docMeta', 'docBlob', 'docText'], 'readwrite')
    await Promise.all([
      tx.objectStore('docMeta').put(meta),
      tx.objectStore('docBlob').put({ id: meta.id, blob: fileBytes }),
      tx.objectStore('docText').put(text),
      tx.done,
    ])
  }

  async listDocMetas(): Promise<DocRecord[]> {
    return this.db.getAll('docMeta')
  }

  async hasDoc(id: string): Promise<boolean> {
    return (await this.db.getKey('docMeta', id)) !== undefined
  }

  async getDocBlob(id: string): Promise<Blob | undefined> {
    return (await this.db.get('docBlob', id))?.blob
  }

  async getDocText(id: string): Promise<DocText | undefined> {
    return this.db.get('docText', id)
  }

  async deleteDoc(id: string): Promise<void> {
    const tx = this.db.transaction(['docMeta', 'docBlob', 'docText'], 'readwrite')
    await Promise.all([
      tx.objectStore('docMeta').delete(id),
      tx.objectStore('docBlob').delete(id),
      tx.objectStore('docText').delete(id),
      tx.done,
    ])
  }

  async getWorkOverrides(): Promise<WorkOverrides> {
    const rec = await this.db.get('meta', 'overrides')
    return (rec?.v as WorkOverrides) ?? EMPTY_OVERRIDES
  }

  async putWorkOverrides(overrides: WorkOverrides): Promise<void> {
    await this.db.put('meta', { k: 'overrides', v: overrides })
  }

  async getOathPassedAt(): Promise<number | null> {
    const rec = await this.db.get('meta', 'oathPassedAt')
    return (rec?.v as number) ?? null
  }

  async setOathPassedAt(ts: number | null): Promise<void> {
    if (ts === null) await this.db.delete('meta', 'oathPassedAt')
    else await this.db.put('meta', { k: 'oathPassedAt', v: ts })
  }
}
