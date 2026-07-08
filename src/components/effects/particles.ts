// Imperativ partikkelmotor: én preallokert pool, én rAF-løkke som sover når
// poolen er tom og ambient er av. Alle effekter (stavgnister, støv,
// Accio-hale, glør fra lysene) deler dette ene canvaset.

export type ParticleKind = 'spark' | 'dust' | 'trail' | 'ember'

interface Particle {
  active: boolean
  kind: ParticleKind
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

const POOL_SIZE = 600

export class ParticleEngine {
  private pool: Particle[] = Array.from({ length: POOL_SIZE }, () => ({
    active: false,
    kind: 'spark',
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 1,
    size: 1,
    hue: 45,
  }))
  private ctx: CanvasRenderingContext2D | null = null
  private raf = 0
  private lastT = 0
  private ambient = false
  private ambientAkk = 0
  private reduced = false

  attach(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      this.ctx?.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)
  }

  setAmbient(on: boolean) {
    this.ambient = on && !this.reduced
    if (this.ambient) this.wake()
  }

  get reducedMotion() {
    return this.reduced
  }

  emit(kind: ParticleKind, x: number, y: number, count = 1, spread = 1) {
    if (this.reduced) return
    for (let i = 0; i < count; i++) {
      const p = this.pool.find((q) => !q.active)
      if (!p) return
      p.active = true
      p.kind = kind
      p.x = x + (Math.random() - 0.5) * 6 * spread
      p.y = y + (Math.random() - 0.5) * 6 * spread
      const vinkel = Math.random() * Math.PI * 2
      const fart = kind === 'spark' ? 20 + Math.random() * 60 : kind === 'trail' ? 10 + Math.random() * 30 : 4
      p.vx = Math.cos(vinkel) * fart * spread
      p.vy = Math.sin(vinkel) * fart * spread - (kind === 'ember' ? 18 : 0)
      p.maxLife = kind === 'dust' ? 9 + Math.random() * 6 : kind === 'ember' ? 1.2 : 0.5 + Math.random() * 0.5
      p.life = p.maxLife
      p.size = kind === 'dust' ? 1 + Math.random() * 1.6 : 1 + Math.random() * 2
      p.hue = kind === 'dust' ? 45 : 38 + Math.random() * 18
    }
    this.wake()
  }

  private wake() {
    if (!this.raf && this.ctx) {
      this.lastT = performance.now()
      this.raf = requestAnimationFrame(this.tick)
    }
  }

  private tick = (t: number) => {
    const ctx = this.ctx
    if (!ctx) return
    const dt = Math.min(0.05, (t - this.lastT) / 1000)
    this.lastT = t
    const w = window.innerWidth
    const h = window.innerHeight
    ctx.clearRect(0, 0, w, h)

    if (this.ambient) {
      // ~1 støvkorn i sekundet, sluppet fra øvre del av skjermen
      this.ambientAkk += dt
      if (this.ambientAkk > 1) {
        this.ambientAkk = 0
        this.emitDust(w, h)
      }
    }

    let levende = 0
    for (const p of this.pool) {
      if (!p.active) continue
      p.life -= dt
      if (p.life <= 0) {
        p.active = false
        continue
      }
      levende++
      if (p.kind === 'dust') {
        p.x += (p.vx + Math.sin(t / 900 + p.y * 0.01) * 6) * dt
        p.y += p.vy * dt
      } else {
        p.vy += (p.kind === 'ember' ? -14 : 60) * dt // gnister faller, glør stiger
        p.x += p.vx * dt
        p.y += p.vy * dt
      }
      const fade = Math.min(1, p.life / (p.maxLife * 0.6))
      ctx.globalAlpha = (p.kind === 'dust' ? 0.28 : 0.9) * fade
      ctx.fillStyle = `hsl(${p.hue} 90% ${p.kind === 'dust' ? 78 : 65}%)`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    if (levende > 0 || this.ambient) {
      this.raf = requestAnimationFrame(this.tick)
    } else {
      this.raf = 0
    }
  }

  private emitDust(w: number, h: number) {
    const p = this.pool.find((q) => !q.active)
    if (!p) return
    p.active = true
    p.kind = 'dust'
    p.x = Math.random() * w
    p.y = Math.random() * h * 0.5
    p.vx = 2 + Math.random() * 4
    p.vy = 3 + Math.random() * 5
    p.maxLife = 10 + Math.random() * 8
    p.life = p.maxLife
    p.size = 0.8 + Math.random() * 1.6
    p.hue = 45
  }
}

export const particles = new ParticleEngine()
