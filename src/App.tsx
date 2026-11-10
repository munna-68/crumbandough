import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { scrollToTop } from './lib/scroll'
import { Dashboard } from './pages/Dashboard'
import { Home } from './pages/Home'
import { Order } from './pages/Order'

export function App() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) scrollToTop()
  }, [location.pathname, location.hash])

  // Strip trailing slashes so active links stay consistent.
  if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
    return (
      <Navigate
        to={`${location.pathname.replace(/\/+$/, '')}${location.search}${location.hash}`}
        replace
      />
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order" element={<Order />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
