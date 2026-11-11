import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Nav, Toasts } from './components/Chrome'
import { Preloader } from './components/Preloader'
import { shouldPlayIntro } from './lib/intro'
import { setIntroPending } from './lib/motion'
import { Home } from './pages/Home'
import { Kitchen } from './pages/Kitchen'
import { Shop } from './pages/Shop'

const playIntro = shouldPlayIntro()
setIntroPending(playIntro)

export function App() {
  const location = useLocation()
  const [intro, setIntro] = useState(playIntro)

  useEffect(() => {
    if (!intro) document.getElementById('boot')?.remove()
  }, [intro])

  if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
    return <Navigate to={`${location.pathname.replace(/\/+$/, '')}${location.search}${location.hash}`} replace />
  }

  return (
    <>
      {location.pathname === '/kitchen' ? null : <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/order" element={<Navigate to={`/shop${location.search}`} replace />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/dashboard" element={<Navigate to="/kitchen" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toasts />
      {intro ? <Preloader onDone={() => setIntro(false)} /> : null}
    </>
  )
}
