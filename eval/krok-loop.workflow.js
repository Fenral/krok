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
const ROUTES = ['/login', '/logg', '/logg/ny', '/kart', '/arter', '/profil']
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

// Helpers (must be inline — script body cannot import Node.js APIs)
async function readState() {
  const out = await agent(
    `Bruk Read-tool på ${STATE_PATH}. Returner JSON-innholdet som JS-objekt.`,
    { label: 'state:read', schema: { type: 'object', additionalProperties: true } },
  )
  return out
}

async function writeState(state) {
  await agent(
    `Bruk Write-tool på ${STATE_PATH} med dette innholdet:\n\`\`\`json\n${JSON.stringify(state, null, 2)}\n\`\`\``,
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

// MAIN LOOP
let state = await readState()
if (state.startedAt === 0) {
  // Date.now() er blokkert i Workflow-scripts (vil brekke resume). Henter via agent.
  const ts = await agent('Bruk Bash til å kjøre: node -e "console.log(Date.now())". Returner KUN tallet som integer.', { label: 'now', schema: { type: 'integer' } })
  state.startedAt = ts
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
  const nowRes = await agent('Bash: node -e "console.log(Date.now())". Returner integer.', { label: 'now', schema: { type: 'integer' } })
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

  const screenshotResults = await parallel(
    ROUTES.map((route) => () =>
      agent(
        `Bruk Playwright MCP browser_navigate til ${PREVIEW_URL}${route}. Vent på network idle. Ta browser_take_screenshot, lagre til eval/screenshots/round-${state.round}${route.replace(/\//g, '_') || '_root'}.png. Returner JSON: {route: "${route}", screenshotPath: "<path>", consoleErrors: <antall console.error fra browser_console_messages>}.`,
        {
          label: `round-${state.round}:shot:${route}`,
          phase: 'Screenshot',
          schema: {
            type: 'object',
            required: ['route', 'screenshotPath', 'consoleErrors'],
            properties: {
              route: { type: 'string' },
              screenshotPath: { type: 'string' },
              consoleErrors: { type: 'integer' },
            },
          },
        },
      ),
    ),
  )

  const shotsTaken = screenshotResults.filter(Boolean)
  log(`Runde ${state.round}: ${shotsTaken.length}/${ROUTES.length} screenshots`)

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
