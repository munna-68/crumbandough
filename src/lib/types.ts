export const BOX_SIZES = [4, 6, 12] as const
export type BoxSize = (typeof BOX_SIZES)[number]

export type FulfilmentMode = 'pickup' | 'delivery'
export type OrderStage = 'new' | 'baking' | 'ready'

export type FlavourSlot =
  | 'classic-chocolate'
  | 'red-velvet'
  | 'lemon-cheesecake'
  | 'biscoff'
  | 'white-kitkat'
  | 'reese-s'
  | 'oreo'

export interface Flavour {
  id: string
  name: string
  desc: string
  /** Short, human note used in the box preview and kitchen list. */
  note: string
  accent: string
  imageSlot: FlavourSlot
}

export interface BoxOption {
  size: BoxSize
  name: string
  blurb: string
  price: number
  badge?: string
}

export interface OrderItem {
  flavourId: string
  name: string
  qty: number
}

export interface OrderDraft {
  boxSize: BoxSize
  counts: Record<string, number>
  mode: FulfilmentMode
  name: string
  area: string
  date: string
  slot: string
  note: string
}

export interface PlacedOrder {
  id: string
  ref: string
  name: string
  createdAt: string
  boxSize: BoxSize
  items: OrderItem[]
  mode: FulfilmentMode
  area: string
  date: string
  slot: string
  note: string
  total: number
  stage: OrderStage
}

export interface BakeRow {
  flavourId: string
  name: string
  qty: number
  accent: string
}

export interface ReviewTheme {
  quote: string
  detail: string
}

export interface Offer {
  eyebrow: string
  title: string
  detail: string
  price: number
}
