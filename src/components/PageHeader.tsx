import type { ReactNode } from 'react'

type PageHeaderProps = {
  titleId: string
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
}

export default function PageHeader({
  titleId,
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-sky-300">
            {eyebrow}
          </p>
        )}
        <h1
          id={titleId}
          className="text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-base text-slate-300">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  )
}
