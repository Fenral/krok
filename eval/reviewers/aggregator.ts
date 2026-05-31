import type { Verdict } from '../state'

export interface ReviewerResult {
  reviewer: string
  verdict: Verdict
  findings: Array<{ severity: string; area: string; issue: string; fix: string }>
  summary: string
}

export interface AggregateResult {
  verdict: Verdict
  greenCount: number
  reason: string
}

export function aggregate(results: ReviewerResult[]): AggregateResult {
  const a11y = results.find((r) => r.reviewer === 'a11yLead')
  if (a11y?.verdict === 'RED') {
    return { verdict: 'RED', greenCount: results.filter((r) => r.verdict === 'GREEN').length, reason: 'a11y-lead VETO (RED)' }
  }

  const greenCount = results.filter((r) => r.verdict === 'GREEN').length
  if (greenCount >= 3) {
    return { verdict: 'GREEN', greenCount, reason: `${greenCount}/4 GREEN, a11y != RED` }
  }
  if (greenCount === 2) {
    return { verdict: 'YELLOW', greenCount, reason: '2/4 GREEN — trenger 3+' }
  }
  return { verdict: 'RED', greenCount, reason: `${greenCount}/4 GREEN — fortsatt ikke i mål` }
}
