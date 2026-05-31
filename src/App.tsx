import { Routes, Route, Link } from 'react-router-dom'
import Login from './routes/Login'
import Logg from './routes/Logg'
import Kart from './routes/Kart'
import Arter from './routes/Arter'
import Profil from './routes/Profil'
import NyFangst from './routes/NyFangst'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav aria-label="Hovedmeny" className="border-b border-slate-800 p-4 flex gap-4">
        <Link to="/logg">Logg</Link>
        <Link to="/kart">Kart</Link>
        <Link to="/arter">Arter</Link>
        <Link to="/profil">Profil</Link>
      </nav>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Logg />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logg" element={<Logg />} />
          <Route path="/logg/ny" element={<NyFangst />} />
          <Route path="/kart" element={<Kart />} />
          <Route path="/arter" element={<Arter />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </main>
    </div>
  )
}
