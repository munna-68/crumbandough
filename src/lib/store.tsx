import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { BOX_OPTIONS, DELIVERY_FEE, FLAVOURS, seedOrders } from './data'
import { dayOptions, isoDate, makeRef } from './format'
import type {
  BoxSize,
  OrderDraft,
  PlacedOrder,
  FulfilmentMode,
} from './types'

interface ShopValue {
  draft: OrderDraft
  boxOption: (typeof BOX_OPTIONS)[number]
  cookieCount: number
  remaining: number
  boxPrice: number
  deliveryFee: number
  total: number
  canPlace: boolean
  missing: string[]
  days: ReturnType<typeof dayOptions>
  orders: PlacedOrder[]
  lastOrder: PlacedOrder | null
  freshOrderId: string | null
  setSize: (size: BoxSize) => void
  addFlavour: (id: string) => void
  removeFlavour: (id: string) => void
  clearBox: () => void
  patchDraft: (patch: Partial<OrderDraft>) => void
  setMode: (mode: FulfilmentMode) => void
  placeOrder: () => PlacedOrder
  clearFresh: () => void
}

const ShopCtx = createContext<ShopValue | null>(null)

export function useShop(): ShopValue {
  const ctx = useContext(ShopCtx)
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
  return ctx
}

function makeDraft(): OrderDraft {
  return {
    boxSize: 6,
    counts: {},
    mode: 'pickup',
    name: '',
    area: '',
    date: isoDate(new Date()),
    slot: '',
    note: '',
  }
}

function countCookies(counts: Record<string, number>): number {
  return Object.values(counts).reduce((sum, qty) => sum + qty, 0)
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<OrderDraft>(makeDraft)
  const [orders, setOrders] = useState<PlacedOrder[]>(seedOrders)
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null)
  const [freshOrderId, setFreshOrderId] = useState<string | null>(null)
  const days = useMemo(() => dayOptions(5), [])

  const cookieCount = useMemo(() => countCookies(draft.counts), [draft.counts])
  const remaining = Math.max(0, draft.boxSize - cookieCount)
  const boxOption = BOX_OPTIONS.find((option) => option.size === draft.boxSize) ?? BOX_OPTIONS[1]
  const boxPrice = boxOption.price
  const deliveryFee = draft.mode === 'delivery' ? DELIVERY_FEE : 0
  const total = boxPrice + deliveryFee

  const missing = useMemo(() => {
    const out: string[] = []
    if (remaining > 0) out.push(`${remaining} more cookie${remaining === 1 ? '' : 's'}`)
    if (!draft.name.trim()) out.push('a first name')
    if (!draft.slot) out.push('a collection time')
    if (draft.mode === 'delivery' && !draft.area.trim()) out.push('a delivery area')
    return out
  }, [remaining, draft.name, draft.slot, draft.mode, draft.area])

  const canPlace = missing.length === 0

  const setSize = useCallback((size: BoxSize) => {
    setDraft((current) => {
      if (current.boxSize === size) return current
      let space = size
      const counts: Record<string, number> = {}
      for (const flavour of FLAVOURS) {
        const keep = Math.min(current.counts[flavour.id] ?? 0, space)
        if (keep > 0) {
          counts[flavour.id] = keep
          space -= keep
        }
        if (space === 0) break
      }
      return { ...current, boxSize: size, counts }
    })
  }, [])

  const addFlavour = useCallback((id: string) => {
    setDraft((current) => {
      if (countCookies(current.counts) >= current.boxSize) return current
      if (!FLAVOURS.some((flavour) => flavour.id === id)) return current
      return {
        ...current,
        counts: { ...current.counts, [id]: (current.counts[id] ?? 0) + 1 },
      }
    })
  }, [])

  const removeFlavour = useCallback((id: string) => {
    setDraft((current) => {
      const count = current.counts[id] ?? 0
      if (count <= 0) return current
      const counts = { ...current.counts }
      if (count === 1) delete counts[id]
      else counts[id] = count - 1
      return { ...current, counts }
    })
  }, [])

  const clearBox = useCallback(() => {
    setDraft((current) => ({ ...current, counts: {} }))
  }, [])

  const patchDraft = useCallback((patch: Partial<OrderDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
  }, [])

  const setMode = useCallback((mode: FulfilmentMode) => {
    setDraft((current) => ({ ...current, mode }))
  }, [])

  const placeOrder = useCallback((): PlacedOrder => {
    if (missing.length > 0) throw new Error(`Order is missing ${missing.join(', ')}`)

    const items = FLAVOURS.flatMap((flavour) => {
      const qty = draft.counts[flavour.id] ?? 0
      return qty > 0
        ? [{ flavourId: flavour.id, name: flavour.name, qty }]
        : []
    })

    const now = new Date()
    const order: PlacedOrder = {
      id: `order-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
      ref: makeRef(new Set(orders.map((existing) => existing.ref))),
      name: draft.name.trim(),
      createdAt: now.toISOString(),
      boxSize: draft.boxSize,
      items,
      mode: draft.mode,
      area: draft.mode === 'delivery' ? draft.area.trim() : '',
      date: draft.date,
      slot: draft.slot,
      note: draft.note.trim(),
      total,
      stage: 'new',
    }

    setOrders((current) => [order, ...current])
    setLastOrder(order)
    setFreshOrderId(order.id)
    setDraft(makeDraft())
    return order
  }, [draft, missing, orders, total])

  const clearFresh = useCallback(() => setFreshOrderId(null), [])

  const value: ShopValue = {
    draft,
    boxOption,
    cookieCount,
    remaining,
    boxPrice,
    deliveryFee,
    total,
    canPlace,
    missing,
    days,
    orders,
    lastOrder,
    freshOrderId,
    setSize,
    addFlavour,
    removeFlavour,
    clearBox,
    patchDraft,
    setMode,
    placeOrder,
    clearFresh,
  }

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>
}
