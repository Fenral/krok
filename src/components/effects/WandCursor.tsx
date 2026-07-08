import { useEffect, useRef } from 'react'
import { particles } from './particles'

// Tryllestav i stedet for musepeker: en fast div som følger pointermove via
// transform (aldri top/left — ingen layout), gnister drysses avstandsthrottlet.
export function WandCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const last = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const grov = window.matchMedia('(pointer: coarse)').matches
    if (grov || particles.reducedMotion) return

    document.documentElement.classList.add('stav-modus')
    const el = ref.current!

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      if (dx * dx + dy * dy > 144) {
        last.current = { x: e.clientX, y: e.clientY }
        particles.emit('spark', e.clientX, e.clientY, 2)
      }
    }
    const onDown = (e: PointerEvent) => particles.emit('spark', e.clientX, e.clientY, 12, 2)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    return () => {
      document.documentElement.classList.remove('stav-modus')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[60] -translate-x-full" aria-hidden>
      {/* Stavtupp i origo, skaftet peker ned-høyre */}
      <svg width="36" height="36" viewBox="0 0 36 36" className="drop-shadow-[0_0_4px_rgba(255,217,138,0.8)]">
        <line x1="2" y1="2" x2="30" y2="30" stroke="#3a2413" strokeWidth="4" strokeLinecap="round" />
        <line x1="2" y1="2" x2="12" y2="12" stroke="#5a3a20" strokeWidth="4" strokeLinecap="round" />
        <circle cx="2.5" cy="2.5" r="2.5" fill="#ffd98a" />
      </svg>
    </div>
  )
}
