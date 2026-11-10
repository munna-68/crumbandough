import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion } from '../lib/format'
import { BrandImage } from './BrandImage'
import { ArrowUpRight, Spark } from './Icons'
import { WipeLink } from './PageTransition'

gsap.registerPlugin(SplitText)

export function Hero({ start }: { start: boolean }) {
  const rootRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cookieRef = useRef<HTMLDivElement>(null)
  const crumbRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const stickerRef = useRef<HTMLDivElement>(null)
  const stampRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const title = titleRef.current
    const reveal = root.querySelectorAll<HTMLElement>('[data-hero-reveal]')
    const reduced = prefersReducedMotion()

    if (!start) {
      if (!reduced) {
        gsap.set(reveal, { autoAlpha: 0, y: 22 })
        gsap.set(title, { autoAlpha: 0 })
        gsap.set(
          [blobRef.current, cookieRef.current, crumbRef.current, stickerRef.current, stampRef.current],
          { autoAlpha: 0 },
        )
      }
      return
    }

    if (reduced) {
      gsap.set(Array.from(reveal), { autoAlpha: 1, clearProps: 'transform' })
      gsap.set(title, { autoAlpha: 1, clearProps: 'transform' })
      gsap.set(root.querySelectorAll('.hero__art > *'), {
        autoAlpha: 1,
        clearProps: 'transform',
      })
      return
    }

    let cancelled = false
    let split: SplitText | null = null
    const context = gsap.context(() => {
      gsap.set(reveal, { autoAlpha: 0, y: 22 })
      gsap.set(title, { autoAlpha: 0 })
      gsap.set(
        [blobRef.current, cookieRef.current, crumbRef.current, stickerRef.current, stampRef.current],
        { autoAlpha: 0 },
      )

      const build = () => {
        if (cancelled || !title) return
        split = SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'hero-line',
        })
        gsap.set(title, { autoAlpha: 1 })
        gsap.from(split.lines, {
          yPercent: 112,
          duration: 0.95,
          stagger: 0.085,
          ease: 'power4.out',
          delay: 0.04,
        })

        gsap.to(reveal, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.085,
          delay: 0.28,
          ease: 'power3.out',
        })

        gsap.fromTo(
          blobRef.current,
          { autoAlpha: 0, scale: 0.76, rotation: -14 },
          {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 1.15,
            delay: 0.05,
            ease: 'power3.out',
          },
        )
        gsap.fromTo(
          cookieRef.current,
          { autoAlpha: 0, scale: 0.56, rotation: -30 },
          {
            autoAlpha: 1,
            scale: 1,
            rotation: -6,
            duration: 1.35,
            delay: 0.16,
            ease: 'elastic.out(1, 0.7)',
          },
        )
        gsap.fromTo(
          crumbRef.current,
          { autoAlpha: 0, scale: 0.35, rotation: 42 },
          {
            autoAlpha: 1,
            scale: 1,
            rotation: 14,
            duration: 0.9,
            delay: 0.65,
            ease: 'back.out(1.8)',
          },
        )
        gsap.fromTo(
          stickerRef.current,
          { autoAlpha: 0, y: 14, rotation: 10 },
          {
            autoAlpha: 1,
            y: 0,
            rotation: 6,
            duration: 0.7,
            delay: 0.75,
            ease: 'power3.out',
          },
        )
        gsap.fromTo(
          stampRef.current,
          { autoAlpha: 0, scale: 0.6 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.9,
            ease: 'back.out(1.7)',
          },
        )
      }

      if (document.fonts?.status === 'loaded') build()
      else document.fonts.ready.then(build).catch(build)
    }, root)

    return () => {
      cancelled = true
      split?.revert()
      context.revert()
    }
  }, [start])

  return (
    <section className="hero" ref={rootRef}>
      <div className="page-shell hero__grid">
        <div className="hero__copy">
          <p className="hero__kicker" data-hero-reveal>
            <span className="pulse-dot" />
            baked in melbourne · small batch
          </p>

          <h1 className="hero__title" ref={titleRef}>
            your next
            <br />
            <span className="hero__accent">cookie</span>
            <br />
            obsession.
          </h1>

          <p className="hero__lede" data-hero-reveal>
            Chunky, gooey and homemade.
            <em> Stuffed with the good stuff, baked in tiny batches and packed by hand.</em>
          </p>

          <div className="hero__actions" data-hero-reveal>
            <WipeLink to="/order" className="btn btn-brown btn-lg">
              build your box
              <ArrowUpRight className="btn__icon" />
            </WipeLink>
            <WipeLink to="/#flavours" className="text-link">
              meet the seven
              <span className="text-link__arrow" aria-hidden="true">
                ↘
              </span>
            </WipeLink>
          </div>

          <p className="hero__price" data-hero-reveal>
            <strong>six for A$35</strong>
            <span className="price-tag">placeholder price</span>
            <span className="hero__price-sep" aria-hidden="true" />
            pickup or delivery
          </p>
        </div>

        <div className="hero__art">
          <div className="hero__blob" ref={blobRef} aria-hidden="true" />
          <div className="hero__ring" aria-hidden="true" />

          <BrandImage ref={cookieRef} slot="hero-cookie" className="hero__cookie" priority />

          <div ref={crumbRef} className="hero__crumb">
            <BrandImage slot="hero-crumb" decorative />
          </div>

          <div className="hero__sticker" ref={stickerRef}>
            <Spark className="hero__sticker-icon" />
            baked this morning
          </div>

          <div className="hero__stamp" ref={stampRef} aria-hidden="true">
            <svg className="hero__stamp-svg" viewBox="0 0 120 120">
              <defs>
                <path
                  id="hero-stamp-path"
                  d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"
                />
              </defs>
              <text className="hero__stamp-text">
                <textPath href="#hero-stamp-path">
                  chunky · gooey · homemade · chunky · gooey · homemade ·
                </textPath>
              </text>
            </svg>
            <Spark className="hero__stamp-spark" />
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>scroll for the good stuff</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  )
}
