import { useEffect, useRef } from 'react'
import { particles } from './particles'

/** Det ene delte partikkel-canvaset — ligger over alt, slipper alle klikk gjennom. */
export function EffectsCanvas({ ambient }: { ambient: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) particles.attach(ref.current)
  }, [])

  useEffect(() => {
    particles.setAmbient(ambient)
    return () => particles.setAmbient(false)
  }, [ambient])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-50" aria-hidden />
}
