import { useLayoutEffect, useRef, useState } from 'react'
import { INTRO_REVEAL, gsap, setIntroPending } from '../lib/motion'
import { markIntroPlayed } from '../lib/intro'
import { lockScroll, unlockScroll } from '../lib/scroll'

/*
 * "The bite" preloader.
 *
 * 1. The Instagram badge (cocoa circle, pink wordmark) plops onto a pink screen.
 * 2. While the counter runs 00 → 100, two bites come out of the badge's rim and
 *    the last one comes out of the "c" in crumb. That bitten c is the logo used
 *    across the site from then on.
 * 3. At 100 chocolate floods out from the badge until the screen is cocoa.
 * 4. The cocoa is nibbled away: a field of bite-sized holes opens in a soft wave
 *    from the bottom right, so the page is uncovered smoothly instead of in one cut.
 *    Only when most of it has gone does the page start its own entrance.
 */

const PHRASES = ['preheating the oven', 'folding in the chunks', 'underbaking, on purpose', 'taking a bite']

/** Three circles along an arc read as one scalloped bite mark. */
function biteCircles(cx: number, cy: number, R: number, angle: number, spread: number) {
  return [-spread, 0, spread].map((d) => ({
    cx: cx + Math.cos(angle + d) * R,
    cy: cy + Math.sin(angle + d) * R,
  }))
}

type Hole = { cx: number; cy: number; r: number; d: number }

/** A jittered grid of holes big enough to cover the screen once they are all open. */
function nibbleField(W: number, H: number): Hole[] {
  const cell = Math.max(W, H) / (W < 640 ? 5 : 8)
  const cols = Math.ceil(W / cell) + 1
  const rows = Math.ceil(H / cell) + 1
  const far = Math.hypot(W, H)
  const holes: Hole[] = []
  let seed = 7
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * cell + (r % 2 ? cell / 2 : 0) + (rand() - 0.5) * cell * 0.3
      const cy = r * cell + (rand() - 0.5) * cell * 0.3
      // Wave starts at the bottom right and travels to the top left.
      const d = Math.hypot(W - cx, H - cy) / far
      holes.push({ cx, cy, r: cell * (0.86 + rand() * 0.14), d: d + (rand() - 0.5) * 0.08 })
    }
  }
  return holes
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [size] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  const { w: W, h: H } = size
  const R = Math.min(W, H) * (W < 640 ? 0.3 : 0.23)
  const cx = W / 2
  const cy = H / 2 - (W < 640 ? H * 0.04 : 0)

  // Two bites out of the badge rim: top right, then bottom left.
  const rimBites = [
    { angle: -0.6, rb: R * 0.24 },
    { angle: Math.PI - 0.55, rb: R * 0.27 },
  ].map((b) => ({ ...b, circles: biteCircles(cx, cy, R * 1.02, b.angle, 0.2) }))

  const [holes] = useState(() => nibbleField(W, H))
  const big = Math.hypot(W, H)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    lockScroll()
    document.getElementById('boot')?.remove()

    const q = gsap.utils.selector(el)
    const counter = { v: 0 }
    const countEl = q('.pl__count-num')[0] as HTMLElement
    const phraseEl = q('.pl__phrase-text')[0] as HTMLElement
    const crumbText = q('.pl__crumb-word')[0] as unknown as SVGTextElement
    const cBite = q('.pl__cbite circle') as unknown as SVGCircleElement[]

    const crumbBurst = (x: number, y: number, dirX: number, dirY: number, n: number, tone = '') => {
      const layer = q('.pl__crumbs')[0] as HTMLElement
      for (let i = 0; i < n; i++) {
        const c = document.createElement('span')
        c.className = `pl__crumb ${tone}`
        const s = gsap.utils.random(5, 14)
        c.style.width = `${s}px`
        c.style.height = `${s * gsap.utils.random(0.7, 1.1)}px`
        c.style.left = `${x}px`
        c.style.top = `${y}px`
        layer.appendChild(c)
        const vx = dirX * gsap.utils.random(40, 160) + gsap.utils.random(-50, 50)
        const up = dirY * gsap.utils.random(20, 90) - gsap.utils.random(40, 110)
        gsap
          .timeline({ onComplete: () => c.remove() })
          .to(c, { x: vx, duration: 1.3, ease: 'power1.out' }, 0)
          .to(c, { y: up, duration: 0.32, ease: 'power2.out' }, 0)
          .to(c, { y: H * 0.9, duration: 1.0, ease: 'power2.in' }, 0.32)
          .to(c, { rotation: gsap.utils.random(-360, 360), duration: 1.3 }, 0)
      }
    }

    // Where the "c" of crumb sits, measured once the font has loaded.
    let cBox = { x: cx - R * 0.6, y: cy - R * 0.45, w: R * 0.25, h: R * 0.3 }
    const placeCBite = () => {
      try {
        const e = crumbText.getExtentOfChar(0)
        if (e.width > 0) cBox = { x: e.x, y: e.y, w: e.width, h: e.height }
      } catch {
        /* keep the estimate */
      }
      // A mouth coming in from the upper left of the c's bowl; same shape as the logo's.
      const em = R * 0.5
      const top = cBox.y + (cBox.h - em) / 2
      const pts = [
        { x: -0.04, y: 0.58, r: 0.16 },
        { x: 0.08, y: 0.38, r: 0.2 },
        { x: 0.3, y: 0.3, r: 0.16 },
      ]
      cBite.forEach((c, i) => {
        c.setAttribute('cx', String(cBox.x + cBox.w * pts[i].x))
        c.setAttribute('cy', String(top + em * pts[i].y))
        c.dataset.r = String(em * pts[i].r)
      })
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 1. plop
      tl.from('.pl__badge', { scale: 0, rotation: -25, svgOrigin: `${cx} ${cy}`, duration: 0.7, ease: 'back.out(1.8)' })
        .from('.pl__corner', { yPercent: 120, duration: 0.6, stagger: 0.06 }, 0.1)
        .from('.pl__count, .pl__phrase', { yPercent: 110, duration: 0.6 }, 0.2)

      // 2. count + three bites (rim, rim, then the c)
      const COUNT = 1.9
      tl.to(
        counter,
        {
          v: 100,
          duration: COUNT,
          ease: 'power1.inOut',
          onUpdate: () => {
            countEl.textContent = String(Math.round(counter.v)).padStart(2, '0')
          },
        },
        0.45,
      )
      const wobble = (at: number, dir: number) =>
        tl.to(
          '.pl__badge-wobble',
          { keyframes: { rotation: [0, 5 * dir, -2 * dir, 0] }, svgOrigin: `${cx} ${cy}`, duration: 0.4, ease: 'power2.out' },
          at,
        )

      rimBites.forEach((b, i) => {
        const at = 0.45 + COUNT * (0.2 + i * 0.27)
        tl.to(q(`.pl__bite-${i} circle`), { attr: { r: b.rb }, duration: 0.26, stagger: 0.035, ease: 'back.out(2.6)' }, at)
        wobble(at, i % 2 ? -1 : 1)
        tl.call(
          () => {
            crumbBurst(cx + Math.cos(b.angle) * R, cy + Math.sin(b.angle) * R, Math.cos(b.angle), Math.sin(b.angle), 11)
            phraseEl.textContent = PHRASES[i + 1]
          },
          [],
          at + 0.05,
        )
      })

      const cAt = 0.45 + COUNT * 0.78
      tl.call(placeCBite, [], cAt - 0.05)
        .to(cBite, { attr: { r: (_i: number, t: SVGCircleElement) => Number(t.dataset.r) }, duration: 0.28, stagger: 0.04, ease: 'back.out(2.4)' }, cAt)
      wobble(cAt, -1)
      tl.call(
        () => {
          crumbBurst(cBox.x + cBox.w * 0.1, cBox.y + cBox.h * 0.35, -1, -0.6, 9, 'is-pink')
          phraseEl.textContent = PHRASES[3]
        },
        [],
        cAt + 0.05,
      )

      // 3. chocolate floods out from the badge, unhurried
      const end = 0.45 + COUNT + 0.25
      tl.to('.pl__count, .pl__phrase, .pl__corner', { yPercent: -120, duration: 0.5, ease: 'power3.in', stagger: 0.03 }, end)
        .to('.pl__word', { scale: 1.06, svgOrigin: `${cx} ${cy}`, duration: 0.7, ease: 'power2.in' }, end)
        .to('.pl__flood', { attr: { r: big * 0.56 }, duration: 0.95, ease: 'power3.inOut' }, end + 0.1)

      // 4. nibble the cocoa away in a soft wave
      const waveAt = end + 1.05
      const WAVE = 1.15
      const holeEls = q('.pl__hole') as unknown as SVGCircleElement[]
      tl.to(
        holeEls,
        {
          attr: { r: (_i: number, t: SVGCircleElement) => Number(t.dataset.r) },
          duration: 0.75,
          ease: 'power2.out',
          stagger: (_i: number, t: SVGCircleElement) => Number(t.dataset.d) * WAVE,
        },
        waveAt,
      )
      // A few crumbs fall off the leading edge as it travels.
      ;[0.15, 0.45, 0.75].forEach((p) => {
        tl.call(() => crumbBurst(W * (1 - p), H * (1 - p * 0.9), -0.6, -0.4, 6), [], waveAt + p * WAVE)
      })
      // The page starts its entrance once most of the screen is open.
      tl.call(() => window.dispatchEvent(new Event(INTRO_REVEAL)), [], waveAt + WAVE * 0.62)
      tl.call(
        () => {
          markIntroPlayed()
          setIntroPending(false)
          unlockScroll()
          onDone()
        },
        [],
        waveAt + WAVE + 0.8,
      )
    }, el)

    return () => {
      ctx.revert()
      unlockScroll()
    }
    // Geometry is fixed for the life of the preloader.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="pl" ref={root} aria-hidden="true">
      <svg className="pl__svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <mask id="pl-screen" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <rect width={W} height={H} fill="#fff" />
            {holes.map((h, i) => (
              <circle key={i} className="pl__hole" cx={h.cx} cy={h.cy} r={0} data-r={h.r} data-d={h.d} fill="#000" />
            ))}
          </mask>
          <mask id="pl-badge" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <rect width={W} height={H} fill="#fff" />
            {rimBites.map((b, i) => (
              <g key={i} className={`pl__bite-${i}`}>
                {b.circles.map((p, j) => (
                  <circle key={j} cx={p.cx} cy={p.cy} r={0} fill="#000" />
                ))}
              </g>
            ))}
          </mask>
          <mask id="pl-c" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <rect width={W} height={H} fill="#fff" />
            <g className="pl__cbite">
              <circle cx={0} cy={0} r={0} fill="#000" />
              <circle cx={0} cy={0} r={0} fill="#000" />
              <circle cx={0} cy={0} r={0} fill="#000" />
            </g>
          </mask>
        </defs>
        <g mask="url(#pl-screen)">
          <rect width={W} height={H} className="pl__ground" />
          <g className="pl__badge">
            <g className="pl__badge-wobble">
              <g mask="url(#pl-badge)">
                <circle cx={cx} cy={cy} r={R} className="pl__disc" />
              </g>
              <g className="pl__word">
                <g mask="url(#pl-c)">
                  <text x={cx} y={cy - R * 0.1} fontSize={R * 0.5} className="pl__script pl__crumb-word" textAnchor="middle">
                    crumb
                  </text>
                </g>
                <text x={cx} y={cy + R * 0.07} fontSize={R * 0.1} className="pl__and" textAnchor="middle">
                  AND
                </text>
                <text x={cx} y={cy + R * 0.47} fontSize={R * 0.5} className="pl__script" textAnchor="middle">
                  dough
                </text>
              </g>
            </g>
          </g>
          <circle cx={cx} cy={cy} r={0} className="pl__flood" />
        </g>
      </svg>

      <div className="pl__crumbs" />

      <div className="pl__ui">
        <div className="pl__top">
          <span className="pl__mask">
            <span className="pl__corner">crumb and dough</span>
          </span>
          <span className="pl__mask">
            <span className="pl__corner">MEL | AUS</span>
          </span>
        </div>
        <div className="pl__bottom">
          <span className="pl__mask">
            <span className="pl__count">
              <span className="pl__count-num">00</span>
            </span>
          </span>
          <span className="pl__mask">
            <span className="pl__phrase">
              <span className="pl__phrase-text">{PHRASES[0]}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
