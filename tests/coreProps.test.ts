import { strToU8, zipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import { readCoreProps } from '../src/lib/docx/coreProps'

function fakeDocx(coreXml: string | null): Uint8Array {
  const files: Record<string, Uint8Array> = {
    'word/document.xml': strToU8('<w:document/>'),
  }
  if (coreXml !== null) files['docProps/core.xml'] = strToU8(coreXml)
  return zipSync(files)
}

const CORE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>Hekseboka &amp; andre eventyr</dc:title>
<dcterms:created xsi:type="dcterms:W3CDTF">2021-03-12T08:00:00Z</dcterms:created>
<dcterms:modified xsi:type="dcterms:W3CDTF">2024-11-04T15:30:00Z</dcterms:modified>
</cp:coreProperties>`

describe('readCoreProps', () => {
  it('leser modified, created og tittel fra core.xml', () => {
    const props = readCoreProps(fakeDocx(CORE))
    expect(props.modified).toBe(Date.parse('2024-11-04T15:30:00Z'))
    expect(props.created).toBe(Date.parse('2021-03-12T08:00:00Z'))
    expect(props.title).toBe('Hekseboka & andre eventyr')
  })

  it('gir null-verdier når core.xml mangler', () => {
    expect(readCoreProps(fakeDocx(null))).toEqual({ modified: null, created: null, title: null })
  })

  it('tåler søppelbytes uten å kaste', () => {
    expect(readCoreProps(new Uint8Array([1, 2, 3, 4]))).toEqual({ modified: null, created: null, title: null })
  })

  it('gir null for udatert/ugyldig datoinnhold', () => {
    const props = readCoreProps(fakeDocx(CORE.replace('2024-11-04T15:30:00Z', 'ikke en dato')))
    expect(props.modified).toBeNull()
    expect(props.created).not.toBeNull()
  })
})
