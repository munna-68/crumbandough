import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BRAND } from '../lib/data'
import { money } from '../lib/format'
import { ScrollTrigger, gsap } from '../lib/motion'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { useShop } from '../lib/store'
import { TLink } from './Transition'

const LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/#flavours', label: 'Flavours' },
  { to: '/#story', label: 'Story' },
  { to: '/#instagram', label: 'Channel' },
]

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      crumb <span className="wordmark__and">and</span> dough
    </span>
  )
}

export function Nav() {
  const { totalCookies } = useShop()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        setScrolled(y > 24)
        setHidden(y > 320 && self.direction === 1)
      },
    })
    return () => st.kill()
  }, [pathname])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.dataset.nav = hidden && !open ? 'hidden' : 'shown'
  }, [hidden, open])

  return (
    <>
      <header
        className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}
      >
        <a href="#main" className="skip">
          Skip to content
        </a>
        <div className="nav__inner">
          <TLink to="/" className="nav__brand" ariaLabel="crumb and dough, home">
            <Wordmark />
          </TLink>
          <nav className="nav__links" aria-label="Main">
            {LINKS.map((l) => (
              <TLink key={l.label} to={l.to} className={`nav__link ${pathname === l.to ? 'is-active' : ''}`}>
                <span className="roll">
                  <span>{l.label}</span>
                  <span aria-hidden="true">{l.label}</span>
                </span>
              </TLink>
            ))}
          </nav>
          <div className="nav__right">
            <TLink to="/kitchen" className="nav__small">
              Kitchen
            </TLink>
            <TLink to="/shop" className="nav__box" ariaLabel={`Your box, ${totalCookies} cookies`}>
              <span>Your box</span>
              <span key={totalCookies} className="nav__count count-pop">
                {totalCookies}
              </span>
            </TLink>
            <button
              type="button"
              className="nav__burger"
              aria-expanded={open}
              aria-controls="menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.toggleAttribute('inert', !open)
    if (first.current) {
      first.current = false
      gsap.set(el, { clipPath: 'circle(0% at calc(100% - 40px) 36px)', visibility: 'hidden' })
      return
    }
    if (open) {
      lockScroll()
      gsap
        .timeline()
        .set(el, { visibility: 'visible' })
        .to(el, { clipPath: 'circle(150% at calc(100% - 40px) 36px)', duration: 0.7, ease: 'power3.inOut' })
        .fromTo(
          el.querySelectorAll('.menu__item'),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.6, stagger: 0.06, ease: 'expo.out' },
          0.25,
        )
      return () => unlockScroll()
    }
    gsap
      .timeline()
      .to(el, { clipPath: 'circle(0% at calc(100% - 40px) 36px)', duration: 0.5, ease: 'power3.in' })
      .set(el, { visibility: 'hidden' })
  }, [open])

  return (
    <div className="menu" id="menu" ref={ref} aria-hidden={!open}>
      <nav className="menu__links" aria-label="Menu">
        {[{ to: '/', label: 'Home' }, ...LINKS, { to: '/kitchen', label: 'Kitchen' }].map((l) => (
          <span key={l.label} className="menu__mask">
            <TLink to={l.to} className="menu__item" onClick={onClose}>
              {l.label}
            </TLink>
          </span>
        ))}
      </nav>
      <p className="menu__foot">
        DM to order on Instagram, or build your box here. {BRAND.shortLocation}
      </p>
    </div>
  )
}

export function Toasts() {
  const { toasts, dismissToast } = useShop()
  return (
    <>
      <div className="toasts" aria-hidden="true">
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => dismissToast(t.id)}
            className={`toast ${t.tone === 'full' ? 'toast--full' : ''}`}
          >
            {t.message}
          </button>
        ))}
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {toasts[toasts.length - 1]?.message ?? ''}
      </div>
    </>
  )
}

/** Mobile only: the running count and the way into the review sheet. */
export function MobileOrderBar() {
  const { totalCookies, boxes, activeBox, boxCount, orderTotal, openReview } = useShop()
  const visible = totalCookies > 0
  const count = boxCount(activeBox)
  return (
    <div className={`obar ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      <div className="obar__text">
        <p>
          {totalCookies} {totalCookies === 1 ? 'cookie' : 'cookies'}, {boxes.length} {boxes.length === 1 ? 'box' : 'boxes'}
          <strong> {money(orderTotal)}</strong>
        </p>
        <div className="obar__segs" aria-hidden="true">
          {Array.from({ length: activeBox.size }).map((_, i) => (
            <span key={i} className={i < count ? 'is-on' : ''} />
          ))}
        </div>
      </div>
      <button type="button" className="btn btn--pink btn--sm" onClick={openReview} tabIndex={visible ? 0 : -1}>
        Review order
      </button>
    </div>
  )
}
