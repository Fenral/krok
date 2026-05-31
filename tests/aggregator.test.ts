import { describe, it, expect } from 'vitest'
import { aggregate, type ReviewerResult } from '../eval/reviewers/aggregator'

const G = (name: string): ReviewerResult => ({ reviewer: name, verdict: 'GREEN', findings: [], summary: '' })
const Y = (name: string): ReviewerResult => ({ reviewer: name, verdict: 'YELLOW', findings: [], summary: '' })
const R = (name: string): ReviewerResult => ({ reviewer: name, verdict: 'RED', findings: [], summary: '' })

describe('aggregator', () => {
  it('GREEN når alle fire GREEN', () => {
    const out = aggregate([G('impeccable'), G('emil'), G('frontendDesign'), G('a11yLead')])
    expect(out.verdict).toBe('GREEN')
    expect(out.greenCount).toBe(4)
  })

  it('GREEN når 3/4 GREEN og a11y GREEN', () => {
    const out = aggregate([G('impeccable'), G('emil'), Y('frontendDesign'), G('a11yLead')])
    expect(out.verdict).toBe('GREEN')
  })

  it('GREEN når 3/4 GREEN og a11y YELLOW (men ikke RED)', () => {
    const out = aggregate([G('impeccable'), G('emil'), G('frontendDesign'), Y('a11yLead')])
    expect(out.verdict).toBe('GREEN')
  })

  it('RED når a11y-lead RED uansett andre', () => {
    const out = aggregate([G('impeccable'), G('emil'), G('frontendDesign'), R('a11yLead')])
    expect(out.verdict).toBe('RED')
    expect(out.reason).toMatch(/a11y/i)
  })

  it('YELLOW når 2/4 GREEN', () => {
    const out = aggregate([G('impeccable'), G('emil'), Y('frontendDesign'), Y('a11yLead')])
    expect(out.verdict).toBe('YELLOW')
  })

  it('RED når 0/4 GREEN', () => {
    const out = aggregate([Y('impeccable'), Y('emil'), R('frontendDesign'), Y('a11yLead')])
    expect(out.verdict).toBe('RED')
  })
})
