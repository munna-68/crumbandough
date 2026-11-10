import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { BOX_OPTIONS, FLAVOURS, TIME_SLOTS } from '../lib/data'
import {
  money,
  orderSummary,
  prefersReducedMotion,
  shortDate,
} from '../lib/format'
import { scrollToTop } from '../lib/scroll'
import { useShop } from '../lib/store'
import type { BoxSize, Flavour, PlacedOrder } from '../lib/types'
import type { ImageSlotName } from '../lib/images'
import { BrandImage } from '../components/BrandImage'
import { SiteFooter, SiteHeader } from '../components/Chrome'
import { BoxPreview } from '../components/BoxPreview'
import {
  ArrowUpRight,
  BagIcon,
  Check,
  CookieMark,
  Minus,
  PinIcon,
  Plus,
} from '../components/Icons'
import { WipeLink } from '../components/PageTransition'

const SIZE_SLOTS: Record<BoxSize, ImageSlotName> = {
  4: 'box-4',
  6: 'box-6',
  12: 'box-12',
}

const BURST = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2 + (index % 2 ? 0.16 : 0)
  const radius = 34 + (index % 4) * 8
  return {
    left: 50 + Math.cos(angle) * radius,
    top: 50 + Math.sin(angle) * radius,
    delay: index * 0.025,
  }
})

export function Order() {
  const {
    draft,
    cookieCount,
    remaining,
    total,
    days,
    setSize,
    addFlavour,
    removeFlavour,
    clearBox,
    patchDraft,
    setMode,
    placeOrder,
  } = useShop()
  const [searchParams] = useSearchParams()
  const [confirmed, setConfirmed] = useState<PlacedOrder | null>(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    const requested = Number(searchParams.get('box'))
    if (requested === 4 || requested === 6 || requested === 12) {
      setSize(requested)
    }
  }, [searchParams, setSize])

  function handlePlace() {
    if (submittingRef.current) return
    submittingRef.current = true
    try {
      const order = placeOrder()
      setConfirmed(order)
      window.requestAnimationFrame(scrollToTop)
    } catch {
      submittingRef.current = false
    }
  }

  return (
    <div className="order-page">
      <a className="skip-link" href="#main">
        skip to your box
      </a>
      <SiteHeader variant="order" />

      <main id="main">
        {confirmed ? (
          <OrderConfirmation order={confirmed} />
        ) : (
          <div className="page-shell order-main">
            <div className="order-hero">
              <div>
                <p className="eyebrow">the order page</p>
                <h1>
                  build your box.
                </h1>
              </div>
              <div className="order-hero__side">
                <p>
                  Four, six or twelve. Pickup or delivery.
                  <em> The only hard part is choosing.</em>
                </p>
                <span className="order-hero__tag">all prices are placeholders</span>
              </div>
            </div>

            <div className="order-shell">
              <div className="builder">
                <section className="order-step" aria-labelledby="size-heading">
                  <div className="step-head">
                    <span className="step-head__num">01</span>
                    <h2 id="size-heading">pick your size</h2>
                    <span className="step-head__aside">bigger is usually the answer</span>
                  </div>

                  <div className="size-options">
                    {BOX_OPTIONS.map((option) => (
                      <button
                        key={option.size}
                        type="button"
                        className="size-card"
                        aria-pressed={draft.boxSize === option.size}
                        onClick={() => setSize(option.size)}
                      >
                        {option.badge && <span className="size-card__badge">{option.badge}</span>}
                        <span className="size-card__top">
                          <span className="size-card__number">{option.size}</span>
                          <BrandImage
                            slot={SIZE_SLOTS[option.size]}
                            className="size-card__thumb"
                            decorative
                            showLabel={false}
                          />
                        </span>
                        <span className="size-card__name">{option.name}</span>
                        <span className="size-card__price">
                          {money(option.price)}
                          <em>placeholder</em>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="order-step" aria-labelledby="flavours-heading">
                  <div className="step-head">
                    <span className="step-head__num">02</span>
                    <h2 id="flavours-heading">fill it up</h2>
                    <div className="step-head__aside step-head__aside--actions">
                      {cookieCount > 0 && (
                        <button type="button" className="step-clear" onClick={clearBox}>
                          clear box
                        </button>
                      )}
                      <span className="step-pill" aria-live="polite">
                        {cookieCount} / {draft.boxSize}
                      </span>
                    </div>
                  </div>

                  <div className="order-live-strip">
                    <span className="order-live-strip__count">
                      {cookieCount} of {draft.boxSize}
                    </span>
                    <span className="order-live-strip__bar" aria-hidden="true">
                      <span
                        style={{
                          transform: `scaleX(${
                            draft.boxSize ? cookieCount / draft.boxSize : 0
                          })`,
                        }}
                      />
                    </span>
                    <span>
                      {remaining > 0 ? `${remaining} to go` : 'box full'} · {money(total)}
                    </span>
                  </div>

                  <div className="flavour-list">
                    {FLAVOURS.map((flavour) => (
                      <FlavourRow
                        key={flavour.id}
                        flavour={flavour}
                        qty={draft.counts[flavour.id] ?? 0}
                        full={remaining === 0}
                        onAdd={() => addFlavour(flavour.id)}
                        onRemove={() => removeFlavour(flavour.id)}
                      />
                    ))}
                  </div>
                </section>

                <section className="order-step" aria-labelledby="details-heading">
                  <div className="step-head">
                    <span className="step-head__num">03</span>
                    <h2 id="details-heading">the details</h2>
                    <span className="step-head__aside">no street address, no fuss</span>
                  </div>

                  <div className="order-fields">
                    <div className="field field--full">
                      <label className="field__label" htmlFor="order-name">
                        first name
                      </label>
                      <input
                        id="order-name"
                        name="given-name"
                        type="text"
                        autoComplete="given-name"
                        placeholder="e.g. alex"
                        maxLength={40}
                        value={draft.name}
                        onChange={(event) => patchDraft({ name: event.target.value })}
                      />
                      <p className="field__help">First name only — enough for the box tag.</p>
                    </div>

                    <div className="field field--full">
                      <span className="field__label" id="mode-label">
                        pickup or delivery
                      </span>
                      <div className="mode-toggle" role="group" aria-labelledby="mode-label">
                        <button
                          type="button"
                          aria-pressed={draft.mode === 'pickup'}
                          onClick={() => setMode('pickup')}
                        >
                          <BagIcon className="mode-toggle__icon" />
                          pickup
                          <small>free</small>
                        </button>
                        <button
                          type="button"
                          aria-pressed={draft.mode === 'delivery'}
                          onClick={() => setMode('delivery')}
                        >
                          <PinIcon className="mode-toggle__icon" />
                          delivery
                          <small>Melbourne metro</small>
                        </button>
                      </div>
                      <p className="field__help">
                        {draft.mode === 'pickup'
                          ? 'Pickup in Melbourne. The exact spot is confirmed after ordering.'
                          : 'Melbourne metro only. A$8 delivery is a placeholder for this concept.'}
                      </p>
                    </div>

                    {draft.mode === 'delivery' && (
                      <div className="field field--full">
                        <label className="field__label" htmlFor="order-area">
                          delivery area
                        </label>
                        <input
                          id="order-area"
                          name="address-level2"
                          type="text"
                          autoComplete="address-level2"
                          placeholder="suburb or area only"
                          maxLength={60}
                          value={draft.area}
                          onChange={(event) => patchDraft({ area: event.target.value })}
                        />
                        <p className="field__help">
                          Area only — no street address needed. We will sort the rest.
                        </p>
                      </div>
                    )}

                    <div className="field field--full">
                      <span className="field__label" id="day-label">
                        day
                      </span>
                      <div className="day-options" role="group" aria-labelledby="day-label">
                        {days.map((day) => (
                          <button
                            key={day.iso}
                            type="button"
                            className="day-chip"
                            aria-pressed={draft.date === day.iso}
                            onClick={() => patchDraft({ date: day.iso })}
                          >
                            <span>{day.weekday}</span>
                            <strong>{day.day}</strong>
                            <em>{day.label}</em>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="field field--full">
                      <span className="field__label" id="time-label">
                        time
                      </span>
                      <div className="slot-options" role="group" aria-labelledby="time-label">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            aria-pressed={draft.slot === slot}
                            onClick={() => patchDraft({ slot })}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      <p className="field__help">
                        All windows are placeholders. The kitchen would confirm the exact
                        slot.
                      </p>
                    </div>

                    <div className="field field--full">
                      <label className="field__label" htmlFor="order-note">
                        note for the kitchen <span>optional</span>
                      </label>
                      <textarea
                        id="order-note"
                        name="note"
                        rows={3}
                        maxLength={240}
                        placeholder="Gift box? Leave the red velvet out? Tell us here."
                        value={draft.note}
                        onChange={(event) => patchDraft({ note: event.target.value })}
                      />
                    </div>
                  </div>
                </section>

                <p className="order-fineprint">
                  This is a concept demo. No payment is taken, nothing is sent, and every
                  price, time and order is fictional.
                </p>
              </div>

              <BoxPreview onPlace={handlePlace} />
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

interface FlavourRowProps {
  flavour: Flavour
  qty: number
  full: boolean
  onAdd: () => void
  onRemove: () => void
}

function FlavourRow({ flavour, qty, full, onAdd, onRemove }: FlavourRowProps) {
  return (
    <div
      className={`flavour-row ${qty > 0 ? 'is-selected' : ''}`}
      style={{ '--row-accent': flavour.accent } as CSSProperties}
    >
      <div className="flavour-row__thumb">
        <BrandImage slot={flavour.imageSlot} decorative showLabel={false} />
      </div>
      <div className="flavour-row__copy">
        <div className="flavour-row__name">
          {flavour.name}
          <span>{flavour.note}</span>
        </div>
        <p>{flavour.desc}</p>
      </div>
      <div className="stepper" aria-label={`${flavour.name} quantity`}>
        <button
          type="button"
          className="stepper__btn"
          onClick={onRemove}
          disabled={qty === 0}
          aria-label={`Remove one ${flavour.name}`}
        >
          <Minus />
        </button>
        <span key={qty} className={`stepper__count ${qty > 0 ? 'count-pop' : ''}`}>
          {qty}
        </span>
        <button
          type="button"
          className="stepper__btn"
          onClick={onAdd}
          disabled={full}
          aria-label={`Add one ${flavour.name}`}
        >
          <Plus />
        </button>
      </div>
    </div>
  )
}

function OrderConfirmation({ order }: { order: PlacedOrder }) {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const root = rootRef.current
    if (!root) return
    const context = gsap.context(() => {
      gsap.from('.confirm__card', {
        y: 28,
        autoAlpha: 0,
        scale: 0.985,
        duration: 0.7,
        ease: 'power3.out',
      })
      gsap.from('.confirm__check', {
        scale: 0.4,
        rotation: -24,
        autoAlpha: 0,
        duration: 0.85,
        delay: 0.18,
        ease: 'elastic.out(1, 0.62)',
      })
      gsap.from('.confirm__burst span', {
        scale: 0,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.022,
        delay: 0.3,
        ease: 'back.out(2)',
      })
      gsap.from('.confirm__row', {
        y: 12,
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.055,
        delay: 0.34,
        ease: 'power2.out',
      })
      gsap.from('.confirm__actions > *', {
        y: 10,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.55,
        ease: 'power2.out',
      })
    }, root)
    return () => context.revert()
  }, [])

  return (
    <section className="confirm" ref={rootRef}>
      <div className="page-shell confirm__shell">
        <div className="confirm__card">
          <div className="confirm__topline">
            <span className="confirm__demo">demo order</span>
            <span className="confirm__ref">{order.ref}</span>
          </div>

          <div className="confirm__check-wrap">
            <div className="confirm__burst" aria-hidden="true">
              {BURST.map((crumb, index) => (
                <span
                  key={index}
                  style={
                    {
                      left: `${crumb.left}%`,
                      top: `${crumb.top}%`,
                      '--delay': `${crumb.delay}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="confirm__check">
              <CookieMark />
              <span className="confirm__check-badge">
                <Check />
              </span>
            </div>
          </div>

          <p className="eyebrow">order in · thank you</p>
          <h1 className="confirm__title">thanks, {order.name}.</h1>
          <p className="confirm__lede">
            The kitchen has your box. In a real version, it would land on the bake list
            before you closed the tab.
          </p>

          <div className="confirm__summary">
            <div className="confirm__row">
              <span>the box</span>
              <strong>{order.boxSize} cookies · {money(order.total)} <em>placeholder</em></strong>
            </div>
            <div className="confirm__row">
              <span>the flavours</span>
              <strong>{orderSummary(order)}</strong>
            </div>
            <div className="confirm__row">
              <span>when</span>
              <strong>{shortDate(order.date)} · {order.slot}</strong>
            </div>
            <div className="confirm__row">
              <span>how</span>
              <strong>
                {order.mode === 'pickup'
                  ? 'pickup · Melbourne'
                  : `delivery · ${order.area}`}
              </strong>
            </div>
            {order.note && (
              <div className="confirm__row">
                <span>kitchen note</span>
                <strong>{order.note}</strong>
              </div>
            )}
          </div>

          <p className="confirm__fineprint">
            Nothing was paid, sent or baked. This confirmation and the kitchen board are
            demo data. All prices are placeholders.
          </p>

          <div className="confirm__actions">
            <WipeLink to="/dashboard" className="btn btn-brown btn-lg">
              open the kitchen board
              <ArrowUpRight className="btn__icon" />
            </WipeLink>
            <WipeLink to="/" className="text-link">
              back to the cookies
            </WipeLink>
          </div>
        </div>
      </div>
    </section>
  )
}
