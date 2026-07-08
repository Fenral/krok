import mammoth from 'mammoth'

export interface ParsedDocx {
  text: string
  html: string
}

/** Kjøres i worker. Kaster ved korrupt/passordbeskyttet fil — fanges per fil i pipelinen. */
export async function parseDocx(arrayBuffer: ArrayBuffer): Promise<ParsedDocx> {
  const [raw, html] = await Promise.all([
    mammoth.extractRawText({ arrayBuffer }),
    mammoth.convertToHtml({ arrayBuffer }),
  ])
  return { text: raw.value, html: html.value }
}

export function countWords(text: string): number {
  const m = text.match(/\S+/g)
  return m ? m.length : 0
}
