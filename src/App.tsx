import { useEffect, type ReactNode } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { EffectsCanvas } from './components/effects/EffectsCanvas'
import { WandCursor } from './components/effects/WandCursor'
import { useLibrary } from './lib/library'
import { Bibliotek } from './routes/Bibliotek'
import { Bok } from './routes/Bok'
import { IkkeFunnet } from './routes/IkkeFunnet'
import { Inngang } from './routes/Inngang'

/** Mykt vern: uten avlagt ed sendes man tilbake til pergamentet. */
function EdKreves({ children }: { children: ReactNode }) {
  const { ready, oathPassed } = useLibrary()
  const navigate = useNavigate()
  useEffect(() => {
    if (ready && !oathPassed) navigate('/', { replace: true })
  }, [ready, oathPassed, navigate])
  if (!ready || !oathPassed) return null
  return <>{children}</>
}

export function App() {
  const location = useLocation()
  const iBiblioteket = location.pathname !== '/'

  return (
    <>
      <Routes>
        <Route path="/" element={<Inngang />} />
        <Route
          path="/bibliotek"
          element={
            <EdKreves>
              <Bibliotek />
            </EdKreves>
          }
        />
        <Route
          path="/bok/:workId"
          element={
            <EdKreves>
              <Bok />
            </EdKreves>
          }
        />
        <Route path="*" element={<IkkeFunnet />} />
      </Routes>
      <EffectsCanvas ambient={iBiblioteket} />
      {iBiblioteket && <WandCursor />}
    </>
  )
}
