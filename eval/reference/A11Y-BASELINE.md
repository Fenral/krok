# Krok — A11Y Baseline (build-loop reference)

Bygd 2026-05-31 av accessibility-lead. Build-agenten SKAL lese denne FØR den skriver UI-kode. Brudd på «MUST»-regler blir RED av accessibility-lead-dommeren og blokkerer GREEN-runde (VETO).

Standard: WCAG 2.2 AA. Theme: dark, default `bg-slate-950` + `text-slate-100`. Språk: norsk (`<html lang="nb">`).

---

## 1. Semantiske strukturer per route-type

**MUST: hver route har én `<main>` med unik `<h1>`. Sub-seksjoner bruker `<section aria-labelledby="...">`. Ingen `<div>` der `<button>`/`<a>`/`<nav>`/`<section>` passer.**

### Form-side (`/login`, `/logg/ny`, `/profil` ved redigering)
```tsx
<main id="main" className="mx-auto max-w-md p-4">
  <h1 className="text-2xl font-semibold text-slate-100">Ny fangst</h1>
  <form aria-labelledby="ny-fangst-tittel" noValidate onSubmit={...}>
    {/* felter — se §4 */}
  </form>
</main>
```

### Liste-side (`/logg`, `/arter`)
```tsx
<main id="main">
  <h1>Min fangstlogg</h1>
  <section aria-labelledby="filter-tittel">
    <h2 id="filter-tittel" className="sr-only">Filtrer fangster</h2>
    <form role="search">…</form>
  </section>
  <section aria-labelledby="resultater-tittel">
    <h2 id="resultater-tittel">42 fangster</h2>
    <ul role="list" className="divide-y divide-slate-800">
      <li><article aria-labelledby="fangst-{id}-tittel">…</article></li>
    </ul>
  </section>
</main>
```
**MUST: liste-tomtilstand (`Ingen fangster ennå`) er tekst i `<p>`, ikke kun ikon.**

### Kart-side (`/kart`) — se §6 for full mønster

### Profil-side (`/profil`)
```tsx
<main id="main">
  <h1>Profil</h1>
  <section aria-labelledby="info-tittel"><h2 id="info-tittel">Min info</h2>…</section>
  <section aria-labelledby="stats-tittel"><h2 id="stats-tittel">Statistikk</h2>…</section>
</main>
```

### Globalt layout (alle routes)
```tsx
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-sky-500 focus:text-slate-950 focus:px-3 focus:py-2 focus:rounded">
  Hopp til hovedinnhold
</a>
<header><nav aria-label="Hovedmeny">…</nav></header>
<main id="main">…</main>
<footer>…</footer>
```
**MUST: skip-link på ALLE routes. `aria-current="page"` på aktiv nav-link.**

---

## 2. Heading-hierarki

**MUST: én `<h1>` per route. Aldri hoppe nivå (h1 → h2 → h3). Heading-nivå velges av struktur, ALDRI av styling — bruk Tailwind-klasser for visuell størrelse.**

| Route | h1 | h2-eksempler |
| --- | --- | --- |
| /login | "Logg inn på Krok" | (ingen — kort form) |
| /logg | "Min fangstlogg" | "Filtrer", "42 fangster" |
| /logg/ny | "Ny fangst" | "Hva fanget du?", "Hvor?", "Bilder" |
| /kart | "Fangstkart" | "Kartvisning", "Listevisning (tilgjengelig alternativ)" |
| /arter | "Norske fiskearter" | "Saltvann", "Ferskvann" |
| /profil | "Profil" | "Min info", "Statistikk" |

`document.title` MUST oppdateres per route: `"Min fangstlogg — Krok"`. Bruk `useEffect` eller route-loader.

---

## 3. Kontrast-tokens mot `bg-slate-950`

Pre-validert WCAG 2.2 AA (4.5:1 normal, 3:1 large/UI). **Build-agent MÅ bruke disse tokens — ikke finne på nye.**

| Bruk | Klasse | Ratio | OK? |
| --- | --- | --- | --- |
| Primær tekst | `text-slate-100` | 17.8:1 | AAA |
| Sekundær tekst | `text-slate-300` | 12.1:1 | AAA |
| Dempet/meta | `text-slate-400` | 7.0:1 | AA |
| **FORBUDT for tekst** | `text-slate-500` (4.2:1) eller mørkere | <4.5:1 | FAIL — kun ≥18pt/14pt-bold |
| Lenke (default) | `text-sky-300` (12.0:1) eller `text-sky-400` (8.5:1) | AA | OK |
| Suksess | `text-emerald-400` (10.5:1) | AAA | OK |
| Feil/error | `text-red-400` (6.5:1) | AA | OK — **må ledsages av ikon/tekst, ikke kun farge (1.4.1)** |
| Advarsel | `text-amber-300` (12.6:1) | AAA | OK |
| Primær knapp BG | `bg-sky-500` + `text-slate-950` (8.6:1 inverted) | AA | OK |
| Subtil border | `border-slate-700` (3.4:1 mot 950) | AA UI | OK for ikke-essensielle borders |
| Input border | `border-slate-600` (4.5:1) | AA UI | **MUST for form-felt** |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950` | 8.5:1 | **MUST på alle interaktive** |

**Andre MUST:**
- Aldri formidle info kun via farge (slipt/beholdt: bruk ikon + tekst, ikke bare grønn/rød).
- `prefers-reduced-motion`: respekter via `motion-safe:` / `motion-reduce:` Tailwind-prefiks.
- Outdoors-lys: behold høy luminans-kontrast (slate-100/300, ikke slate-400 til primær).

---

## 4. Form-mønster

**MUST per input:**
1. Synlig `<label>` koblet med `htmlFor`/`id` (ikke kun placeholder).
2. `required` på obligatoriske + `aria-required="true"` redundant kun ved custom widget.
3. `aria-invalid={hasError}` + `aria-describedby="<id>-error <id>-hint"` når aktuelt.
4. Feilmelding i element med id `<input-id>-error` og `role="alert"` ved submit-feil (ikke ved hver keystroke — det spammer SR).
5. På submit-feil: `element.focus()` på første ugyldige felt.
6. `autocomplete`-attr satt korrekt (`email`, `current-password`, `name`).
7. `inputmode` for tall-felter på mobil (`inputmode="decimal"` for vekt/lengde).

```tsx
<div>
  <label htmlFor="vekt" className="block text-sm font-medium text-slate-100">
    Vekt (kg) <span className="text-slate-400">(valgfritt)</span>
  </label>
  <input
    id="vekt"
    type="number"
    inputMode="decimal"
    step="0.001"
    aria-invalid={!!errors.vekt}
    aria-describedby={errors.vekt ? "vekt-error vekt-hint" : "vekt-hint"}
    className="mt-1 block w-full rounded-md bg-slate-900 border border-slate-600 text-slate-100 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
  />
  <p id="vekt-hint" className="mt-1 text-xs text-slate-400">F.eks. 2,350</p>
  {errors.vekt && (
    <p id="vekt-error" role="alert" className="mt-1 text-sm text-red-400">
      <span aria-hidden="true">⚠ </span>{errors.vekt}
    </p>
  )}
</div>
```

**Required-markør:** Bruk synlig `*` MED `aria-hidden="true"` + tekst-fallback (`<span className="sr-only">obligatorisk</span>`), ELLER bare merk valgfrie som `(valgfritt)`. Krok: marker VALGFRIE — de fleste felter er obligatoriske.

**Submit-knapp:** `<button type="submit">` med tekst (ikke kun ikon). Disabled state MUST formidles via `aria-disabled="true"` + tekst-endring, ikke kun grå farge.

---

## 5. Modal/dialog-mønster

**MUST: bruk native `<dialog>` med `showModal()` der det går. Hvis custom: følg ARIA APG dialog-pattern.**

```tsx
<dialog
  ref={dialogRef}
  aria-labelledby="dialog-tittel"
  aria-describedby="dialog-desc"
  className="rounded-lg bg-slate-900 text-slate-100 p-6 backdrop:bg-slate-950/80"
  onClose={handleClose}
>
  <h2 id="dialog-tittel">Slett fangst?</h2>
  <p id="dialog-desc">Dette kan ikke angres.</p>
  <div className="mt-4 flex gap-2 justify-end">
    <button type="button" onClick={() => dialogRef.current?.close()}>Avbryt</button>
    <button type="button" onClick={confirmDelete} className="bg-red-500 text-slate-950">Slett</button>
  </div>
</dialog>
```

**MUST-sjekkliste:**
- Focus flyttes til første interaktive element (eller dialog-container med `tabindex="-1"`) ved åpning.
- Focus returneres til trigger-element ved lukking (`<dialog>` gjør dette gratis).
- `Escape` lukker (native `<dialog>` gjør dette gratis).
- Focus trapped i dialog (native `<dialog>` gjør dette gratis — for custom: bruk `focus-trap-react` eller egen handler).
- Bakgrunn er inert (native `<dialog>` showModal gjør dette gratis; custom MUST sette `inert` på resten av siden).
- `aria-modal="true"` redundant for native `<dialog>` — ikke legg på.

---

## 6. Kart-tilgjengelighet (`/kart`)

Kart er fundamentalt utilgjengelig for SR + keyboard-only. **MUST: tilby tabell-visning av samme data som tilgjengelig alternativ (2.1.1, 1.3.1).**

```tsx
<main id="main">
  <h1>Fangstkart</h1>
  <div role="tablist" aria-label="Visningstype">
    <button role="tab" aria-selected={view==='map'} aria-controls="kart-panel" id="tab-kart">Kart</button>
    <button role="tab" aria-selected={view==='list'} aria-controls="liste-panel" id="tab-liste">Liste</button>
  </div>

  <section id="kart-panel" role="tabpanel" aria-labelledby="tab-kart" hidden={view!=='map'}>
    <h2 className="sr-only">Kartvisning</h2>
    <div role="application" aria-label="Interaktivt kart med 42 fangst-pins">
      {/* Leaflet/Mapbox-instans */}
    </div>
    <p className="sr-only">Bytt til Liste-fanen for tilgjengelig alternativ.</p>
  </section>

  <section id="liste-panel" role="tabpanel" aria-labelledby="tab-liste" hidden={view!=='list'}>
    <h2>Fangster (listevisning)</h2>
    <table>
      <caption className="sr-only">42 fangster sortert etter dato</caption>
      <thead><tr><th scope="col">Dato</th><th scope="col">Art</th><th scope="col">Sted</th><th scope="col">Vekt</th></tr></thead>
      <tbody>{/* rader */}</tbody>
    </table>
  </section>
</main>
```

**MUST:**
- Pin-popups MUST også være kallbare fra tabell-rad (klikk på rad → fokus på pin eller åpne samme popup).
- Zoom-knapper MUST være `<button>` med `aria-label` (Leaflet default mangler norsk lokalisering).
- Aldri `role="img"` på kartet — bruk `role="application"` og forklar i `aria-label`.

---

## 7. Foto-upload-tilgjengelighet (`/logg/ny`)

**MUST per opplastet bilde:**
1. Bruker prompted for alt-tekst (input-felt under thumbnail, ikke modal).
2. Tom alt = lagres som `alt=""` + lagres som `decorative=true` i DB (ikke null, ikke "image of fish").
3. Drag-to-reorder MUST også støtte keyboard (`↑`/`↓` på fokusert thumbnail flytter den, kunngjøres via live-region).

```tsx
<fieldset>
  <legend>Bilder ({photos.length}/5)</legend>

  <label htmlFor="file-input" className="inline-block cursor-pointer bg-sky-500 text-slate-950 px-4 py-2 rounded focus-within:ring-2 focus-within:ring-sky-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950">
    <span>Legg til bilde</span>
    <input id="file-input" type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={handleFiles} />
  </label>

  <ul role="list" aria-label="Opplastede bilder">
    {photos.map((p, i) => (
      <li key={p.id}>
        <img src={p.thumbUrl} alt="" className="w-24 h-24 object-cover rounded" />
        <label htmlFor={`alt-${p.id}`} className="block text-sm text-slate-300 mt-1">
          Beskriv bildet (for skjermlesere)
        </label>
        <input id={`alt-${p.id}`} type="text" value={p.alt} onChange={...} placeholder="F.eks. Stor ørret holdt i ene hånden ved elvebredd"
          className="block w-full bg-slate-900 border border-slate-600 text-slate-100 rounded px-2 py-1" />
        <div className="flex gap-1 mt-1">
          <button type="button" aria-label={`Flytt bilde ${i+1} opp`} onClick={() => move(i,-1)}>↑</button>
          <button type="button" aria-label={`Flytt bilde ${i+1} ned`} onClick={() => move(i,+1)}>↓</button>
          <button type="button" aria-label={`Fjern bilde ${i+1}`} onClick={() => remove(i)}>✕</button>
        </div>
      </li>
    ))}
  </ul>
  <div role="status" aria-live="polite" className="sr-only">{statusMsg}</div>
</fieldset>
```
**MUST: kamera-trigger på mobil = `capture="environment"` (bakkamera).**

---

## Accessibility-lead VETO-prioriteringer (alltid RED)

Disse blokkerer GREEN uavhengig av de andre dommerne:

1. **Manglende form-label-association** (input uten `<label htmlFor>` eller `aria-labelledby`) — vanligste a11y-bug i AI-generert kode.
2. **Kart uten tabell-alternativ** — låser SR/keyboard-brukere ute fra primær-feature.
3. **Tekst-kontrast under 4.5:1** mot faktisk bakgrunn (typisk `text-slate-500` på `bg-slate-950`) — utendørs-bruk gjør dette ekstra kritisk.

(Sekundære auto-RED: manglende skip-link, modal uten focus-trap/Esc, ikon-knapp uten `aria-label`, `<h1>` mangler eller flere enn én per route.)
