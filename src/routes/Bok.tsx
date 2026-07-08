import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useLibrary } from '../lib/library'
import { modifiedAt } from '../types'

const datoFmt = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'long', timeStyle: 'short' })

export function Bok() {
  const { workId } = useParams()
  const [params, setParams] = useSearchParams()
  const { ready, works, downloadVersion, getVersionText } = useLibrary()
  const work = useMemo(() => works.find((w) => w.id === workId), [works, workId])

  const valgtId = params.get('v') ?? work?.versions[0]?.doc.id
  const valgt = work?.versions.find((v) => v.doc.id === valgtId) ?? work?.versions[0]
  const [lastet, setLastet] = useState<{ id: string; avsnitt: string[] } | null>(null)
  const tekst = lastet && lastet.id === valgt?.doc.id ? lastet.avsnitt : null

  useEffect(() => {
    if (!valgt) return
    let aktiv = true
    void getVersionText(valgt.doc.id).then((t) => {
      if (aktiv && t) {
        setLastet({
          id: valgt.doc.id,
          avsnitt: t.text.split(/\n{2,}|\r\n{2,}/).map((a) => a.trim()).filter(Boolean),
        })
      }
    })
    return () => {
      aktiv = false
    }
  }, [valgt, getVersionText])

  if (!ready) return <main className="min-h-screen p-10 text-center font-broedtekst italic text-pergament/50">Biblioteket vekkes …</main>

  if (!work || !valgt) {
    return (
      <main className="min-h-screen p-10 text-center">
        <p className="font-tittel text-xl text-pergament/80">Denne boken har noen fjernet fra hylla.</p>
        <Link to="/bibliotek" className="mt-4 inline-block font-broedtekst italic text-lys underline decoration-dotted">
          Tilbake til biblioteket
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10 md:px-10">
      <nav className="mx-auto mb-8 flex max-w-4xl items-center justify-between">
        <Link to="/bibliotek" className="font-broedtekst text-sm italic text-pergament/50 hover:text-lys">
          ← Tilbake til hylla
        </Link>
        <span className="font-broedtekst text-xs italic text-pergament/35">
          Sist redigert {datoFmt.format(modifiedAt(work.versions[0].doc))}
        </span>
      </nav>

      <h1 className="mx-auto max-w-4xl text-center font-tittel text-3xl tracking-wide text-lys">{work.title}</h1>

      {/* Versjonshistorikk */}
      <section className="mx-auto mt-8 max-w-4xl" aria-label="Versjonshistorikk">
        <h2 className="font-tittel text-sm uppercase tracking-[0.2em] text-pergament/45">
          Versjoner ({work.versions.length})
        </h2>
        <ul className="mt-3 divide-y divide-lys/10 rounded-md border border-lys/15 bg-natt-800/60">
          {work.versions.map((v) => {
            const aktivRad = v.doc.id === valgt.doc.id
            return (
              <li key={v.doc.id} className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 ${aktivRad ? 'bg-natt-700/60' : ''}`}>
                <button
                  type="button"
                  onClick={() => setParams(v.doc.id === work.versions[0].doc.id ? {} : { v: v.doc.id })}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className={`block truncate font-broedtekst text-sm ${aktivRad ? 'text-lys' : 'text-pergament/85'}`}>
                    {v.doc.fileName}
                  </span>
                  <span className="mt-0.5 block font-broedtekst text-xs italic text-pergament/45">
                    {datoFmt.format(modifiedAt(v.doc))}
                    {v.doc.modifiedDocx === null && ' (fildato)'}
                    {` · ${v.doc.wordCount.toLocaleString('nb-NO')} ord`}
                  </span>
                </button>
                {v.probableDuplicate && (
                  <span className="rounded-full border border-lys/25 px-2 py-0.5 font-broedtekst text-[11px] italic text-pergament/50">
                    trolig duplikat
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => void downloadVersion(v.doc.id, v.doc.fileName)}
                  className="rounded-md border border-lys/30 px-3 py-1 font-broedtekst text-xs text-lys transition-colors hover:bg-lys/10"
                >
                  Last ned .docx
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Pergamentleser */}
      <article className="pergament-flate mx-auto mt-10 max-w-3xl rounded-sm px-8 py-12 shadow-[0_20px_60px_rgba(0,0,0,0.55)] md:px-16" aria-label="Boktekst">
        {tekst === null ? (
          <p className="text-center font-broedtekst italic text-pergament-blekk/50">Sidene blas opp …</p>
        ) : tekst.length === 0 ? (
          <p className="text-center font-broedtekst italic text-pergament-blekk/50">Denne versjonen er uten lesbar tekst.</p>
        ) : (
          <div className="leser-tekst font-broedtekst text-pergament-blekk">
            {tekst.map((avsnitt, i) => (
              <p key={i}>{avsnitt}</p>
            ))}
          </div>
        )}
      </article>
    </main>
  )
}
