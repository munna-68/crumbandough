import { useRef } from 'react'
import { BOX_OPTIONS } from '../../lib/data'
import { money } from '../../lib/format'
import { MOTION, gsap, useGSAP } from '../../lib/motion'
import { TLink } from '../Transition'
import { SectionTitle } from './SectionTitle'

const STAGES = [
  { src: '/images/trio-4.webp', w: 1000, h: 910, tone: 'n4' },
  { src: '/images/trio-6.webp', w: 1000, h: 701, tone: 'n6' },
  { src: '/images/trio-12.webp', w: 1000, h: 948, tone: 'n12' },
] as const

/** The reference's 3 · 6 · 9 row, as this shop's real box sizes. */
export function ShopTrio() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        q('.trio__item').forEach((item: Element) => {
          const s = gsap.utils.selector(item)
          gsap
            .timeline({
              scrollTrigger: { trigger: item, start: 'top 92%', end: 'center 45%', scrub: 0.8 },
            })
            .fromTo(s('.trio__num'), { yPercent: 55, scale: 0.55, rotation: -8 }, { yPercent: 0, scale: 1, rotation: 0, ease: 'none' }, 0)
            .fromTo(s('.trio__shot'), { yPercent: 28, rotation: -6, scale: 0.9 }, { yPercent: 0, rotation: 0, scale: 1, ease: 'none' }, 0)
          gsap.from(s('.trio__text > *'), {
            y: 26,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: item, start: 'top 70%', toggleActions: 'play none none reverse' },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="trio" id="shop" ref={root} aria-labelledby="shop-title">
      <SectionTitle id="shop-title" className="title--rose">
        Shop
      </SectionTitle>
      <ul className="trio__list">
        {BOX_OPTIONS.map((box, i) => {
          const stage = STAGES[i]
          return (
            <li key={box.size} className="trio__item">
              <TLink to={`/shop?size=${box.size}`} className="trio__link" ariaLabel={`${box.name}: ${box.size} cookies for ${money(box.price)}`}>
                <div className={`trio__stage trio__stage--${stage.tone}`}>
                  <span className="trio__num" aria-hidden="true">
                    {box.numeral}
                  </span>
                  <span className="trio__shot">
                    <img src={stage.src} alt="" width={stage.w} height={stage.h} loading="lazy" />
                  </span>
                </div>
                <div className="trio__text">
                  <p className="trio__name">{box.name}</p>
                  <p className="trio__price">
                    {box.size} cookies for <strong>{money(box.price)}</strong>
                  </p>
                  <p className="trio__when">{box.when}</p>
                </div>
              </TLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
