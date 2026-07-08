import { describe, expect, it } from 'vitest'
import { normalizeFilename, prettyTitle } from '../src/lib/grouping/normalizeFilename'

describe('normalizeFilename', () => {
  const cases: [string, string][] = [
    ['Hekseboka.docx', 'hekseboka'],
    ['Hekseboka kopi.docx', 'hekseboka'],
    ['Hekseboka kopi (2).docx', 'hekseboka'],
    ['Hekseboka - Copy.docx', 'hekseboka'],
    ['hekseboka ENDELIG v3 12.03.2024.docx', 'hekseboka'],
    ['Hekseboka_v2.docx', 'hekseboka'],
    ['Hekseboka utkast 4.docx', 'hekseboka'],
    ['Hekseboka versjon 2 FERDIG.docx', 'hekseboka'],
    ['Hekseboka siste.docx', 'hekseboka'],
    ['Hekseboka NY.docx', 'hekseboka'],
    ['Hekseboka gammel backup.docx', 'hekseboka'],
    ['Hekseboka 2023-11-04.docx', 'hekseboka'],
    ['Hekseboka mars 2024.docx', 'hekseboka'],
    ['Hekseboka rev. 7.docx', 'hekseboka'],
    ['Hekseboka sikkerhetskopi.docx', 'hekseboka'],
    ['Dagbok fra Nordmarka.docx', 'dagbok fra nordmarka'],
    ['Notater (1).docx', 'notater'],
    // æøå skal overleve
    ['Bjørnen Sover ENDELIG.docx', 'bjørnen sover'],
    // .doc også
    ['Hekseboka.doc', 'hekseboka'],
  ]

  it.each(cases)('%s → %s', (input, expected) => {
    expect(normalizeFilename(input)).toBe(expected)
  })

  it('spiser ikke titler som bare er tall («1984»)', () => {
    expect(normalizeFilename('1984.docx')).toBe('1984')
    expect(normalizeFilename('1984 kopi.docx')).toBe('1984')
  })

  it('beholder hengende tall bare når resten blir for kort', () => {
    expect(normalizeFilename('Hekseboka 2.docx')).toBe('hekseboka')
    expect(normalizeFilename('Bok 2.docx')).toBe('bok')
  })

  it('skiller «del»-titler fra versjonsstøy', () => {
    expect(normalizeFilename('Hekseboka del to.docx')).toBe('hekseboka del to')
  })
})

describe('prettyTitle', () => {
  it('setter stor forbokstav per ord', () => {
    expect(prettyTitle('dagbok fra nordmarka')).toBe('Dagbok Fra Nordmarka')
    expect(prettyTitle('bjørnen sover')).toBe('Bjørnen Sover')
  })
})
