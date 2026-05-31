export const meta = {
  name: 'krok-loop',
  description: 'Autonom build-loop for Krok: build → 4-reviewer → fix → commit → push, til GREEN/10t/manuell',
  phases: [
    { title: 'Preflight', detail: 'Sjekker state + start preview-server' },
    { title: 'Screenshot', detail: 'Playwright tar alle routes' },
    { title: 'Review', detail: '4 dommere parallelt' },
    { title: 'Fix', detail: 'Build-agent fikser findings' },
    { title: 'Commit', detail: 'git commit + push + ntfy' },
  ],
}

const STATE_PATH = 'eval/state.json'
const TEN_HOURS_MS = 10 * 60 * 60 * 1000
// route → (regex for h1 tekst, brukes til å verifisere at riktig side er rendret før screenshot)
const ROUTES = [
  { path: '/login', h1: 'Logg inn på Krok' },
  { path: '/logg', h1: 'Min fangstlogg' },
  { path: '/logg/ny', h1: 'Ny fangst' },
  { path: '/kart', h1: 'Fangstkart' },
  { path: '/arter', h1: 'Norske fiskearter' },
  { path: '/profil', h1: 'Profil' },
]
const PREVIEW_URL = 'http://localhost:4173'

const REVIEWERS = [
  { key: 'impeccable', label: 'review:impeccable' },
  { key: 'emil', label: 'review:emil' },
  { key: 'frontendDesign', label: 'review:frontend-design' },
  { key: 'a11yLead', label: 'review:a11y-lead', agentType: 'accessibility-agents:accessibility-lead' },
]

const REVIEWER_SCHEMA = {
  type: 'object',
  required: ['verdict', 'findings', 'summary'],
  properties: {
    verdict: { type: 'string', enum: ['GREEN', 'YELLOW', 'RED'] },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'area', 'issue', 'fix'],
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          area: { type: 'string' },
          issue: { type: 'string' },
          fix: { type: 'string' },
        },
      },
    },
    summary: { type: 'string' },
  },
}

// Helpers — no schemas (schema-enforcement nudged agent away from raw output).
// Parse defensively from raw text response.
function extractJson(raw) {
  // Find first { ... } block in the response. Handles agents that add chat-text before/after.
  const match = String(raw).match(/\{[\s\S]*\}/)
  if (!match) throw new Error('extractJson: no JSON object found in response: ' + String(raw).slice(0, 200))
  return JSON.parse(match[0])
}

async function readState() {
  const raw = await agent(
    `Bruk Bash til å kjøre: cat ${STATE_PATH}\n\nReturner KUN det rå JSON-innholdet fra Bash-output. Ikke legg til markdown, kode-fence, eller forklaring.`,
    { label: 'state:read' },
  )
  const parsed = extractJson(raw)
  return {
    startedAt: Number(parsed.startedAt ?? 0),
    round: Number(parsed.round ?? 0),
    manualStop: parsed.manualStop === true || parsed.manualStop === 'true',
    verdictHistory: Array.isArray(parsed.verdictHistory) ? parsed.verdictHistory : [],
  }
}

async function writeState(state) {
  const json = JSON.stringify(state, null, 2).replace(/'/g, "'\\''")
  await agent(
    `Bruk Bash til å skrive denne JSON-strengen til ${STATE_PATH} via:\n\ncat > ${STATE_PATH} <<'KROK_EOF'\n${json}\nKROK_EOF\n\nReturner kort: "ok".`,
    { label: 'state:write' },
  )
}

async function ntfy(message) {
  await agent(
    `Bruk Bash til å kjøre: curl -s -d "${message.replace(/"/g, '\\"')}" https://ntfy.sh/krok-loop`,
    { label: 'ntfy' },
  )
}

async function shell(cmd, label) {
  return await agent(`Bruk Bash til å kjøre: ${cmd}\nReturner kort sammendrag av output (stdout siste 20 linjer + exit code).`, {
    label,
  })
}

// Helper for timestamp — Date.now() blokkert i Workflow-scripts.
async function nowMs() {
  const raw = await agent('Bruk Bash til å kjøre: node -e "console.log(Date.now())"\n\nReturner KUN tallet (ingen kommentar, ingen kode-fence).', { label: 'now' })
  const m = String(raw).match(/\b(\d{13,16})\b/)
  if (!m) throw new Error('nowMs: no timestamp in: ' + String(raw).slice(0, 200))
  return Number(m[1])
}

// MAIN LOOP
let state = await readState()
if (state.startedAt === 0) {
  state.startedAt = await nowMs()
  await writeState(state)
}

phase('Preflight')

await ntfy(`Krok-loop startet ved runde ${state.round + 1}`)

let consecutiveGreen = 0
let stagnationCount = 0

while (true) {
  // Stop-vilkår
  state = await readState()
  if (state.manualStop) {
    await ntfy('Krok-loop: STOPPED (manuell)')
    return { stopped: 'manual', state }
  }
  const nowRes = await nowMs()
  if (nowRes - state.startedAt >= TEN_HOURS_MS) {
    await ntfy('Krok-loop: STOPPED (10t-vegg)')
    return { stopped: 'time-cap', state }
  }
  if (consecutiveGreen >= 2) {
    await ntfy('Krok-loop: GREEN over 2 runder — FERDIG')
    return { stopped: 'green', state }
  }
  if (stagnationCount >= 5) {
    await ntfy('Krok-loop: STAGNASJON (5 runder uten verdict-bedring). Send "fortsett" eller "drop" til krok-loop-channel.')
    // I praksis pauser vi her ved å avslutte; Sivert restarter manuelt om ønsket.
    return { stopped: 'stagnation', state }
  }

  state.round += 1
  await writeState(state)

  // Bygg + start preview
  await shell('npm run build', `round-${state.round}:build`)
  // Vi starter preview-server som background-prosess via en agent som spawner og returnerer raskt
  await agent(`Bruk Bash med run_in_background: npm run preview. Returner kort: "started".`, { label: `round-${state.round}:preview-up` })
  // Vent litt på at server lytter
  await shell('node -e "setTimeout(()=>{},2000)"', `round-${state.round}:wait`)

  phase('Screenshot')

  // Screenshots tas SEKVENSIELT — parallelle Playwright-kall mot samme
  // browser-context i samme MCP-server forårsaket race-condition i runde 3
  // der 4 av 6 screenshots ble samme frame (alle samme browser-tab byttet
  // til siste URL før alle shots ble tatt). Sekvensiell + h1-verifisering
  // garanterer at hver fil viser sin egen route.
  const screenshotResults = []
  for (const route of ROUTES) {
    const fileName = `round-${state.round}${route.path.replace(/\//g, '_') || '_root'}.png`
    const filePath = `eval/screenshots/${fileName}`
    const res = await agent(
      [
        `Bruk Playwright MCP for å ta screenshot av ${PREVIEW_URL}${route.path}:`,
        `1. browser_navigate til ${PREVIEW_URL}${route.path}`,
        `2. browser_wait_for med text="${route.h1}" (timeout 10s) — verifiserer at riktig side er montert`,
        `3. browser_evaluate: returner location.pathname og document.title — bekreft at pathname matcher "${route.path}" og at h1-tekst er "${route.h1}".`,
        `4. browser_take_screenshot, lagre til ${filePath}`,
        `5. Returner JSON: {route: "${route.path}", screenshotPath: "${filePath}", actualPath: "<location.pathname>", actualTitle: "<document.title>", consoleErrors: <antall console.error fra browser_console_messages>}.`,
        `Hvis pathname ikke matcher eller h1 ikke finnes etter 10s: returner {route: "${route.path}", screenshotPath: null, error: "navigation failed or h1 mismatch", consoleErrors: <n>}.`,
      ].join('\n'),
      {
        label: `round-${state.round}:shot:${route.path}`,
        phase: 'Screenshot',
        schema: {
          type: 'object',
          required: ['route', 'consoleErrors'],
          properties: {
            route: { type: 'string' },
            screenshotPath: { type: ['string', 'null'] },
            actualPath: { type: 'string' },
            actualTitle: { type: 'string' },
            error: { type: 'string' },
            consoleErrors: { type: 'integer' },
          },
        },
      },
    )
    screenshotResults.push(res)
  }

  const shotsTaken = screenshotResults.filter((r) => r && r.screenshotPath)
  log(`Runde ${state.round}: ${shotsTaken.length}/${ROUTES.length} screenshots`)

  // Etter alle screenshots: verifiser at hver fil er unik (ikke duplikater).
  // Hvis to filer har samme sha256, betyr det at navigasjon-pipelinen
  // fortsatt har en bug — vi varsler men blokkerer ikke runden.
  const dupeCheck = await agent(
    `Bruk Bash til å sjekke at round-${state.round} screenshots er unike:\n\nfor f in eval/screenshots/round-${state.round}_*.png; do sha256sum "$f"; done | sort\n\nReturner kort: hvor mange unike hashes finnes, og hvilke filer som deler hash (hvis noen).`,
    { label: `round-${state.round}:dupe-check` },
  )
  log(`Runde ${state.round} dupe-check: ${String(dupeCheck).slice(0, 300)}`)

  phase('Review')

  const reviewerResults = await parallel(
    REVIEWERS.map((rev) => () => {
      const promptModule = `Les eval/reviewers/prompts.ts og bruk REVIEWER_PROMPTS['${rev.key}'] som system-prompt. Review screenshots i eval/screenshots/round-${state.round}*.png mot eval/reference/INVENTORY.md + eval/reference/A11Y-BASELINE.md. Returner verdict-JSON per schema.`
      return agent(promptModule, {
        label: rev.label,
        phase: 'Review',
        schema: REVIEWER_SCHEMA,
        ...(rev.agentType ? { agentType: rev.agentType } : {}),
      }).then((res) => ({ reviewer: rev.key, ...res }))
    }),
  )

  const results = reviewerResults.filter(Boolean)
  const a11y = results.find((r) => r.reviewer === 'a11yLead')
  const greenCount = results.filter((r) => r.verdict === 'GREEN').length
  let aggregateVerdict
  if (a11y?.verdict === 'RED') aggregateVerdict = 'RED'
  else if (greenCount >= 3) aggregateVerdict = 'GREEN'
  else if (greenCount === 2) aggregateVerdict = 'YELLOW'
  else aggregateVerdict = 'RED'

  log(`Runde ${state.round} verdict: ${aggregateVerdict} (${greenCount}/4 GREEN, a11y=${a11y?.verdict ?? 'n/a'})`)

  // Stagnasjon-sjekk
  const last = state.verdictHistory[state.verdictHistory.length - 1]
  if (last && last === aggregateVerdict && aggregateVerdict !== 'GREEN') stagnationCount += 1
  else stagnationCount = 0

  state.verdictHistory.push(aggregateVerdict)
  await writeState(state)

  if (aggregateVerdict !== 'GREEN') {
    phase('Fix')
    consecutiveGreen = 0

    const findingsBlob = JSON.stringify(results, null, 2)
    await agent(
      `Du er build-agent for Krok runde ${state.round}. Les eval/build-agent-prompt.ts → buildAgentPrompt(${state.round}, ...) for full kontekst. Fiks alle findings under, prioritert high → medium → low; a11y-lead findings har øverste prioritet uansett severity.\n\nResults:\n${findingsBlob}\n\nKjør deretter: npm run typecheck && npm test && npm run build. Alle må PASS. Returner kort sammendrag av filer endret.`,
      { label: `round-${state.round}:fix`, phase: 'Fix' },
    )
  } else {
    consecutiveGreen += 1
  }

  phase('Commit')

  await shell(
    `git add -A && git commit -m "round ${state.round}: ${aggregateVerdict} (${greenCount}/4)" --allow-empty && git push`,
    `round-${state.round}:push`,
  )

  // Skriv rapport
  await agent(
    `Bruk Write på eval/reports/round-${state.round}.md. Innhold: # Runde ${state.round}\n\nVerdict: ${aggregateVerdict} (${greenCount}/4 GREEN)\n\n## Reviewers\n${results.map((r) => `### ${r.reviewer}: ${r.verdict}\n${r.summary}\n\nFindings:\n${r.findings.map((f) => `- [${f.severity}] ${f.area}: ${f.issue} → ${f.fix}`).join('\n')}`).join('\n\n')}\n`,
    { label: `round-${state.round}:report` },
  )

  await ntfy(`Krok runde ${state.round}: ${aggregateVerdict} (${greenCount}/4). Stagnasjon=${stagnationCount}. Consec-GREEN=${consecutiveGreen}.`)
}
