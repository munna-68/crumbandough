import { useRef } from 'react'
import { FLAVOURS } from '../../lib/data'
import { MOTION, REDUCED, gsap, useGSAP } from '../../lib/motion'
import { Cookie } from '../Cookie'
import { TLink } from '../Transition'

/*
 * The one theatrical section. It pins for seven screens; each scroll step rolls
 * the current cookie off to the left while the next rolls in from the right,
 * the wall repaints in that flavour's tint and the name swaps line by line.
 */
export function FlavourStage() {
  const root = useRef<HTMLElement>(null)
  const n = FLAVOURS.length

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        const pin = q('.fl__pin')[0] as HTMLElement
        const cookies = q('.fl__cookie') as HTMLElement[]
        const names = q('.fl__name') as HTMLElement[]
        const metas = q('.fl__meta-item') as HTMLElement[]
        const dots = q('.fl__dot') as HTMLElement[]
        const count = q('.fl__count-now')[0] as HTMLElement

        gsap.set(cookies.slice(1), { xPercent: 220, rotation: 330 })
        names.slice(1).forEach((nm) => gsap.set(nm.querySelectorAll('.fl__line-in'), { yPercent: 110 }))
        gsap.set(metas.slice(1), { autoAlpha: 0, y: 20 })
        gsap.set(pin, { backgroundColor: FLAVOURS[0].tint })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              const i = Math.round(self.progress * (n - 1))
              count.textContent = String(i + 1).padStart(2, '0')
              dots.forEach((d, j) => d.classList.toggle('is-on', j === i))
            },
          },
        })

        for (let i = 1; i < n; i++) {
          const at = i - 1
          tl.to(cookies[i - 1], { xPercent: -300, rotation: -420, duration: 0.8, ease: 'power2.in' }, at)
            .to(cookies[i], { xPercent: 0, rotation: 0, duration: 0.9, ease: 'power3.out' }, at + 0.15)
            .to(names[i - 1].querySelectorAll('.fl__line-in'), { yPercent: -110, duration: 0.45, stagger: 0.06 }, at)
            .to(names[i].querySelectorAll('.fl__line-in'), { yPercent: 0, duration: 0.5, stagger: 0.06 }, at + 0.3)
            .to(metas[i - 1], { autoAlpha: 0, y: -20, duration: 0.35 }, at)
            .to(metas[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.4)
            .to(pin, { backgroundColor: FLAVOURS[i].tint, duration: 0.8, ease: 'none' }, at)
            .to(q('.fl__shadow'), { keyframes: { scaleX: [1, 0.6, 1] }, duration: 0.8 }, at)
        }
        tl.to({}, { duration: 0.2 })
      })
      mm.add(REDUCED, () => {
        root.current?.classList.add('fl--static')
      })
    },
    { scope: root },
  )

  return (
    <section className="fl" id="flavours" ref={root} aria-labelledby="fl-title" style={{ ['--n' as string]: n }}>
      <div className="fl__pin">
        <h2 className="fl__title" id="fl-title">
          Flavours
        </h2>

        <div className="fl__names">
          {FLAVOURS.map((f) => (
            <h3 key={f.id} className="fl__name">
              {f.name.split(' ').map((w, i) => (
                <span key={i} className="fl__line">
                  <span className="fl__line-in">{w}</span>
                </span>
              ))}
            </h3>
          ))}
        </div>

        <div className="fl__stage" aria-hidden="true">
          <span className="fl__shadow" />
          {FLAVOURS.map((f, i) => (
            <div key={f.id} className="fl__cookie">
              <Cookie id={f.id} size="lg" alt="" eager={i < 2} />
            </div>
          ))}
        </div>

        <div className="fl__count" aria-hidden="true">
          <span className="fl__count-now">01</span>
          <span className="fl__count-of">/{String(n).padStart(2, '0')}</span>
        </div>

        <div className="fl__metas">
          {FLAVOURS.map((f) => (
            <div key={f.id} className="fl__meta-item">
              <p className="fl__note">{f.note}</p>
              <p className="fl__desc">{f.desc}</p>
              <TLink to={`/shop?add=${f.id}`} className="btn btn--cocoa btn--sm">
                <span className="roll">
                  <span>Add to a box</span>
                  <span aria-hidden="true">Add to a box</span>
                </span>
              </TLink>
            </div>
          ))}
        </div>

        <div className="fl__dots" aria-hidden="true">
          {FLAVOURS.map((f, i) => (
            <span key={f.id} className={`fl__dot ${i === 0 ? 'is-on' : ''}`} style={{ background: f.accent }} />
          ))}
        </div>
      </div>
    </section>
  )
}
