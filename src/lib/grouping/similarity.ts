/** Levenshtein-likhet normalisert til [0, 1]. */
export function keySimilarity(a: string, b: string): number {
  if (a === b) return 1
  if (!a.length || !b.length) return 0
  const dist = levenshtein(a, b)
  return 1 - dist / Math.max(a.length, b.length)
}

function levenshtein(a: string, b: string): number {
  const prev = new Array<number>(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
    }
  }
  return prev[b.length]
}

/** Én nøkkel utvider den andre («hekseboka» / «hekseboka del to»). */
export function isPrefixExtension(a: string, b: string): boolean {
  const [kort, lang] = a.length <= b.length ? [a, b] : [b, a]
  return kort.length >= 5 && lang.startsWith(kort)
}

/** Trigram-Jaccard på tekstprøver — fanger samme bok med helt ulike filnavn. */
export function contentSimilarity(a: string, b: string): number {
  const ta = trigrams(a)
  const tb = trigrams(b)
  if (!ta.size || !tb.size) return 0
  let felles = 0
  for (const g of ta) if (tb.has(g)) felles++
  return felles / (ta.size + tb.size - felles)
}

function trigrams(text: string): Set<string> {
  const s = text.toLowerCase().replace(/\s+/g, ' ').trim()
  const out = new Set<string>()
  for (let i = 0; i + 3 <= s.length; i++) out.add(s.slice(i, i + 3))
  return out
}
