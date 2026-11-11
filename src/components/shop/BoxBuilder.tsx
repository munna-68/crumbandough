import { BOX_OPTIONS, BOX_PRICES, FLAVOURS } from '../../lib/data'
import { money } from '../../lib/format'
import { useShop } from '../../lib/store'
import type { Box } from '../../lib/types'
import { Cookie } from '../Cookie'
import { Minus, Plus, X } from './Icons'

/** Cookies in a box, in pick order, one entry per cookie. */
export function filledSlots(box: Box): string[] {
  const out: string[] = []
  for (const [id, n] of Object.entries(box.items)) for (let i = 0; i < n; i++) out.push(id)
  return out
}

function useCta() {
  const { totalCookies, capacity, boxes, isBoxFull, orderTotal } = useShop()
  if (totalCookies === 0) return { title: 'Pick a cookie to start', sub: null, disabled: true }
  if (boxes.every(isBoxFull)) return { title: `Check out, ${money(orderTotal)}`, sub: null, disabled: false }
  const more = capacity - totalCookies
  return {
    title: `Check out with ${totalCookies}`,
    sub: `${more} more ${more === 1 ? 'fits' : 'fit'} at no extra cost`,
    disabled: false,
  }
}

export function SizePicker({ compact = false }: { compact?: boolean }) {
  const { activeBox, setSize } = useShop()
  return (
    <div role="group" aria-label="Box size" className={`sizes ${compact ? 'sizes--compact' : ''}`}>
      {BOX_OPTIONS.map((o) => {
        const on = activeBox.size === o.size
        return (
          <button key={o.size} type="button" aria-pressed={on} onClick={() => setSize(o.size)} className={`size ${on ? 'is-on' : ''}`}>
            <span className="size__num">{o.size}</span>
            <span className="size__price">{money(o.price)}</span>
          </button>
        )
      })}
    </div>
  )
}

function BoxTabs({ light = false }: { light?: boolean }) {
  const { boxes, activeBoxId, setActiveBox, addBox, boxCount } = useShop()
  return (
    <div className={`tabs ${light ? 'tabs--light' : ''}`}>
      {boxes.map((b, i) => (
        <button
          key={b.id}
          type="button"
          aria-pressed={b.id === activeBoxId}
          onClick={() => setActiveBox(b.id)}
          className={`tab ${b.id === activeBoxId ? 'is-on' : ''}`}
        >
          Box {i + 1}
          <span className="tab__count">
            {boxCount(b)}/{b.size}
          </span>
        </button>
      ))}
      {boxes.length < 4 ? (
        <button type="button" onClick={addBox} className="tab tab--add">
          + Box
        </button>
      ) : null}
    </div>
  )
}

/** Round slots, because cookies are. `data-slot-index` is the fly-in target. */
export function SlotGrid({ box, variant }: { box: Box; variant: 'panel' | 'strip' | 'sheet' }) {
  const { remove, activeBoxId } = useShop()
  const filled = filledSlots(box)
  const live = box.id === activeBoxId
  return (
    <ul className={`slots slots--${variant} slots--${box.size}`}>
      {Array.from({ length: box.size }).map((_, i) => {
        const id = filled[i]
        const f = id ? FLAVOURS.find((x) => x.id === id) : undefined
        return (
          <li key={i} className={`slot ${f ? 'is-filled' : ''}`} data-slot-index={live ? i : undefined} data-slot-variant={variant}>
            {f ? (
              <>
                <span className="slot__cookie">
                  <Cookie id={f.id} alt={f.name} />
                </span>
                {live ? (
                  <button type="button" className="slot__x" onClick={() => remove(f.id)} aria-label={`Remove one ${f.name}`}>
                    <X />
                  </button>
                ) : null}
              </>
            ) : (
              <span className="slot__n" aria-hidden="true">
                {i + 1}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function CtaButton() {
  const { openCheckout } = useShop()
  const cta = useCta()
  return (
    <button type="button" className="btn btn--pink btn--block btn--tall" disabled={cta.disabled} onClick={() => openCheckout(1)}>
      <span className="btn__stack">
        <span>{cta.title}</span>
        {cta.sub ? <small>{cta.sub}</small> : null}
      </span>
    </button>
  )
}

/** Desktop: the sticky cocoa panel beside the rack. */
export function BoxPanel() {
  const { activeBox, boxes, boxCount, orderTotal, add, remove, clearBox, canAdd, addBox, removeBox } = useShop()
  const index = boxes.findIndex((b) => b.id === activeBox.id)
  const items = FLAVOURS.filter((f) => (activeBox.items[f.id] ?? 0) > 0)
  const others = boxes.filter((b) => b.id !== activeBox.id)
  const count = boxCount(activeBox)

  return (
    <div className="panel">
      <div className="panel__scroll">
        {boxes.length > 1 ? <BoxTabs /> : null}
        <p className="panel__label">Choose your box</p>
        <SizePicker />

        <div className="panel__row">
          <p className="panel__label">Fill it</p>
          <p className="panel__meta">
            {count} of {activeBox.size}
          </p>
        </div>
        <SlotGrid box={activeBox} variant="panel" />

        <div className="panel__list">
          {others.map((b) => (
            <p key={b.id} className="panel__other">
              <span>
                Box {boxes.indexOf(b) + 1}, {boxCount(b)} of {b.size}
              </span>
              <span>{money(BOX_PRICES[b.size])}</span>
            </p>
          ))}
          {items.length === 0 ? (
            <p className="panel__empty">Tap Add on any flavour to drop it in this box.</p>
          ) : (
            <>
              <ul>
                {items.map((f) => (
                  <li key={f.id} className="line">
                    <span className="line__name">{f.name}</span>
                    <span className="stepper stepper--dark">
                      <button type="button" onClick={() => remove(f.id)} aria-label={`Remove one ${f.name}`}>
                        <Minus />
                      </button>
                      <span key={activeBox.items[f.id]} className="count-pop">
                        {activeBox.items[f.id]}
                      </span>
                      <button type="button" onClick={() => add(f.id)} disabled={!canAdd()} aria-label={`Add another ${f.name}`}>
                        <Plus />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <button type="button" className="panel__clear" onClick={clearBox}>
                Empty box {index + 1}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="panel__foot">
        <div className="panel__total">
          <span>Total</span>
          <strong key={orderTotal} className="count-pop">
            {money(orderTotal)}
          </strong>
        </div>
        <CtaButton />
        <div className="panel__more">
          {boxes.length < 4 ? (
            <button type="button" onClick={addBox}>
              + Add another box
            </button>
          ) : null}
          {boxes.length > 1 ? (
            <button type="button" onClick={() => removeBox(activeBox.id)}>
              Remove box {index + 1}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** Phone: the compact strip that sticks under the nav while you scroll the rack. */
export function MobileControls() {
  const { activeBox, orderTotal, boxes } = useShop()
  return (
    <div className="mctrl">
      <SizePicker compact />
      {boxes.length > 1 ? <BoxTabs light /> : null}
      <div className="mctrl__row">
        <SlotGrid box={activeBox} variant="strip" />
        <span key={orderTotal} className="mctrl__price count-pop">
          {money(orderTotal)}
        </span>
      </div>
    </div>
  )
}
