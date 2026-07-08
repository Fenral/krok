import {
  CONTENT_SIMILARITY_THRESHOLD,
  DUPLICATE_SIMILARITY_THRESHOLD,
  KEY_SIMILARITY_THRESHOLD,
} from '../../config'
import type { DocRecord, Work, WorkOverrides } from '../../types'
import { EMPTY_OVERRIDES, modifiedAt } from '../../types'
import { prettyTitle } from './normalizeFilename'
import { contentSimilarity, isPrefixExtension, keySimilarity } from './similarity'

// Grupperer dokumenter i verk. Ren funksjon: verk persisteres aldri, de utledes
// på nytt ved hver last/import, så algoritmen kan forbedres uten migrering.
export function groupWorks(docs: DocRecord[], overrides: WorkOverrides = EMPTY_OVERRIDES): Work[] {
  // 1. Bucket per eksakt normalisert nøkkel
  const buckets = new Map<string, DocRecord[]>()
  for (const doc of docs) {
    const list = buckets.get(doc.normalizedKey)
    if (list) list.push(doc)
    else buckets.set(doc.normalizedKey, [doc])
  }

  // 2. Slå sammen nesten-like nøkler (union-find over buckets)
  const keys = [...buckets.keys()]
  const parent = keys.map((_, i) => i)
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])))
  const union = (a: number, b: number) => {
    parent[find(a)] = find(b)
  }
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      if (keySimilarity(keys[i], keys[j]) >= KEY_SIMILARITY_THRESHOLD || isPrefixExtension(keys[i], keys[j])) {
        union(i, j)
      }
    }
  }

  let clusters: DocRecord[][] = []
  {
    const byRoot = new Map<number, DocRecord[]>()
    keys.forEach((key, i) => {
      const root = find(i)
      const list = byRoot.get(root) ?? []
      list.push(...buckets.get(key)!)
      byRoot.set(root, list)
    })
    clusters = [...byRoot.values()]
  }

  // 3. Innholdspass: slå sammen klynger der en tekstprøve-kryssammenligning treffer
  // (samme bok lagret under helt ulikt navn)
  for (let i = 0; i < clusters.length; i++) {
    for (let j = clusters.length - 1; j > i; j--) {
      if (anyContentMatch(clusters[i], clusters[j])) {
        clusters[i].push(...clusters[j])
        clusters.splice(j, 1)
      }
    }
  }

  // 4. Manuelle korrigeringer sist: tvungne sammenslåinger, så tvungne splitter
  for (const group of overrides.merge) {
    const ids = new Set(group)
    const involved = clusters.filter((c) => c.some((d) => ids.has(d.id)))
    if (involved.length > 1) {
      const merged = involved.flat()
      clusters = clusters.filter((c) => !involved.includes(c))
      clusters.push(merged)
    }
  }
  for (const id of Object.keys(overrides.split)) {
    for (const cluster of clusters) {
      const idx = cluster.findIndex((d) => d.id === id)
      if (idx >= 0 && cluster.length > 1) {
        clusters.push(cluster.splice(idx, 1))
        break
      }
    }
  }

  // 5. Bygg verk: nyeste først, stabil id, duplikatflagg
  const works = clusters.map((cluster) => buildWork(cluster, overrides))
  works.sort((a, b) => modifiedAt(b.versions[0].doc) - modifiedAt(a.versions[0].doc))
  return works
}

function anyContentMatch(a: DocRecord[], b: DocRecord[]): boolean {
  for (const da of a) {
    for (const db of b) {
      if (contentSimilarity(da.textSample, db.textSample) >= CONTENT_SIMILARITY_THRESHOLD) return true
    }
  }
  return false
}

function buildWork(cluster: DocRecord[], overrides: WorkOverrides): Work {
  const sorted = [...cluster].sort((a, b) => modifiedAt(b) - modifiedAt(a))
  // Laveste medlems-id som verk-id: ny versjon i verket endrer ikke id-en
  const id = cluster.reduce((min, d) => (d.id < min ? d.id : min), cluster[0].id)
  const newest = sorted[0]
  return {
    id,
    title: overrides.titles[id] ?? prettyTitle(newest.normalizedKey),
    versions: sorted.map((doc, i) => ({
      doc,
      probableDuplicate:
        i > 0 &&
        sorted.slice(0, i).some(
          (nyere) =>
            nyere.wordCount === doc.wordCount &&
            contentSimilarity(nyere.textSample, doc.textSample) >= DUPLICATE_SIMILARITY_THRESHOLD,
        ),
    })),
  }
}
