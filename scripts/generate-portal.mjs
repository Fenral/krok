// Genererer den cinematiske inngangssekvensen med Nano Banana Pro (Gemini 3 Pro Image).
// Nøkkelen leses fra .env.local (GEMINI_API_KEY) og committes ALDRI.
//
// Kjør:  node scripts/generate-portal.mjs
// Ut:    public/portal/frame-1.png … frame-5.png  (16:9)
//
// Trick: fasaden genereres én gang, så brukes hvert bilde som referanse for
// neste tilstand — da holder Nano Banana samme arkitektur/kamera mens bare
// lyset og dørene endrer seg. Det gir en ekte «samme sted»-cinematisk følelse.

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'portal')
const MODEL = 'gemini-3-pro-image-preview'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

function apiKey() {
  try {
    const env = readFileSync(join(ROOT, '.env.local'), 'utf8')
    const m = env.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)\s*$/m)
    if (m) return m[1].trim().replace(/^["']|["']$/g, '')
  } catch {
    /* faller gjennom */
  }
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY
  throw new Error('Fant ingen GEMINI_API_KEY i .env.local eller miljøet.')
}

const KEY = apiKey()

const STYLE =
  'Cinematic wide establishing shot, 16:9. A grand ancient Hogwarts-style library entrance seen ' +
  'head-on from a first-person point of view standing before it: a pair of tall, ornately carved ' +
  'dark oak double doors set into a towering stone archway, worn brass fittings, gothic detailing. ' +
  'Dark academia, deep midnight-blue shadows, warm candle-gold accents, floating dust motes, ' +
  'volumetric light, painterly photoreal, moody and reverent. No people, no text, no watermark.'

// Hvert steg: enten ren tekst (frame 1) eller en redigeringsinstruksjon over forrige bilde.
const STEG = [
  {
    fil: 'frame-1.png',
    tekst:
      `${STYLE} The scene is almost entirely dark — the doors are firmly CLOSED. Only cold pale ` +
      `moonlight from a high window rakes across the stone. The candles are UNLIT. Silent, ` +
      `expectant, on the threshold of something.`,
  },
  {
    fil: 'frame-2.png',
    fra: 'frame-1.png',
    instruksjon:
      'Keep the exact same doors, stone archway, camera angle and composition. Now the very first ' +
      'floating candles are flickering to LIFE along the walls — small warm points of golden flame ' +
      'igniting in the darkness. The doors remain CLOSED. Warm light just beginning to push back the shadows.',
  },
  {
    fil: 'frame-3.png',
    fra: 'frame-2.png',
    instruksjon:
      'Keep the exact same doors, archway, camera angle and composition. Now HUNDREDS of floating ' +
      'candles are fully lit, bathing the stone and the carved oak doors in a rich warm golden glow. ' +
      'Dust motes drift through volumetric candlelight. The doors are still CLOSED but now fully revealed and inviting.',
  },
  {
    fil: 'frame-4.png',
    fra: 'frame-3.png',
    instruksjon:
      'Keep the exact same doors, archway, camera angle and composition, still lit by hundreds of ' +
      'floating candles. Now the great double doors have begun to OPEN — parted slightly at the centre — ' +
      'and a brilliant warm shaft of golden light spills out through the widening gap toward the viewer.',
  },
  {
    fil: 'frame-5.png',
    fra: 'frame-4.png',
    instruksjon:
      'Keep the exact same doors, archway and camera angle. Now the double doors stand FULLY OPEN, ' +
      'revealing the interior beyond: towering candle-lit bookshelves receding into warm golden depth, ' +
      'floating candles, dust and magic in the air. An inviting glowing threshold drawing the viewer inward.',
  },
]

async function generer(parts, forsok = 0) {
  const body = {
    contents: [{ parts }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '16:9', imageSize: '2K' } },
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const t = await res.text()
    if ((res.status === 429 || res.status >= 500) && forsok < 4) {
      const vent = 2000 * 2 ** forsok
      console.log(`  ${res.status} — prøver igjen om ${vent / 1000}s …`)
      await new Promise((r) => setTimeout(r, vent))
      return generer(parts, forsok + 1)
    }
    throw new Error(`API ${res.status}: ${t.slice(0, 400)}`)
  }
  const json = await res.json()
  const cand = json.candidates?.[0]
  const bildedel = cand?.content?.parts?.find((p) => p.inlineData?.data)
  if (!bildedel) throw new Error(`Ingen bilde i svaret: ${JSON.stringify(json).slice(0, 400)}`)
  return Buffer.from(bildedel.inlineData.data, 'base64')
}

async function main() {
  mkdirSync(OUT, { recursive: true })
  for (const steg of STEG) {
    process.stdout.write(`Genererer ${steg.fil} … `)
    let parts
    if (steg.fra) {
      const forrige = readFileSync(join(OUT, steg.fra)).toString('base64')
      parts = [{ inlineData: { mimeType: 'image/png', data: forrige } }, { text: steg.instruksjon }]
    } else {
      parts = [{ text: steg.tekst }]
    }
    const png = await generer(parts)
    writeFileSync(join(OUT, steg.fil), png)
    console.log(`ok (${(png.length / 1024).toFixed(0)} kB)`)
  }
  console.log('\nFerdig. Bildene ligger i public/portal/.')
}

main().catch((e) => {
  console.error('\nFEIL:', e.message)
  process.exit(1)
})
