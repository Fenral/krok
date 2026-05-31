import { describe, it, expect } from 'vitest'
import { isTimeCapReached, TEN_HOURS_MS } from '../eval/time-cap'

describe('time-cap', () => {
  it('returnerer false rett etter start', () => {
    expect(isTimeCapReached(Date.now(), Date.now())).toBe(false)
  })

  it('returnerer false ved 9.99 timer', () => {
    const startedAt = 1000
    const now = startedAt + TEN_HOURS_MS - 60_000
    expect(isTimeCapReached(startedAt, now)).toBe(false)
  })

  it('returnerer true ved nøyaktig 10 timer', () => {
    const startedAt = 1000
    const now = startedAt + TEN_HOURS_MS
    expect(isTimeCapReached(startedAt, now)).toBe(true)
  })

  it('returnerer true ved 10t + 1ms', () => {
    const startedAt = 1000
    const now = startedAt + TEN_HOURS_MS + 1
    expect(isTimeCapReached(startedAt, now)).toBe(true)
  })

  it('returnerer false når startedAt === 0 (ikke startet)', () => {
    expect(isTimeCapReached(0, Date.now())).toBe(false)
  })
})
