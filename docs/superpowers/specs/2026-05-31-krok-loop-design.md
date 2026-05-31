# Krok — Autonom Build-Loop Design

**Dato:** 2026-05-31
**Status:** Godkjent design, klar for implementasjonsplan
**Eier:** Sivert (Fenral)

## 1. Hva vi bygger

Krok er en norsk fiskedagbok-app inspirert av Fishbrain, bygget av en **autonom build-loop** der fire reviewer-agenter (impeccable, emil-design-eng, frontend-design, accessibility-lead) styrer kvaliteten frem til alle (eller 3 av 4) sier GREEN.

Loopen er et generelt rammeverk vi tester på Krok — samme mønster kan gjenbrukes for andre prosjekter senere (analogt til [[project_strikearc_3_auto_eval_loop]]).

### Marked-vinkel
- Søkefrase «fiskedagbok norsk» og «fiskeapp norsk» er stabile.
- Fishbrain er amerikansk; ingen seriøs norsk konkurrent.
- MVP-scope dekker det nordmenn faktisk etterspør: logg fangst, kart med pins, norsk artsdatabase.

## 2. Arkitektur

```
C:\Users\SkotvoldSivertSende\krok\
├── src/                       # Vite + React + TS + Tailwind (det loopen bygger)
├── supabase/migrations/       # Schema, laget av loopen via Supabase MCP
├── eval/                      # AUTO-EVAL-LOOP infrastruktur
│   ├── run-round.ts           # npm run eval:round (1 runde)
│   ├── run-loop.ts            # npm run eval:loop (kjør til stop)
│   ├── fishbrain-scrape.ts    # Playwright MCP henter referanse-screenshots (kjøres én gang)
│   ├── reference/             # Cached Fishbrain-screenshots (gitignored)
│   │   ├── INVENTORY.md       # Features mappet til MVP-scope
│   │   └── *.png / *.html
│   ├── reports/round-NN.md    # Per-runde resultat (alle 4 dommere)
│   └── state.json             # {round, startedAt, lastVerdict, manualStop, verdictHistory}
├── tools/
│   ├── ntfy-push.ts           # Sender notifikasjon ved hver runde + STOP/GREEN
│   └── time-cap.ts            # Sjekker 10-timers-vegg
└── docs/superpowers/specs/    # Denne spec-en + fremtidige
```

**Stack-valg og hvorfor:**
- **Vite + React + TS + Tailwind:** Samme som strikearc-3 og trener-3-emner — kjent stack, raskt å iterere.
- **Capacitor:** Wraps Vite-appen for iOS + Android senere (Ryddy/Spire-mønster). Loopen kjører IKKE Capacitor-build per runde — det ville drept 10-timers-budsjettet (~3 min/build). Web-versjonen iterereres til GREEN, deretter wrappes.
- **Supabase:** Nytt prosjekt. Postgres + Auth + Storage (bilder) + PostGIS (kart). Schema og RLS er en del av runde 1.
- **Vercel:** Auto-deploy fra main. Gir klikkbar URL per push (per [[feedback_always_provide_url]]).

**Repo:** `Fenral/krok` (privat til Sivert sier «klar for lansering», per [[feedback_no_index_pre_launch]]).

## 3. MVP-scope (definerer «ferdig»)

«Standard MVP» — det folk forventer av en fiskedagbok:

1. **Auth:** E-post + magic-link via Supabase Auth.
2. **Logg fangst:** Art, vekt, lengde, GPS-posisjon, vær (met.no), foto, slipt/beholdt, notat.
3. **Min logg:** Liste + filter på art/sted/dato.
4. **Kart:** Pins for egne fangster (PostGIS).
5. **Artsdatabase:** Norske arter (ferskvann + saltvann), min-mål, sesong.
6. **Profil:** Navn, avatar.

~8-12 skjermer. Loopen er «ferdig» når 3/4 dommere sier GREEN på alle skjermene.

**Eksplisitt ute av MVP:** social feed, månefase/tidevann, varsler, premium-features, andres fangster. Disse er post-MVP roadmap.

## 4. Loop-mekanikken

### `npm run eval:round` (én iterasjon, forventet 3-8 min)

```
1. Les eval/state.json.
   → Hvis manualStop=true: ntfy "stopped by user", exit 0.
   → Hvis nå - startedAt > 10t: ntfy "time cap reached", exit 0.

2. Bygg Vite-app (vite build), start preview-server på :4173.

3. Playwright MCP åpner :4173, screenshoter alle hovedflows:
   /login, /logg, /kart, /arter, /profil, /logg/ny.
   Lagrer til eval/screenshots/round-NN/.

4. Dispatch 4 reviewer-agenter PARALLELT via Workflow-tool:
   - impeccable          → UX, hierarki, interaksjon, anti-AI-generisk
   - emil-design-eng     → polish, animasjon, micro-detaljer
   - frontend-design     → kreativ kvalitet, distinkt visuell stil
   - accessibility-lead  → WCAG 2.2 AA, ARIA, keyboard, focus, kontrast

   Hver dommer får: screenshots fra denne runden + relevante Fishbrain-referanser
   + diff fra forrige runde. Returnerer:
   { verdict: "GREEN"|"YELLOW"|"RED", findings: [{severity, area, issue, fix}] }

5. Aggregator:
   GREEN-runde = (≥3 GREEN) OG (accessibility-lead != RED).
   Accessibility-lead har VETO på RED — a11y-blokkere kan ikke overstemmes.

6. Hvis ikke GREEN:
   - Build-agent (subagent_type: general-purpose) får alle findings + nåværende kodebase.
   - Build-agenten fikser, kjører lint + typecheck.
   - Hvis lint/typecheck feiler: prøv 1 gang til, deretter rød runde + ntfy.

7. git add -A && git commit -m "round NN: <oneliner>" && git push.
   Vercel auto-deployer.

8. ntfy push: "Krok runde NN: <verdict> — <vercel-url>".

9. Skriv eval/reports/round-NN.md (verdicts + findings + diff-summary).
   Oppdater state.json: round++, verdictHistory.push(verdict).
```

### `npm run eval:loop` (driver til stop)

- Kjører `eval:round` i while-loop.
- Sjekker stop-vilkår FØR hver runde:
  1. `state.json.manualStop === true` → STOP.
  2. `now() - state.startedAt > 10h` → STOP.
  3. Siste 5 runder uten verdict-forbedring (alle samme aggregert-score) → ntfy «stagnasjon, drop?» + pauser (per [[feedback_critique_rounds_drop_signal]]). Sivert kan svare via ntfy: «fortsett» eller «drop».
- Loggfører hver runde sin tokenbruk (best effort) i state.json.

### Reviewer-prompts (kort)

Hver dommer får en system-prompt som inkluderer:
- Rollen (impeccable/emil/frontend-design/accessibility-lead — fra Skill-katalogen).
- MVP-scope fra denne speca.
- Fishbrain-referansene fra `eval/reference/INVENTORY.md`.
- Anti-bias-instruksjon: «Vær ærlig RED hvis noe er åpenbart galt. YELLOW for forbedringspotensial. GREEN kun når du ville sluppet det til brukertest.»
- Eksplisitt forventning til returformat (strict JSON via StructuredOutput).

## 5. Fishbrain-input (one-shot, før loop starter)

`eval/fishbrain-scrape.ts` kjører ÉN gang manuelt:

1. Playwright MCP åpner `fishbrain.com` (ikke pålogget — kun offentlig innhold).
2. Navigerer 6-8 hovedflows: landing, catch feed, species page, map view, profil, log-catch teaser.
3. Screenshoter til `eval/reference/<flow>.png`.
4. Lagrer DOM-snapshot til `eval/reference/<flow>.html`.
5. Lager `eval/reference/INVENTORY.md` med tabell:
   | Fishbrain-feature | MVP-scope? | Hvordan tilpasses norsk |
   | --- | --- | --- |
   | Catch logging | Ja | Met.no-vær, NOR-arter |
   | Map with pins | Ja | OpenStreetMap (lisens) |
   | Species DB | Ja | Norske arter |
   | Social feed | Nei (post-MVP) | — |
   | ... | | |

**Token-økonomi:** Build-agenten leser KUN INVENTORY.md + 1-3 relevante screenshots per runde — aldri hele referanse-mappen.

**IP-merknad:** Vi kopierer ikke pixels eller copy fra Fishbrain. Vi bruker dem som funksjonell referanse + designspråk-inspirasjon. Krok skal ha egen distinkt visuell identitet (frontend-design-dommeren vil flagge generisk look).

## 6. Supabase-schema (MVP)

Nytt Supabase-prosjekt. Secrets i `C:\Users\SkotvoldSivertSende\krok\.krok-secrets\` (gitignored), samme mønster som [[project_ryddy_play_store_setup]].

```sql
-- profiles: utvider auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- species: offentlig, redigeres av admin
create table species (
  id uuid primary key default gen_random_uuid(),
  no_navn text not null,
  latin text not null,
  type text not null check (type in ('saltvann', 'ferskvann')),
  min_legal_size_cm integer,
  sesong_start date,
  sesong_slutt date
);

-- catches: brukerens fangstlogg
create extension if not exists postgis;
create table catches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  species_id uuid not null references species(id),
  weight_kg numeric(6,3),
  length_cm numeric(5,1),
  location geography(point, 4326) not null,
  water_body_name text,
  weather_jsonb jsonb,         -- snapshot fra met.no
  released boolean not null default false,
  notes text,
  caught_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index catches_user_caught_idx on catches (user_id, caught_at desc);
create index catches_location_gix on catches using gist (location);

-- catch_photos: 0..N bilder per fangst
create table catch_photos (
  id uuid primary key default gen_random_uuid(),
  catch_id uuid not null references catches(id) on delete cascade,
  storage_path text not null,
  ordering integer not null default 0
);

-- RLS
alter table profiles enable row level security;
alter table catches enable row level security;
alter table catch_photos enable row level security;
alter table species enable row level security;

create policy "profiles: read own" on profiles for select using (auth.uid() = id);
create policy "profiles: insert own" on profiles for insert with check (auth.uid() = id);
create policy "profiles: update own" on profiles for update using (auth.uid() = id);

create policy "catches: CRUD own" on catches for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "catch_photos: CRUD via own catch" on catch_photos for all
  using (exists (select 1 from catches c where c.id = catch_id and c.user_id = auth.uid()))
  with check (exists (select 1 from catches c where c.id = catch_id and c.user_id = auth.uid()));

create policy "species: public read" on species for select using (true);
```

Storage-bucket: `catch-photos` (privat, RLS via signed URLs).

Schema og RLS lages av runde 1 via Supabase MCP. Migrations er destruktive endringer per [[feedback_destructive_requires_approval]] — første schema-apply trigger 🔒-prompt til Sivert.

## 7. Autonomi + sikkerhet

| Område | Default | Hvorfor |
| --- | --- | --- |
| build / test / lint / commit / push | Autonomt | [[feedback_autonomous_cli_mcp]] |
| Vercel preview-deploy | Autonomt | Git-koblet, sikker rollback |
| DB-migrasjoner | 🔒-prompt + ntfy | [[feedback_destructive_requires_approval]] |
| Aktivere betalte tjenester (Sentry, RevenueCat osv) | 🔒-prompt | [[feedback_no_surprise_costs]] |
| Slette filer/grener | 🔒-prompt | Destruktivt |
| Endre denne spec-en | Kun via brainstorming-skill | Beskytt design-intent |

**ntfy-channel:** `krok-loop` (ny, opprettes av tools/ntfy-push.ts).
Push ved: runde-fullført, stop, stagnasjon, 🔒-godkjenning trengs.

**Manuell stop (3 måter):**
1. `echo '{"manualStop":true}' > eval/state.json` (eller `Set-Content` i PowerShell).
2. Send `stop` til ntfy-channel (watcher i loopen poller hver 30s).
3. Ctrl+C i terminalen som kjører `eval:loop`.

**Audit-log:**
- `eval/reports/round-NN.md` — per runde: verdicts, findings, diff-summary, token-est, vercel-url.
- `eval/state.json` — historikk over alle runder, ikke slettes.

**Pre-launch noindex** (per [[feedback_no_index_pre_launch]]):
- `<meta name="robots" content="noindex,nofollow">` i index.html fra runde 1.
- `public/robots.txt` med `Disallow: /` fra runde 1.
- Fjernes IKKE før Sivert eksplisitt sier «klar for lansering».

## 8. Definition of Done — loopen er ferdig når

EN av disse:
1. **GREEN** — 3/4 dommere GREEN + accessibility-lead != RED, holdt over 2 påfølgende runder (anti-fluke).
2. **TIME-CAP** — 10 timer siden `state.startedAt`.
3. **MANUAL** — `state.manualStop = true`.
4. **STAGNASJON** — 5 runder uten verdict-forbedring + Sivert sier «drop».

Ved STOP: loopen genererer `eval/FINAL-REPORT.md` med:
- Totalt antall runder, total wall-clock-tid.
- Siste verdicts per dommer.
- Outstanding findings (det vi IKKE rakk å fikse).
- Anbefalt neste skritt (Capacitor-wrap? Mer iterasjon? Drop?).

## 9. Hva er IKKE inkludert i denne speca

- **Capacitor-wrapping** — eget prosjekt etter web-MVP er GREEN. Spec lages da.
- **App Store/Play Store-prep** — eget prosjekt, etter Capacitor-wrap (følger [[project_ryddy_play_store_setup]]-mønster).
- **Social/community-features** — post-MVP roadmap.
- **Premium/monetisering** — post-MVP roadmap.
- **Bruk av denne loopen for andre prosjekter** — vurderes etter Krok er GREEN.

## 10. Open questions for implementation-plan-fasen

- Hvilken kart-tile-provider? OpenStreetMap (gratis, krever attribution) vs Mapbox (gratis-tier, penere).
- Hvilken vær-API? met.no (gratis, krever User-Agent-header) vs OpenWeather.
- Skal artsdatabasen seedes fra en kilde, eller bygges manuelt? (Wikipedia? Miljødirektoratet?)
- Hvordan håndtere foto-komprimering før upload (klient-side resize)?

Disse løses i implementasjonsplanen, ikke her.

---

**Referanser i Sivert sin auto-memory:**
[[project_strikearc_3_auto_eval_loop]] [[project_ryddy_play_store_setup]] [[feedback_just_build]] [[feedback_always_provide_url]] [[feedback_autonomous_cli_mcp]] [[feedback_destructive_requires_approval]] [[feedback_no_surprise_costs]] [[feedback_spend_cap_100nok]] [[feedback_no_index_pre_launch]] [[feedback_critique_rounds_drop_signal]] [[feedback_three_perspectives_always]]
