import { useState, type FormEvent } from 'react'
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
    // Vertikalt sentrert hero — bryter tidligere "card-klemt-øverst"-følelsen.
    // min-h-[calc(100vh-…)] sørger for at kortet faktisk lever midt i visning,
    // ikke i toppen av en stor svart canvas.
    <div className="relative mx-auto flex min-h-[calc(100vh-13rem)] max-w-md flex-col justify-center px-4 py-10">
      {/* Subtil radial glow bak kortet — gir dybde uten å lyse opp baseline. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-64 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.10),transparent_60%)]"
      />

      <header className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 ring-1 ring-sky-400/30">
          <HookIcon className="h-7 w-7 text-sky-300" />
        </div>
        <h1
          id="login-title"
          className="text-3xl font-semibold tracking-tight text-slate-100"
        >
          Logg inn p&aring; Krok
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-base text-slate-300">
          Vi sender deg en magisk lenke p&aring; e-post. Ingen passord &aring; huske
          — og er du ny, oppretter vi kontoen din n&aring;r du &aring;pner lenken.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/40">
        {submitted ? (
          <div
            role="status"
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
          >
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
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 active:translate-y-px active:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Send magisk lenke
            </button>

            <div className="mt-5 flex items-center gap-3 rounded-md border border-slate-800 bg-slate-950/60 p-3">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-300"
              >
                +
              </span>
              <p className="text-xs text-slate-300">
                <span className="font-medium text-slate-100">Ny p&aring; Krok?</span>{' '}
                Skriv inn e-posten din ovenfor — vi oppretter konto automatisk
                n&aring;r du &aring;pner lenken.
              </p>
            </div>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Trenger du hjelp?{' '}
        <a
          href="/kontakt"
          className="text-sky-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Kontakt oss
        </a>
      </p>
    </div>
  )
}
