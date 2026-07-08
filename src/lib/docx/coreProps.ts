import { unzipSync } from 'fflate'

export interface CoreProps {
  modified: number | null
  created: number | null
  title: string | null
}

// Leser docProps/core.xml fra docx-zipen. Kjøres i worker der DOMParser ikke
// finnes — elementene er maskingenererte med fast form, så regex holder.
export function readCoreProps(bytes: Uint8Array): CoreProps {
  try {
    const files = unzipSync(bytes, { filter: (f) => f.name === 'docProps/core.xml' })
    const xmlBytes = files['docProps/core.xml']
    if (!xmlBytes) return { modified: null, created: null, title: null }
    const xml = new TextDecoder().decode(xmlBytes)
    return {
      modified: parseDate(xml, 'dcterms:modified'),
      created: parseDate(xml, 'dcterms:created'),
      title: parseText(xml, 'dc:title'),
    }
  } catch {
    return { modified: null, created: null, title: null }
  }
}

function parseDate(xml: string, tag: string): number | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`))
  if (!m) return null
  const ts = Date.parse(m[1].trim())
  return Number.isNaN(ts) ? null : ts
}

function parseText(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`))
  const val = m?.[1].trim()
  return val ? decodeXmlEntities(val) : null
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}
