import { BOX_PRICES, FLAVOURS } from '../../lib/data'
import { money } from '../../lib/format'
import { useShop } from '../../lib/store'
import { useDialog } from '../../lib/useDialog'
import { usePresence } from '../../lib/usePresence'
import { Cookie } from '../Cookie'
import { SlotGrid } from './BoxBuilder'
import { Minus, Plus, X } from './Icons'

/** Phone: the bottom sheet behind "Review order", ported from Bake House. */
export function ReviewSheet() {
  const {
    reviewOpen,
    closeReview,
    boxes,
    boxCount,
    orderTotal,
    activeBoxId,
    setActiveBox,
    add,
    remove,
    addBox,
    openCheckout,
    totalCookies,
    canAdd,
  } = useShop()
  const { ref } = useDialog(reviewOpen, closeReview)
  const { mounted, isClosing } = usePresence(reviewOpen, 280)
  if (!mounted) return null

  return (
    <div className={`overlay overlay--sheet ${isClosing ? 'is-closing' : ''}`}>
      <button type="button" className="overlay__scrim" aria-label="Close your order" onClick={closeReview} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="review-title" className="sheet" tabIndex={-1}>
        <span className="sheet__grip" aria-hidden="true" />
        <div className="sheet__head">
          <h2 id="review-title" className="sheet__title">
            Your order
          </h2>
          <button type="button" onClick={closeReview} aria-label="Close" className="icon-btn">
            <X />
          </button>
        </div>

        <div className="sheet__boxes">
          {boxes.map((b, i) => {
            const items = FLAVOURS.filter((f) => (b.items[f.id] ?? 0) > 0)
            const live = b.id === activeBoxId
            return (
              <section key={b.id} className={`rbox ${live ? 'is-live' : ''}`}>
                <div className="rbox__head">
                  <span className="rbox__tag">
                    Box {i + 1}, {b.size} cookies
                  </span>
                  {live ? (
                    <span className="rbox__count">
                      {boxCount(b)} of {b.size} filled
                    </span>
                  ) : (
                    <button type="button" className="rbox__edit" onClick={() => setActiveBox(b.id)}>
                      Edit this box
                    </button>
                  )}
                </div>
                <SlotGrid box={b} variant="sheet" />
                {items.length === 0 ? (
                  <p className="rbox__empty">Nothing in here yet.</p>
                ) : (
                  <ul className="rbox__list">
                    {items.map((f) => (
                      <li key={f.id} className="line">
                        <span className="line__thumb">
                          <Cookie id={f.id} alt="" />
                        </span>
                        <span className="line__name">{f.name}</span>
                        {live ? (
                          <span className="stepper">
                            <button type="button" onClick={() => remove(f.id)} aria-label={`Remove one ${f.name}`}>
                              <Minus />
                            </button>
                            <span key={b.items[f.id]} className="count-pop">
                              {b.items[f.id]}
                            </span>
                            <button type="button" onClick={() => add(f.id)} disabled={!canAdd()} aria-label={`Add one ${f.name}`}>
                              <Plus />
                            </button>
                          </span>
                        ) : (
                          <span className="line__qty">× {b.items[f.id]}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="rbox__price">
                  <span>Box of {b.size}</span>
                  <strong>{money(BOX_PRICES[b.size])}</strong>
                </p>
              </section>
            )
          })}
        </div>

        {boxes.length < 4 ? (
          <button type="button" className="btn btn--outline btn--block" onClick={addBox}>
            + Add another box
          </button>
        ) : null}

        <div className="sheet__total">
          <span>Total</span>
          <strong key={orderTotal} className="count-pop">
            {money(orderTotal)}
          </strong>
        </div>
        <button type="button" className="btn btn--cocoa btn--block btn--tall" disabled={totalCookies === 0} onClick={() => openCheckout(1)}>
          Check out, {money(orderTotal)}
        </button>
      </div>
    </div>
  )
}
