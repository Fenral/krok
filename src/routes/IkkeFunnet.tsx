import { Link } from 'react-router-dom'

export function IkkeFunnet() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-tittel text-2xl tracking-wide text-lys">Denne siden har blitt forhekset bort.</h1>
      <Link to="/bibliotek" className="mt-6 font-broedtekst italic text-pergament/60 underline decoration-dotted hover:text-lys">
        Tilbake til biblioteket
      </Link>
    </main>
  )
}
