import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../lib/format'
import { scrollForRoute } from '../lib/scroll'

interface WipePoint {
  x: number
  y: number
}

interface TransitionValue {
  go: (to: string, point?: WipePoint) => void
}

const TransitionCtx = createContext<TransitionValue | null>(null)

function usePageTransition(): TransitionValue {
  const ctx = useContext(TransitionCtx)
  if (!ctx) throw new Error('usePageTransition must be used inside <TransitionProvider>')
  return ctx
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const overlayRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const busyRef = useRef(false)

  const go = useCallback(
    (to: string, point?: WipePoint) => {
      if (busyRef.current) return
      const overlay = overlayRef.current
      const mark = markRef.current
      const reduced = prefersReducedMotion()

      if (!overlay || !mark || reduced) {
        navigate(to)
        scrollForRoute(to)
        return
      }

      const x = point?.x ?? window.innerWidth / 2
      const y = point?.y ?? window.innerHeight / 2
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      busyRef.current = true
      document.documentElement.classList.add('is-wiping')
      gsap.killTweensOf([overlay, mark])
      gsap.set(overlay, {
        autoAlpha: 1,
        clipPath: `circle(0px at ${x}px ${y}px)`,
      })
      gsap.set(mark, { autoAlpha: 0, y: 10 })

      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 })
          document.documentElement.classList.remove('is-wiping')
          busyRef.current = false
        },
      })

      timeline
        .to(overlay, {
          clipPath: `circle(${radius + 24}px at ${x}px ${y}px)`,
          duration: 0.36,
          ease: 'power3.inOut',
        })
        .to(
          mark,
          { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' },
          '-=0.08',
        )
        .add(() => {
          navigate(to)
          scrollForRoute(to)
        })
        .to(mark, { autoAlpha: 0, duration: 0.1, ease: 'power1.in' }, '+=0.04')
        .to(
          overlay,
          {
            clipPath: `circle(0px at ${x}px ${y}px)`,
            duration: 0.3,
            ease: 'power3.inOut',
          },
          '-=0.02',
        )
    },
    [navigate],
  )

  return (
    <TransitionCtx.Provider value={{ go }}>
      {children}
      <div className="page-wipe" ref={overlayRef} aria-hidden="true">
        <div className="page-wipe__mark" ref={markRef}>
          <span className="page-wipe__cookie" />
          crumb and dough
        </div>
      </div>
    </TransitionCtx.Provider>
  )
}

interface WipeLinkProps {
  to: string
  children: ReactNode
  className?: string
  ariaLabel?: string
  title?: string
  onClick?: () => void
}

/** An internal link that leaves through a circular wipe from the click point. */
export function WipeLink({
  to,
  children,
  className,
  ariaLabel,
  title,
  onClick,
}: WipeLinkProps) {
  const { go } = usePageTransition()

  function handleClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    onClick?.()
    const keyboard = event.detail === 0
    go(
      to,
      keyboard
        ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        : { x: event.clientX, y: event.clientY },
    )
  }

  return (
    <a
      href={to}
      className={className}
      aria-label={ariaLabel}
      title={title}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
