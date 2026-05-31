import type { ArtShape } from '../lib/arter'

type ArtSilhouetteProps = {
  shape: ArtShape
  className?: string
}

/**
 * Per-art silhuett-render. 7 distinkte former dekker 17 norske
 * arter på en måte som er visuelt skannbar (laks vs gjedde vs flatfisk
 * vs torskefisk vs makrell vs karpefisk vs abbor) — ikke et flatt
 * "samme strek-fisk i 17 kort"-grid lenger.
 *
 * Alle silhuetter er rene `fill="currentColor"` så vi kan style farge
 * via parent (tone-on-tone aksent per habitat). `aria-hidden=true` på
 * SVG-roten siden art-navnet allerede er tekst i samme kort.
 */
export default function ArtSilhouette({ shape, className }: ArtSilhouetteProps) {
  const common = {
    viewBox: '0 0 120 60',
    fill: 'currentColor',
    className,
    'aria-hidden': true as const,
    focusable: 'false' as const,
  }
  switch (shape) {
    case 'salmonid':
      // Langstrakt, slank kropp med liten fettfinne — klassisk laksefisk.
      return (
        <svg {...common}>
          <path d="M8 30 C 22 14, 60 12, 86 26 L 98 18 L 100 30 L 98 42 L 86 34 C 60 48, 22 46, 8 30 Z" />
          <path d="M62 16 L 66 8 L 70 16 Z" opacity="0.85" />
          <path d="M52 44 L 56 52 L 60 44 Z" opacity="0.7" />
          <circle cx="22" cy="27" r="2" fill="#0f172a" />
        </svg>
      )
    case 'pike':
      // Lang torpedo med klar gap mellom ryggfinne og halen — gjedde-langform.
      return (
        <svg {...common}>
          <path d="M6 30 C 18 22, 70 18, 92 26 L 104 16 L 106 30 L 104 44 L 92 34 C 70 42, 18 38, 6 30 Z" />
          <path d="M76 18 L 82 10 L 86 20 Z" opacity="0.85" />
          <path d="M62 42 L 66 50 L 72 42 Z" opacity="0.7" />
          <circle cx="18" cy="28" r="1.8" fill="#0f172a" />
        </svg>
      )
    case 'perch':
      // Dyp kropp, tydelig pigget ryggfinne — abbor/gjørs.
      return (
        <svg {...common}>
          <path d="M10 32 C 22 12, 68 8, 90 28 L 102 20 L 104 32 L 102 44 L 90 36 C 68 56, 22 52, 10 32 Z" />
          <path d="M40 12 L 44 4 L 48 12 L 52 5 L 56 12 L 60 5 L 64 12 Z" opacity="0.85" />
          <path d="M58 46 L 62 54 L 68 46 Z" opacity="0.7" />
          <circle cx="22" cy="30" r="2" fill="#0f172a" />
        </svg>
      )
    case 'cod':
      // Tre ryggfinner + skjeggtråd under haka — torskefamilien.
      return (
        <svg {...common}>
          <path d="M10 32 C 26 16, 70 14, 92 28 L 104 20 L 106 32 L 104 44 L 92 36 C 70 50, 26 48, 10 32 Z" />
          <path d="M34 14 L 40 6 L 46 14 Z" opacity="0.85" />
          <path d="M54 12 L 60 4 L 66 12 Z" opacity="0.85" />
          <path d="M72 14 L 78 6 L 84 14 Z" opacity="0.85" />
          <path d="M58 44 L 62 52 L 68 44 Z" opacity="0.7" />
          <circle cx="20" cy="30" r="1.8" fill="#0f172a" />
          <path d="M18 38 L 20 44" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'mackerel':
      // Slank, strømlinjeformet, kløftet hale — makrell.
      return (
        <svg {...common}>
          <path d="M8 30 C 20 18, 70 16, 90 28 L 104 16 L 100 30 L 104 44 L 90 32 C 70 44, 20 42, 8 30 Z" />
          <path d="M60 14 L 64 6 L 68 14 Z" opacity="0.85" />
          <path d="M52 42 L 56 50 L 60 42 Z" opacity="0.7" />
          <path d="M30 24 Q 60 22, 88 24" stroke="#0f172a" strokeWidth="1.3" fill="none" opacity="0.4" />
          <circle cx="20" cy="28" r="1.8" fill="#0f172a" />
        </svg>
      )
    case 'flatfish':
      // Oval, sammenpresset, begge øyne på én side — flatfisk.
      return (
        <svg {...common}>
          <ellipse cx="56" cy="32" rx="48" ry="22" />
          <path d="M100 22 L 112 14 L 108 32 L 112 50 L 100 42 Z" />
          <circle cx="30" cy="26" r="2.2" fill="#0f172a" />
          <circle cx="40" cy="22" r="2" fill="#0f172a" />
          <path d="M14 18 Q 60 12 96 20" stroke="#0f172a" strokeWidth="0.8" fill="none" opacity="0.35" />
        </svg>
      )
    case 'cyprinid':
      // Høy ryggfinne, dyp kropp, enkel form — karpefisk.
      return (
        <svg {...common}>
          <path d="M10 32 C 22 14, 70 12, 90 28 L 102 20 L 104 32 L 102 44 L 90 36 C 70 52, 22 50, 10 32 Z" />
          <path d="M46 12 Q 56 2 66 14" opacity="0.85" />
          <path d="M58 46 L 62 54 L 68 46 Z" opacity="0.7" />
          <circle cx="22" cy="30" r="2" fill="#0f172a" />
        </svg>
      )
  }
}
