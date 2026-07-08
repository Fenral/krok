# Krok — Biblioteket

Et Harry Potter-inspirert, personlig bibliotek for egne bokmanuskripter (.docx).
Dra inn Word-filene dine — biblioteket sorterer duplikater og versjoner i verk,
viser når hver versjon sist ble redigert, og lar deg lese og søke i alt sammen.
Norsk UI, nattmørkt Hogwarts-bibliotek som stemning.

## Kom i gang

```bash
npm install
npm run dev   # http://localhost:5173
```

1. Skriv eden på pergamentet: **«Jeg lover høytidelig at jeg pønsker på noe galt»**
   (eller klikk «hvisk eden til meg»). Frasen kan endres i `src/config.ts`.
2. Dra .docx-filene dine inn hvor som helst på biblioteksiden — gjerne hundrevis
   på én gang. Filer som er byte-identiske hoppes over som duplikater.
3. Hylla viser én bok per verk. Klikk en bok for versjonshistorikk (sortert på
   redigeringsdato), pergamentleser og nedlasting av original .docx.
4. Søk i titler og fulltekst — treffet flyr ut av hylla (Accio!).

## Hvordan det virker

- **Gruppering**: filnavn normaliseres («Hekseboka kopi (2)», «hekseboka ENDELIG
  v3 12.03.2024» → «hekseboka»), nesten like nøkler slås sammen, og et
  innholdspass (trigram-likhet på tekstprøver) fanger samme bok lagret under
  helt ulikt navn. Ren, testdrevet logikk i `src/lib/grouping/`.
- **Sist redigert**: leses fra docx-ens indre `docProps/core.xml`
  (`dcterms:modified`); filsystemdatoen brukes som fallback.
- **Lagring**: alt ligger lokalt i nettleseren (IndexedDB) — originalbytes,
  fulltekst og metadata i separate stores. Ingen server. Skylagring kan plugges
  inn senere via `StorageAdapter`-grensesnittet
  (`src/lib/storage/SupabaseAdapter.stub.ts` beskriver hvordan).
- **Parsing**: mammoth + fflate i en Web Worker, så hovedtråden (og magien)
  aldri hakker under bulk-import.
- **Magien**: én delt canvas med partikkelmotor (stavgnister, støv, glør,
  Accio-hale) + CSS-keyframes (pustende bøker, Monsterbok-knurring, flakkende
  lys, blekk som tegner Marauder-kartet). `prefers-reduced-motion` respekteres.

## Kommandoer

```bash
npm run dev         # utviklingsserver
npm run build       # produksjonsbygg til dist/
npm run preview     # server produksjonsbygget
npm test            # vitest (gruppering, normalisering, lagring, core.xml)
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

## Mapper

- `src/lib/grouping/` — normalisering, likhet og grupperingsmotor (kjernen)
- `src/lib/storage/` — StorageAdapter + IndexedDB-implementasjon
- `src/lib/import/` — importpipeline + docx-worker
- `src/lib/search/` — MiniSearch-indeks over titler og fulltekst
- `src/components/effects/` — partikkelmotor, tryllestav, Accio, Marauder-blekk
- `src/routes/` — Inngang (eden), Bibliotek (hylla), Bok (leser)

## Verdt å vite

- Biblioteket bor i den nettleseren du bruker det i. Slett nettleserdata =
  tøm hylla (originalfilene dine på disk påvirkes selvsagt ikke).
- Eden er stemning, ikke sikkerhet — innholdet er ikke kryptert.
- «Ugagn utført» nederst på hyllesiden låser pergamentet igjen.
