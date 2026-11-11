import { Fragment, useRef } from 'react'
import { MOTION, SplitText, gsap, useGSAP } from '../../lib/motion'
import { Cookie } from '../Cookie'

/*
 * The story, as one sentence that lights up word by word as you scroll,
 * with little cookie pills tucked into the line.
 */
const PARTS: Array<string | { cookie: string }> = [
  'Chunky, gooey and homemade.',
  { cookie: 'classic-chocolate' },
  'Every cookie is stuffed, baked in small batches in a Melbourne kitchen',
  { cookie: 'red-velvet' },
  'and packed into its box by hand. Pick it up, or we bring it to you.',
  { cookie: 'biscoff' },
]

const FACTS = [
  { k: 'Baked to order', v: 'Nothing sits on a shelf. Your box is baked for your day.' },
  { k: 'Pick up or delivery', v: 'Collect in Melbourne, or have it dropped at your door.' },
  { k: 'Mix and match', v: 'Seven flavours. Pick one of each, or six of the same.' },
]

export function Statement() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        const split = SplitText.create(q('.story__words'), { type: 'words' })
        gsap
          .timeline({
            scrollTrigger: { trigger: q('.story__text')[0], start: 'top 78%', end: 'bottom 45%', scrub: true },
          })
          .fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none' }, 0)
        q('.story__pill').forEach((pill: Element) => {
          gsap.from(pill, {
            scale: 0,
            rotation: -90,
            duration: 0.8,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: pill, start: 'top 75%', toggleActions: 'play none none reverse' },
          })
        })
        gsap.from(q('.story__fact'), {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: q('.story__facts')[0], start: 'top 85%' },
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section className="story" id="story" ref={root} aria-label="Our story">
      <p className="story__text">
        {PARTS.map((part, i) =>
          typeof part === 'string' ? (
            <Fragment key={i}>
              <span className="story__words">{part}</span>{' '}
            </Fragment>
          ) : (
            <Fragment key={i}>
              <span className="story__pill" aria-hidden="true">
                <Cookie id={part.cookie} alt="" />
              </span>{' '}
            </Fragment>
          ),
        )}
      </p>
      <dl className="story__facts">
        {FACTS.map((f) => (
          <div key={f.k} className="story__fact">
            <dt>{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
