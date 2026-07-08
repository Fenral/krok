import { useEffect, useRef, useState } from 'react'
import type { Work } from '../../types'
import { particles } from '../effects/particles'
import { Bokrygg } from './Bokrygg'

interface Props {
  works: Work[]
  onOpen: (work: Work, spineEl: HTMLElement | null) => void
}

// Hylla lever: med jevne mellomrom «knurrer» en tilfeldig bok (Monsterboken)
// og snapper mot pekeren om den er nær nok.
export function Bokhylle({ works, onOpen }: Props) {
  const [snapperId, setSnapperId] = useState<string | null>(null)
  const rot = useRef<HTMLDivElement>(null)
  const peker = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      peker.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    if (!works.length || particles.reducedMotion) return
    let timeout: ReturnType<typeof setTimeout>
    const planlegg = () => {
      timeout = setTimeout(() => {
        const work = works[Math.floor(Math.random() * works.length)]
        const el = rot.current?.querySelector<HTMLElement>(`[data-work-id="${work.id}"]`)
        if (el) {
          const r = el.getBoundingClientRect()
          const cx = r.left + r.width / 2
          const cy = r.top + r.height / 2
          const naer = Math.hypot(peker.current.x - cx, peker.current.y - cy) < 150
          setSnapperId(work.id)
          particles.emit('dust', cx, r.top, naer ? 6 : 3, 2)
          setTimeout(() => setSnapperId(null), 700)
        }
        planlegg()
      }, 8000 + Math.random() * 12000)
    }
    planlegg()
    return () => clearTimeout(timeout)
  }, [works])

  // Fordel bøkene på hyller à maks 14
  const perHylle = 14
  const hyller: Work[][] = []
  for (let i = 0; i < works.length; i += perHylle) hyller.push(works.slice(i, i + perHylle))

  return (
    <div ref={rot} className="mx-auto w-full max-w-5xl">
      {hyller.map((rad, i) => (
        <div key={i} className="relative">
          <div className="hylle-vegg flex min-h-[230px] items-end justify-center gap-[3px] px-8 pt-4">
            {rad.map((work) => (
              <Bokrygg
                key={work.id}
                work={work}
                snapper={snapperId === work.id}
                onClick={() => onOpen(work, rot.current?.querySelector(`[data-work-id="${work.id}"]`) ?? null)}
              />
            ))}
          </div>
          {/* hylleplanke */}
          <div className="hylle-planke h-5 w-full rounded-b-[3px]" />
        </div>
      ))}
    </div>
  )
}
