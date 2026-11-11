import { isoDate } from './format'
import type { BoxOption, BoxSize, Flavour, OrderBox, PlacedOrder } from './types'

export const BRAND = {
  name: 'crumb and dough',
  handle: '@crumbandough',
  instagram: 'https://www.instagram.com/crumbandough/',
  tiktok: 'https://www.tiktok.com/@crumbandough',
  location: 'Melbourne, Australia',
  shortLocation: 'MEL | AUS',
  tagline: 'Chunky, gooey and homemade cookies.',
} as const

/** Placeholder until the kitchen confirms its real fee. */
export const DELIVERY_FEE = 8

export const BOX_OPTIONS: BoxOption[] = [
  { size: 4, name: 'The little box', price: 24, when: 'Mondays and Tuesdays', numeral: '4' },
  { size: 6, name: 'The everyday box', price: 35, when: 'Every day', numeral: '6' },
  { size: 12, name: 'The party box', price: 66, when: 'For sharing, or not', numeral: '12' },
]

export const BOX_PRICES: Record<BoxSize, number> = { 4: 24, 6: 35, 12: 66 }

/**
 * The seven flavours from the shop's own posts. Photos are borrowed placeholders
 * from the Bake House set until the kitchen's own shots arrive.
 */
export const FLAVOURS: Flavour[] = [
  {
    id: 'classic-chocolate',
    name: 'Classic chocolate',
    desc: 'Rich chocolate cookie loaded with white, dark and milk chocolate chips.',
    note: 'the house standard',
    tint: '#EBCFAE',
    accent: '#B9824E',
    allergens: ['Wheat', 'Milk', 'Egg', 'Soy'],
  },
  {
    id: 'red-velvet',
    name: 'Red velvet',
    desc: 'Soft red velvet with a creamy, tangy cheesecake centre.',
    note: 'the tangy one',
    tint: '#F0B3BE',
    accent: '#A83A48',
    allergens: ['Wheat', 'Milk', 'Egg'],
  },
  {
    id: 'lemon-cheesecake',
    name: 'Lemon cheesecake',
    desc: 'Buttery lemon cookie with a smooth, creamy cheesecake filling.',
    note: 'the bright one',
    tint: '#F5E3A8',
    accent: '#C9A13A',
    allergens: ['Wheat', 'Milk', 'Egg'],
  },
  {
    id: 'biscoff',
    name: 'Biscoff',
    desc: 'Biscoff filled, topped with crunchy crumbs and an extra spoon of spread.',
    note: 'the one that drips',
    tint: '#E9BC8E',
    accent: '#A8652E',
    allergens: ['Wheat', 'Milk', 'Soy'],
  },
  {
    id: 'white-kitkat',
    name: 'White KitKat',
    desc: 'White chocolate filled, finished with a silky glaze and crunchy KitKat.',
    note: 'the white chocolate one',
    tint: '#F4E6D2',
    accent: '#C7A57A',
    allergens: ['Wheat', 'Milk', 'Soy'],
  },
  {
    id: 'reese-s',
    name: "Reese's",
    desc: 'Dark chocolate dough around a creamy, salty-sweet peanut butter centre.',
    note: 'the salty-sweet one',
    tint: '#EEC39B',
    accent: '#8D5637',
    allergens: ['Wheat', 'Milk', 'Peanuts', 'Soy'],
  },
  {
    id: 'oreo',
    name: 'Oreo',
    desc: 'Oreo frosting filled, chocolate chips, Oreo glaze and extra frosting.',
    note: 'the extra one',
    tint: '#D9C6C9',
    accent: '#3E2A22',
    allergens: ['Wheat', 'Milk', 'Soy'],
  },
]

export function flavourById(id: string): Flavour | undefined {
  return FLAVOURS.find((f) => f.id === id)
}

/** Cutout photo for a flavour. `lg` is the 1200px version for hero-sized use. */
export function cookieSrc(id: string, size: 'sm' | 'lg' = 'sm'): string {
  return `/cookies/${id}${size === 'lg' ? '-lg' : ''}.webp`
}

export const TIME_SLOTS = ['10am – 12pm', '12pm – 2pm', '2pm – 4pm', '4pm – 6pm'] as const

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function box(size: BoxSize, items: Array<[string, number]>): OrderBox {
  return {
    size,
    items: items.map(([flavourId, qty]) => ({ flavourId, name: flavourById(flavourId)?.name ?? flavourId, qty })),
  }
}

/** Seed queue for the kitchen board. Fictional first names only. */
export function seedOrders(): PlacedOrder[] {
  const today = isoDate(new Date())
  return [
    {
      id: 'seed-1041',
      ref: 'CD-1041',
      name: 'Mabel',
      createdAt: minutesAgo(18),
      boxes: [box(6, [['classic-chocolate', 2], ['red-velvet', 2], ['biscoff', 1], ['oreo', 1]])],
      mode: 'pickup',
      area: '',
      date: today,
      slot: '12pm – 2pm',
      note: 'One red velvet is a gift. Could it be wrapped on its own?',
      total: 35,
      stage: 'new',
    },
    {
      id: 'seed-1040',
      ref: 'CD-1040',
      name: 'Theo',
      createdAt: minutesAgo(38),
      boxes: [box(4, [['lemon-cheesecake', 1], ['white-kitkat', 1], ['reese-s', 2]])],
      mode: 'delivery',
      area: 'Brunswick',
      date: today,
      slot: '2pm – 4pm',
      note: 'Leave at the side gate, please.',
      total: 32,
      stage: 'baking',
    },
    {
      id: 'seed-1039',
      ref: 'CD-1039',
      name: 'Ari',
      createdAt: minutesAgo(62),
      boxes: [
        box(12, [
          ['classic-chocolate', 2],
          ['red-velvet', 2],
          ['lemon-cheesecake', 2],
          ['biscoff', 2],
          ['white-kitkat', 2],
          ['reese-s', 2],
        ]),
      ],
      mode: 'pickup',
      area: '',
      date: today,
      slot: '4pm – 6pm',
      note: 'Birthday box.',
      total: 66,
      stage: 'baking',
    },
    {
      id: 'seed-1038',
      ref: 'CD-1038',
      name: 'Juno',
      createdAt: minutesAgo(94),
      boxes: [box(6, [['biscoff', 3], ['oreo', 3]])],
      mode: 'delivery',
      area: 'Footscray',
      date: today,
      slot: '10am – 12pm',
      note: '',
      total: 43,
      stage: 'ready',
    },
  ]
}
