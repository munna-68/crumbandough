import { useRef } from 'react'
import { BRAND } from '../../lib/data'
import { PHOTOS } from '../../lib/photos'
import { MOTION, REDUCED, ScrollTrigger, SplitText, gsap, onPageReady, useGSAP } from '../../lib/motion'
import { TLink } from '../Transition'
import { HeroStillLife } from './Scene'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        const split = SplitText.create(q('.hero__title .line'), { type: 'chars', mask: 'chars' })
        const blocks = q('[data-piece="block"]')
        const cookies = q('[data-piece="cookie"]')
        const spheres = q('[data-piece="sphere"]')
        const photo = q('.hero__photo')

        gsap.set(split.chars, { yPercent: 110 })
        gsap.set(q('.hero__fade'), { autoAlpha: 0, y: 24 })
        gsap.set(blocks, { scaleY: 0, transformOrigin: '50% 100%' })
        gsap.set(cookies, { y: () => -window.innerHeight * 0.9, rotation: -140, autoAlpha: 0 })
        gsap.set(spheres, { y: () => -window.innerHeight * 0.8, autoAlpha: 0 })
        gsap.set(q('.scene__arch'), { scale: 0.6, autoAlpha: 0, transformOrigin: '50% 100%' })
        gsap.set(photo, { scale: 1.18 })

        const off = onPageReady(contextSafe!(() => {
          const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
          tl.to(split.chars, { yPercent: 0, duration: 1.1, stagger: 0.03 }, 0.1)
            .to(q('.hero__fade'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.45)
            .to(photo, { scale: 1, duration: 1.8 }, 0)
            .to(q('.scene__arch'), { scale: 1, autoAlpha: 1, duration: 1.4 }, 0)
            .to(blocks, { scaleY: 1, duration: 1.1, stagger: 0.07 }, 0.05)
            .to(cookies, { y: 0, rotation: 0, autoAlpha: 1, duration: 1.15, stagger: 0.09, ease: 'back.out(1.25)' }, 0.35)
            .to(spheres, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.1, ease: 'bounce.out' }, 0.55)
        }))

        // Scroll: the still life drifts apart by depth, the title lifts away.
        const pieces = q('[data-depth]') as HTMLElement[]
        const scrollTl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        pieces.forEach((p) => {
          const d = Number(p.dataset.depth ?? 1)
          scrollTl.to(p, { yPercent: -d * 26, ease: 'none' }, 0)
        })
        scrollTl
          .to(q('.hero__copy'), { yPercent: -30, autoAlpha: 0.2, ease: 'none' }, 0)
          .to(photo, { yPercent: 12, ease: 'none' }, 0)

        // Pointer: a little parallax, desktop only.
        const movers = pieces.map((p) => ({
          d: Number(p.dataset.depth ?? 1),
          x: gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3.out' }),
        }))
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          const nx = e.clientX / window.innerWidth - 0.5
          movers.forEach((m) => m.x(nx * m.d * -26))
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
      <div className="hero__art">
        {PHOTOS.heroDesktop ? (
          <picture>
            {PHOTOS.heroMobile ? <source media="(max-width: 767px)" srcSet={PHOTOS.heroMobile} /> : null}
            <img className="hero__photo" src={PHOTOS.heroDesktop} alt="" fetchPriority="high" />
          </picture>
        ) : (
          <>
            <div className="hero__floor" />
            <HeroStillLife />
          </>
        )}
      </div>

      <div className="hero__copy">
        <p className="hero__kicker hero__fade">Small-batch cookies, baked in Melbourne</p>
        <h1 className="hero__title" id="hero-title">
          <span className="line">Chunky, gooey,</span>
          <span className="line">homemade.</span>
        </h1>
        <p className="hero__lede hero__fade">
          Stuffed cookies, baked to order and packed by hand. Pick up or delivery across Melbourne.
        </p>
        <div className="hero__ctas hero__fade">
          <TLink to="/shop" className="btn btn--cocoa">
            <span className="roll">
              <span>Build your box</span>
              <span aria-hidden="true">Build your box</span>
            </span>
          </TLink>
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="link-under">
            or DM us to order
          </a>
        </div>
      </div>

      <p className="hero__note hero__fade">
        <strong>6 for A$35</strong> every day
        <br />
        <strong>4 for A$24</strong> Mondays and Tuesdays
      </p>
      <p className="hero__scroll hero__fade" aria-hidden="true">
        <span />
        Scroll
      </p>
    </section>
  )
}
