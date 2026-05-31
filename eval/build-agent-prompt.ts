import type { ReviewerResult } from './reviewers/aggregator'

export function buildAgentPrompt(round: number, results: ReviewerResult[]): string {
  const findings = results.flatMap((r) =>
    r.findings.map((f) => ({ ...f, reviewer: r.reviewer })),
  )
  const high = findings.filter((f) => f.severity === 'high')
  const medium = findings.filter((f) => f.severity === 'medium')
  const low = findings.filter((f) => f.severity === 'low')

  return `Du er build-agent for Krok-prosjektet, runde ${round}.

OPPGAVE: Fiks findings fra reviewer-dommerne. Prioriter rekkefølge: high → medium → low.
A11y-findings (fra a11yLead) har høyeste prioritet uansett severity — disse blokkerer GREEN.

KONTEKST:
- Spec: docs/superpowers/specs/2026-05-31-krok-loop-design.md (les den!)
- MVP-scope: auth, logg fangst, min logg, kart, artsdatabase, profil
- Stack: Vite + React + TS + Tailwind + Supabase
- Fishbrain-referanse: eval/reference/INVENTORY.md + relevante PNG (les KUN det du trenger)
- A11y-baseline: eval/reference/A11Y-BASELINE.md

ETTER ENDRINGER:
1. Kjør \`npm run typecheck\` — må PASS
2. Kjør \`npm test\` — må PASS
3. Kjør \`npm run build\` — må PASS
4. Hvis noe feiler: prøv én gang til, deretter returner status: "build-failed" med detaljer.

INGEN COMMIT/PUSH — det gjør loopen selv etter du er ferdig.

FINDINGS (${findings.length} totalt):

## High (${high.length})
${high.map((f) => `- [${f.reviewer}] ${f.area}: ${f.issue}\n  → ${f.fix}`).join('\n') || '(ingen)'}

## Medium (${medium.length})
${medium.map((f) => `- [${f.reviewer}] ${f.area}: ${f.issue}\n  → ${f.fix}`).join('\n') || '(ingen)'}

## Low (${low.length})
${low.map((f) => `- [${f.reviewer}] ${f.area}: ${f.issue}\n  → ${f.fix}`).join('\n') || '(ingen)'}

Når ferdig: returner kort sammendrag av hva som ble endret (filer + 1-liner per fil).
`
}
