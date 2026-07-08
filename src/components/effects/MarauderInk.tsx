// Bibliotekets «kart» tegnes opp med blekk: klassisk stroke-dashoffset-animasjon
// over håndlagde SVG-paths, forskjøvet i tid per strek.

const STREKER: { d: string; delay: number; width?: number }[] = [
  // ytterramme med snirkler
  { d: 'M60,40 H540 M60,360 H540 M60,40 V360 M540,40 V360', delay: 0 },
  { d: 'M60,40 C40,40 40,60 60,60 M540,40 C560,40 560,60 540,60 M60,360 C40,360 40,340 60,340 M540,360 C560,360 560,340 540,340', delay: 0.3 },
  // bokhyller (to kolonner)
  { d: 'M100,90 H260 V140 H100 Z M100,160 H260 V210 H100 Z M100,230 H260 V280 H100 Z', delay: 0.8 },
  { d: 'M340,90 H500 V140 H340 Z M340,160 H500 V210 H340 Z M340,230 H500 V280 H340 Z', delay: 1.2 },
  // bokrygg-streker i hyllene
  { d: 'M120,90 V140 M145,90 V140 M170,90 V140 M200,90 V140 M225,90 V140 M360,160 V210 M390,160 V210 M420,160 V210 M455,160 V210', delay: 1.6, width: 1.2 },
  // midtgang med fotspor-prikker
  { d: 'M300,300 C300,270 290,250 300,220 C310,190 295,170 300,150', delay: 2.0, width: 1.5 },
  // lysekrone
  { d: 'M300,60 v14 m-16,-6 a16,10 0 0 0 32,0', delay: 2.3, width: 1.5 },
]

export function MarauderInk() {
  return (
    <svg viewBox="0 0 600 400" className="mx-auto w-full max-w-2xl" aria-hidden>
      {STREKER.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill="none"
          stroke="#3b2f1e"
          strokeWidth={s.width ?? 2}
          strokeLinecap="round"
          className="blekk-strek"
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
      <text
        x="300"
        y="335"
        textAnchor="middle"
        className="blekk-tekst"
        style={{ animationDelay: '2.6s' }}
        fill="#3b2f1e"
        fontSize="26"
        fontFamily="Georgia, serif"
        letterSpacing="6"
      >
        KROK-BIBLIOTEKET
      </text>
    </svg>
  )
}
