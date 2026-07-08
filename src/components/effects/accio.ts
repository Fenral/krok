import { particles } from './particles'

// Accio: bokryggen (klonet) flyr fra hylla til midten av skjermen med
// overshoot og gnisthale, via Web Animations API — ingen bibliotek.
export function accioFly(spineEl: HTMLElement | null, onDone: () => void): void {
  if (!spineEl || particles.reducedMotion) {
    onDone()
    return
  }
  const fra = spineEl.getBoundingClientRect()
  const klon = spineEl.cloneNode(true) as HTMLElement
  klon.style.position = 'fixed'
  klon.style.left = `${fra.left}px`
  klon.style.top = `${fra.top}px`
  klon.style.width = `${fra.width}px`
  klon.style.height = `${fra.height}px`
  klon.style.margin = '0'
  klon.style.zIndex = '55'
  klon.style.pointerEvents = 'none'
  document.body.appendChild(klon)

  const tilX = window.innerWidth / 2 - (fra.left + fra.width / 2)
  const tilY = window.innerHeight / 2 - (fra.top + fra.height / 2)

  const anim = klon.animate(
    [
      { transform: 'translate(0,0) rotate(0deg) scale(1)' },
      { transform: `translate(${tilX * 0.6}px, ${tilY * 0.55 - 60}px) rotate(-8deg) scale(1.6)`, offset: 0.55 },
      { transform: `translate(${tilX}px, ${tilY}px) rotate(3deg) scale(2.6)` },
    ],
    { duration: 650, easing: 'cubic-bezier(0.22, 1.4, 0.36, 1)', fill: 'forwards' },
  )

  // gnisthale langs ferden
  const start = performance.now()
  const hale = () => {
    const t = Math.min(1, (performance.now() - start) / 650)
    const r = klon.getBoundingClientRect()
    particles.emit('trail', r.left + r.width / 2, r.top + r.height / 2, 3)
    if (t < 1) requestAnimationFrame(hale)
  }
  requestAnimationFrame(hale)

  anim.onfinish = () => {
    const fade = klon.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' })
    fade.onfinish = () => {
      klon.remove()
      onDone()
    }
  }
}
