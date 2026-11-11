import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PAGE_ENTER, gsap, setTransitionPending } from '../lib/motion'
import { prefersReducedMotion } from '../lib/format'
import { lockScroll, scrollForRoute, unlockScroll } from '../lib/scroll'

/*
 * The chocolate pour. A cocoa sheet with a dripping lower edge falls over the
 * page, the destination's name rises in pink, the route swaps underneath, and
 * the sheet is pulled back up with its drips stretching after it.
 */

interface TransitionValue {
  go: (to: string, label?: string) => void
}

const Ctx = createContext<TransitionValue | null>(null)

export function useTransition() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTransition must be inside TransitionProvider')
  return ctx
}

const LABELS: Record<string, string> = {
  '/': 'home',
  '/shop': 'build a box',
  '/kitchen': 'the kitchen',
}

function labelFor(to: string) {
  const path = to.split(/[?#]/)[0] || '/'
  return LABELS[path] ?? 'one sec'
}

/** A run of chocolate drips along the bottom of a 1440×160 box. */
function dripPath() {
  const base = 26
  const drips: Array<[number, number, number]> = [
    [70, 26, 54],
    [210, 34, 104],
    [330, 22, 40],
    [470, 30, 82],
    [640, 40, 126],
    [790, 24, 48],
    [930, 32, 96],
    [1080, 26, 60],
    [1220, 36, 112],
    [1360, 24, 44],
  ]
  let d = `M0,0 H1440 V${base} `
  // Walk right-to-left so the shape closes cleanly.
  for (let i = drips.length - 1; i >= 0; i--) {
    const [x, w, depth] = drips[i]
    const r = w * 0.42
    const y = base + depth
    d += `L${x + w},${base} `
    d += `C${x + w * 0.4},${base} ${x + r},${y - depth * 0.55} ${x + r},${y - r} `
    d += `A${r},${r} 0 0 1 ${x - r},${y - r} `
    d += `C${x - r},${y - depth * 0.55} ${x - w * 0.4},${base} ${x - w},${base} `
  }
  d += `L0,${base} Z`
  return d
}

const DRIP = dripPath()

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const busy = useRef(false)
  const sheet = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const here = useRef(location.pathname + location.search)
  here.current = location.pathname + location.search

  const go = useCallback(
    (to: string, customLabel?: string) => {
      if (busy.current) return
      const [path] = to.split('#')
      if (path === here.current || (path === '' && to.startsWith('#'))) {
        scrollForRoute(to)
        return
      }
      const el = sheet.current
      if (!el || prefersReducedMotion()) {
        navigate(to)
        scrollForRoute(to)
        window.setTimeout(() => window.dispatchEvent(new Event(PAGE_ENTER)), 30)
        return
      }
      busy.current = true
      lockScroll()
      setTransitionPending(true)
      const text = customLabel ?? labelFor(to)
      if (label.current) {
        label.current.innerHTML = text
          .split('')
          .map((ch) => `<span class="pt__char">${ch === ' ' ? '&nbsp;' : ch}</span>`)
          .join('')
      }
      const chars = el.querySelectorAll('.pt__char')
      const edge = el.querySelector('.pt__edge')
      const cookie = el.querySelector('.pt__cookie')

      gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .set(el, { visibility: 'visible', yPercent: -100 })
        .set(edge, { scaleY: 0.25 })
        .to(el, { yPercent: 0, duration: 0.62 })
        .to(edge, { scaleY: 1, duration: 0.7, ease: 'power2.out' }, 0.05)
        .fromTo(chars, { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.025, ease: 'expo.out' }, 0.38)
        .fromTo(cookie, { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, 0.32)
        .call(() => {
          navigate(to)
          scrollForRoute(to)
        })
        .to({}, { duration: 0.32 })
        .to(chars, { yPercent: -110, duration: 0.35, stagger: 0.015, ease: 'power3.in' })
        .to(cookie, { scale: 0, rotation: 120, duration: 0.35, ease: 'power3.in' }, '<')
        .call(() => {
          unlockScroll()
          setTransitionPending(false)
          window.dispatchEvent(new Event(PAGE_ENTER))
        })
        .to(el, { yPercent: -118, duration: 0.8, ease: 'power3.inOut' }, '<0.1')
        .to(edge, { scaleY: 1.9, duration: 0.8, ease: 'power2.in' }, '<')
        .set(el, { visibility: 'hidden' })
        .call(() => {
          busy.current = false
        })
    },
    [navigate],
  )

  const value = useMemo(() => ({ go }), [go])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pt" ref={sheet} aria-hidden="true">
        <div className="pt__sheet">
          <img className="pt__cookie" src="/cookies/oreo.webp" alt="" width={96} height={96} />
          <span className="pt__label" ref={label} />
        </div>
        <svg className="pt__edge" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path d={DRIP} />
        </svg>
      </div>
    </Ctx.Provider>
  )
}

/** A link that pours the chocolate sheet before routing. */
export function TLink({
  to,
  label,
  className,
  children,
  onClick,
  ariaLabel,
}: {
  to: string
  label?: string
  className?: string
  children: ReactNode
  onClick?: () => void
  ariaLabel?: string
}) {
  const { go } = useTransition()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    onClick?.()
    go(to, label)
  }
  return (
    <a href={to} onClick={handle} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
