export const meta = {
  name: 'fishbrain-scrape',
  description: 'Scraper Fishbrain web for referanse-screenshots + INVENTORY.md',
  phases: [
    { title: 'Scrape', detail: 'Playwright åpner Fishbrain og screenshoter hovedflows' },
    { title: 'Inventory', detail: 'Genererer INVENTORY.md mappet til Krok MVP-scope' },
  ],
}

const FLOWS = [
  { slug: 'landing', url: 'https://fishbrain.com/', desc: 'Forside / landing' },
  { slug: 'catches', url: 'https://fishbrain.com/catches', desc: 'Catch feed' },
  { slug: 'species', url: 'https://fishbrain.com/species', desc: 'Artsdatabase' },
  { slug: 'map', url: 'https://fishbrain.com/fishing-waters', desc: 'Kart / vannveier' },
  { slug: 'app-promo', url: 'https://fishbrain.com/app', desc: 'App-side (mobil-UX-hint)' },
]

phase('Scrape')

const scrapeResults = await parallel(
  FLOWS.map((flow) => () =>
    agent(
      `Bruk Playwright MCP til å navigere til ${flow.url}. Vent til siden er ferdig lastet (network idle). Ta full-page screenshot og lagre til eval/reference/${flow.slug}.png. Lagre også HTML-snapshot (page.content()) til eval/reference/${flow.slug}.html. Returner JSON: {slug: "${flow.slug}", url: "${flow.url}", desc: "${flow.desc}", titleSeen: "<faktisk title>", notableElements: ["<3-5 UX-mønstre du så>"]}.`,
      {
        label: `scrape:${flow.slug}`,
        phase: 'Scrape',
        schema: {
          type: 'object',
          required: ['slug', 'url', 'desc', 'titleSeen', 'notableElements'],
          properties: {
            slug: { type: 'string' },
            url: { type: 'string' },
            desc: { type: 'string' },
            titleSeen: { type: 'string' },
            notableElements: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    ),
  ),
)

phase('Inventory')

const inventory = await agent(
  `Du fikk disse scrape-resultatene fra Fishbrain:\n\n${JSON.stringify(scrapeResults.filter(Boolean), null, 2)}\n\nSkriv eval/reference/INVENTORY.md med en tabell over Fishbrain-features mappet mot Krok MVP-scope (auth, logg fangst, min logg, kart, artsdatabase, profil) + 'post-MVP' for resten. Kolonner: Fishbrain-feature | I MVP? | Norsk tilpasning. Inkluder en kort introduksjons-paragraf og lenker til screenshot-filene under hver feature. Returner JSON: {filePath: "eval/reference/INVENTORY.md", lineCount: <antall>, featuresCount: <antall>}.`,
  {
    label: 'inventory',
    phase: 'Inventory',
    schema: {
      type: 'object',
      required: ['filePath', 'lineCount', 'featuresCount'],
      properties: {
        filePath: { type: 'string' },
        lineCount: { type: 'integer' },
        featuresCount: { type: 'integer' },
      },
    },
  },
)

log(`Fishbrain-scrape ferdig: ${scrapeResults.filter(Boolean).length}/${FLOWS.length} flows + INVENTORY.md (${inventory?.featuresCount ?? '?'} features).`)

return { scraped: scrapeResults.filter(Boolean), inventory }
