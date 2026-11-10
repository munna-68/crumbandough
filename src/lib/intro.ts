import { prefersReducedMotion } from './format'

const INTRO_KEY = 'crumbandough.intro.v1'

/**
 * The dough intro plays once per browser session on the home page.
 * ?intro=1 forces it for a recording; ?intro=0 skips it.
 */
export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false
  const flag = new URLSearchParams(window.location.search).get('intro')
  if (flag === '0') return false
  if (flag === '1') return true
  if (prefersReducedMotion()) return false
  try {
    return window.sessionStorage.getItem(INTRO_KEY) !== '1'
  } catch {
    return true
  }
}

export function markIntroPlayed() {
  try {
    window.sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* private browsing — just play it again next visit */
  }
}
