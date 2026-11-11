import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { BOX_PRICES, DELIVERY_FEE, FLAVOURS, seedOrders } from './data'
import { dayOptions, isoDate, makeRef } from './format'
import { BOX_SIZES, type Box, type BoxSize, type Customer, type Fulfilment, type PlacedOrder, type Toast } from './types'

/*
 * The box builder store, ported from Bake House.
 * Multi-box orders, an active box, tap-to-fill slots, toasts, a mobile review
 * sheet and a three-step checkout. Stock counts were dropped (the kitchen bakes
 * to order), and placed orders land on the kitchen board in the same session.
 */

const STORAGE_KEY = 'crumbandough.box.v2'
const MAX_BOXES = 4
const TOAST_MS = 3000

export type CheckoutStep = 1 | 2 | 3 | 4

interface Persisted {
  boxes: Box[]
  activeBoxId: string
  boxSeq: number
  fulfilment: Fulfilment
  customer: Customer
}

interface ShopValue {
  boxes: Box[]
  activeBox: Box
  activeBoxId: string
  boxCount: (b: Box) => number
  totalCookies: number
  capacity: number
  orderTotal: number
  qtyInOrder: (flavourId: string) => number
  qtyInActive: (flavourId: string) => number
  isBoxFull: (b: Box) => boolean
  canAdd: () => boolean
  fulfilment: Fulfilment
  customer: Customer
  days: ReturnType<typeof dayOptions>
  toasts: Toast[]
  checkoutOpen: boolean
  checkoutStep: CheckoutStep
  reviewOpen: boolean
  orders: PlacedOrder[]
  lastOrder: PlacedOrder | null
  freshOrderId: string | null
  add: (flavourId: string) => void
  remove: (flavourId: string) => void
  clearBox: () => void
  setSize: (size: BoxSize) => void
  addBox: () => void
  setActiveBox: (id: string) => void
  removeBox: (id: string) => void
  setMode: (mode: Fulfilment['mode']) => void
  patchFulfilment: (patch: Partial<Fulfilment>) => void
  patchCustomer: (patch: Partial<Customer>) => void
  placeOrder: () => PlacedOrder
  openCheckout: (step?: CheckoutStep) => void
  setCheckoutStep: (step: CheckoutStep) => void
  closeCheckout: () => void
  openReview: () => void
  closeReview: () => void
  toast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
  advanceOrder: (id: string) => void
  clearFresh: () => void
}

const ShopCtx = createContext<ShopValue | null>(null)

export function useShop(): ShopValue {
  const ctx = useContext(ShopCtx)
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
  return ctx
}

function makeBox(seq: number, size: BoxSize = 6): Box {
  return { id: `box-${seq}`, size, items: {} }
}

function sumItems(box: Box): number {
  return Object.values(box.items).reduce((a, c) => a + c, 0)
}

function initialState(): Persisted {
  return {
    boxes: [makeBox(1)],
    activeBoxId: 'box-1',
    boxSeq: 1,
    fulfilment: { mode: 'pickup', day: isoDate(new Date()), window: null, area: '' },
    customer: { name: '', contact: '', note: '' },
  }
}

const KNOWN = new Set(FLAVOURS.map((f) => f.id))

function load(): Persisted {
  const base = initialState()
  if (typeof window === 'undefined') return base
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw) as Partial<Persisted>
    const boxes = Array.isArray(parsed.boxes)
      ? parsed.boxes
          .filter((b): b is Box => typeof b?.id === 'string')
          .map((b) => {
            const size = (BOX_SIZES as readonly number[]).includes(b.size) ? b.size : 6
            const items: Record<string, number> = {}
            let room: number = size
            for (const [k, v] of Object.entries(b.items ?? {})) {
              if (!KNOWN.has(k) || typeof v !== 'number' || v <= 0) continue
              const keep = Math.min(Math.floor(v), room)
              if (keep > 0) items[k] = keep
              room -= keep
            }
            return { id: b.id, size, items }
          })
      : []
    if (boxes.length === 0) return base
    // Day choices only go forward; a stale saved day resets to today.
    const fulfilment = { ...base.fulfilment, ...(parsed.fulfilment ?? {}) }
    if (fulfilment.day < base.fulfilment.day) fulfilment.day = base.fulfilment.day
    return {
      boxes,
      activeBoxId: boxes.some((b) => b.id === parsed.activeBoxId) ? (parsed.activeBoxId as string) : boxes[0].id,
      boxSeq: Math.max(parsed.boxSeq ?? 1, boxes.length),
      fulfilment,
      customer: { ...base.customer, ...(parsed.customer ?? {}) },
    }
  } catch {
    return base
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutStep, setStep] = useState<CheckoutStep>(1)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [orders, setOrders] = useState<PlacedOrder[]>(seedOrders)
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null)
  const [freshOrderId, setFreshOrderId] = useState<string | null>(null)
  const days = useMemo(() => dayOptions(5), [])

  const stateRef = useRef(state)
  stateRef.current = state
  const toastSeq = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage blocked — the builder still works for this visit */
    }
  }, [state])

  /**
   * Commit and update the ref synchronously, so two taps in one tick can never
   * overfill a box (the Bake House fix for the "ten cookies in a six" bug).
   */
  const commit = useCallback((updater: (s: Persisted) => Persisted) => {
    const next = updater(stateRef.current)
    stateRef.current = next
    setState(next)
    return next
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message: string, tone: Toast['tone'] = 'default') => {
    const id = ++toastSeq.current
    setToasts((prev) => [...prev.slice(-1), { id, message, tone }])
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), TOAST_MS)
  }, [])

  const boxCount = useCallback((b: Box) => sumItems(b), [])

  const activeBox = useMemo(
    () => state.boxes.find((b) => b.id === state.activeBoxId) ?? state.boxes[0],
    [state.boxes, state.activeBoxId],
  )

  const qtyByFlavour = useMemo(() => {
    const m: Record<string, number> = {}
    for (const b of state.boxes) for (const [k, v] of Object.entries(b.items)) m[k] = (m[k] ?? 0) + v
    return m
  }, [state.boxes])

  const totalCookies = useMemo(() => state.boxes.reduce((a, b) => a + sumItems(b), 0), [state.boxes])
  const capacity = useMemo(() => state.boxes.reduce((a, b) => a + b.size, 0), [state.boxes])
  const orderTotal = useMemo(
    () =>
      state.boxes.reduce((a, b) => a + BOX_PRICES[b.size], 0) +
      (state.fulfilment.mode === 'delivery' ? DELIVERY_FEE : 0),
    [state.boxes, state.fulfilment.mode],
  )

  const qtyInOrder = useCallback((id: string) => qtyByFlavour[id] ?? 0, [qtyByFlavour])
  const qtyInActive = useCallback((id: string) => activeBox.items[id] ?? 0, [activeBox])
  const isBoxFull = useCallback((b: Box) => sumItems(b) >= b.size, [])
  const canAdd = useCallback(() => {
    const cur = stateRef.current
    const b = cur.boxes.find((x) => x.id === cur.activeBoxId)
    return Boolean(b && sumItems(b) < b.size)
  }, [])

  const add = useCallback(
    (flavourId: string) => {
      const cur = stateRef.current
      const f = FLAVOURS.find((x) => x.id === flavourId)
      const b = cur.boxes.find((x) => x.id === cur.activeBoxId)
      if (!f || !b || sumItems(b) >= b.size) return
      const next = sumItems(b) + 1
      const index = cur.boxes.findIndex((x) => x.id === b.id) + 1
      commit((s) => ({
        ...s,
        boxes: s.boxes.map((x) =>
          x.id === b.id ? { ...x, items: { ...x.items, [flavourId]: (x.items[flavourId] ?? 0) + 1 } } : x,
        ),
      }))
      const where = cur.boxes.length > 1 ? ` in box ${index}` : ''
      toast(`${f.name} in. ${next} of ${b.size}${where}.`)
      if (next >= b.size) window.setTimeout(() => toast('Box full. Ready when you are.', 'full'), 240)
    },
    [commit, toast],
  )

  const remove = useCallback(
    (flavourId: string) => {
      commit((s) => ({
        ...s,
        boxes: s.boxes.map((b) => {
          if (b.id !== s.activeBoxId) return b
          const n = b.items[flavourId] ?? 0
          if (n <= 0) return b
          const items = { ...b.items }
          if (n - 1 <= 0) delete items[flavourId]
          else items[flavourId] = n - 1
          return { ...b, items }
        }),
      }))
    },
    [commit],
  )

  const clearBox = useCallback(() => {
    commit((s) => ({ ...s, boxes: s.boxes.map((b) => (b.id === s.activeBoxId ? { ...b, items: {} } : b)) }))
  }, [commit])

  /** Changing size keeps as many cookies as fit, in the order they were picked. */
  const setSize = useCallback(
    (size: BoxSize) => {
      commit((s) => ({
        ...s,
        boxes: s.boxes.map((b) => {
          if (b.id !== s.activeBoxId || b.size === size) return b
          let room: number = size
          const items: Record<string, number> = {}
          for (const [k, v] of Object.entries(b.items)) {
            const keep = Math.min(v, room)
            if (keep > 0) items[k] = keep
            room -= keep
          }
          return { ...b, size, items }
        }),
      }))
    },
    [commit],
  )

  const addBox = useCallback(() => {
    const cur = stateRef.current
    if (cur.boxes.length >= MAX_BOXES) return
    const seq = cur.boxSeq + 1
    const b = makeBox(seq)
    commit((s) => ({ ...s, boxes: [...s.boxes, b], activeBoxId: b.id, boxSeq: seq }))
    toast(`Box ${cur.boxes.length + 1} started.`)
  }, [commit, toast])

  const setActiveBox = useCallback(
    (id: string) => commit((s) => (s.boxes.some((b) => b.id === id) ? { ...s, activeBoxId: id } : s)),
    [commit],
  )

  const removeBox = useCallback(
    (id: string) => {
      commit((s) => {
        if (s.boxes.length <= 1) return s
        const boxes = s.boxes.filter((b) => b.id !== id)
        return { ...s, boxes, activeBoxId: s.activeBoxId === id ? boxes[0].id : s.activeBoxId }
      })
    },
    [commit],
  )

  const setMode = useCallback(
    (mode: Fulfilment['mode']) => commit((s) => ({ ...s, fulfilment: { ...s.fulfilment, mode, window: null } })),
    [commit],
  )
  const patchFulfilment = useCallback(
    (patch: Partial<Fulfilment>) => commit((s) => ({ ...s, fulfilment: { ...s.fulfilment, ...patch } })),
    [commit],
  )
  const patchCustomer = useCallback(
    (patch: Partial<Customer>) => commit((s) => ({ ...s, customer: { ...s.customer, ...patch } })),
    [commit],
  )

  const ordersRef = useRef(orders)
  ordersRef.current = orders

  const placeOrder = useCallback((): PlacedOrder => {
    const cur = stateRef.current
    const ref = makeRef(new Set(ordersRef.current.map((o) => o.ref)))
    const total =
      cur.boxes.reduce((a, b) => a + BOX_PRICES[b.size], 0) + (cur.fulfilment.mode === 'delivery' ? DELIVERY_FEE : 0)
    const order: PlacedOrder = {
      id: `order-${Date.now().toString(36)}`,
      ref,
      name: cur.customer.name.trim() || 'Guest',
      createdAt: new Date().toISOString(),
      boxes: cur.boxes
        .filter((b) => sumItems(b) > 0)
        .map((b) => ({
          size: b.size,
          items: FLAVOURS.filter((f) => (b.items[f.id] ?? 0) > 0).map((f) => ({
            flavourId: f.id,
            name: f.name,
            qty: b.items[f.id],
          })),
        })),
      mode: cur.fulfilment.mode,
      area: cur.fulfilment.mode === 'delivery' ? cur.fulfilment.area.trim() : '',
      date: cur.fulfilment.day,
      slot: cur.fulfilment.window ?? '',
      note: cur.customer.note.trim(),
      total,
      stage: 'new',
    }
    setOrders((prev) => [order, ...prev])
    setLastOrder(order)
    setFreshOrderId(order.id)
    const seq = cur.boxSeq + 1
    commit((s) => ({
      ...s,
      boxes: [makeBox(seq)],
      activeBoxId: `box-${seq}`,
      boxSeq: seq,
      fulfilment: { ...s.fulfilment, window: null },
    }))
    return order
  }, [commit])

  const openCheckout = useCallback((step: CheckoutStep = 1) => {
    setStep(step)
    setReviewOpen(false)
    setCheckoutOpen(true)
  }, [])
  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false)
    window.setTimeout(() => setStep(1), 300)
  }, [])

  const advanceOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, stage: o.stage === 'new' ? 'baking' : o.stage === 'baking' ? 'ready' : 'new' } : o,
      ),
    )
  }, [])

  const value: ShopValue = {
    boxes: state.boxes,
    activeBox,
    activeBoxId: state.activeBoxId,
    boxCount,
    totalCookies,
    capacity,
    orderTotal,
    qtyInOrder,
    qtyInActive,
    isBoxFull,
    canAdd,
    fulfilment: state.fulfilment,
    customer: state.customer,
    days,
    toasts,
    checkoutOpen,
    checkoutStep,
    reviewOpen,
    orders,
    lastOrder,
    freshOrderId,
    add,
    remove,
    clearBox,
    setSize,
    addBox,
    setActiveBox,
    removeBox,
    setMode,
    patchFulfilment,
    patchCustomer,
    placeOrder,
    openCheckout,
    setCheckoutStep: setStep,
    closeCheckout,
    openReview: useCallback(() => setReviewOpen(true), []),
    closeReview: useCallback(() => setReviewOpen(false), []),
    toast,
    dismissToast,
    advanceOrder,
    clearFresh: useCallback(() => setFreshOrderId(null), []),
  }

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>
}
