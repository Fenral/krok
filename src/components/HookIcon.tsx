type HookIconProps = {
  className?: string
  title?: string
}

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
      <path d="M14 4v9a5 5 0 1 1-10 0" />
      <circle cx="14" cy="3.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  )
}
