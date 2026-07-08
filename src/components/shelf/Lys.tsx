import { useEffect } from 'react'
import { particles } from '../effects/particles'

// Svevende stearinlys à la storsalen: CSS-flamme som flakker, sakte sveving,
// og en gnist av glo i ny og ne.
const LYS = [
  { left: '12%', top: '8%', delay: 0, hoyde: 46 },
  { left: '32%', top: '16%', delay: 1.7, hoyde: 34 },
  { left: '55%', top: '6%', delay: 0.9, hoyde: 52 },
  { left: '74%', top: '14%', delay: 2.4, hoyde: 38 },
  { left: '89%', top: '9%', delay: 1.2, hoyde: 44 },
]

export function Lys() {
  useEffect(() => {
    if (particles.reducedMotion) return
    const id = setInterval(() => {
      const lys = LYS[Math.floor(Math.random() * LYS.length)]
      const x = (parseFloat(lys.left) / 100) * window.innerWidth
      const y = (parseFloat(lys.top) / 100) * window.innerHeight
      particles.emit('ember', x, y, 1)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {LYS.map((lys, i) => (
        <div key={i} className="lys-svev absolute" style={{ left: lys.left, top: lys.top, animationDelay: `${lys.delay}s` }}>
          {/* flamme */}
          <div className="flamme-flakk relative mx-auto h-4 w-2.5 rounded-full bg-gradient-to-t from-lys via-lys-glow to-white/90 shadow-[0_0_18px_6px_rgba(232,182,76,0.45)]" />
          {/* voks */}
          <div
            className="mx-auto w-3 rounded-[2px] bg-gradient-to-b from-pergament to-pergament-dyp shadow-[inset_0_-4px_6px_rgba(0,0,0,0.25)]"
            style={{ height: lys.hoyde }}
          />
        </div>
      ))}
    </div>
  )
}
