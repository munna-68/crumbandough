import { useRef } from 'react'
import { BRAND } from '../../lib/data'
import { MOTION, gsap, useGSAP } from '../../lib/motion'
import { Cookie } from '../Cookie'
import { SectionTitle } from './SectionTitle'

/*
 * Five post-shaped tiles, like the reference's Instagram row. They are made
 * from the shop's real offers and voice, and every tile opens the profile.
 */
const TILES = [
  { tone: 'cocoa', kicker: 'On the menu', title: 'Red velvet', sub: 'with a cheesecake centre', cookies: ['red-velvet'] },
  { tone: 'pink', kicker: 'Mondays + Tuesdays', title: '4 for $24', sub: 'the little box', cookies: ['toasted-marshmallow', 'oreo'] },
  { tone: 'butter', kicker: 'Every day', title: '6 for $35', sub: 'mix and match', cookies: ['classic-chocolate', 'biscoff', 'reese-s', 'white-kitkat', 'red-velvet', 'oreo'] },
  { tone: 'caramel', kicker: 'The one that drips', title: 'Biscoff', sub: 'extra spread on top', cookies: ['biscoff'] },
  { tone: 'milk', kicker: 'Order', title: 'DM us', sub: BRAND.handle, cookies: ['reese-s'] },
] as const

export function Instagram() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        gsap.fromTo(
          q('.ig__tile'),
          { clipPath: 'inset(100% 0% 0% 0% round 6px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 6px)',
            duration: 1.1,
            ease: 'expo.inOut',
            stagger: 0.08,
            scrollTrigger: { trigger: q('.ig__row')[0], start: 'top 82%' },
          },
        )
        gsap.from(q('.ig__art'), {
          scale: 1.5,
          rotation: -30,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: q('.ig__row')[0], start: 'top 82%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="ig" id="instagram" ref={root} aria-labelledby="ig-title">
      <SectionTitle id="ig-title" className="title--cocoa">
        Instagram
      </SectionTitle>
      <a className="ig__handle" href={BRAND.instagram} target="_blank" rel="noreferrer">
        {BRAND.handle}
      </a>
      <ul className="ig__row">
        {TILES.map((t) => (
          <li key={t.title}>
            <a
              className={`ig__tile ig__tile--${t.tone}`}
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.title}, ${t.sub}. Opens Instagram.`}
            >
              <span className="ig__kicker">{t.kicker}</span>
              <span className="ig__big">{t.title}</span>
              <span className="ig__sub">{t.sub}</span>
              <span className={`ig__art ig__art--${t.cookies.length}`} aria-hidden="true">
                {t.cookies.map((c, i) => (
                  <Cookie key={i} id={c} alt="" />
                ))}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
