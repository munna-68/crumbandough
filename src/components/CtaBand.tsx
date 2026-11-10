import { BRAND } from '../lib/data'
import { BrandImage } from './BrandImage'
import { ArrowUpRight } from './Icons'
import { WipeLink } from './PageTransition'

export function CtaBand() {
  return (
    <section className="cta">
      <div className="page-shell">
        <div className="cta__panel">
          <div className="cta__copy">
            <p className="eyebrow">baked, boxed, gone</p>
            <h2 className="cta__title">
              hungry
              <br />
              yet?
            </h2>
            <p className="cta__lede">
              Build a box of four, six or twelve. Chunky, gooey, and packed like it is
              going to someone you like.
            </p>
            <div className="cta__actions">
              <WipeLink to="/order" className="btn btn-brown btn-lg">
                build your box
                <ArrowUpRight className="btn__icon" />
              </WipeLink>
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                or dm us on instagram
                <ArrowUpRight className="text-link__icon" />
              </a>
            </div>
            <p className="cta__price">
              <strong>six for A$35</strong>
              <span className="price-tag price-tag--light">placeholder price</span>
            </p>
          </div>

          <div className="cta__art">
            <div className="cta__circle" aria-hidden="true" />
            <div className="cta__dashes" aria-hidden="true" />
            <BrandImage slot="cta-cookie" className="cta__cookie" />
            <div className="cta__scribble">no sharing required</div>
          </div>
        </div>
      </div>
    </section>
  )
}
