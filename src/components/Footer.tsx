import { useRef } from 'react'
import { BRAND } from '../lib/data'
import { MOTION, gsap, useGSAP } from '../lib/motion'
import { PHOTOS } from '../lib/photos'
import { Plinth, Sphere, Standing } from './home/Scene'
import { TLink } from './Transition'

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        gsap.fromTo(
          q('.foot__mark-in'),
          { yPercent: 70 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
          },
        )
        gsap.from(q('.foot__scene [data-piece]'), {
          y: -80,
          autoAlpha: 0,
          duration: 1,
          ease: 'bounce.out',
          stagger: 0.08,
          scrollTrigger: { trigger: q('.foot__scene')[0], start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <footer className="foot" ref={root}>
      <div className="foot__top">
        <div className="foot__info">
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
          <p>
            crumb and dough, {BRAND.location}. Chunky, gooey and homemade cookies, delivery and pick up available.
          </p>
          <p className="foot__fine">
            A concept site built from the shop&rsquo;s public Instagram. Prices shown are placeholders and no payment is
            taken. Not affiliated with or endorsed by crumb and dough.
          </p>
        </div>
        <div className="foot__scene" aria-hidden="true">
          {PHOTOS.footer ? (
            <img src={PHOTOS.footer} alt="" className="foot__photo" loading="lazy" />
          ) : (
            <div className="scene scene--foot">
              <Plinth x={8} y={0} w={22} h={18} tone="milk" />
              <Plinth x={30} y={0} w={16} h={30} tone="pink" />
              <Standing id="white-kitkat" x={9} y={17.4} d={19} tilt={-6} />
              <Standing id="oreo" x={30} y={29.4} d={16} tilt={8} />
              <Standing id="red-velvet" x={50} y={0} d={18} tilt={-14} />
              <Sphere x={70} y={0} d={9} tone="cocoa" />
              <Sphere x={2} y={0} d={6} tone="pink" />
            </div>
          )}
        </div>
      </div>
      <div className="foot__mark" aria-hidden="true">
        <span className="foot__mark-in">crumb and dough</span>
      </div>
      <p className="foot__copy">© {new Date().getFullYear()} crumb and dough concept</p>
    </footer>
  )
}
