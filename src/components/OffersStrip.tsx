import { BOX_OPTIONS, OFFERS } from '../lib/data'
import { money } from '../lib/format'
import { BrandImage } from './BrandImage'
import { ArrowUpRight } from './Icons'
import { WipeLink } from './PageTransition'

const OFFER_SLOTS = {
  4: 'box-4',
  6: 'box-6',
} as const

export function OffersStrip() {
  return (
    <section className="offers" id="offers">
      <div className="page-shell">
        <div className="offers__panel">
          <div className="offers__head">
            <div>
              <p className="eyebrow eyebrow--pink">from the menu</p>
              <h2 className="offers__title">two very good reasons.</h2>
            </div>
            <p className="offers__note">
              Both are real offers from the public menu.
              <br />
              Prices here are placeholders.
            </p>
          </div>

          <div className="offers__grid">
            {OFFERS.map((offer, index) => {
              const option = BOX_OPTIONS.find((box) => box.size === (index === 0 ? 6 : 4))
              if (!option) return null
              const slot = OFFER_SLOTS[option.size as 4 | 6]
              return (
                <WipeLink
                  key={offer.title}
                  to={`/order?box=${option.size}`}
                  className={`offer-card ${index === 0 ? 'offer-card--pink' : 'offer-card--glass'}`}
                >
                  <div className="offer-card__copy">
                    <p className="offer-card__eyebrow">{offer.eyebrow}</p>
                    <h3 className="offer-card__title">{offer.title}</h3>
                    <p className="offer-card__detail">{offer.detail}</p>
                    <p className="offer-card__price">
                      <span className="offer-card__amount">{money(offer.price)}</span>
                      <span className="offer-card__tag">placeholder price</span>
                    </p>
                    <span className="offer-card__cta">
                      build this box
                      <ArrowUpRight className="offer-card__arrow" />
                    </span>
                  </div>
                  <div className="offer-card__art">
                    <BrandImage slot={slot} decorative />
                  </div>
                </WipeLink>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
