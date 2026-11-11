import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export { gsap, ScrollTrigger, SplitText, useGSAP }

export const REDUCED = '(prefers-reduced-motion: reduce)'
export const MOTION = '(prefers-reduced-motion: no-preference)'

/** Fired by the preloader when the hero should start its entrance. */
export const INTRO_REVEAL = 'cd:intro-reveal'
/** Fired by the page transition once the new page is uncovered. */
export const PAGE_ENTER = 'cd:page-enter'

let introPending = false
export function setIntroPending(v: boolean) {
  introPending = v
}
export function isIntroPending() {
  return introPending
}

let transitionPending = false
export function setTransitionPending(v: boolean) {
  transitionPending = v
}
export function isTransitionPending() {
  return transitionPending
}

/**
 * Run `play` when the page is actually visible: after the preloader chomps
 * through, after a page transition lifts, or straight away.
 */
export function onPageReady(play: () => void): () => void {
  let done = false
  let frame = 0
  const run = () => {
    if (done) return
    done = true
    play()
  }
  // The events fire from inside other timelines' callbacks. GSAP files any
  // animation created in a callback under that timeline's context, so the
  // preloader unmounting would revert the hero entrance with it. Starting on
  // the next frame keeps the entrance in this page's own context.
  const later = () => {
    frame = window.requestAnimationFrame(run)
  }
  const evt = introPending ? INTRO_REVEAL : transitionPending ? PAGE_ENTER : null
  if (evt) {
    window.addEventListener(evt, later, { once: true })
    return () => {
      window.removeEventListener(evt, later)
      window.cancelAnimationFrame(frame)
    }
  }
  frame = window.requestAnimationFrame(run)
  return () => window.cancelAnimationFrame(frame)
}
