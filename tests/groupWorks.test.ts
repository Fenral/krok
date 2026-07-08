import { describe, expect, it } from 'vitest'
import { groupWorks } from '../src/lib/grouping/groupWorks'
import { normalizeFilename } from '../src/lib/grouping/normalizeFilename'
import type { DocRecord } from '../src/types'

let teller = 0
function doc(fileName: string, opts: Partial<DocRecord> = {}): DocRecord {
  teller++
  return {
    id: opts.id ?? `id-${String(teller).padStart(3, '0')}`,
    fileName,
    byteSize: 1000,
    modifiedDocx: opts.modifiedDocx ?? Date.UTC(2024, 0, teller),
    modifiedFile: opts.modifiedFile ?? Date.UTC(2023, 0, 1),
    importedAt: 0,
    normalizedKey: normalizeFilename(fileName),
    textSample: opts.textSample ?? `unik tekst for ${fileName} ${teller} `.repeat(20),
    wordCount: opts.wordCount ?? 5000 + teller,
    ...opts,
  }
}

const HEKSETEKST =
  'Det var en mørk og stormfull natt da Vilde først oppdaget boken i bestemorens loftskiste. ' +
  'Støvet lå tykt over permen og de gylne bokstavene var nesten slitt bort. '.repeat(5)

describe('groupWorks', () => {
  it('grupperer varianter av samme filnavn til ett verk', () => {
    const works = groupWorks([
      doc('Hekseboka.docx', { textSample: HEKSETEKST }),
      doc('Hekseboka kopi (2).docx', { textSample: HEKSETEKST }),
      doc('hekseboka ENDELIG v3 12.03.2024.docx', { textSample: HEKSETEKST + 'nytt avsnitt' }),
      doc('Dagbok fra Nordmarka.docx'),
    ])
    expect(works).toHaveLength(2)
    const heks = works.find((w) => w.title.toLowerCase().includes('hekseboka'))!
    expect(heks.versions).toHaveLength(3)
  })

  it('sorterer versjoner nyeste først etter docx-intern dato', () => {
    const gammel = doc('Hekseboka v1.docx', { modifiedDocx: Date.UTC(2022, 5, 1), textSample: HEKSETEKST })
    const nyest = doc('Hekseboka endelig.docx', { modifiedDocx: Date.UTC(2024, 5, 1), textSample: HEKSETEKST })
    const midt = doc('Hekseboka v2.docx', { modifiedDocx: Date.UTC(2023, 5, 1), textSample: HEKSETEKST })
    const [work] = groupWorks([gammel, nyest, midt])
    expect(work.versions.map((v) => v.doc.id)).toEqual([nyest.id, midt.id, gammel.id])
  })

  it('faller tilbake på File.lastModified når docx-dato mangler', () => {
    const utenCore = doc('Hekseboka.docx', {
      modifiedDocx: null,
      modifiedFile: Date.UTC(2025, 0, 1),
      textSample: HEKSETEKST,
    })
    const medCore = doc('Hekseboka v2.docx', { modifiedDocx: Date.UTC(2024, 0, 1), textSample: HEKSETEKST })
    const [work] = groupWorks([utenCore, medCore])
    expect(work.versions[0].doc.id).toBe(utenCore.id)
  })

  it('slår sammen samme bok lagret under helt ulikt filnavn (innholdspass)', () => {
    const works = groupWorks([
      doc('Roman uten navn.docx', { textSample: HEKSETEKST }),
      doc('Hekseboka gammel.docx', { textSample: HEKSETEKST.replace('mørk', 'kald') }),
    ])
    expect(works).toHaveLength(1)
  })

  it('holder ulike bøker fra hverandre selv med korte navn', () => {
    const works = groupWorks([doc('Dagbok.docx'), doc('Notater.docx')])
    expect(works).toHaveLength(2)
  })

  it('flagger trolig duplikat (likt ordantall + nesten identisk tekst)', () => {
    const a = doc('Hekseboka.docx', { textSample: HEKSETEKST, wordCount: 5000, modifiedDocx: Date.UTC(2024, 1, 1) })
    const b = doc('Hekseboka kopi.docx', { textSample: HEKSETEKST, wordCount: 5000, modifiedDocx: Date.UTC(2023, 1, 1) })
    const [work] = groupWorks([a, b])
    expect(work.versions[0].probableDuplicate).toBe(false)
    expect(work.versions[1].probableDuplicate).toBe(true)
  })

  it('verk-id er stabil (laveste medlems-id) når nye versjoner kommer til', () => {
    const a = doc('Hekseboka.docx', { id: 'bbb', textSample: HEKSETEKST })
    const [foer] = groupWorks([a])
    const b = doc('Hekseboka v2.docx', { id: 'ccc', textSample: HEKSETEKST })
    const [etter] = groupWorks([a, b])
    expect(foer.id).toBe('bbb')
    expect(etter.id).toBe('bbb')
  })

  it('respekterer tvungen sammenslåing og splitt (overrides)', () => {
    const a = doc('Alfa.docx', { id: 'a1' })
    const b = doc('Beta.docx', { id: 'b1' })
    const merged = groupWorks([a, b], { merge: [['a1', 'b1']], split: {}, titles: {} })
    expect(merged).toHaveLength(1)

    const c = doc('Hekseboka.docx', { id: 'c1', textSample: HEKSETEKST })
    const d = doc('Hekseboka kopi.docx', { id: 'd1', textSample: HEKSETEKST })
    const split = groupWorks([c, d], { merge: [], split: { d1: true }, titles: {} })
    expect(split).toHaveLength(2)
  })

  it('bruker egendefinert tittel fra overrides', () => {
    const a = doc('gammel fil.docx', { id: 'x1' })
    const [work] = groupWorks([a], { merge: [], split: {}, titles: { x1: 'Mesterverket' } })
    expect(work.title).toBe('Mesterverket')
  })

  it('verkene sorteres nyeste først på hylla', () => {
    const gammel = doc('Dagbok.docx', { modifiedDocx: Date.UTC(2020, 0, 1) })
    const ny = doc('Notater.docx', { modifiedDocx: Date.UTC(2025, 0, 1) })
    const works = groupWorks([gammel, ny])
    expect(works[0].versions[0].doc.id).toBe(ny.id)
  })
})
