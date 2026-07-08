import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { IndexedDbAdapter } from '../src/lib/storage/IndexedDbAdapter'
import type { DocRecord, DocText } from '../src/types'

function meta(id: string): DocRecord {
  return {
    id,
    fileName: `${id}.docx`,
    byteSize: 3,
    modifiedDocx: 1700000000000,
    modifiedFile: 1600000000000,
    importedAt: 1750000000000,
    normalizedKey: id,
    textSample: 'tekst',
    wordCount: 1,
  }
}

const text: DocText = { id: 'a', text: 'hei verden', html: '<p>hei verden</p>' }

describe('IndexedDbAdapter', () => {
  let adapter: IndexedDbAdapter

  beforeEach(async () => {
    adapter = new IndexedDbAdapter(`test-${Math.random()}`)
    await adapter.init()
  })

  it('lagrer og lister metadata', async () => {
    await adapter.putDoc(meta('a'), new Blob(['abc']), { ...text, id: 'a' })
    await adapter.putDoc(meta('b'), new Blob(['def']), { ...text, id: 'b' })
    const metas = await adapter.listDocMetas()
    expect(metas.map((m) => m.id).sort()).toEqual(['a', 'b'])
    expect(await adapter.hasDoc('a')).toBe(true)
    expect(await adapter.hasDoc('x')).toBe(false)
  })

  it('henter originalblob og tekst lazy', async () => {
    await adapter.putDoc(meta('a'), new Blob(['abc']), { ...text, id: 'a' })
    const blob = await adapter.getDocBlob('a')
    // fake-indexeddb + jsdom klarer ikke klone Blob-innhold trofast;
    // byte-identisk rundtur verifiseres i nettleser-E2E i stedet
    expect(blob).toBeDefined()
    const t = await adapter.getDocText('a')
    expect(t!.text).toBe('hei verden')
  })

  it('sletter alle tre stores for et dokument', async () => {
    await adapter.putDoc(meta('a'), new Blob(['abc']), { ...text, id: 'a' })
    await adapter.deleteDoc('a')
    expect(await adapter.hasDoc('a')).toBe(false)
    expect(await adapter.getDocBlob('a')).toBeUndefined()
    expect(await adapter.getDocText('a')).toBeUndefined()
  })

  it('overrides rundtur med tom default', async () => {
    expect(await adapter.getWorkOverrides()).toEqual({ merge: [], split: {}, titles: {} })
    const o = { merge: [['a', 'b']], split: { c: true as const }, titles: { a: 'Tittel' } }
    await adapter.putWorkOverrides(o)
    expect(await adapter.getWorkOverrides()).toEqual(o)
  })

  it('oathPassedAt kan settes og nullstilles', async () => {
    expect(await adapter.getOathPassedAt()).toBeNull()
    await adapter.setOathPassedAt(123)
    expect(await adapter.getOathPassedAt()).toBe(123)
    await adapter.setOathPassedAt(null)
    expect(await adapter.getOathPassedAt()).toBeNull()
  })
})
