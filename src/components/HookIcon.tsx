type HookIconProps = {
  className?: string
  title?: string
}

/**
 * Fiskekrok-glyph for Krok-merket. Tegnet med tydelig:
 *  - rett øvre skaft (eye/ring),
 *  - lang nedre kurve (bend),
 *  - oppoverbøyd point + barb (motkrok),
 * slik at silhuetten leses som «krok», ikke som bokstaven J.
 */
export default function HookIcon({ className, title }: HookIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {/* Eye/ring øverst */}
      <circle cx="14" cy="3.5" r="1.5" />
      {/* Skaft + kurve + spids */}
      <path d="M14 5v8a5 5 0 1 1-10 0V11" />
      {/* Barb / motkrok som peker oppover-utover fra spidsen */}
      <path d="M4 11l3-1.5" />
    </svg>
  )
}
