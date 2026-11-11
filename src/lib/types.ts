export const BOX_SIZES = [4, 6, 12] as const
export type BoxSize = (typeof BOX_SIZES)[number]

export type FulfilmentMode = 'pickup' | 'delivery'
export type OrderStage = 'new' | 'baking' | 'ready'

export interface Flavour {
  id: string
  name: string
  /** One line, in the shop's own voice. */
  desc: string
  /** Short nickname used on the flavour stage and kitchen board. */
  note: string
  /** Pastel ground used behind this cookie on the flavour stage. */
  tint: string
  /** Solid accent for bars and dots. */
  accent: string
  allergens: string[]
}

export interface BoxOption {
  size: BoxSize
  name: string
  price: number
  /** When the offer runs, in plain words. */
  when: string
  numeral: string
}

export interface Box {
  id: string
  size: BoxSize
  /** flavourId -> quantity */
  items: Record<string, number>
}

export interface Fulfilment {
  mode: FulfilmentMode
  day: string
  window: string | null
  /** Suburb only — never a street address. */
  area: string
}

export interface Customer {
  name: string
  contact: string
  note: string
}

export interface OrderBox {
  size: BoxSize
  items: Array<{ flavourId: string; name: string; qty: number }>
}

export interface PlacedOrder {
  id: string
  ref: string
  name: string
  createdAt: string
  boxes: OrderBox[]
  mode: FulfilmentMode
  area: string
  date: string
  slot: string
  note: string
  total: number
  stage: OrderStage
}

export interface Toast {
  id: number
  message: string
  tone: 'default' | 'full'
}
