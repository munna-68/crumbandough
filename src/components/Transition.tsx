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
 * The box. Two baby-pink cardboard flaps fold in from the sides (in 3D) and
 * meet in the middle; the bitten cocoa badge stamps onto the seam like a seal;
 * the route swaps behind it; then the flaps fold back open and the seal splits
 * in half along the seam, each half riding away on its flap.
 */

interface TransitionValue {
  go: (to: string) => void
}

const Ctx = createContext<TransitionValue | null>(null)

export function useTransition() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTransition must be inside TransitionProvider')
  return ctx
}

/** The seal: the badge with two bites out of its rim, as in the preloader. */
export function Seal({ id, className = 'pt__seal-art' }: { id: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <rect width="200" height="200" fill="#fff" />
          {[
            [168, 40, 16],
            [180, 58, 15],
            [184, 79, 13],
            [24, 146, 15],
            [36, 163, 16],
            [55, 176, 13],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#000" />
          ))}
        </mask>
      </defs>
      <circle cx="100" cy="100" r="92" className="pt__seal-disc" mask={`url(#${id})`} />
      <circle cx="100" cy="100" r="78" className="pt__seal-ring" mask={`url(#${id})`} />
      <text x="100" y="92" textAnchor="middle" className="pt__seal-word">
        crumb
      </text>
      <text x="100" y="110" textAnchor="middle" className="pt__seal-and">
        AND
      </text>
      <text x="100" y="140" textAnchor="middle" className="pt__seal-word">
        dough
      </text>
    </svg>
  )
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const busy = useRef(false)
  const root = useRef<HTMLDivElement>(null)
  const here = useRef(location.pathname + location.search)
  here.current = location.pathname + location.search

  const go = useCallback(
    (to: string) => {
      if (busy.current) return
      const [path] = to.split('#')
      if (path === here.current || (path === '' && to.startsWith('#'))) {
        scrollForRoute(to)
        return
      }
      const el = root.current
      if (!el || prefersReducedMotion()) {
        navigate(to)
        scrollForRoute(to)
        window.setTimeout(() => window.dispatchEvent(new Event(PAGE_ENTER)), 30)
        return
      }
      busy.current = true
      lockScroll()
      setTransitionPending(true)
      const q = gsap.utils.selector(el)
      const left = q('.pt__flap--l')
      const right = q('.pt__flap--r')
      const shades = q('.pt__shade')
      const seals = q('.pt__seal')

      gsap
        .timeline()
        .set(el, { visibility: 'visible' })
        .set(left, { rotationY: -96 })
        .set(right, { rotationY: 96 })
        .set(shades, { opacity: 0.4 })
        .set(seals, { scale: 1.9, autoAlpha: 0, rotation: -40 })
        // fold shut
        .to(left, { rotationY: 0, duration: 0.62, ease: 'power3.in' }, 0)
        .to(right, { rotationY: 0, duration: 0.62, ease: 'power3.in' }, 0.04)
        .to(shades, { opacity: 0, duration: 0.62, ease: 'power2.in' }, 0)
        // the thud
        .to(el, { keyframes: { y: [0, 5, -2, 0] }, duration: 0.28, ease: 'power2.out' }, 0.66)
        // seal it
        .to(seals, { scale: 1, autoAlpha: 1, rotation: -8, duration: 0.42, ease: 'back.out(2.2)' }, 0.7)
        .call(() => {
          navigate(to)
          scrollForRoute(to)
        })
        .to({}, { duration: 0.18 })
        .call(() => {
          unlockScroll()
          setTransitionPending(false)
          window.dispatchEvent(new Event(PAGE_ENTER))
        })
        // fold open; the seal splits along the seam
        .addLabel('open')
        .to(left, { rotationY: -100, duration: 0.85, ease: 'power3.inOut' }, 'open')
        .to(right, { rotationY: 100, duration: 0.85, ease: 'power3.inOut' }, 'open+=0.05')
        .to(shades, { opacity: 0.45, duration: 0.85, ease: 'power2.in' }, 'open')
        .set(el, { visibility: 'hidden' })
        .set([left, right], { rotationY: 0 })
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
      <div className="pt" ref={root} aria-hidden="true">
        {(['l', 'r'] as const).map((side) => (
          <div key={side} className={`pt__flap pt__flap--${side}`}>
            <span className="pt__tab" />
            <span className="pt__seal">
              <Seal id={`pt-bites-${side}`} />
            </span>
            <span className="pt__shade" />
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

/** A link that closes the box before routing. */
export function TLink({
  to,
  className,
  children,
  onClick,
  ariaLabel,
}: {
  to: string
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
    go(to)
  }
  return (
    <a href={to} onClick={handle} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
