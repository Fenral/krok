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
  nordlys:
    'Vinden bar med seg lukten av is og gammelt jern da Sigrid steg ut på tunet for siste gang. ' +
    'Over fjellet sto nordlyset og pustet i grønt og fiolett, som om himmelen selv holdt på en hemmelighet den snart ikke orket å bære lenger.\n\n' +
    'Hun visste at hun ikke kom til å vende tilbake. Det lå i måten hundene tidde på, i måten døra ikke ville lukke seg helt. ' +
    'Et sted der ute ventet noe som hadde ventet svært lenge.',
  nordlys2:
    'Vinden bar med seg lukten av is og våt ull da Sigrid steg ut på tunet for aller siste gang. ' +
    'Over fjellet sto nordlyset og pustet i grønt og gull, som om himmelen selv holdt på en hemmelighet den ikke lenger orket å bære alene.\n\n' +
    'Hun visste at hun ikke ville vende tilbake. Det lå i måten hundene tidde på, i måten døra nektet å lukke seg. ' +
    'Et sted der ute ventet noe som hadde ventet i århundrer, tålmodig som stein.',
  bunad:
    'Det var under bunadssaumen at fru Tønnesen oppdaget den lille lappen, sydd inn i fôret med sting så fine at bare et forstørrelsesglass røpet dem. ' +
    '«Han lyver om Hardanger», sto det. Ingenting mer.\n\n' +
    'Hun la ned nåla og kjente hjertet slå et ekstra slag. I trettifem år hadde hun sydd bunader for hele bygda, og aldri hadde et plagg fortalt henne noe slikt.',
  hav:
    'Hver morgen gikk hun ned til fjæra og fortalte havet hva hun ikke kunne si til noen andre. ' +
    'Bølgene tok imot ordene uten å dømme, dro dem med seg ut og la dem igjen et sted der ingen kunne finne dem.\n\n' +
    'Denne morgenen svarte havet for første gang. Ikke med ord, men med en flaske, grønn og glatt, med noe hvitt sammenrullet inni.',
  finse:
    'Siste tog fra Finse gikk klokka 23.47, og Marius rakk det med syv sekunder til gode. ' +
    'Han visste ikke ennå at kvinnen i kupé fire hadde ventet på nettopp ham, eller at snøen som falt utenfor ville stenge fjellet i tre døgn.\n\n' +
    'Da lyset flakket og toget stanset mellom to tuneller, forsto han at reisen nettopp hadde begynt.',
  oppskrift:
    'Bestemors kokebok luktet av kardemomme og noe eldre, noe man ikke fant navnet på. ' +
    'Mellom oppskriften på fattigmann og krumkaker lå et ark med en håndskrift som ikke var hennes.\n\n' +
    'Oppskriften manglet en ingrediens. Der det skulle stått en mengde, sto det bare et navn, og navnet var mitt.',
  sunnmore:
    'Tåka la seg over Sunnmøre som et lokk, og med den kom stillheten som alltid varslet at noe var galt. ' +
    'Lensmann Vik hadde bodd her lenge nok til å kjenne forskjell på vanlig stillhet og den andre sorten.\n\n' +
    'Nede ved naustet lå en båt som ikke skulle vært der, og i den satt en mann alle trodde hadde druknet for ti år siden.',
  lofoten:
    'Da stjernene falt over Lofoten den natten, sto Ingrid og Jonas på moloen og lot som de ikke merket at hendene deres nesten rørte hverandre. ' +
    'Havet var svart og speilblankt, og hver fallende stjerne trakk en tynn strek gjennom himmelen.\n\n' +
    '«Ønsk noe», sa han. Hun ønsket seg det umulige, og skammet seg ikke.',
  trollbundet:
    'Ingen i landsbyen snakket om skogen etter mørkets frembrudd, og aldri, aldri nevnte de det som bodde der. ' +
    'Men Even var tolv år og redd for feil ting, og da søsteren hans forsvant mellom trærne, gikk han etter.\n\n' +
    'Det første han lærte var at troll ikke er dumme. Det andre lærte han for sent.',
  regnet:
    'Regnet i Bergen er ikke vær, det er et språk. Det snakker i takrenner og brostein, i paraplyer som vrenges og i folk som later som de ikke har det travelt.\n\n' +
    'Jeg flyttet hit for å glemme, og byen tok imot meg med åpne, våte armer og hvisket: her får ingen tørke ut minnene sine helt.',
  vinter:
    'Vinteren 1743 var den kaldeste noen kunne minnes, og det var da jegerne kom ned fra fjellet med noe de ikke ville snakke om. ' +
    'Presten skrev i kirkeboka at tre menn døde av kulde. Han skrev ikke hva den fjerde hadde sett.\n\n' +
    'Historien ble borte i to hundre år, til en ung arkivar fant siden som var revet ut og gjemt.',
}

const DEMO: DemoWork[] = [
  {
    versions: [
      { fileName: 'Nordlysets vokter.docx', modified: '2022-03-14T10:00:00Z', text: T.nordlys },
      { fileName: 'Nordlysets vokter v2 endelig.docx', modified: '2024-11-02T16:30:00Z', text: T.nordlys2 },
    ],
  },
  { versions: [{ fileName: 'Bunadsmysteriet.docx', modified: '2025-05-20T09:15:00Z', text: T.bunad }] },
  { versions: [{ fileName: 'Hun som talte til havet.docx', modified: '2023-08-01T12:00:00Z', text: T.hav }] },
  { versions: [{ fileName: 'Siste tog fra Finse.docx', modified: '2025-01-11T20:45:00Z', text: T.finse }] },
  {
    versions: [
      { fileName: 'Bestemors hemmelige oppskrifter.docx', modified: '2024-02-18T08:00:00Z', text: T.oppskrift },
      // nesten identisk kopi → flagges som «trolig duplikat»
      { fileName: 'Bestemors hemmelige oppskrifter kopi.docx', modified: '2024-02-17T08:00:00Z', text: T.oppskrift },
    ],
  },
  { versions: [{ fileName: 'Skyggen over Sunnmøre.docx', modified: '2024-09-09T14:20:00Z', text: T.sunnmore }] },
  { versions: [{ fileName: 'Da stjernene falt over Lofoten.docx', modified: '2023-12-24T22:00:00Z', text: T.lofoten }] },
  { versions: [{ fileName: 'Trollbundet.docx', modified: '2025-06-30T11:11:00Z', text: T.trollbundet }] },
  { versions: [{ fileName: 'Regnet i Bergen.docx', modified: '2021-10-05T07:30:00Z', text: T.regnet }] },
  { versions: [{ fileName: 'Vinterjakten.docx', modified: '2024-12-01T18:00:00Z', text: T.vinter }] },
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
