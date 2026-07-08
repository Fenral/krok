import { describe, expect, it } from 'vitest'
import { contentSimilarity, isPrefixExtension, keySimilarity } from '../src/lib/grouping/similarity'

describe('keySimilarity', () => {
  it('identiske nøkler gir 1', () => {
    expect(keySimilarity('hekseboka', 'hekseboka')).toBe(1)
  })
  it('én skrivefeil i et langt navn er fortsatt likt', () => {
    expect(keySimilarity('dagbok fra nordmarka', 'dagbok fra nordmarka')).toBe(1)
    expect(keySimilarity('dagbok fra nordmarka', 'dagbok fra nordmark')).toBeGreaterThan(0.9)
  })
  it('ulike titler er ulike', () => {
    expect(keySimilarity('hekseboka', 'dagbok fra nordmarka')).toBeLessThan(0.5)
  })
  it('tomme strenger', () => {
    expect(keySimilarity('', 'hekseboka')).toBe(0)
  })
})

describe('isPrefixExtension', () => {
  it('kort nøkkel som starter lang nøkkel', () => {
    expect(isPrefixExtension('hekseboka', 'hekseboka kapittel en')).toBe(true)
    expect(isPrefixExtension('hekseboka kapittel en', 'hekseboka')).toBe(true)
  })
  it('krever minst 5 tegn felles', () => {
    expect(isPrefixExtension('bok', 'bok to')).toBe(false)
  })
  it('ikke-prefiks', () => {
    expect(isPrefixExtension('dagbok', 'hekseboka')).toBe(false)
  })
})

describe('contentSimilarity', () => {
  const kap1 =
    'Det var en mørk og stormfull natt da Vilde først oppdaget boken i bestemorens loftskiste. ' +
    'Støvet lå tykt over permen, og de gylne bokstavene var nesten slitt bort.'
  it('identisk tekst gir 1', () => {
    expect(contentSimilarity(kap1, kap1)).toBe(1)
  })
  it('lett redigert tekst er fortsatt svært lik', () => {
    const redigert = kap1.replace('mørk og stormfull', 'kald og stille')
    expect(contentSimilarity(kap1, redigert)).toBeGreaterThan(0.6)
  })
  it('helt ulik tekst er ulik', () => {
    const annen =
      'Rapporten oppsummerer kvartalets fangststatistikk for indre Oslofjord, med vekt på torsk og sjøørret.'
    expect(contentSimilarity(kap1, annen)).toBeLessThan(0.2)
  })
  it('normaliserer whitespace og casing', () => {
    expect(contentSimilarity('Det  Var En\n\nNatt', 'det var en natt')).toBe(1)
  })
  it('tom tekst gir 0', () => {
    expect(contentSimilarity('', kap1)).toBe(0)
  })
})
