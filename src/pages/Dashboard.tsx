import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { gsap } from 'gsap'
import { BOX_OPTIONS, FLAVOURS } from '../lib/data'
import {
  isoDate,
  longDate,
  money,
  prefersReducedMotion,
  relativeTime,
  shortDate,
} from '../lib/format'
import { useShop } from '../lib/store'
import type { BakeRow, PlacedOrder } from '../lib/types'
import {
  ArrowUpRight,
  BagIcon,
  ClockIcon,
  CookieMark,
  PinIcon,
  Spark,
} from '../components/Icons'
import { WipeLink } from '../components/PageTransition'

const STAGE_LABEL = {
  new: 'new',
  baking: 'baking',
  ready: 'ready',
} as const

export function Dashboard() {
  const { orders, freshOrderId, clearFresh } = useShop()
  const [highlightId] = useState(freshOrderId)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (freshOrderId) clearFresh()
  }, [freshOrderId, clearFresh])

  const today = isoDate(new Date())
  const sorted = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [orders],
  )

  const openOrders = useMemo(
    () => sorted.filter((order) => order.stage !== 'ready'),
    [sorted],
  )

  const bakeRows = useMemo<BakeRow[]>(() => {
    const totals = new Map<string, number>()
    for (const order of openOrders) {
      for (const item of order.items) {
        totals.set(item.flavourId, (totals.get(item.flavourId) ?? 0) + item.qty)
      }
    }
    return FLAVOURS.map((flavour) => ({
      flavourId: flavour.id,
      name: flavour.name,
      qty: totals.get(flavour.id) ?? 0,
      accent: flavour.accent,
    }))
      .filter((row) => row.qty > 0)
      .sort((a, b) => b.qty - a.qty)
  }, [openOrders])

  const cookiesToBake = bakeRows.reduce((sum, row) => sum + row.qty, 0)
  const queueCount = orders.filter((order) => order.stage === 'new').length
  const deliveries = openOrders.filter((order) => order.mode === 'delivery').length
  const freshOrder = sorted.find((order) => order.id === highlightId) ?? null
  const nextOut = openOrders[0] ?? null

  const greeting =
    new Date().getHours() < 12
      ? 'good morning'
      : new Date().getHours() < 17
        ? 'good afternoon'
        : 'good evening'

  useLayoutEffect(() => {
    if (!highlightId || prefersReducedMotion()) return
    const root = rootRef.current
    if (!root) return
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-fresh="true"]',
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, delay: 0.08, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.dash-fresh',
        { y: -8, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' },
      )
      gsap.fromTo(
        '.stat-card',
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
      )
    }, root)
    return () => context.revert()
  }, [highlightId])

  return (
    <div className="dashboard" ref={rootRef}>
      <header className="dash-header">
        <div className="page-shell dash-header__inner">
          <WipeLink to="/" className="dash-brand" ariaLabel="Back to Crumb and Dough">
            <CookieMark className="dash-brand__mark" />
            <span className="dash-brand__name">crumb and dough</span>
            <span className="dash-brand__divider">/</span>
            <span className="dash-brand__page">kitchen</span>
          </WipeLink>

          <div className="dash-header__actions">
            <span className="demo-tag">
              <span className="demo-tag__dot" />
              demo data
            </span>
            <WipeLink to="/" className="btn btn-cream btn-sm">
              view shop
              <ArrowUpRight className="btn__icon" />
            </WipeLink>
          </div>
        </div>
      </header>

      <main className="page-shell dash-main">
        <div className="dash-hero">
          <div>
            <p className="eyebrow eyebrow--pink">the kitchen board · {longDate()}</p>
            <h1 className="dash-title">
              {greeting},
              <br />
              <span>kitchen.</span>
            </h1>
            <p className="dash-sub">
              New orders land at the top. The bake list counts itself.
            </p>
          </div>
          <div className="dash-hero__meta">
            <span className="dash-hero__meta-label">on the board</span>
            <strong>{orders.length} orders</strong>
            <span>{openOrders.length} still open</span>
          </div>
        </div>

        <div className="dash-stats">
          <div className="stat-card stat-card--pink">
            <span className="stat-card__value">{queueCount}</span>
            <span className="stat-card__label">new in the queue</span>
            <span className="stat-card__hint">needs a first look</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{cookiesToBake}</span>
            <span className="stat-card__label">cookies to bake</span>
            <span className="stat-card__hint">across open orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{deliveries}</span>
            <span className="stat-card__label">deliveries open</span>
            <span className="stat-card__hint">
              {openOrders.length - deliveries} pickups
            </span>
          </div>
        </div>

        {freshOrder && (
          <div className="dash-fresh">
            <Spark className="dash-fresh__spark" />
            <div className="dash-fresh__copy">
              <strong>new order just landed.</strong>
              <span>
                {freshOrder.ref} from {freshOrder.name} · {freshOrder.boxSize} cookies.
                It is at the top of the queue and already in the bake list.
              </span>
            </div>
            <span className="dash-fresh__tag">just in</span>
          </div>
        )}

        <div className="dash-grid">
          <section className="queue" aria-labelledby="queue-title">
            <div className="queue__head">
              <div>
                <p className="eyebrow">incoming</p>
                <h2 id="queue-title">the queue</h2>
              </div>
              <span className="queue__count">{orders.length} orders</span>
            </div>

            <div className="queue__list">
              {sorted.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  today={today}
                  fresh={order.id === highlightId}
                />
              ))}
            </div>
          </section>

          <aside className="bake-panel" aria-labelledby="bake-title">
            <div className="bake-panel__head">
              <div>
                <p className="eyebrow">for the oven</p>
                <h2 id="bake-title">bake list</h2>
              </div>
              <span className="bake-panel__live">
                <span />
                live
              </span>
            </div>
            <p className="bake-panel__note">
              New + in-progress orders, counted by flavour. Ready orders drop off the list.
            </p>

            <div className="bake-list">
              {bakeRows.map((row) => (
                <div className="bake-row" key={row.flavourId}>
                  <span
                    className="bake-row__dot"
                    style={{ background: row.accent }}
                    aria-hidden="true"
                  />
                  <div className="bake-row__copy">
                    <span>{row.name}</span>
                    <span className="bake-row__bar" aria-hidden="true">
                      <span
                        style={{
                          width: `${Math.max(
                            10,
                            (row.qty / Math.max(...bakeRows.map((item) => item.qty))) * 100,
                          )}%`,
                          background: row.accent,
                        }}
                      />
                    </span>
                  </div>
                  <span key={row.qty} className="bake-row__qty count-pop">
                    {row.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="bake-total">
              <span>total to bake</span>
              <strong>{cookiesToBake}</strong>
            </div>

            <div className="bake-panel__next">
              <ClockIcon className="bake-panel__next-icon" />
              <span>
                next out
                <strong>
                  {nextOut
                    ? `${nextOut.slot} · ${nextOut.ref}`
                    : 'nothing open in the queue'}
                </strong>
              </span>
            </div>
          </aside>
        </div>
      </main>

      <footer className="dash-footer page-shell">
        <span>fictional orders · held in browser memory only · new orders appear live</span>
        <span>all prices are placeholders · concept for @crumbandough</span>
      </footer>
    </div>
  )
}

function OrderCard({
  order,
  today,
  fresh,
}: {
  order: PlacedOrder
  today: string
  fresh: boolean
}) {
  const option = BOX_OPTIONS.find((box) => box.size === order.boxSize)

  return (
    <article
      className={`order-card ${fresh ? 'order-card--fresh' : ''}`}
      data-order-id={order.id}
      data-fresh={fresh ? 'true' : undefined}
    >
      <div className="order-card__top">
        <span className="order-card__ref">{order.ref}</span>
        <span className="order-card__time">{relativeTime(order.createdAt)}</span>
        <span className={`stage-badge stage-badge--${order.stage}`}>
          {fresh ? 'just in' : STAGE_LABEL[order.stage]}
        </span>
      </div>

      <div className="order-card__head">
        <h3>
          {order.name}
          <span>{option?.name ?? `${order.boxSize} cookie box`}</span>
        </h3>
        <span className="order-card__total">
          {money(order.total)}
          <em>placeholder</em>
        </span>
      </div>

      <div className="order-card__meta">
        <span>
          {order.mode === 'pickup' ? (
            <BagIcon className="order-card__icon" />
          ) : (
            <PinIcon className="order-card__icon" />
          )}
          {order.mode === 'pickup' ? 'pickup' : `delivery · ${order.area}`}
        </span>
        <span>
          <ClockIcon className="order-card__icon" />
          {order.date === today ? 'today' : shortDate(order.date)} · {order.slot}
        </span>
        <span className="order-card__box">{order.boxSize} cookies</span>
      </div>

      <div className="order-card__items">
        {order.items.map((item) => (
          <span key={item.flavourId}>
            <strong>{item.qty}×</strong> {item.name}
          </span>
        ))}
      </div>

      {order.note && (
        <p className="order-card__note">
          <span>kitchen note</span>
          {order.note}
        </p>
      )}
    </article>
  )
}
