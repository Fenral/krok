import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { readState, writeState, defaultState, type LoopState } from '../eval/state'

const FIXTURE = 'eval/__test-state.json'

describe('state', () => {
  afterEach(() => {
    if (existsSync(FIXTURE)) unlinkSync(FIXTURE)
  })

  it('returnerer defaults når fil ikke finnes', () => {
    const s = readState('eval/__nonexistent.json')
    expect(s.round).toBe(0)
    expect(s.manualStop).toBe(false)
    expect(s.verdictHistory).toEqual([])
    expect(typeof s.startedAt).toBe('number')
  })

  it('skriver og leser tilbake state', () => {
    const s: LoopState = {
      ...defaultState(),
      round: 5,
      verdictHistory: ['RED', 'YELLOW', 'GREEN', 'GREEN', 'GREEN'],
    }
    writeState(FIXTURE, s)
    const read = readState(FIXTURE)
    expect(read.round).toBe(5)
    expect(read.verdictHistory).toEqual(['RED', 'YELLOW', 'GREEN', 'GREEN', 'GREEN'])
  })

  it('beholder eldre startedAt ved write', () => {
    const earlier = Date.now() - 1000
    const s = { ...defaultState(), startedAt: earlier, round: 1 }
    writeState(FIXTURE, s)
    const read = readState(FIXTURE)
    expect(read.startedAt).toBe(earlier)
  })
})
