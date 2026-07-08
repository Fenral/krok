import { useMemo } from 'react'
import { hashString, seededRandom } from '../../lib/seededRandom'
import type { Work } from '../../types'

// Slitt skinn-palett: [rygg, mørk kant, tittelfolie]
const SKINN: [string, string, string][] = [
  ['#5c2320', '#3d1512', '#d9b36a'],
  ['#274036', '#182a23', '#c9ad72'],
  ['#3a2f55', '#241c38', '#d0b984'],
  ['#59421c', '#3a2a10', '#e0c98e'],
  ['#472a38', '#2e1a24', '#ce9d6b'],
  ['#233a52', '#152534', '#c7b489'],
]

export interface SpineLook {
  height: number
  width: number
  tilt: number
  farge: string
  kant: string
  folie: string
  baand: number
  pustDelay: number
  pustDur: number
}

export function spineLook(workId: string): SpineLook {
  const rnd = seededRandom(hashString(workId))
  const [farge, kant, folie] = SKINN[Math.floor(rnd() * SKINN.length)]
  return {
    height: 150 + Math.floor(rnd() * 70),
    width: 30 + Math.floor(rnd() * 17),
    tilt: (rnd() - 0.5) * 3.6,
    farge,
    kant,
    folie,
    baand: 0.12 + rnd() * 0.16, // posisjon for tittelbånd
    pustDelay: rnd() * 5,
    pustDur: 4 + rnd() * 3,
  }
}

interface Props {
  work: Work
  snapper: boolean
  onClick: () => void
}

export function Bokrygg({ work, snapper, onClick }: Props) {
  const look = useMemo(() => spineLook(work.id), [work.id])
  const antall = work.versions.length

  return (
    <button
      type="button"
      data-work-id={work.id}
      onClick={onClick}
      title={`${work.title} — ${antall} versjon${antall === 1 ? '' : 'er'}`}
      className={`bok-pust group relative shrink-0 origin-bottom cursor-pointer rounded-t-[3px] outline-offset-4 transition-transform hover:-translate-y-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lys ${snapper ? 'bok-knurr' : ''}`}
      style={{
        height: look.height,
        width: look.width,
        rotate: `${look.tilt}deg`,
        background: `linear-gradient(90deg, ${look.kant} 0%, ${look.farge} 18%, ${look.farge} 74%, ${look.kant} 100%)`,
        boxShadow: 'inset 0 6px 8px -6px rgba(255,235,190,0.35), inset 0 -10px 14px -8px rgba(0,0,0,0.7), 2px 0 6px rgba(0,0,0,0.55)',
        animationDelay: `${look.pustDelay}s`,
        animationDuration: `${look.pustDur}s`,
      }}
    >
      {/* slitasje nederst */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-6 rounded-t-[2px] opacity-40"
        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.6), transparent)' }}
      />
      {/* tittelbånd med gullfolie */}
      <span
        className="pointer-events-none absolute inset-x-[3px] flex items-center justify-center overflow-hidden rounded-[1px] border-y py-1"
        style={{ top: `${look.baand * 100}%`, borderColor: `${look.folie}55`, background: 'rgba(0,0,0,0.18)' }}
      >
        <span
          className="font-tittel text-[10px] font-semibold leading-tight tracking-wider"
          style={{
            writingMode: 'vertical-rl',
            color: look.folie,
            textShadow: '0 0 3px rgba(255,220,150,0.45)',
            maxHeight: look.height * 0.62,
            overflow: 'hidden',
          }}
        >
          {work.title}
        </span>
      </span>
      {/* ryggbånd */}
      <span className="pointer-events-none absolute inset-x-[2px] top-[6%] h-[3px] rounded-full opacity-50" style={{ background: look.folie }} />
      <span className="pointer-events-none absolute inset-x-[2px] bottom-[8%] h-[3px] rounded-full opacity-50" style={{ background: look.folie }} />
      {/* versjonsantall som små hakk */}
      {antall > 1 && (
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-natt-900/90 px-1.5 font-tittel text-[10px] text-lys opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        >
          ×{antall}
        </span>
      )}
    </button>
  )
}
