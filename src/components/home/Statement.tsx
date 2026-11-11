import { useRef } from 'react'
import { MOTION, REDUCED, SplitText, gsap, useGSAP } from '../../lib/motion'
import { Cookie } from '../Cookie'

/*
 * "The break". The section pins and one big cookie is pulled apart by the
 * scroll: a crack draws down the middle, the halves separate, strands of
 * chocolate stretch between them, thin out and snap one by one, and the line
 * "Gooey inside." is waiting in the gap, literally inside the cookie.
 *
 * Geometry is in "stage percent": the stage is a square and every half, the
 * crack and the strands share its 0–100 coordinate space.
 */

// The crack, top to bottom, in stage percent.
const CRACK: Array<[number, number]> = [
  [50, 2],
  [46.5, 13],
  [52.5, 24],
  [47, 36],
  [53.5, 48],
  [48, 60],
  [53, 72],
  [46.5, 84],
  [50.5, 98],
]
const LEFT = `polygon(0% 0%, ${CRACK.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 0% 100%)`
const RIGHT = `polygon(100% 0%, ${CRACK.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%)`
const CRACK_POINTS = CRACK.map(([x, y]) => `${x},${y}`).join(' ')

/** x of the crack at height y. */
function crackX(y: number) {
  for (let i = 1; i < CRACK.length; i++) {
    const [x0, y0] = CRACK[i - 1]
    const [x1, y1] = CRACK[i]
    if (y <= y1) return x0 + ((y - y0) / (y1 - y0)) * (x1 - x0)
  }
  return 50
}

// Strands of goo: height on the crack, thickness, and the gap at which each snaps.
const STRANDS = [
  { y: 24, t: 5.5, snap: 34 },
  { y: 37, t: 8, snap: 52 },
  { y: 50, t: 10, snap: 64 },
  { y: 62, t: 7, snap: 44 },
  { y: 74, t: 5, snap: 28 },
]

type P = { x: number; y: number }

/** Rotate a stage point about the stage centre, then shift it. */
function place(x: number, y: number, deg: number, dx: number, dy: number): P {
  const a = (deg * Math.PI) / 180
  const ox = x - 50
  const oy = y - 50
  return { x: 50 + ox * Math.cos(a) - oy * Math.sin(a) + dx, y: 50 + ox * Math.sin(a) + oy * Math.cos(a) + dy }
}

/** A filled strand from L to R that pinches and sags as it stretches. */
function bridge(L: P, R: P, t: number, pinch: number, sag: number) {
  const mx = (L.x + R.x) / 2
  const my = (L.y + R.y) / 2 + sag
  const lx = mx - L.x
  const rx = R.x - mx
  return [
    `M${L.x},${L.y - t / 2}`,
    `C${L.x + lx * 0.55},${L.y - t / 2 + sag * 0.25} ${mx - lx * 0.35},${my - pinch / 2} ${mx},${my - pinch / 2}`,
    `C${mx + rx * 0.35},${my - pinch / 2} ${R.x - rx * 0.55},${R.y - t / 2 + sag * 0.25} ${R.x},${R.y - t / 2}`,
    `L${R.x},${R.y + t / 2}`,
    `C${R.x - rx * 0.55},${R.y + t / 2 + sag * 0.35} ${mx + rx * 0.35},${my + pinch / 2} ${mx},${my + pinch / 2}`,
    `C${mx - lx * 0.35},${my + pinch / 2} ${L.x + lx * 0.55},${L.y + t / 2 + sag * 0.35} ${L.x},${L.y + t / 2}`,
    'Z',
  ].join(' ')
}

/** After a strand snaps, each end droops into a drip hanging off the half. */
function drip(P0: P, dir: number, t: number, len: number) {
  const tip = { x: P0.x + dir * len * 0.3, y: P0.y + len }
  const r = Math.max(0.6, t * 0.32)
  return [
    `M${P0.x},${P0.y - t / 2}`,
    `C${P0.x + dir * t * 0.9},${P0.y - t / 2} ${tip.x + r},${tip.y - len * 0.55} ${tip.x + r},${tip.y}`,
    `A${r},${r} 0 0 1 ${tip.x - r},${tip.y}`,
    `C${tip.x - r},${tip.y - len * 0.4} ${P0.x + dir * t * 0.2},${P0.y + t / 2} ${P0.x},${P0.y + t / 2}`,
    'Z',
  ].join(' ')
}

const FACTS = [
  { k: 'Baked to order', v: 'Nothing sits on a shelf. Your box is baked for the day you pick.' },
  { k: 'Stuffed, every one', v: 'Cheesecake, Biscoff, peanut butter, frosting. There is always a middle.' },
  { k: 'Packed by hand', v: 'Pick it up in Melbourne, or we bring it to your door.' },
]

export function Statement() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const left = q('.brk__half--l')[0] as HTMLElement
      const right = q('.brk__half--r')[0] as HTMLElement
      const goo = q('.brk__goo path') as unknown as SVGPathElement[]
      const drips = q('.brk__drip') as unknown as SVGPathElement[]
      const state = { g: 0, a: 0, lift: 0 }

      // Draw both halves and every strand for the current gap g (stage %) and tilt a (deg).
      const draw = () => {
        const { g, a, lift } = state
        gsap.set(left, { xPercent: -g, yPercent: lift, rotation: -a })
        gsap.set(right, { xPercent: g, yPercent: -lift * 0.6, rotation: a })
        STRANDS.forEach((s, i) => {
          const x = crackX(s.y)
          const L = place(x, s.y, -a, -g, lift)
          const R = place(x, s.y, a, g, -lift * 0.6)
          const d = R.x - L.x
          if (d < s.snap) {
            const k = Math.min(1, d / s.snap)
            const pinch = s.t * Math.max(0.12, 1 - k * 0.92)
            goo[i].setAttribute('d', bridge(L, R, s.t, pinch, k * k * 7))
            drips[i * 2].setAttribute('d', '')
            drips[i * 2 + 1].setAttribute('d', '')
          } else {
            goo[i].setAttribute('d', '')
            const len = Math.min(s.t * 2.6, s.t * 0.8 + (d - s.snap) * 0.35)
            drips[i * 2].setAttribute('d', drip(L, 1, s.t * 0.8, len))
            drips[i * 2 + 1].setAttribute('d', drip(R, -1, s.t * 0.8, len * 0.85))
          }
        })
      }

      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const split = SplitText.create(q('.brk__l1'), { type: 'chars', mask: 'chars' })
        const wide = window.innerWidth >= 768
        const G = wide ? 70 : 40
        draw()

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
        })
        tl.from(split.chars, { yPercent: 110, stagger: 0.02, duration: 0.5, ease: 'power3.out' }, 0)
          .from(q('.brk__copy'), { autoAlpha: 0, y: 30, duration: 0.4, ease: 'power2.out' }, 0.2)
          .from(q('.brk__stage'), { scale: 0.82, rotation: -18, duration: 0.9, ease: 'power2.out' }, 0)
          // the crack draws, the cookie shudders
          .fromTo(q('.brk__crack'), { strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.in' }, 0.75)
          .to(q('.brk__stage'), { keyframes: { x: [0, -6, 5, -3, 0] }, duration: 0.35 }, 1.05)
          .fromTo(q('.brk__edge'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 1.15)
          .set(q('.brk__crack'), { autoAlpha: 0 }, 1.4)
          // the pull
          .to(state, { g: G, a: wide ? 9 : 6, lift: 3, duration: 2.2, ease: 'power1.inOut', onUpdate: draw }, 1.3)
          .fromTo(q('.brk__l2'), { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 1.7)
          .to(q('.brk__crumb'), {
            x: (i) => [-1, 1, -1, 1, -1, 1, -1, 1][i] * gsap.utils.random(80, 220),
            y: (i) => gsap.utils.random(-160, 200) + i * 10,
            rotation: () => gsap.utils.random(-260, 260),
            autoAlpha: 1,
            duration: 1.4,
            ease: 'power2.out',
          }, 1.3)
          .to(q('.brk__crumb'), { autoAlpha: 0, duration: 0.4 }, 2.6)
          // what it means
          .from(q('.brk__fact'), { autoAlpha: 0, y: 40, stagger: 0.15, duration: 0.6, ease: 'power3.out' }, 3.0)
          .to({}, { duration: 0.4 })

        return () => split.revert()
      })
      mm.add(REDUCED, () => {
        Object.assign(state, { g: 46, a: 6, lift: 2 })
        draw()
        gsap.set(q('.brk__crack'), { autoAlpha: 0 })
      })
    },
    { scope: root },
  )

  return (
    <section className="brk" id="story" ref={root} aria-labelledby="brk-title">
      <div className="brk__pin">
        <div className="brk__head">
          <h2 className="brk__l1" id="brk-title">
            Chunky outside.
          </h2>
          <p className="brk__copy">
            Every cookie is stuffed, baked in small batches in a Melbourne kitchen and packed into its box by hand.
          </p>
        </div>

        <p className="brk__l2" aria-hidden="true">
          Gooey <span>inside.</span>
        </p>

        <div className="brk__stage" aria-hidden="true">
          <svg className="brk__goo" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="brk-choc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#6a3a24" />
                <stop offset="0.45" stopColor="#3a1f14" />
                <stop offset="1" stopColor="#24130c" />
              </linearGradient>
            </defs>
            {STRANDS.map((s) => (
              <path key={s.y} />
            ))}
            {STRANDS.map((s) => [<path key={`${s.y}a`} className="brk__drip" />, <path key={`${s.y}b`} className="brk__drip" />])}
          </svg>
          {(['l', 'r'] as const).map((side) => (
            <div key={side} className={`brk__half brk__half--${side}`} style={{ clipPath: side === 'l' ? LEFT : RIGHT }}>
              <Cookie id="classic-chocolate" size="lg" alt="" />
              <svg className="brk__edge" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <clipPath id={`brk-disc-${side}`}>
                    <circle cx="50" cy="50" r="41" />
                  </clipPath>
                </defs>
                <polyline points={CRACK_POINTS} clipPath={`url(#brk-disc-${side})`} />
              </svg>
            </div>
          ))}
          <svg className="brk__crackline" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline className="brk__crack" points={CRACK_POINTS} pathLength={120} />
          </svg>
          <div className="brk__crumbs">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="brk__crumb" style={{ top: `${30 + i * 6}%` }} />
            ))}
          </div>
        </div>

        <dl className="brk__facts">
          {FACTS.map((f) => (
            <div key={f.k} className="brk__fact">
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
