import { BRAND } from '../../lib/data'
import { SectionTitle } from './SectionTitle'

export function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <SectionTitle id="contact-title" className="title--caramel">
        Contact
      </SectionTitle>
      <dl className="contact__row">
        <div>
          <dt>Orders</dt>
          <dd>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer">
              DM {BRAND.handle}
            </a>
          </dd>
        </div>
        <div>
          <dt>Watch us bake</dt>
          <dd>
            <a href={BRAND.tiktok} target="_blank" rel="noreferrer">
              TikTok {BRAND.handle}
            </a>
          </dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>Melbourne, pick up or delivery</dd>
        </div>
      </dl>
    </section>
  )
}
