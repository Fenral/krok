// Reduserer et filnavn til en grupperingsnøkkel: «Hekseboka ENDELIG v3 12.03.2024.docx»
// og «hekseboka kopi (2).docx» skal begge bli «hekseboka».

const NOISE_TOKENS = [
  // kopi-markører
  /kopi(?: \d+)?/,
  /copy(?: \d+)?/,
  /\(\d+\)/,
  // versjonsmarkører
  /v\d+/,
  /versjon \d+/,
  /utkast(?: \d+)?/,
  /draft(?: \d+)?/,
  /rev(?:isjon)?\.? ?\d*/,
  // finalitetsmarkører
  /endelig/,
  /final/,
  /ferdig/,
  /siste/,
  /nyeste/,
  /ny/,
  /gammel/,
  /backup/,
  /sikkerhetskopi/,
  // datoer og årstall
  /\d{1,2}[. \-/]\d{1,2}[. \-/]\d{2,4}\.?/,
  /\d{4}-\d{2}-\d{2}/,
  /(?:jan(?:uar)?|feb(?:ruar)?|mars?|apr(?:il)?|mai|jun(?:i)?|jul(?:i)?|aug(?:ust)?|sep(?:tember)?|okt(?:ober)?|nov(?:ember)?|des(?:ember)?)(?: (?:19|20)\d{2})?/,
  /(?:19|20)\d{2}/,
]

const TRAILING_NOISE = new RegExp(`(?:^|\\s)(?:${NOISE_TOKENS.map((r) => r.source).join('|')})$`, 'iu')
// Hengende småtall («Hekseboka 2») — strippes kun når noe substansielt står igjen,
// så titler som «1984» overlever.
const TRAILING_NUMBER = /(?:^|\s)\d{1,3}$/

export function normalizeFilename(fileName: string): string {
  let s = fileName
    .normalize('NFC')
    .replace(/\.docx?$/i, '')
    .toLowerCase()
    .replace(/[_.\-–—]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  for (;;) {
    const etterStoy = s.replace(TRAILING_NOISE, '').trim()
    if (etterStoy !== s && etterStoy.length > 0) {
      s = etterStoy
      continue
    }
    const etterTall = s.replace(TRAILING_NUMBER, '').trim()
    if (etterTall !== s && etterTall.length >= 2) {
      s = etterTall
      continue
    }
    return s
  }
}

/** Visningstittel fra en grupperingsnøkkel: første bokstav i hvert ord stor. */
export function prettyTitle(normalizedKey: string): string {
  return normalizedKey.replace(/(^|\s)(\S)/g, (_, sp: string, ch: string) => sp + ch.toUpperCase())
}
