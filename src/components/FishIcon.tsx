type FishIconProps = {
  className?: string
  title?: string
}

/**
 * Fisk-glyph. Brukes i tomtilstander og illustrasjoner der vi vil
 * signalisere fiskekontekst uten å resirkulere brand-mark (krok).
 */
export default function FishIcon({ className, title }: FishIconProps) {
  return (
    <svg
      viewBox="0 0 64 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {/* Body */}
      <path d="M2 16 Q 18 2 38 16 Q 18 30 2 16 Z" />
      {/* Tail */}
      <path d="M38 16 L 56 6 L 50 16 L 56 26 Z" />
      {/* Eye */}
      <circle cx="14" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
      {/* Subtle gill curve */}
      <path d="M20 11 Q 22 16 20 21" />
    </svg>
  )
}
