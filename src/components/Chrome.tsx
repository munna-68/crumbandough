import { BRAND } from '../lib/data'
import { CookieMark, ArrowUpRight, InstagramIcon, TikTokIcon } from './Icons'
import { WipeLink } from './PageTransition'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <CookieMark className="logo__mark" />
      <span className="logo__type">crumb and dough</span>
    </span>
  )
}

export function SiteHeader({ variant = 'shop' }: { variant?: 'shop' | 'order' }) {
  return (
    <header className="site-header">
      <div className="page-shell site-header__inner">
        <WipeLink to="/" className="logo-link" ariaLabel="Crumb and Dough home">
          <Logo />
        </WipeLink>

        <nav className="site-nav" aria-label="Main">
          <WipeLink to="/#flavours">the cookies</WipeLink>
          <WipeLink to="/#offers">prices</WipeLink>
          <WipeLink to="/#reviews">reviews</WipeLink>
        </nav>

        <div className="site-header__actions">
          {variant === 'shop' ? (
            <WipeLink to="/order" className="btn btn-brown btn-sm">
              order a box
              <ArrowUpRight className="btn__icon" />
            </WipeLink>
          ) : (
            <WipeLink to="/" className="btn btn-ghost btn-sm">
              back to the cookies
            </WipeLink>
          )}
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-wordmark">crumb and dough</p>
            <p className="footer-blurb">
              Chunky, gooey, homemade cookies. Baked in small batches in Melbourne, packed
              by hand, sent with care.
            </p>
            <div className="footer-location">
              <span className="footer-location__dot" />
              Melbourne, Australia · pickup + delivery
            </div>
          </div>

          <div className="footer-col">
            <p className="footer-heading">the good stuff</p>
            <WipeLink to="/#flavours">seven flavours</WipeLink>
            <WipeLink to="/#offers">box prices</WipeLink>
            <WipeLink to="/order">build a box</WipeLink>
          </div>

          <div className="footer-col">
            <p className="footer-heading">say hello</p>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer">
              <InstagramIcon className="footer-icon" />
              {BRAND.handle}
              <ArrowUpRight className="footer-arrow" />
            </a>
            <a href={BRAND.tiktok} target="_blank" rel="noreferrer">
              <TikTokIcon className="footer-icon" />
              tiktok
              <ArrowUpRight className="footer-arrow" />
            </a>
            <WipeLink to="/dashboard" className="footer-kitchen-link">
              kitchen board <span>(demo)</span>
            </WipeLink>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} crumb and dough · concept demo</span>
          <span>All prices are placeholders. This is not the real shop.</span>
        </div>
      </div>
    </footer>
  )
}
