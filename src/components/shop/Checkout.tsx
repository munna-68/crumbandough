import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BOX_PRICES, DELIVERY_FEE, FLAVOURS, TIME_SLOTS } from '../../lib/data'
import { dayLabel, money, prefersReducedMotion } from '../../lib/format'
import { gsap } from '../../lib/motion'
import { useShop, type CheckoutStep } from '../../lib/store'
import type { PlacedOrder } from '../../lib/types'
import { useDialog } from '../../lib/useDialog'
import { usePresence } from '../../lib/usePresence'
import { Cookie } from '../Cookie'
import { TLink } from '../Transition'
import { Check, X } from './Icons'

/*
 * Three steps, ported from the Bake House checkout and re-cut for a DM bakery:
 * how you want it, who it's for, then a last look before it goes to the
 * kitchen. No card form: the shop confirms by DM and nothing is charged here.
 */

const STEP_TITLES = ['How do you want it?', 'Who is it for?', 'One last look'] as const

export function Checkout() {
  const { checkoutOpen, checkoutStep, closeCheckout, setCheckoutStep } = useShop()
  const { ref } = useDialog(checkoutOpen, closeCheckout)
  const { mounted, isClosing } = usePresence(checkoutOpen, 280)
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd')
  const prev = useRef<CheckoutStep>(1)

  const go = (s: CheckoutStep) => {
    setDir(s >= prev.current ? 'fwd' : 'back')
    prev.current = s
    setCheckoutStep(s)
    ref.current?.querySelector('.modal__body')?.scrollTo({ top: 0 })
  }

  useEffect(() => {
    if (checkoutOpen) prev.current = checkoutStep
    // Only on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutOpen])

  if (!mounted) return null
  const done = checkoutStep === 4

  return (
    <div className={`overlay overlay--modal ${isClosing ? 'is-closing' : ''}`}>
      <button type="button" className="overlay__scrim" aria-label="Close checkout" onClick={closeCheckout} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="co-title" className="modal" tabIndex={-1}>
        <div className="modal__head">
          <div>
            {!done ? <p className="modal__step">Step {checkoutStep} of 3</p> : null}
            <h2 id="co-title" className="modal__title">
              {done ? 'Sent to the kitchen' : STEP_TITLES[checkoutStep - 1]}
            </h2>
          </div>
          <button type="button" onClick={closeCheckout} aria-label="Close" className="icon-btn">
            <X />
          </button>
        </div>
        {!done ? (
          <div className="modal__bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${checkoutStep / 3})` }} />
          </div>
        ) : null}
        <div className="modal__body">
          <div key={checkoutStep} className={dir === 'fwd' ? 'step-fwd' : 'step-back'}>
            {checkoutStep === 1 ? <StepWhen onNext={() => go(2)} /> : null}
            {checkoutStep === 2 ? <StepWho onNext={() => go(3)} onBack={() => go(1)} /> : null}
            {checkoutStep === 3 ? <StepSend onBack={() => go(2)} onDone={() => go(4)} /> : null}
            {checkoutStep === 4 ? <Confirmation /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="group">
      <legend>{label}</legend>
      {children}
    </fieldset>
  )
}

function Field({
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  textarea,
  autoComplete,
  id,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  hint?: string
  placeholder?: string
  textarea?: boolean
  autoComplete?: string
  id: string
}) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea id={id} rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        />
      )}
      {error ? (
        <p id={`${id}-err`} className="field__err" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function StepWhen({ onNext }: { onNext: () => void }) {
  const { days, fulfilment, setMode, patchFulfilment } = useShop()
  const [error, setError] = useState<string | null>(null)
  const delivery = fulfilment.mode === 'delivery'

  const submit = () => {
    if (!fulfilment.window) return setError(delivery ? 'Choose a delivery window to carry on.' : 'Choose a pick up window to carry on.')
    if (delivery && fulfilment.area.trim().length < 3) return setError('Tell us which suburb to deliver to.')
    setError(null)
    onNext()
  }

  return (
    <div>
      <div className="modes" role="group" aria-label="Pick up or delivery">
        <button type="button" aria-pressed={!delivery} className={`mode ${!delivery ? 'is-on' : ''}`} onClick={() => setMode('pickup')}>
          <strong>Pick up</strong>
          <span>Free, in Melbourne</span>
        </button>
        <button type="button" aria-pressed={delivery} className={`mode ${delivery ? 'is-on' : ''}`} onClick={() => setMode('delivery')}>
          <strong>Delivery</strong>
          <span>{money(DELIVERY_FEE)} across Melbourne</span>
        </button>
      </div>

      <div className={`collapse ${delivery ? 'is-open' : ''}`}>
        <div>
          <Field
            id="co-area"
            label="Suburb"
            value={fulfilment.area}
            onChange={(v) => patchFulfilment({ area: v })}
            placeholder="Brunswick"
            autoComplete="address-level2"
            hint="Just the suburb for now. We confirm the address by DM."
          />
        </div>
      </div>

      <Group label="Which day">
        <div className="days">
          {days.map((d) => (
            <button
              key={d.iso}
              type="button"
              aria-pressed={fulfilment.day === d.iso}
              className={`day ${fulfilment.day === d.iso ? 'is-on' : ''}`}
              onClick={() => patchFulfilment({ day: d.iso, window: null })}
            >
              <strong>{d.day}</strong>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </Group>

      <Group label={delivery ? 'Delivery window' : 'Pick up window'}>
        <div className="slots-time">
          {TIME_SLOTS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={fulfilment.window === s}
              className={`chip ${fulfilment.window === s ? 'is-on' : ''}`}
              onClick={() => {
                patchFulfilment({ window: s })
                setError(null)
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>

      {error ? (
        <p className="form-err" role="alert">
          {error}
        </p>
      ) : null}
      <div className="modal__actions">
        <button type="button" className="btn btn--cocoa btn--block btn--tall" onClick={submit}>
          Continue to your details
        </button>
      </div>
    </div>
  )
}

function StepWho({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { customer, patchCustomer } = useShop()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = () => {
    const next: Record<string, string> = {}
    if (customer.name.trim().length < 2) next.name = 'Add a first name so we know whose box it is.'
    if (customer.contact.trim().length < 3) next.contact = 'Add your Instagram handle or a mobile number.'
    setErrors(next)
    if (Object.keys(next).length === 0) onNext()
  }

  return (
    <div>
      <Field id="co-name" label="First name" value={customer.name} onChange={(v) => patchCustomer({ name: v })} error={errors.name} autoComplete="given-name" placeholder="Mabel" />
      <Field
        id="co-contact"
        label="Instagram or mobile"
        value={customer.contact}
        onChange={(v) => patchCustomer({ contact: v })}
        error={errors.contact}
        hint="We message you here to confirm the order."
        placeholder="@yourhandle"
      />
      <Field
        id="co-note"
        label="A note for the kitchen (optional)"
        value={customer.note}
        onChange={(v) => patchCustomer({ note: v })}
        textarea
        placeholder="It's a birthday box, or one is a gift…"
      />
      <div className="modal__actions">
        <button type="button" className="btn btn--cocoa btn--block btn--tall" onClick={submit}>
          Continue to a last look
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onBack}>
          Back to timing
        </button>
      </div>
    </div>
  )
}

function Summary({ order }: { order?: PlacedOrder }) {
  const { boxes, fulfilment, orderTotal } = useShop()
  const rows = order
    ? order.boxes.map((b) => ({ size: b.size, items: b.items.map((i) => ({ id: i.flavourId, name: i.name, qty: i.qty })) }))
    : boxes
        .filter((b) => Object.keys(b.items).length > 0)
        .map((b) => ({
          size: b.size,
          items: FLAVOURS.filter((f) => b.items[f.id]).map((f) => ({ id: f.id, name: f.name, qty: b.items[f.id] })),
        }))
  const mode = order?.mode ?? fulfilment.mode
  const day = order?.date ?? fulfilment.day
  const slot = order?.slot ?? fulfilment.window
  const area = order?.area ?? fulfilment.area
  const total = order?.total ?? orderTotal

  return (
    <div className="summary">
      {rows.map((b, i) => (
        <div key={i} className="summary__box">
          <p className="summary__row summary__row--head">
            <span>
              Box {i + 1}, {b.size} cookies
            </span>
            <span>{money(BOX_PRICES[b.size])}</span>
          </p>
          <ul>
            {b.items.map((it) => (
              <li key={it.id} className="summary__item">
                <span className="summary__thumb">
                  <Cookie id={it.id} alt="" />
                </span>
                <span>{it.name}</span>
                <span className="summary__qty">× {it.qty}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="summary__when">
        {mode === 'pickup' ? 'Pick up' : `Delivery to ${area || 'your suburb'}`} {dayLabel(day)}, {slot ?? 'time to choose'}
      </p>
      {mode === 'delivery' ? (
        <p className="summary__row">
          <span>Delivery</span>
          <span>{money(DELIVERY_FEE)}</span>
        </p>
      ) : null}
      <p className="summary__row summary__row--total">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </p>
    </div>
  )
}

function StepSend({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const { placeOrder, customer } = useShop()
  const [sending, setSending] = useState(false)
  return (
    <div>
      <Summary />
      <p className="note-box">
        Payment happens over DM once {customer.name.trim() || 'you'} and the kitchen have confirmed the day. Nothing is
        charged on this site.
      </p>
      <div className="modal__actions">
        <button
          type="button"
          className="btn btn--pink btn--block btn--tall"
          disabled={sending}
          onClick={() => {
            setSending(true)
            window.setTimeout(
              () => {
                placeOrder()
                onDone()
              },
              prefersReducedMotion() ? 0 : 650,
            )
          }}
        >
          {sending ? 'Sending…' : 'Send to the kitchen'}
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onBack}>
          Back to your details
        </button>
      </div>
    </div>
  )
}

function Confirmation() {
  const { lastOrder, closeCheckout } = useShop()
  const stamp = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stamp.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from('.stamp__ring', { scale: 0, rotation: -180, duration: 0.9, ease: 'back.out(1.6)' })
        .from('.stamp__check', { scale: 0, duration: 0.5, ease: 'back.out(3)' }, 0.35)
        .from('.stamp__crumb', { scale: 0, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.03 }, 0.3)
    }, el)
    return () => ctx.revert()
  }, [])

  if (!lastOrder) return null
  return (
    <div>
      <div className="stamp" ref={stamp} aria-hidden="true">
        <span className="stamp__ring">
          <Cookie id={lastOrder.boxes[0]?.items[0]?.flavourId ?? 'classic-chocolate'} alt="" />
        </span>
        <span className="stamp__check">
          <Check />
        </span>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="stamp__crumb" style={{ ['--a' as string]: `${i * 45}deg` }} />
        ))}
      </div>
      <p className="confirm__ref">{lastOrder.ref}</p>
      <p className="confirm__lede">
        Thanks {lastOrder.name}. The kitchen has your order and will message you to confirm{' '}
        {lastOrder.mode === 'pickup' ? 'where to pick it up' : 'the delivery'} {dayLabel(lastOrder.date)}.
      </p>
      <Summary order={lastOrder} />
      <div className="modal__actions">
        <TLink to="/kitchen" className="btn btn--cocoa btn--block btn--tall" onClick={closeCheckout}>
          See it on the kitchen board
        </TLink>
        <button type="button" className="btn btn--ghost btn--block" onClick={closeCheckout}>
          Build another box
        </button>
      </div>
    </div>
  )
}
