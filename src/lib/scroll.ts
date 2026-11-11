import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './format'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Mount once, high in the tree. Reduced-motion users keep native scrolling. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })
    lenis = instance

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    instance.on('scroll', ScrollTrigger.update)

    let cancelled = false
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh()
    }
    document.fonts?.ready.then(refresh).catch(() => undefined)
    window.addEventListener('load', refresh)
    window.setTimeout(refresh, 600)

    return () => {
      cancelled = true
      window.removeEventListener('load', refresh)
      instance.off('scroll', ScrollTrigger.update)
      instance.destroy()
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      if (lenis === instance) lenis = null
    }
  }, [])

  return null
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true })
    return
  }
  window.scrollTo({ top: 0, behavior: 'auto' })
}

/** Scroll to an in-page section, clearing the sticky header. */
export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const element = document.getElementById(id)
  if (!element) return false

  if (lenis) {
    lenis.scrollTo(element, { offset: -78, duration: 1.05, force: true })
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY - 78
    window.scrollTo({ top, behavior: 'smooth' })
  }
  return true
}

let locks = 0
let hardLocks = 0

/**
 * Freeze page scroll under a dialog or transition. Nested calls are counted.
 * `keepBar` (used by the page transition) only stops Lenis, which already
 * swallows wheel and touch, so the scrollbar stays put and the page width
 * doesn't jump. Dialogs, or any page without Lenis, also hide overflow.
 */
export function lockScroll({ keepBar = false }: { keepBar?: boolean } = {}) {
  locks += 1
  lenis?.stop()
  if (keepBar && lenis) return
  hardLocks += 1
  document.documentElement.classList.add('is-locked')
}

export function unlockScroll({ keepBar = false }: { keepBar?: boolean } = {}) {
  locks = Math.max(0, locks - 1)
  if (!(keepBar && lenis)) {
    hardLocks = Math.max(0, hardLocks - 1)
    if (hardLocks === 0) document.documentElement.classList.remove('is-locked')
  }
  if (locks === 0) lenis?.start()
}

export function refreshScroll() {
  ScrollTrigger.refresh()
}

export function scrollForRoute(to: string) {
  const hash = to.includes('#') ? to.split('#')[1] : ''
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (hash) {
        window.setTimeout(() => {
          refreshScroll()
          scrollToHash(hash)
        }, 100)
      } else {
        scrollToTop()
        window.setTimeout(refreshScroll, 140)
      }
    })
  })
}
