import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLAVOURS } from '../lib/data'
import { prefersReducedMotion } from '../lib/format'
import type { Flavour } from '../lib/types'
import { BrandImage } from './BrandImage'
import { CookieMark } from './Icons'

gsap.registerPlugin(ScrollTrigger)

export function FlavourRoll() {
  const [reduced] = useState(() => prefersReducedMotion())
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const context = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const shared = {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        invalidateOnRefresh: true,
      }

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          ...shared,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      })

      gsap.fromTo(
        ghostRef.current,
        { rotation: -28 },
        {
          rotation: 248,
          ease: 'none',
          scrollTrigger: { ...shared, scrub: 1.1 },
        },
      )

      gsap.to(track.querySelectorAll('.flavour-card__cookie'), {
        rotation: 14,
        ease: 'none',
        scrollTrigger: { ...shared, scrub: 1.4 },
      })

      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { ...shared, scrub: 0.4 },
        },
      )
    }, section)

    return () => context.revert()
  }, [reduced])

  return (
    <section
      className={`flavours ${reduced ? 'flavours--static' : ''}`}
      id="flavours"
      ref={sectionRef}
    >
      {!reduced && (
        <div className="flavours__ghost-wrap" aria-hidden="true">
          <div className="flavours__ghost" ref={ghostRef}>
            <CookieMark />
          </div>
        </div>
      )}

      <div className="flavours__pin">
        <div className="flavours__head page-shell">
          <div>
            <p className="eyebrow eyebrow--pink">the menu · seven flavours</p>
            <h2 className="flavours__title">
              seven flavours.
              <br />
              <span>zero self-control.</span>
            </h2>
          </div>
          <div className="flavours__aside">
            <span className="flavours__aside-pill">mix + match, or six of one</span>
            <p>
              Stuffed, gooey and made by hand.
              <br />
              Pick a favourite or take the lot.
            </p>
          </div>
        </div>

        <div className="flavours__viewport">
          <div className="flavour-track" ref={trackRef}>
            {FLAVOURS.map((flavour, index) => (
              <FlavourCard key={flavour.id} flavour={flavour} index={index} />
            ))}
          </div>
        </div>

        <div className="flavours__foot page-shell">
          <span className="flavours__count">01 — 07</span>
          <span className="flavours__progress">
            <span ref={progressRef} />
          </span>
          <span className="flavours__scroll-label">scroll the menu →</span>
        </div>
      </div>
    </section>
  )
}

function FlavourCard({ flavour, index }: { flavour: Flavour; index: number }) {
  return (
    <article
      className="flavour-card"
      style={{ '--flavour-accent': flavour.accent } as CSSProperties}
    >
      <div className="flavour-card__top">
        <span className="flavour-card__index">{String(index + 1).padStart(2, '0')}</span>
        <span className="flavour-card__note">{flavour.note}</span>
      </div>

      <div className="flavour-card__orbit">
        <BrandImage slot={flavour.imageSlot} className="flavour-card__cookie" decorative />
      </div>

      <div className="flavour-card__copy">
        <h3>{flavour.name}</h3>
        <p>{flavour.desc}</p>
      </div>
    </article>
  )
}
