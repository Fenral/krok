export const TEN_HOURS_MS = 10 * 60 * 60 * 1000

export function isTimeCapReached(startedAt: number, now: number): boolean {
  if (startedAt === 0) return false
  return now - startedAt >= TEN_HOURS_MS
}
