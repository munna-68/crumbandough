import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Wordmark } from '../components/Chrome'
import { Cookie } from '../components/Cookie'
import { TLink } from '../components/Transition'
import { FLAVOURS, TIME_SLOTS } from '../lib/data'
import { dayLabel, longDate, money, orderCookies, relativeTime } from '../lib/format'
import { Flip, MOTION, gsap, onPageReady, useGSAP } from '../lib/motion'
import { useShop } from '../lib/store'
import type { OrderStage, PlacedOrder } from '../lib/types'

/*
 * The kitchen, as its own little app: no site nav, a sidebar, a live clock,
 * counters that tick, and a three-column board where cards Flip between
 * columns as they move along. "Simulate an order" drops a believable order in
 * so the board can be shown off without placing one by hand.
 */

type View = 'board' | 'bake' | 'run'
type Col = Exclude<OrderStage, 'done'>

const COLUMNS: Array<{ id: Col; label: string; next: string; hint: string }> = [
  { id: 'new', label: 'New', next: 'Start baking', hint: 'Just landed' },
  { id: 'baking', label: 'Baking', next: 'Mark ready', hint: 'In the oven' },
  { id: 'ready', label: 'Ready', next: 'Hand over', hint: 'Boxed and sealed' },
]

const VIEWS: Array<{ id: View; label: string; icon: string }> = [
  { id: 'board', label: 'Board', icon: 'M3 4h5v16H3zM10 4h5v10h-5zM17 4h4v13h-4z' },
  { id: 'bake', label: 'Bake list', icon: 'M4 6h16M4 12h10M4 18h6' },
  { id: 'run', label: 'Run sheet', icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3 2' },
]

function greeting(d: Date) {
  const h = d.getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])
  return now
}

/** A number that rolls to its new value instead of jumping. */
function Count({ value, format = String }: { value: number; format?: (n: number) => string }) {
  const el = useRef<HTMLSpanElement>(null)
  const shown = useRef(0)
  useEffect(() => {
    const node = el.current
    if (!node) return
    const o = { v: shown.current }
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tw = gsap.to(o, {
      v: value,
      duration: still ? 0 : 1.1,
      ease: 'power3.out',
      onUpdate: () => {
        shown.current = o.v
        node.textContent = format(Math.round(o.v))
      },
    })
    return () => {
      tw.kill()
    }
  }, [value, format])
  return <span ref={el}>{format(0)}</span>
}

export function Kitchen() {
  const { orders, freshOrderId, clearFresh, advanceOrder, simulateOrder, toast } = useShop()
  const root = useRef<HTMLDivElement>(null)
  const flip = useRef<Flip.FlipState | null>(null)
  const [view, setView] = useState<View>('board')
  const [justIn, setJustIn] = useState<string | null>(freshOrderId)
  const [leaving, setLeaving] = useState<string | null>(null)
  const now = useClock()

  useEffect(() => {
    if (freshOrderId) clearFresh()
  }, [freshOrderId, clearFresh])

  const sorted = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders],
  )
  const live = sorted.filter((o) => o.stage !== 'done')
  const handed = orders.filter((o) => o.stage === 'done').length
  const bake = useMemo(() => {
    const t = new Map<string, number>()
    for (const o of live)
      if (o.stage !== 'ready')
        for (const b of o.boxes) for (const i of b.items) t.set(i.flavourId, (t.get(i.flavourId) ?? 0) + i.qty)
    return FLAVOURS.map((f) => ({ f, qty: t.get(f.id) ?? 0 })).sort((a, b) => b.qty - a.qty)
  }, [live])
  const toBake = bake.reduce((a, r) => a + r.qty, 0)
  const max = Math.max(1, ...bake.map((r) => r.qty))
  const takings = orders.reduce((a, o) => a + o.total, 0)

  /* ---------- Flip: record before a change, play after React commits ---------- */

  const capture = useCallback(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    flip.current = Flip.getState(root.current.querySelectorAll('.kcard'))
  }, [])

  useLayoutEffect(() => {
    const state = flip.current
    if (!state || !root.current) return
    flip.current = null
    Flip.from(state, {
      targets: root.current.querySelectorAll('.kcard'),
      duration: 0.7,
      ease: 'power3.inOut',
      absolute: true,
      nested: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { autoAlpha: 0, scale: 0.6, y: -40, rotation: -4 },
          { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)' },
        ),
    })
  }, [orders])

  const move = (o: PlacedOrder) => {
    if (o.stage === 'ready') {
      const card = root.current?.querySelector(`[data-flip-id="${o.id}"]`)
      const done = () => {
        capture()
        setLeaving(null)
        advanceOrder(o.id)
        toast(`${o.ref} handed over to ${o.name}`)
      }
      if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return done()
      setLeaving(o.id)
      gsap.to(card, { x: 80, rotation: 8, autoAlpha: 0, duration: 0.45, ease: 'power2.in', onComplete: done })
      return
    }
    capture()
    advanceOrder(o.id)
  }

  const simulate = () => {
    if (view !== 'board') setView('board')
    capture()
    const o = simulateOrder()
    setJustIn(o.id)
    toast(`New order: ${o.ref} from ${o.name}, ${orderCookies(o)} cookies`)
  }

  /* ---------- entrance ---------- */

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        gsap.set(q('.kside'), { xPercent: -100 })
        gsap.set(q('.kin'), { autoAlpha: 0, y: 26 })
        const off = onPageReady(
          contextSafe!(() => {
            gsap
              .timeline({ defaults: { ease: 'expo.out' } })
              .to(q('.kside'), { xPercent: 0, duration: 1 })
              .to(q('.kin'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.15)
              .from(q('.kcard'), { y: 40, autoAlpha: 0, rotation: () => gsap.utils.random(-4, 4), duration: 0.9, stagger: 0.06 }, 0.35)
          }),
        )
        return off
      })
    },
    { scope: root },
  )

  // Switching views: the new panel slides up.
  useEffect(() => {
    const el = root.current?.querySelector('.kview')
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' })
  }, [view])

  const time = now.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div className="kapp" ref={root}>
      <aside className="kside" aria-label="Kitchen">
        <TLink to="/" className="kside__brand" aria-label="crumb and dough, back to the site">
          <Wordmark />
        </TLink>
        <p className="kside__tag">Kitchen</p>
        <nav className="kside__nav">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`kside__link ${view === v.id ? 'is-on' : ''}`}
              aria-current={view === v.id ? 'page' : undefined}
              onClick={() => setView(v.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={v.icon} />
              </svg>
              {v.label}
              {v.id === 'board' ? <span className="kside__badge">{live.length}</span> : null}
            </button>
          ))}
        </nav>
        <div className="kside__live">
          <span className="kside__dot" aria-hidden="true" />
          Taking orders
        </div>
        <button type="button" className="kside__sim" onClick={simulate}>
          <span aria-hidden="true">+</span> Simulate an order
        </button>
        <div className="kside__links">
          <TLink to="/shop">Place a real test order</TLink>
          <TLink to="/">Back to the site</TLink>
        </div>
      </aside>

      <main id="main" className="kmain">
        <header className="ktop kin">
          <div>
            <p className="ktop__date">{longDate(now)}</p>
            <h1 className="ktop__title">{greeting(now)}, kitchen.</h1>
          </div>
          <div className="ktop__right">
            <span className="ktop__clock" aria-label={`The time is ${time}`}>
              {time}
            </span>
            <button type="button" className="ktop__sim" onClick={simulate}>
              + Simulate
            </button>
          </div>
        </header>

        <nav className="ktabs kin" aria-label="Kitchen views">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" className={view === v.id ? 'is-on' : ''} onClick={() => setView(v.id)}>
              {v.label}
            </button>
          ))}
        </nav>

        <dl className="kstats">
          <div className="kstat kin">
            <dt>Open orders</dt>
            <dd>
              <Count value={live.length} />
            </dd>
          </div>
          <div className="kstat kin">
            <dt>Cookies to bake</dt>
            <dd>
              <Count value={toBake} />
            </dd>
          </div>
          <div className="kstat kin">
            <dt>Handed over</dt>
            <dd>
              <Count value={handed} />
            </dd>
          </div>
          <div className="kstat kstat--cocoa kin">
            <dt>Taken today</dt>
            <dd>
              <Count value={takings} format={money} />
            </dd>
          </div>
        </dl>

        {view === 'board' ? (
          <div className="kview kboard kin">
            {COLUMNS.map((c) => {
              const list = live.filter((o) => o.stage === c.id)
              return (
                <section key={c.id} className={`kcol kcol--${c.id}`} aria-labelledby={`kcol-${c.id}`}>
                  <header className="kcol__head">
                    <h2 id={`kcol-${c.id}`}>{c.label}</h2>
                    <span className="kcol__count">
                      {list.length}
                    </span>
                    <p>{c.hint}</p>
                  </header>
                  <ul className="kcol__list">
                    {list.map((o) => (
                      <OrderCard
                        key={o.id}
                        order={o}
                        next={c.next}
                        fresh={o.id === justIn}
                        busy={leaving === o.id}
                        onMove={() => move(o)}
                      />
                    ))}
                    {list.length === 0 ? <li className="kcol__empty">Nothing here.</li> : null}
                  </ul>
                </section>
              )
            })}
          </div>
        ) : null}

        {view === 'bake' ? (
          <section className="kview kpanel" aria-labelledby="bake-title">
            <h2 id="bake-title" className="kpanel__title">
              Bake list <span>{toBake} cookies for new and baking orders</span>
            </h2>
            <ul className="kbars">
              {bake.map(({ f, qty }) => (
                <li key={f.id} className={`kbar ${qty === 0 ? 'is-zero' : ''}`}>
                  <span className="kbar__thumb">
                    <Cookie id={f.id} alt="" />
                  </span>
                  <span className="kbar__name">
                    {f.name}
                    <small>{f.note}</small>
                  </span>
                  <span className="kbar__track">
                    <span className="kbar__fill" style={{ width: `${(qty / max) * 100}%`, background: f.accent }} />
                  </span>
                  <span className="kbar__qty">{qty}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {view === 'run' ? (
          <section className="kview kpanel" aria-labelledby="run-title">
            <h2 id="run-title" className="kpanel__title">
              Run sheet <span>Today, by pick up and drop off window</span>
            </h2>
            <ol className="krun">
              {TIME_SLOTS.map((slot) => {
                const list = live.filter((o) => o.slot === slot)
                return (
                  <li key={slot} className="krun__slot">
                    <span className="krun__time">{slot}</span>
                    <ul>
                      {list.map((o) => (
                        <li key={o.id} className={`krun__item stage-${o.stage}`}>
                          <strong>{o.name}</strong>
                          <span>
                            {o.ref}, {orderCookies(o)} cookies
                          </span>
                          <span className="krun__mode">{o.mode === 'pickup' ? 'Pick up' : `Drop off, ${o.area}`}</span>
                          <span className="krun__stage">{o.stage}</span>
                        </li>
                      ))}
                      {list.length === 0 ? <li className="krun__free">Free</li> : null}
                    </ul>
                  </li>
                )
              })}
            </ol>
          </section>
        ) : null}
      </main>
    </div>
  )
}

function OrderCard({
  order,
  next,
  fresh,
  busy,
  onMove,
}: {
  order: PlacedOrder
  next: string
  fresh: boolean
  busy: boolean
  onMove: () => void
}) {
  const cookies = order.boxes.flatMap((b, bi) =>
    b.items.flatMap((i) => Array.from({ length: i.qty }, (_, k) => ({ key: `${bi}-${i.flavourId}-${k}`, ...i }))),
  )
  return (
    <li className={`kcard stage-${order.stage} ${fresh ? 'is-fresh' : ''}`} data-flip-id={order.id}>
      <div className="kcard__top">
        <p className="kcard__who">
          <strong>{order.name}</strong>
          <span>{order.ref}</span>
        </p>
        {fresh ? <span className="kcard__tag">Just in</span> : <span className="kcard__ago">{relativeTime(order.createdAt)}</span>}
      </div>
      <div className="kcard__cookies" aria-label={`${cookies.length} cookies`}>
        {cookies.map((c) => (
          <span key={c.key} className="kcard__c" title={c.name}>
            <Cookie id={c.flavourId} alt="" />
          </span>
        ))}
      </div>
      <p className="kcard__meta">
        <span className={`kcard__mode kcard__mode--${order.mode}`}>{order.mode === 'pickup' ? 'Pick up' : order.area}</span>
        {dayLabel(order.date)}, {order.slot}
      </p>
      {order.note ? <p className="kcard__note">“{order.note}”</p> : null}
      <div className="kcard__foot">
        <span>{money(order.total)}</span>
        <button type="button" className="kcard__btn" onClick={onMove} disabled={busy}>
          {next}
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
          </svg>
        </button>
      </div>
    </li>
  )
}
