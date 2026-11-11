import { useLayoutEffect, useRef, useState } from 'react'
import { INTRO_REVEAL, gsap, setIntroPending } from '../lib/motion'
import { markIntroPlayed } from '../lib/intro'
import { lockScroll, unlockScroll } from '../lib/scroll'

/*
 * "The bite" preloader.
 *
 * 1. The Instagram badge (cocoa circle, pink wordmark) plops onto a pink screen.
 * 2. While the counter runs 00 → 100, three bites are taken out of its edge,
 *    each one spraying crumbs that fall off the screen.
 * 3. At 100 chocolate floods out from the middle until the screen is cocoa…
 * 4. …and the whole screen gets eaten: three scalloped bites, each bigger
 *    than the last, chomp through to the hero underneath.
 */

const PHRASES = ['preheating the oven', 'folding in the chunks', 'underbaking, on purpose', 'boxing it up']

/** Three circles along an arc read as one scalloped bite mark. */
function biteCircles(cx: number, cy: number, R: number, angle: number, spread: number) {
  return [-spread, 0, spread].map((d) => ({
    cx: cx + Math.cos(angle + d) * R,
    cy: cy + Math.sin(angle + d) * R,
  }))
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [size] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  const { w: W, h: H } = size
  const R = Math.min(W, H) * (W < 640 ? 0.3 : 0.23)
  const cx = W / 2
  const cy = H / 2 - (W < 640 ? H * 0.04 : 0)

  // Small bites on the badge rim: top-right, left, bottom.
  const smallBites = [
    { angle: -0.6, rb: R * 0.24 },
    { angle: Math.PI + 0.35, rb: R * 0.27 },
    { angle: Math.PI / 2 + 0.25, rb: R * 0.3 },
  ].map((b) => ({ ...b, circles: biteCircles(cx, cy, R * 1.02, b.angle, 0.2) }))

  const big = Math.hypot(W, H)
  // Screen-sized chomps: from the right edge, the bottom-left, then the rest.
  const chomps = [
    { circles: [{ cx: W * 1.02, cy: H * 0.2 }, { cx: W * 1.04, cy: H * 0.55 }, { cx: W * 1.02, cy: H * 0.9 }], r: big * 0.26 },
    { circles: [{ cx: -W * 0.02, cy: H * 0.55 }, { cx: W * 0.18, cy: H * 1.04 }, { cx: W * 0.5, cy: H * 1.06 }], r: big * 0.42 },
    { circles: [{ cx: W * 0.35, cy: -H * 0.02 }, { cx: W * 0.62, cy: H * 0.1 }, { cx: W * 0.55, cy: H * 0.45 }], r: big * 0.62 },
  ]

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    lockScroll()
    document.getElementById('boot')?.remove()

    const q = gsap.utils.selector(el)
    const counter = { v: 0 }
    const countEl = q('.pl__count-num')[0] as HTMLElement
    const phraseEl = q('.pl__phrase-text')[0] as HTMLElement

    const crumbBurst = (x: number, y: number, dirX: number, dirY: number, n: number, scale = 1) => {
      const layer = q('.pl__crumbs')[0] as HTMLElement
      for (let i = 0; i < n; i++) {
        const c = document.createElement('span')
        c.className = 'pl__crumb'
        const s = gsap.utils.random(5, 14) * scale
        c.style.width = `${s}px`
        c.style.height = `${s * gsap.utils.random(0.7, 1.1)}px`
        c.style.left = `${x}px`
        c.style.top = `${y}px`
        layer.appendChild(c)
        const vx = dirX * gsap.utils.random(40, 160) * scale + gsap.utils.random(-50, 50)
        const up = dirY * gsap.utils.random(20, 90) * scale - gsap.utils.random(40, 110)
        gsap
          .timeline({ onComplete: () => c.remove() })
          .to(c, { x: vx, duration: 1.3, ease: 'power1.out' }, 0)
          .to(c, { y: up, duration: 0.32, ease: 'power2.out' }, 0)
          .to(c, { y: H * 0.9, duration: 1.0, ease: 'power2.in' }, 0.32)
          .to(c, { rotation: gsap.utils.random(-360, 360), duration: 1.3 }, 0)
      }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 1. plop
      tl.from('.pl__badge', { scale: 0, rotation: -25, svgOrigin: `${cx} ${cy}`, duration: 0.7, ease: 'back.out(1.8)' })
        .from('.pl__corner', { yPercent: 120, duration: 0.6, stagger: 0.06 }, 0.1)
        .from('.pl__count, .pl__phrase', { yPercent: 110, duration: 0.6 }, 0.2)

      // 2. count + three bites
      const COUNT = 1.75
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
      smallBites.forEach((b, i) => {
        const at = 0.45 + COUNT * (0.22 + i * 0.27)
        tl.to(
          q(`.pl__bite-${i} circle`),
          { attr: { r: b.rb }, duration: 0.26, stagger: 0.035, ease: 'back.out(2.6)' },
          at,
        )
          .to(
            '.pl__badge-wobble',
            {
              keyframes: { rotation: [0, i % 2 ? -5 : 5, i % 2 ? 2 : -2, 0] },
              svgOrigin: `${cx} ${cy}`,
              duration: 0.4,
              ease: 'power2.out',
            },
            at,
          )
          .call(
            () => {
              const bx = cx + Math.cos(b.angle) * R
              const by = cy + Math.sin(b.angle) * R
              crumbBurst(bx, by, Math.cos(b.angle), Math.sin(b.angle), 11)
              phraseEl.textContent = PHRASES[i + 1]
            },
            [],
            at + 0.05,
          )
      })

      // 3. swell to cocoa
      const end = 0.45 + COUNT + 0.1
      tl.to('.pl__count, .pl__phrase, .pl__corner', { yPercent: -120, duration: 0.45, ease: 'power3.in', stagger: 0.03 }, end)
        .to('.pl__word', { scale: 1.08, svgOrigin: `${cx} ${cy}`, duration: 0.6, ease: 'power2.in' }, end)
        .to('.pl__flood', { attr: { r: big * 0.56 }, duration: 0.62, ease: 'expo.in' }, end + 0.05)

      // 4. chomp, chomp, chomp
      const chompAt = end + 0.68
      chomps.forEach((c, i) => {
        const at = chompAt + i * 0.26
        tl.to(q(`.pl__chomp-${i} circle`), { attr: { r: c.r }, duration: 0.42, stagger: 0.04, ease: 'back.out(1.3)' }, at)
        if (i === 0) {
          tl.call(() => window.dispatchEvent(new Event(INTRO_REVEAL)), [], at + 0.1)
        }
        tl.call(
          () => {
            const p = c.circles[1]
            crumbBurst(
              gsap.utils.clamp(20, W - 20, p.cx),
              gsap.utils.clamp(20, H - 40, p.cy),
              i === 0 ? -1 : i === 1 ? 1 : 0,
              i === 1 ? -1 : 0.4,
              14,
              1.4,
            )
          },
          [],
          at + 0.05,
        )
      })
      tl.call(
        () => {
          markIntroPlayed()
          setIntroPending(false)
          unlockScroll()
          onDone()
        },
        [],
        chompAt + 0.26 * 2 + 0.55,
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
            {chomps.map((c, i) => (
              <g key={i} className={`pl__chomp-${i}`}>
                {c.circles.map((p, j) => (
                  <circle key={j} cx={p.cx} cy={p.cy} r={0} fill="#000" />
                ))}
              </g>
            ))}
          </mask>
          <mask id="pl-badge" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <rect width={W} height={H} fill="#fff" />
            {smallBites.map((b, i) => (
              <g key={i} className={`pl__bite-${i}`}>
                {b.circles.map((p, j) => (
                  <circle key={j} cx={p.cx} cy={p.cy} r={0} fill="#000" />
                ))}
              </g>
            ))}
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
                <text x={cx} y={cy - R * 0.1} fontSize={R * 0.5} className="pl__script" textAnchor="middle">
                  crumb
                </text>
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
