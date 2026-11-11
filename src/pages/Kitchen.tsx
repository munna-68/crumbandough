import { useEffect, useMemo, useRef, useState } from 'react'
import { FLAVOURS } from '../lib/data'
import { dayLabel, longDate, money, orderCookies, relativeTime } from '../lib/format'
import { MOTION, SplitText, gsap, onPageReady, useGSAP } from '../lib/motion'
import { useShop } from '../lib/store'
import type { OrderStage, PlacedOrder } from '../lib/types'
import { Cookie } from '../components/Cookie'
import { TLink } from '../components/Transition'

const STAGES: Array<{ id: OrderStage; label: string; next: string }> = [
  { id: 'new', label: 'New', next: 'Start baking' },
  { id: 'baking', label: 'Baking', next: 'Mark ready' },
  { id: 'ready', label: 'Ready', next: 'Back to new' },
]

/** The back of house: every box ordered on the site, and how many of each flavour to bake. */
export function Kitchen() {
  const { orders, freshOrderId, clearFresh, advanceOrder } = useShop()
  const [fresh] = useState(freshOrderId)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (freshOrderId) clearFresh()
  }, [freshOrderId, clearFresh])

  const sorted = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders],
  )
  const open = sorted.filter((o) => o.stage !== 'ready')
  const bake = useMemo(() => {
    const t = new Map<string, number>()
    for (const o of open) for (const b of o.boxes) for (const i of b.items) t.set(i.flavourId, (t.get(i.flavourId) ?? 0) + i.qty)
    return FLAVOURS.map((f) => ({ f, qty: t.get(f.id) ?? 0 }))
      .filter((r) => r.qty > 0)
      .sort((a, b) => b.qty - a.qty)
  }, [open])
  const toBake = bake.reduce((a, r) => a + r.qty, 0)
  const max = Math.max(1, ...bake.map((r) => r.qty))
  const takings = orders.reduce((a, o) => a + o.total, 0)

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        const split = SplitText.create(q('.khead__title .line'), { type: 'chars', mask: 'chars' })
        gsap.set(split.chars, { yPercent: 110 })
        gsap.set(q('.kfade'), { autoAlpha: 0, y: 24 })
        gsap.set(q('.kbar__fill'), { scaleX: 0 })
        const off = onPageReady(contextSafe!(() => {
          gsap
            .timeline({ defaults: { ease: 'expo.out' } })
            .to(split.chars, { yPercent: 0, duration: 1, stagger: 0.03 })
            .to(q('.kfade'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.2)
            .to(q('.kbar__fill'), { scaleX: 1, duration: 1.2, stagger: 0.06 }, 0.5)
            .from(q('.order.is-fresh'), { scale: 0.9, duration: 1, ease: 'elastic.out(1, 0.6)' }, 0.5)
        }))
        return () => {
          off()
          split.revert()
        }
      })
    },
    { scope: root },
  )

  return (
    <main id="main" className="kitchen" ref={root}>
      <header className="khead">
        <div>
          <p className="khead__date kfade">{longDate()}</p>
          <h1 className="khead__title">
            <span className="line">Kitchen</span> <span className="line">board</span>
          </h1>
          <p className="khead__lede kfade">
            Every box ordered on the site lands here. Tap an order to move it along. Demo data, kept in this browser
            tab only.
          </p>
        </div>
        <TLink to="/shop" className="btn btn--cocoa kfade">
          Place a test order
        </TLink>
      </header>

      {fresh ? <FreshBanner order={orders.find((o) => o.id === fresh)} /> : null}

      <dl className="kstats">
        <div className="kstat kfade">
          <dt>Open orders</dt>
          <dd>{open.length}</dd>
        </div>
        <div className="kstat kfade">
          <dt>Cookies to bake</dt>
          <dd>{toBake}</dd>
        </div>
        <div className="kstat kfade">
          <dt>Deliveries</dt>
          <dd>{open.filter((o) => o.mode === 'delivery').length}</dd>
        </div>
        <div className="kstat kfade">
          <dt>On the board</dt>
          <dd>{money(takings)}</dd>
        </div>
      </dl>

      <div className="kgrid">
        <section aria-labelledby="queue-title">
          <h2 id="queue-title" className="ksub kfade">
            The queue
          </h2>
          <ul className="queue">
            {sorted.map((o) => (
              <OrderCard key={o.id} order={o} fresh={o.id === fresh} onAdvance={() => advanceOrder(o.id)} />
            ))}
          </ul>
        </section>
        <section aria-labelledby="bake-title" className="kbake">
          <h2 id="bake-title" className="ksub kfade">
            Bake list
          </h2>
          <ul className="kbars">
            {bake.map(({ f, qty }) => (
              <li key={f.id} className="kbar kfade">
                <span className="kbar__thumb">
                  <Cookie id={f.id} alt="" />
                </span>
                <span className="kbar__name">{f.name}</span>
                <span className="kbar__track">
                  <span className="kbar__fill" style={{ width: `${(qty / max) * 100}%`, background: f.accent }} />
                </span>
                <span className="kbar__qty">{qty}</span>
              </li>
            ))}
            {bake.length === 0 ? <li className="kbar__empty">Nothing to bake. Enjoy the quiet.</li> : null}
          </ul>
        </section>
      </div>
    </main>
  )
}

function FreshBanner({ order }: { order?: PlacedOrder }) {
  if (!order) return null
  return (
    <div className="fresh kfade" role="status">
      <span className="fresh__tag">Just in</span>
      <p>
        {order.ref} from {order.name}: {orderCookies(order)} cookies for {order.mode === 'pickup' ? 'pick up' : `delivery to ${order.area}`}{' '}
        {dayLabel(order.date)}, {order.slot}.
      </p>
    </div>
  )
}

function OrderCard({ order, fresh, onAdvance }: { order: PlacedOrder; fresh: boolean; onAdvance: () => void }) {
  const stage = STAGES.find((s) => s.id === order.stage) ?? STAGES[0]
  return (
    <li className={`order kfade stage-${order.stage} ${fresh ? 'is-fresh' : ''}`}>
      <div className="order__top">
        <p className="order__who">
          <strong>{order.name}</strong>
          <span>{order.ref}</span>
        </p>
        <span className="order__stage">{stage.label}</span>
      </div>
      <div className="order__cookies" aria-label={`${orderCookies(order)} cookies`}>
        {order.boxes.flatMap((b, bi) =>
          b.items.flatMap((i) =>
            Array.from({ length: i.qty }).map((_, k) => (
              <span key={`${bi}-${i.flavourId}-${k}`} className="order__c" title={i.name}>
                <Cookie id={i.flavourId} alt="" />
              </span>
            )),
          ),
        )}
      </div>
      <p className="order__meta">
        {order.mode === 'pickup' ? 'Pick up' : `Delivery, ${order.area}`} {dayLabel(order.date)}, {order.slot}
      </p>
      {order.note ? <p className="order__note">“{order.note}”</p> : null}
      <div className="order__foot">
        <span>
          {money(order.total)}, {relativeTime(order.createdAt)}
        </span>
        <button type="button" className="btn btn--outline btn--sm" onClick={onAdvance}>
          {stage.next}
        </button>
      </div>
    </li>
  )
}
