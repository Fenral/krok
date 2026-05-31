import { useState, type FormEvent } from 'react'
import PageHeader from '../components/PageHeader'
import HookIcon from '../components/HookIcon'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Login() {
  useDocumentTitle('Logg inn på Krok — Krok')
  const [epost, setEpost] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!epost || !epost.includes('@')) {
      setError('Skriv inn en gyldig e-postadresse.')
      const el = document.getElementById('epost')
      el?.focus()
      return
    }
    setError(null)
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 md:py-16">
      <PageHeader
        titleId="login-title"
        eyebrow="Velkommen"
        title="Logg inn på Krok"
        description="Vi sender deg en magisk lenke på e-post. Ingen passord å huske."
      />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-950/40">
        <div className="mb-6 flex items-center gap-3 text-sky-300">
          <HookIcon className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Magisk lenke
          </span>
        </div>

        {submitted ? (
          <div role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <p className="font-medium">Sjekk innboksen din</p>
            <p className="mt-1 text-emerald-200/90">
              Vi har sendt en p&aring;loggingslenke til {epost}. Åpne den fra
              samme enhet for &aring; logge inn.
            </p>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} aria-labelledby="login-title">
            <div>
              <label
                htmlFor="epost"
                className="block text-sm font-medium text-slate-100"
              >
                E-post
              </label>
              <input
                id="epost"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={epost}
                onChange={(e) => setEpost(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'epost-error epost-hint' : 'epost-hint'}
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                placeholder="navn@eksempel.no"
              />
              <p id="epost-hint" className="mt-2 text-xs text-slate-400">
                Vi bruker e-posten din kun for innlogging.
              </p>
              {error && (
                <p
                  id="epost-error"
                  role="alert"
                  className="mt-2 text-sm text-red-400"
                >
                  <span aria-hidden="true">⚠ </span>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Send magisk lenke
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Ny her? Skriv inn e-post og vi oppretter konto automatisk.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
