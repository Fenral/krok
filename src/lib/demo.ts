import { strToU8, zipSync } from 'fflate'
import { TEXT_SAMPLE_LENGTH } from '../config'
import type { DocRecord, DocText } from '../types'
import { normalizeFilename } from './grouping/normalizeFilename'
import type { StorageAdapter } from './storage/StorageAdapter'

// Ti fiktive verk for en demo-hylle. Et par har flere versjoner (for å vise
// versjonshistorikk, datosortering og «trolig duplikat»-flagget).
interface DemoVersion {
  fileName: string
  modified: string // ISO-dato
  text: string
}
interface DemoWork {
  versions: DemoVersion[]
}

const T = {
  gille:
    'Ingen visste hvor Gille kom fra, bare at han var der en morgen, sittende på steinen ved elveosen som om han hadde vokst opp av jorda selv. ' +
    'Håret hans var grått som novemberhimmel, og øynene fortalte om ting som hadde skjedd før noen av oss ble født.\n\n' +
    'Bygda tok imot ham slik man tar imot uvær: med senkede blikk og lukkede dører. Men jeg var syv år og redd for feil ting, og jeg gikk rett bort til ham og spurte hva han het.',
  jeger:
    'Han jaktet bare når månen var borte. Det var det første barna i Vargdal lærte — at når himmelen ble helt svart, skulle man ikke gå ut, ikke tenne lys, ikke engang trekke pusten for høyt.\n\n' +
    'For da gikk Nattens jeger langs stiene, og han skilte ikke mellom skyldig og uskyldig. Han tok den som var ute.',
  jeger2:
    'Han jaktet bare når månen var borte. Det var det første mødrene i Vargdal hvisket til barna sine — at når himmelen ble helt svart, skulle ingen gå ut, ikke tenne lys, knapt trekke pusten.\n\n' +
    'For da vandret Nattens jeger langs stiene, og han spurte aldri om skyld eller uskyld. Han tok den han fant, og han fant alltid noen.',
  satan:
    'Presten sa at barnet aldri skulle vært født, og at det var en synd bare å se på det. Likevel kom hele bygda til kirken den dagen, for å se med egne øyne det de var blitt forbudt å se.\n\n' +
    'Jenta i kurven sov rolig, uvitende om alt hun allerede var anklaget for. Hun var tre dager gammel, og hun hadde alt fått et navn ingen turte å si høyt.',
  ener:
    'Det står skrevet at én skal fødes med et merke ingen kan forfalske, og at verden skal kjenne ham igjen det året lyset svikter. De fleste trodde det var et eventyr, noe de gamle fortalte for å holde vinteren ut.\n\n' +
    'Så ble en gutt født den natten sola ikke sto opp, med et merke som brant kaldt mot huden. Og de gamle sluttet å le.',
  olve:
    'Olve rakk å skrive tre setninger før hånden sviktet ham, og de tre setningene skulle komme til å styrte en hel ætt. Han visste det da han skrev dem. Det var nettopp derfor han skrev dem.\n\n' +
    'Blekket var knapt tørt før de kom for å hente arket. Men en mann som har levd lenge nok, vet alltid hvor man gjemmer det som ikke skal finnes.',
  kveilla:
    'Kveilla kom aldri før det var mørkt, og hun gikk alltid før det ble lyst, og imellom satt hun ved senga mi og lyttet til alt jeg ikke torde si om dagen. Ingen andre kunne se henne. Det var vår avtale.\n\n' +
    'Mor sa jeg måtte slutte å snakke med tomrommet i hjørnet. Men tomrommet hadde et navn, og navnet var Kveilla, og hun kjente sannheter om huset vårt som ingen levende burde vite.',
}

const DEMO: DemoWork[] = [
  { versions: [{ fileName: 'Gille.docx', modified: '2023-04-19T10:00:00Z', text: T.gille }] },
  {
    versions: [
      { fileName: 'Nattens Jeger.docx', modified: '2022-11-08T13:00:00Z', text: T.jeger },
      { fileName: 'Nattens Jeger v2 endelig.docx', modified: '2025-02-14T17:30:00Z', text: T.jeger2 },
    ],
  },
  { versions: [{ fileName: 'Satans Barn.docx', modified: '2024-10-31T23:00:00Z', text: T.satan }] },
  {
    versions: [
      { fileName: 'Den Fødte Ener.docx', modified: '2025-03-21T09:00:00Z', text: T.ener },
      // identisk kopi, eldre dato → flagges som «trolig duplikat»
      { fileName: 'Den Fødte Ener kopi.docx', modified: '2025-03-20T09:00:00Z', text: T.ener },
    ],
  },
  { versions: [{ fileName: 'Olves Testamente.docx', modified: '2024-06-12T15:20:00Z', text: T.olve }] },
  { versions: [{ fileName: 'Tanka Til Kveilla.docx', modified: '2025-07-01T20:00:00Z', text: T.kveilla }] },
]

export const DEMO_ID_PREFIX = 'demo-'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Bygger en gyldig, minimal .docx (så «Last ned .docx» gir en ekte fil).
function makeDocx(paragraphs: string[], modifiedIso: string): Uint8Array {
  const body = paragraphs
    .map((p) => `<w:p><w:r><w:t xml:space="preserve">${esc(p)}</w:t></w:r></w:p>`)
    .join('')
  return zipSync({
    '[Content_Types].xml': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
        '</Types>',
    ),
    '_rels/.rels': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
        '</Relationships>',
    ),
    'word/document.xml': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
        body +
        '</w:body></w:document>',
    ),
    'docProps/core.xml': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        `<dcterms:modified xsi:type="dcterms:W3CDTF">${modifiedIso}</dcterms:modified>` +
        '</cp:coreProperties>',
    ),
  })
}

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

/** Fyller biblioteket med ti demobøker. Idempotent — kjører man den to ganger skjer ingenting nytt. */
export async function seedDemoLibrary(storage: StorageAdapter): Promise<void> {
  for (let w = 0; w < DEMO.length; w++) {
    const versions = DEMO[w].versions
    for (let v = 0; v < versions.length; v++) {
      const ver = versions[v]
      const id = `${DEMO_ID_PREFIX}${w + 1}-${v + 1}`
      if (await storage.hasDoc(id)) continue
      const paragraphs = ver.text.split(/\n{2,}/)
      const bytes = makeDocx(paragraphs, ver.modified)
      const blob = new Blob([bytes.slice()], { type: DOCX_MIME })
      const ts = Date.parse(ver.modified)
      const meta: DocRecord = {
        id,
        fileName: ver.fileName,
        byteSize: blob.size,
        modifiedDocx: ts,
        modifiedFile: ts,
        importedAt: ts,
        normalizedKey: normalizeFilename(ver.fileName),
        textSample: ver.text.slice(0, TEXT_SAMPLE_LENGTH),
        wordCount: ver.text.match(/\S+/g)?.length ?? 0,
      }
      const text: DocText = {
        id,
        text: ver.text,
        html: paragraphs.map((p) => `<p>${esc(p)}</p>`).join(''),
      }
      await storage.putDoc(meta, blob, text)
    }
  }
}

/** Fjerner alle demobøker igjen. */
export async function removeDemoLibrary(storage: StorageAdapter): Promise<void> {
  const metas = await storage.listDocMetas()
  for (const m of metas) {
    if (m.id.startsWith(DEMO_ID_PREFIX)) await storage.deleteDoc(m.id)
  }
}
