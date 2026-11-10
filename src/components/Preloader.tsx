import { useEffect, useRef, type CSSProperties } from 'react'

interface PreloaderProps {
  onReveal: () => void
  onDone: () => void
}

const CHIPS = [
  { x: '-42px', y: '-12px', r: '-34deg', w: '17px', delay: '0.55s' },
  { x: '-12px', y: '-20px', r: '18deg', w: '14px', delay: '0.65s' },
  { x: '24px', y: '-15px', r: '44deg', w: '19px', delay: '0.72s' },
  { x: '48px', y: '5px', r: '-12deg', w: '15px', delay: '0.82s' },
  { x: '23px', y: '20px', r: '28deg', w: '18px', delay: '0.9s' },
  { x: '-18px', y: '19px', r: '-20deg', w: '13px', delay: '0.98s' },
  { x: '-50px', y: '6px', r: '8deg', w: '12px', delay: '1.02s' },
]

const CRUMBS = [
  { x: '-82px', y: '-44px', delay: '1.48s' },
  { x: '74px', y: '-52px', delay: '1.54s' },
  { x: '92px', y: '30px', delay: '1.6s' },
  { x: '-74px', y: '46px', delay: '1.64s' },
  { x: '40px', y: '58px', delay: '1.7s' },
]

/**
 * The one-off dough-to-cookie intro. CSS and SVG only.
 * Timers are kept here; the visual sequence is entirely CSS keyframes.
 */
export function Preloader({ onReveal, onDone }: PreloaderProps) {
  const revealRef = useRef(onReveal)
  const doneRef = useRef(onDone)
  revealRef.current = onReveal
  doneRef.current = onDone

  useEffect(() => {
    document.documentElement.classList.add('preloader-running')

    const revealTimer = window.setTimeout(() => revealRef.current(), 2140)
    const doneTimer = window.setTimeout(() => {
      document.documentElement.classList.remove('preloader-running')
      doneRef.current()
    }, 2820)

    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(doneTimer)
      document.documentElement.classList.remove('preloader-running')
    }
  }, [])

  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__halo" />
      <div className="preloader__stage">
        <div className="preloader__shadow" />
        <div className="preloader__dough" />
        {CHIPS.map((chip, index) => (
          <span
            key={index}
            className="preloader__chip"
            style={
              {
                '--x': chip.x,
                '--y': chip.y,
                '--r': chip.r,
                '--w': chip.w,
                '--delay': chip.delay,
              } as CSSProperties
            }
          />
        ))}
        {CRUMBS.map((crumb, index) => (
          <span
            key={index}
            className="preloader__crumb"
            style={
              {
                '--x': crumb.x,
                '--y': crumb.y,
                '--delay': crumb.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="preloader__footer">
        <p className="preloader__word">crumb and dough</p>
        <p className="preloader__tag">small batch · melbourne</p>
      </div>
    </div>
  )
}
