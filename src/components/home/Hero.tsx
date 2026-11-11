import { useRef } from 'react'
import { BRAND } from '../../lib/data'
import { MOTION, REDUCED, ScrollTrigger, SplitText, gsap, onPageReady, useGSAP } from '../../lib/motion'
import { TLink } from '../Transition'

/*
 * Hero, after the egglife layout: a centred headline, one row of copy and a
 * pill button, then a cream dome rising out of the bottom of the pink with the
 * open box and the cookie stack standing on it. A cocoa card overlaps the
 * bottom edge with a spinning stamp.
 */

const STAMP = 'baked to order · melbourne · stuffed every time · '

function Stamp() {
  return (
    <svg className="hstamp" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id="hstamp-path" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
      </defs>
      <circle cx="100" cy="100" r="98" className="hstamp__disc" />
      <g className="hstamp__ring">
        <text className="hstamp__text">
          <textPath href="#hstamp-path" textLength="462">
            {STAMP}
          </textPath>
        </text>
      </g>
      <text x="100" y="96" textAnchor="middle" className="hstamp__mid">
        c&amp;d
      </text>
      <text x="100" y="124" textAnchor="middle" className="hstamp__small">
        MEL | AUS
      </text>
    </svg>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const split = SplitText.create(q('.hero__title .line'), { type: 'chars', mask: 'chars' })
        gsap.set(split.chars, { yPercent: 115 })
        gsap.set(q('.hero__fade'), { autoAlpha: 0, y: 24 })
        gsap.set(q('.hero__dome'), { yPercent: 60, scaleX: 0.7 })
        gsap.set(q('.hero__box'), { yPercent: 70, rotation: 8, autoAlpha: 0 })
        gsap.set(q('.hero__stack'), { xPercent: -60, yPercent: 30, rotation: -24, autoAlpha: 0 })
        gsap.set(q('.hcard'), { yPercent: 30, autoAlpha: 0 })

        const off = onPageReady(
          contextSafe!(() => {
            gsap
              .timeline({ defaults: { ease: 'expo.out' } })
              .to(split.chars, { yPercent: 0, duration: 1.1, stagger: 0.025 }, 0)
              .to(q('.hero__fade'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.35)
              .to(q('.hero__dome'), { yPercent: 0, scaleX: 1, duration: 1.4 }, 0.15)
              .to(q('.hero__box'), { yPercent: 0, rotation: 0, autoAlpha: 1, duration: 1.3, ease: 'back.out(1.2)' }, 0.45)
              .to(q('.hero__stack'), { xPercent: 0, yPercent: 0, rotation: 0, autoAlpha: 1, duration: 1.3, ease: 'back.out(1.3)' }, 0.6)
              .to(q('.hcard'), { yPercent: 0, autoAlpha: 1, duration: 1.2 }, 0.75)
          }),
        )

        // Scroll: the copy lifts away, the box and stack drift at their own speeds.
        gsap
          .timeline({ scrollTrigger: { trigger: q('.hero__top')[0], start: 'top top', end: 'bottom top', scrub: true } })
          .to(q('.hero__copy'), { yPercent: -35, autoAlpha: 0.3, ease: 'none' }, 0)
          .to(q('.hero__box-wrap'), { yPercent: -10, ease: 'none' }, 0)
          .to(q('.hero__stack-wrap'), { yPercent: -24, rotation: -6, ease: 'none' }, 0)
          .to(q('.hero__dome'), { scaleX: 1.08, ease: 'none' }, 0)
        gsap.to(q('.hstamp__ring'), {
          rotation: 360,
          svgOrigin: '100 100',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
        })

        // Pointer: the products lean toward the cursor a touch.
        const box = gsap.quickTo(q('.hero__box-wrap'), 'x', { duration: 1, ease: 'power3.out' })
        const stack = gsap.quickTo(q('.hero__stack-wrap'), 'x', { duration: 1, ease: 'power3.out' })
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          const nx = e.clientX / window.innerWidth - 0.5
          box(nx * -18)
          stack(nx * -34)
        }
        window.addEventListener('pointermove', onMove)
        return () => {
          off()
          window.removeEventListener('pointermove', onMove)
          split.revert()
        }
      })
      mm.add(REDUCED, () => {
        ScrollTrigger.refresh()
      })
    },
    { scope: root },
  )

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero__top">
        <div className="hero__copy">
          <h1 className="hero__title" id="hero-title">
            <span className="line">Chunky, gooey,</span>
            <span className="line hero__accent">homemade.</span>
          </h1>
          <div className="hero__row hero__fade">
            <p className="hero__lede">Stuffed cookies, baked to order in Melbourne.</p>
            <TLink to="/shop" className="btn btn--cocoa btn--arrow">
              <span className="roll">
                <span>Build your box</span>
                <span aria-hidden="true">Build your box</span>
              </span>
              <span className="btn__arrow" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
                </svg>
              </span>
            </TLink>
          </div>
        </div>

        <div className="hero__stage" aria-hidden="true">
          <div className="hero__dome" />
          <div className="hero__stack-wrap">
            <img className="hero__stack" src="/images/hero-stack.webp" alt="" width={1200} height={1135} />
          </div>
          <div className="hero__box-wrap">
            <img className="hero__box" src="/images/hero-box.webp" alt="" width={1400} height={1545} {...{ fetchpriority: 'high' }} />
          </div>
        </div>
      </div>

      <div className="hcard">
        <div className="hcard__head">
          <h2 className="hcard__title">
            Six for <em>A$35</em>, every day.
          </h2>
          <span className="hcard__stamp">
            <Stamp />
          </span>
        </div>
        <ul className="hcard__facts">
          <li>
            <strong>Mondays and Tuesdays</strong>
            <span>The little box: four for A$24.</span>
          </li>
          <li>
            <strong>Pick up or delivery</strong>
            <span>Collect in Melbourne, or we bring it to you.</span>
          </li>
          <li>
            <strong>Rather DM?</strong>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer">
              Message {BRAND.handle} on Instagram
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
