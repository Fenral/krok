import { readFileSync, writeFileSync, existsSync } from 'node:fs'

export type Verdict = 'GREEN' | 'YELLOW' | 'RED'

export interface LoopState {
  startedAt: number
  round: number
  manualStop: boolean
  verdictHistory: Verdict[]
  lastVercelUrl?: string
}

export function defaultState(): LoopState {
  return {
    startedAt: Date.now(),
    round: 0,
    manualStop: false,
    verdictHistory: [],
  }
}

export function readState(path: string): LoopState {
  if (!existsSync(path)) return defaultState()
  const raw = readFileSync(path, 'utf8')
  const parsed = JSON.parse(raw) as Partial<LoopState>
  return { ...defaultState(), ...parsed }
}

export function writeState(path: string, state: LoopState): void {
  writeFileSync(path, JSON.stringify(state, null, 2), 'utf8')
}
