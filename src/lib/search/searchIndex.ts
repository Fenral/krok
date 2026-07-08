import MiniSearch from 'minisearch'
import type { Work } from '../../types'
import type { StorageAdapter } from '../storage/StorageAdapter'

export interface SearchHit {
  workId: string
  title: string
  /** Kort utdrag rundt første treff i teksten, tom om treffet er i tittelen */
  snippet: string
}

interface IndexedDoc {
  id: string // workId
  title: string
  text: string
}

// Indekserer kun nyeste versjon per verk — å søke i fem nesten like utkast gir bare støy.
export class SearchIndex {
  private mini: MiniSearch<IndexedDoc> | null = null
  private texts = new Map<string, string>()

  async build(works: Work[], storage: StorageAdapter): Promise<void> {
    const mini = new MiniSearch<IndexedDoc>({
      fields: ['title', 'text'],
      storeFields: ['title'],
      searchOptions: { boost: { title: 3 }, prefix: true, fuzzy: 0.2 },
    })
    const docs: IndexedDoc[] = []
    this.texts.clear()
    for (const work of works) {
      const newest = work.versions[0].doc
      const text = (await storage.getDocText(newest.id))?.text ?? ''
      this.texts.set(work.id, text)
      docs.push({ id: work.id, title: work.title, text })
    }
    mini.addAll(docs)
    this.mini = mini
  }

  search(query: string): SearchHit[] {
    if (!this.mini || !query.trim()) return []
    return this.mini.search(query).slice(0, 8).map((r) => ({
      workId: String(r.id),
      title: (r as unknown as { title: string }).title,
      snippet: this.snippetFor(String(r.id), query),
    }))
  }

  private snippetFor(workId: string, query: string): string {
    const text = this.texts.get(workId) ?? ''
    const term = query.trim().split(/\s+/)[0]?.toLowerCase()
    if (!term) return ''
    const idx = text.toLowerCase().indexOf(term)
    if (idx < 0) return ''
    const start = Math.max(0, idx - 40)
    const end = Math.min(text.length, idx + 120)
    return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ').trim()}${end < text.length ? '…' : ''}`
  }
}
