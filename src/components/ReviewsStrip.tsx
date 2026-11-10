import { BRAND, REVIEW_THEMES } from '../lib/data'
import { BrandImage } from './BrandImage'
import { ArrowUpRight } from './Icons'

export function ReviewsStrip() {
  return (
    <section className="reviews" id="reviews">
      <div className="page-shell reviews__grid">
        <div className="reviews__copy">
          <p className="eyebrow">review themes · placeholder</p>
          <h2 className="reviews__title">
            the bits people
            <br />
            <span>keep mentioning.</span>
          </h2>
          <p className="reviews__note">
            The real REVIEWS highlight is behind Instagram&apos;s login, so these are
            anonymous brand-voice themes — not customer quotes or names. Every theme below
            is written to be replaced with a verified review.
          </p>

          <div className="reviews__themes">
            {REVIEW_THEMES.map((theme, index) => (
              <div className="review-theme" key={theme.quote}>
                <span className="review-theme__index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="review-theme__line">{theme.quote}</p>
                  <p className="review-theme__detail">{theme.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            className="text-link reviews__link"
            href={BRAND.instagram}
            target="_blank"
            rel="noreferrer"
          >
            see the real highlights
            <ArrowUpRight className="text-link__icon" />
          </a>
        </div>

        <div className="reviews__media">
          <div className="reviews__image">
            <BrandImage slot="kitchen-still" />
          </div>
          <div className="reviews__sticker">
            packed with love
            <span>packed with care</span>
          </div>
          <span className="reviews__media-caption">the kitchen, when it is quiet</span>
        </div>
      </div>
    </section>
  )
}
