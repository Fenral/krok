import { useState, type FormEvent } from 'react'
import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type Errors = Partial<Record<'art' | 'vekt' | 'lengde' | 'sted', string>>

export default function NyFangst() {
  useDocumentTitle('Ny fangst — Krok')
  const [errors, setErrors] = useState<Errors>({})
  const [saved, setSaved] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const next: Errors = {}
    if (!data.get('art')) next.art = 'Velg art.'
    if (!data.get('sted')) next.sted = 'Skriv hvor du fanget den.'
    const vekt = String(data.get('vekt') ?? '').trim()
    if (vekt && Number.isNaN(Number(vekt.replace(',', '.')))) {
      next.vekt = 'Vekt m&aring; v&aelig;re et tall (kg).'
    }
    const lengde = String(data.get('lengde') ?? '').trim()
    if (lengde && Number.isNaN(Number(lengde.replace(',', '.')))) {
      next.lengde = 'Lengde m&aring; v&aelig;re et tall (cm).'
    }
    setErrors(next)
    if (Object.keys(next).length > 0) {
      const firstKey = Object.keys(next)[0]
      document.getElementById(firstKey)?.focus()
      return
    }
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-12">
      <PageHeader
        titleId="ny-fangst-title"
        title="Ny fangst"
        description="Velg art og fyll inn detaljene. Det meste er valgfritt — bare art og sted m&aring; med."
      />

      {saved && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
        >
          Fangsten er klar til lagring. Backend kobles til i n&aelig;ste runde.
        </div>
      )}

      <form
        noValidate
        onSubmit={handleSubmit}
        aria-labelledby="ny-fangst-title"
        className="space-y-8 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 md:p-8"
      >
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-slate-100">
            Hva fanget du?
          </legend>

          <div>
            <label
              htmlFor="art"
              className="block text-sm font-medium text-slate-100"
            >
              Art
            </label>
            <select
              id="art"
              name="art"
              required
              defaultValue=""
              aria-invalid={!!errors.art}
              aria-describedby={errors.art ? 'art-error' : undefined}
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <option value="" disabled>
                Velg art...
              </option>
              <option value="orret">&Oslash;rret</option>
              <option value="roye">R&oslash;ye</option>
              <option value="harr">Harr</option>
              <option value="abbor">Abbor</option>
              <option value="gjedde">Gjedde</option>
              <option value="sik">Sik</option>
              <option value="laks">Laks</option>
              <option value="sjoorret">Sj&oslash;&oslash;rret</option>
              <option value="makrell">Makrell</option>
              <option value="torsk">Torsk</option>
              <option value="sei">Sei</option>
            </select>
            {errors.art && (
              <p id="art-error" role="alert" className="mt-1 text-sm text-red-400">
                <span aria-hidden="true">⚠ </span>
                {errors.art}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="vekt"
                className="block text-sm font-medium text-slate-100"
              >
                Vekt (kg){' '}
                <span className="text-slate-400">(valgfritt)</span>
              </label>
              <input
                id="vekt"
                name="vekt"
                type="text"
                inputMode="decimal"
                aria-invalid={!!errors.vekt}
                aria-describedby={
                  errors.vekt ? 'vekt-error vekt-hint' : 'vekt-hint'
                }
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                placeholder="2,35"
              />
              <p id="vekt-hint" className="mt-1 text-xs text-slate-400">
                F.eks. 2,35
              </p>
              {errors.vekt && (
                <p id="vekt-error" role="alert" className="mt-1 text-sm text-red-400">
                  <span aria-hidden="true">⚠ </span>
                  {errors.vekt}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lengde"
                className="block text-sm font-medium text-slate-100"
              >
                Lengde (cm){' '}
                <span className="text-slate-400">(valgfritt)</span>
              </label>
              <input
                id="lengde"
                name="lengde"
                type="text"
                inputMode="decimal"
                aria-invalid={!!errors.lengde}
                aria-describedby={
                  errors.lengde ? 'lengde-error lengde-hint' : 'lengde-hint'
                }
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                placeholder="52"
              />
              <p id="lengde-hint" className="mt-1 text-xs text-slate-400">
                Lengde i centimeter.
              </p>
              {errors.lengde && (
                <p
                  id="lengde-error"
                  role="alert"
                  className="mt-1 text-sm text-red-400"
                >
                  <span aria-hidden="true">⚠ </span>
                  {errors.lengde}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-slate-100">
            Hvor?
          </legend>
          <div>
            <label
              htmlFor="sted"
              className="block text-sm font-medium text-slate-100"
            >
              Vann / sted
            </label>
            <input
              id="sted"
              name="sted"
              type="text"
              required
              autoComplete="off"
              aria-invalid={!!errors.sted}
              aria-describedby={errors.sted ? 'sted-error sted-hint' : 'sted-hint'}
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              placeholder="F.eks. Mj&oslash;sa, Brumunddal"
            />
            <p id="sted-hint" className="mt-1 text-xs text-slate-400">
              Skriv navn p&aring; vann og kommune.
            </p>
            {errors.sted && (
              <p id="sted-error" role="alert" className="mt-1 text-sm text-red-400">
                <span aria-hidden="true">⚠ </span>
                {errors.sted}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="gps"
              className="block text-sm font-medium text-slate-100"
            >
              GPS-koordinater{' '}
              <span className="text-slate-400">(valgfritt)</span>
            </label>
            <input
              id="gps"
              name="gps"
              type="text"
              autoComplete="off"
              aria-describedby="gps-hint"
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              placeholder="60.7945, 11.0680"
            />
            <p id="gps-hint" className="mt-1 text-xs text-slate-400">
              Bredde- og lengdegrad. Vi henter dette automatisk i n&aelig;ste runde.
            </p>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-lg font-semibold text-slate-100">Bilder</legend>
          <p className="text-sm text-slate-300">
            Last opp inntil 5 bilder. Kameraet starter med bakkameraet p&aring;
            mobil.
          </p>
          <label
            htmlFor="file-input"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-700 focus-within:ring-2 focus-within:ring-sky-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-950"
          >
            <span aria-hidden="true">+</span>
            Legg til bilde
            <input
              id="file-input"
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="sr-only"
            />
          </label>
          <p className="text-xs text-slate-400">
            Du kan beskrive bildet for skjermlesere etter at det er lastet opp.
          </p>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-lg font-semibold text-slate-100">Notat</legend>
          <label htmlFor="notat" className="sr-only">
            Notat om fangsten
          </label>
          <textarea
            id="notat"
            name="notat"
            rows={4}
            aria-describedby="notat-hint"
            className="block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            placeholder="Vind, fluen som funket, kompis som var med ..."
          />
          <p id="notat-hint" className="text-xs text-slate-400">
            Valgfritt. Hold det kort — du kan utvide senere.
          </p>
        </fieldset>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="reset"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            onClick={() => setSaved(false)}
          >
            Nullstill
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Lagre fangst
          </button>
        </div>
      </form>
    </div>
  )
}
