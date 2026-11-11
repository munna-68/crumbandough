import { useRef } from 'react'
import { MOTION, REDUCED, gsap, useGSAP } from '../../lib/motion'
import { Cookie } from '../Cookie'
import { Seal, TLink } from '../Transition'

/*
 * "From a tap to your door". On desktop the section pins and four big cards
 * slide past sideways while a cookie rolls along a track underneath; each card
 * acts out its step as it arrives (slots fill, a ticket gets stamped, a day is
 * circled and the cookies puff, the box gets its seal). On phones the cards
 * stack and each one plays as it scrolls into view.
 */

const SLOT_COOKIES = ['classic-chocolate', 'red-velvet', 'biscoff', 'oreo', 'reese-s', 'white-kitkat']
const DAYS = ['Today', 'Tomorrow', 'Fri', 'Sat', 'Sun']

export function Journey() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)

      /** Each card's own little performance, scrubbed by whatever trigger it is given. */
      const acts = (st: (panel: Element) => ScrollTrigger.Vars) => {
        const [p1, p2, p3, p4] = q('.jcard') as HTMLElement[]
        gsap
          .timeline({ scrollTrigger: st(p1) })
          .from(p1.querySelectorAll('.jslots__c'), { scale: 0, rotation: -200, stagger: 0.12, ease: 'back.out(1.6)' })
        gsap
          .timeline({ scrollTrigger: st(p2) })
          .from(p2.querySelector('.jticket'), { yPercent: 40, rotation: -10, autoAlpha: 0, ease: 'power3.out' })
          .from(p2.querySelector('.jticket__stamp'), { scale: 2.4, autoAlpha: 0, rotation: -40, ease: 'back.out(2)' }, '>-0.1')
        gsap
          .timeline({ scrollTrigger: st(p3) })
          .from(p3.querySelector('.jdays__ring'), { scale: 0, rotation: -120, ease: 'back.out(1.8)' })
          .from(p3.querySelectorAll('.jtray__c'), { scale: 0.55, y: 20, stagger: 0.1, ease: 'elastic.out(1, 0.5)' }, '<0.1')
        gsap
          .timeline({ scrollTrigger: st(p4) })
          .from(p4.querySelector('.jbox'), { yPercent: 30, rotation: 6, ease: 'power3.out' })
          .from(p4.querySelector('.jbox__seal'), { scale: 2.6, autoAlpha: 0, rotation: -60, ease: 'back.out(2)' }, '>-0.05')
      }

      const mm = gsap.matchMedia()
      mm.add(`${MOTION} and (min-width: 900px)`, () => {
        const track = q('.journey__track')[0] as HTMLElement
        const roller = q('.journey__roller')[0] as HTMLElement
        const fill = q('.journey__fill')[0] as HTMLElement
        const dist = () => track.scrollWidth - window.innerWidth
        const slide = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: q('.journey__pin')[0],
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const w = (roller.parentElement as HTMLElement).offsetWidth
              const x = self.progress * (w - roller.offsetWidth)
              gsap.set(roller, { x, rotation: (x / (Math.PI * roller.offsetWidth)) * 360 })
              // The pink line trails right behind the cookie, all the way to the end.
              gsap.set(fill, { scaleX: (x + roller.offsetWidth / 2) / w })
            },
          },
        })
        acts((panel) => ({ trigger: panel, containerAnimation: slide, start: 'left 95%', end: 'left 62%', scrub: true }))
      })
      mm.add(`${MOTION} and (max-width: 899px)`, () => {
        acts((panel) => ({ trigger: panel, start: 'top 80%', end: 'center 55%', scrub: true }))
      })
      mm.add(REDUCED, () => {
        root.current?.classList.add('journey--static')
      })
    },
    { scope: root },
  )

  return (
    <section className="journey" id="story" ref={root} aria-labelledby="journey-title">
      <div className="journey__pin">
        <div className="journey__track">
          <div className="jintro">
            <p className="jintro__kicker">How it works</p>
            <h2 className="jintro__title" id="journey-title">
              From a tap on your phone to a box at <em>your door.</em>
            </h2>
            <p className="jintro__lede">
              No account and no card. Your order goes straight to the kitchen, and payment stays in the DMs like it
              always has.
            </p>
          </div>

          <article className="jcard jcard--pink">
            <span className="jcard__n">01</span>
            <div className="jcard__art">
              <ul className="jslots" aria-hidden="true">
                {SLOT_COOKIES.map((id) => (
                  <li key={id}>
                    <span className="jslots__c">
                      <Cookie id={id} alt="" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <h3>Build your box</h3>
            <p>Pick four, six or twelve and tap the flavours in. Mix them up or go all in on one.</p>
          </article>

          <article className="jcard jcard--butter">
            <span className="jcard__n">02</span>
            <div className="jcard__art">
              <div className="jticket" aria-hidden="true">
                <p className="jticket__ref">CD-1042</p>
                <p className="jticket__name">Mabel</p>
                <dl>
                  <div>
                    <dt>Box</dt>
                    <dd>6 cookies</dd>
                  </div>
                  <div>
                    <dt>When</dt>
                    <dd>Fri, 12pm – 2pm</dd>
                  </div>
                  <div>
                    <dt>How</dt>
                    <dd>Pick up</dd>
                  </div>
                </dl>
                <span className="jticket__stamp">NEW</span>
              </div>
            </div>
            <h3>It lands on the kitchen board</h3>
            <p>The second you send it, your order is on the board with your day, your window and your note.</p>
          </article>

          <article className="jcard jcard--milk">
            <span className="jcard__n">03</span>
            <div className="jcard__art">
              <div className="jdays" aria-hidden="true">
                {DAYS.map((d) => (
                  <span key={d} className={`jdays__d ${d === 'Fri' ? 'is-pick' : ''}`}>
                    {d}
                    {d === 'Fri' ? <span className="jdays__ring" /> : null}
                  </span>
                ))}
              </div>
              <div className="jtray" aria-hidden="true">
                {['red-velvet', 'classic-chocolate', 'oreo'].map((id) => (
                  <span key={id} className="jtray__c">
                    <Cookie id={id} alt="" />
                  </span>
                ))}
              </div>
            </div>
            <h3>Baked on the day you pick</h3>
            <p>Nothing waits on a shelf. Your cookies go in the oven for the day you chose.</p>
          </article>

          <article className="jcard jcard--rose">
            <span className="jcard__n">04</span>
            <div className="jcard__art">
              <div className="jbox" aria-hidden="true">
                <span className="jbox__flap jbox__flap--l" />
                <span className="jbox__flap jbox__flap--r" />
                <span className="jbox__seal">
                  <Seal id="journey-seal" className="jbox__seal-art" />
                </span>
              </div>
            </div>
            <h3>Packed by hand, picked up or dropped off</h3>
            <p>Collect in Melbourne, or we bring it to your door.</p>
            <TLink to="/shop" className="btn btn--cocoa btn--sm jcard__cta">
              <span className="roll">
                <span>Build your box</span>
                <span aria-hidden="true">Build your box</span>
              </span>
            </TLink>
          </article>
        </div>

        <div className="journey__rail" aria-hidden="true">
          <span className="journey__line" />
          <span className="journey__fill" />
          <span className="journey__roller">
            <Cookie id="classic-chocolate" alt="" />
          </span>
        </div>
      </div>
    </section>
  )
}
