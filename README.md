# Krok — Fiskedagbok (autonom build-loop)

Norsk fiskedagbok-app bygget av en autonom build-loop. Se [spec](docs/superpowers/specs/2026-05-31-krok-loop-design.md) for full design.

## Setup

```bash
npm install
cp .env.example .env
# Fyll .env med Supabase-credentials
npm run dev   # http://localhost:5173
```

## Auto-loopen

Loopen drives av Claude Code Workflow-tool fra en interaktiv sesjon (ikke shell):

### Fishbrain-scrape (én gang før første loop)

I Claude Code-sesjon:

> Kjør Workflow med scriptPath `eval/fishbrain-scrape.workflow.js`.

Resultat: `eval/reference/INVENTORY.md` + screenshots.

### Hovedloop

> Kjør Workflow med scriptPath `eval/krok-loop.workflow.js`.

Loopen kjører til EN av:
- 3/4 dommere GREEN (a11y-lead != RED) holdt over 2 runder
- 10 timer siden start
- `eval/state.json` har `"manualStop": true`
- 5 runder stagnasjon + Sivert sier «drop» via ntfy

## Stop loopen

3 måter:
1. PowerShell: `'{"manualStop":true}' | Set-Content eval/state.json -Encoding utf8`
2. Send `stop` til ntfy-channel `krok-loop`
3. Ctrl+C i Claude Code-sesjonen som kjører Workflow

## Tester

```bash
npm test            # vitest run
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

## Mapper

- `src/` — React-app (bygges av loopen)
- `supabase/migrations/` — schema (apply via Supabase MCP)
- `eval/` — loop-infrastruktur (Workflow-scripts, reviewers, state)
- `tools/` — ntfy push/watch, time-cap
- `docs/superpowers/` — spec + plan
