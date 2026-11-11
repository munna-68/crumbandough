import { useRef } from 'react'
import { BRAND } from '../lib/data'
import { MOTION, SplitText, gsap, useGSAP } from '../lib/motion'
import { TLink } from './Transition'

/*
 * Footer, the bookend to the hero: "Hungry yet?" over a cream dome with the
 * cookie pile sitting on it, then a cocoa slab that the pile spills over,
 * holding the links and a giant bitten wordmark that rises as you hit bottom.
 */

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        const split = SplitText.create(q('.foot__title'), { type: 'chars', mask: 'chars' })
        gsap.from(split.chars, {
          yPercent: 115,
          duration: 1,
          stagger: 0.03,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.foot__title')[0], start: 'top 88%' },
        })
        gsap.from(q('.foot__fade'), {
          autoAlpha: 0,
          y: 20,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.foot__title')[0], start: 'top 88%' },
        })
        gsap
          .timeline({ scrollTrigger: { trigger: q('.foot__stage')[0], start: 'top bottom', end: 'bottom 70%', scrub: true } })
          .fromTo(q('.foot__dome'), { yPercent: 45, scaleX: 0.75 }, { yPercent: 0, scaleX: 1, ease: 'none' }, 0)
          .fromTo(q('.foot__pile'), { yPercent: 40, scale: 0.86, rotation: -4 }, { yPercent: 0, scale: 1, rotation: 0, ease: 'none' }, 0)
        gsap.fromTo(
          q('.foot__mark-in'),
          { yPercent: 80 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: q('.foot__base')[0], start: 'top bottom', end: 'bottom bottom', scrub: true },
          },
        )
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <footer className="foot" ref={root}>
      <div className="foot__cta">
        <h2 className="foot__title">Hungry yet?</h2>
        <div className="foot__row foot__fade">
          <p>Six for A$35. Baked on the day you pick.</p>
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

      <div className="foot__stage" aria-hidden="true">
        <div className="foot__dome" />
        <img className="foot__pile" src="/images/footer-pile.webp" alt="" width={1560} height={958} loading="lazy" />
      </div>

      <div className="foot__base">
        <div className="foot__top">
          <ul className="foot__social">
            <li>
              <a href={BRAND.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={BRAND.tiktok} target="_blank" rel="noreferrer">
                TikTok
              </a>
            </li>
            <li>
              <TLink to="/shop">Build a box</TLink>
            </li>
            <li>
              <TLink to="/kitchen">Kitchen board</TLink>
            </li>
          </ul>
          <div className="foot__info">
            <p>
              crumb and dough, {BRAND.location}. Chunky, gooey and homemade cookies, delivery and pick up available.
            </p>
            <p className="foot__fine">
              A concept site built from the shop&rsquo;s public Instagram. Prices shown are placeholders and no payment
              is taken. Not affiliated with or endorsed by crumb and dough.
            </p>
          </div>
        </div>
        <div className="foot__mark" aria-hidden="true">
          <span className="foot__mark-in">
            <span className="wordmark__c">c</span>rumb &amp; dough
          </span>
        </div>
        <p className="foot__copy">© {new Date().getFullYear()} crumb and dough concept</p>
      </div>
    </footer>
  )
}
