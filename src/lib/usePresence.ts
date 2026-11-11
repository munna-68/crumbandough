import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './format'

/** Keeps an overlay mounted long enough for its exit animation. */
export function usePresence(open: boolean, exitDuration = 260) {
  const [mounted, setMounted] = useState(open)
  const [isClosing, setIsClosing] = useState(false)
  const duration = prefersReducedMotion() ? 0 : exitDuration

  useEffect(() => {
    if (open) {
      setMounted(true)
      setIsClosing(false)
      return
    }
    if (!mounted) return
    if (duration === 0) {
      setMounted(false)
      return
    }
    setIsClosing(true)
    const t = window.setTimeout(() => {
      setMounted(false)
      setIsClosing(false)
    }, duration)
    return () => window.clearTimeout(t)
  }, [open, duration, mounted])

  return { mounted, isClosing }
}
