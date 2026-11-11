import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MobileOrderBar } from '../components/Chrome'
import { Footer } from '../components/Footer'
import { BoxPanel, MobileControls } from '../components/shop/BoxBuilder'
import { Checkout } from '../components/shop/Checkout'
import { Rack } from '../components/shop/Rack'
import { ReviewSheet } from '../components/shop/ReviewSheet'
import { Cookie } from '../components/Cookie'
import { FLAVOURS } from '../lib/data'
import { MOTION, SplitText, gsap, onPageReady, useGSAP } from '../lib/motion'
import { useShop } from '../lib/store'
import { BOX_SIZES, type BoxSize } from '../lib/types'

export function Shop() {
  const { setSize, add, canAdd } = useShop()
  const location = useLocation()
  const navigate = useNavigate()
  const handled = useRef('')
  const root = useRef<HTMLElement>(null)

  // ?size=4 preselects a box, ?add=red-velvet drops one cookie in. Both are used by links from home.
  useEffect(() => {
    if (!location.search || handled.current === location.search) return
    handled.current = location.search
    const params = new URLSearchParams(location.search)
    const size = Number(params.get('size'))
    if ((BOX_SIZES as readonly number[]).includes(size)) setSize(size as BoxSize)
    const id = params.get('add')
    if (id && FLAVOURS.some((f) => f.id === id) && canAdd()) add(id)
    navigate('/shop', { replace: true })
  }, [location.search, setSize, add, canAdd, navigate])

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        const split = SplitText.create(q('.phead__title .line'), { type: 'chars', mask: 'chars' })
        gsap.set(split.chars, { yPercent: 110 })
        gsap.set(q('.phead__fade'), { autoAlpha: 0, y: 20 })
        gsap.set(q('.phead__cookie'), { xPercent: 120, rotation: 180 })
        gsap.set(q('.card'), { autoAlpha: 0, y: 60 })
        const off = onPageReady(contextSafe!(() => {
          gsap
            .timeline({ defaults: { ease: 'expo.out' } })
            .to(split.chars, { yPercent: 0, duration: 1, stagger: 0.03 }, 0.05)
            .to(q('.phead__fade'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.3)
            .to(q('.phead__cookie'), { xPercent: 0, rotation: 0, duration: 1.4, stagger: 0.1 }, 0.1)
          gsap.to(q('.card'), {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: { each: 0.06, from: 'start' },
            delay: 0.35,
          })
        }))
        return () => {
          off()
          split.revert()
        }
      })
    },
    { scope: root },
  )

  return (
    <>
      <main id="main" ref={root} className="shop">
        <header className="phead">
          <div className="phead__copy">
            <h1 className="phead__title">
              <span className="line">Build</span>
              <span className="line">your box</span>
            </h1>
            <p className="phead__lede phead__fade">
              Pick a size, then tap the flavours in. Mix and match, or six of the same. We bake it for the day you choose.
            </p>
          </div>
          <dl className="phead__facts phead__fade">
            <div>
              <dt>Every day</dt>
              <dd>6 for A$35</dd>
            </div>
            <div>
              <dt>Mondays and Tuesdays</dt>
              <dd>4 for A$24</dd>
            </div>
          </dl>
          <div className="phead__cookies" aria-hidden="true">
            <span className="phead__cookie">
              <Cookie id="reese-s" size="lg" alt="" eager />
            </span>
            <span className="phead__cookie">
              <Cookie id="red-velvet" size="lg" alt="" eager />
            </span>
          </div>
        </header>

        <section className="builder" aria-label="Box builder">
          <div className="builder__strip">
            <MobileControls />
          </div>
          <div className="builder__grid">
            <aside className="builder__aside" aria-label="Your box">
              <BoxPanel />
            </aside>
            <Rack />
          </div>
        </section>
      </main>
      <Footer />
      <MobileOrderBar />
      <ReviewSheet />
      <Checkout />
    </>
  )
}
