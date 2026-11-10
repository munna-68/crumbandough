import { isoDate } from './format'
import type { BoxOption, Flavour, Offer, PlacedOrder, ReviewTheme } from './types'

export const BRAND = {
  name: 'crumb and dough',
  handle: '@crumbandough',
  instagram: 'https://www.instagram.com/crumbandough/',
  tiktok: 'https://www.tiktok.com/@crumbandough',
  location: 'Melbourne, Australia',
  shortLocation: 'MEL | AUS',
  tagline: 'Chunky, gooey and homemade cookies.',
  footerLine: 'Pick up or delivery available',
} as const

export const DELIVERY_FEE = 8

export const BOX_OPTIONS: BoxOption[] = [
  {
    size: 4,
    name: 'the little box',
    blurb: 'Four cookies. The Monday and Tuesday habit.',
    price: 24,
  },
  {
    size: 6,
    name: 'the everyday box',
    blurb: 'Six cookies. Mix, match, or go all in on one.',
    price: 35,
    badge: 'most picked',
  },
  {
    size: 12,
    name: 'the party box',
    blurb: 'Twelve cookies. For sharing, or not.',
    price: 66,
  },
]

export const FLAVOURS: Flavour[] = [
  {
    id: 'classic-chocolate',
    name: 'Classic chocolate',
    desc: 'Rich chocolate cookie loaded with white and dark/milk chocolate chips.',
    note: 'the house standard',
    accent: '#c58b52',
    imageSlot: 'classic-chocolate',
  },
  {
    id: 'red-velvet',
    name: 'Red velvet',
    desc: 'Soft cookie with a creamy, tangy cheesecake centre.',
    note: 'the tangy one',
    accent: '#a8464f',
    imageSlot: 'red-velvet',
  },
  {
    id: 'lemon-cheesecake',
    name: 'Lemon cheesecake',
    desc: 'Buttery lemon cookie with a smooth, creamy cheesecake filling.',
    note: 'the bright one',
    accent: '#d9b95c',
    imageSlot: 'lemon-cheesecake',
  },
  {
    id: 'biscoff',
    name: 'Biscoff',
    desc: 'Biscoff filled cookie topped with crunchy crumbs and extra Biscoff spread.',
    note: 'the one that drips',
    accent: '#b3733b',
    imageSlot: 'biscoff',
  },
  {
    id: 'white-kitkat',
    name: 'White KitKat',
    desc: 'White chocolate filled cookie topped with silky glaze and crunchy KitKat.',
    note: 'the white chocolate one',
    accent: '#e7d5b9',
    imageSlot: 'white-kitkat',
  },
  {
    id: 'reese-s',
    name: "Reese's",
    desc: 'Decadent dark chocolate cookie with a creamy, salty-sweet peanut butter centre.',
    note: 'the salty-sweet one',
    accent: '#8d5637',
    imageSlot: 'reese-s',
  },
  {
    id: 'oreo',
    name: 'Oreo',
    desc: 'Oreo frosting filled cookie with chocolate chips, Oreo glaze and extra frosting.',
    note: 'the extra one',
    accent: '#4a372e',
    imageSlot: 'oreo',
  },
]

export const OFFERS: Offer[] = [
  {
    eyebrow: 'every day',
    title: 'the box of six',
    detail: 'Six chunky cookies, mix and match. The everyday order.',
    price: 35,
  },
  {
    eyebrow: 'monday + tuesday',
    title: 'the little box',
    detail: 'Four cookies for the start of the week. Same seven flavours.',
    price: 24,
  },
]

export const REVIEW_THEMES: ReviewTheme[] = [
  {
    quote: 'The middle is the whole point.',
    detail: 'Stuffed, gooey, and never a dry bite.',
  },
  {
    quote: 'It arrived looking like the photo.',
    detail: 'Packed with care, ribbon and all.',
  },
  {
    quote: 'Choosing one flavour is the hard part.',
    detail: 'So mix and match the whole menu.',
  },
]

export const TIME_SLOTS = ['10am – 12pm', '12pm – 2pm', '2pm – 4pm', '4pm – 6pm'] as const

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function item(flavourId: string, qty: number) {
  const flavour = FLAVOURS.find((f) => f.id === flavourId)
  if (!flavour) throw new Error(`Unknown flavour ${flavourId}`)
  return { flavourId, name: flavour.name, qty }
}

/** Seed queue for the dashboard. Fictional first names only. */
export function seedOrders(): PlacedOrder[] {
  const today = isoDate(new Date())
  return [
    {
      id: 'seed-1041',
      ref: 'CD-1041',
      name: 'Mabel',
      createdAt: minutesAgo(18),
      boxSize: 6,
      items: [
        item('classic-chocolate', 2),
        item('red-velvet', 2),
        item('biscoff', 1),
        item('oreo', 1),
      ],
      mode: 'pickup',
      area: '',
      date: today,
      slot: '12pm – 2pm',
      note: 'One red velvet is a gift — could it be boxed on its own?',
      total: 35,
      stage: 'new',
    },
    {
      id: 'seed-1040',
      ref: 'CD-1040',
      name: 'Theo',
      createdAt: minutesAgo(38),
      boxSize: 4,
      items: [
        item('lemon-cheesecake', 1),
        item('white-kitkat', 1),
        item('reese-s', 2),
      ],
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
      boxSize: 12,
      items: [
        item('classic-chocolate', 2),
        item('red-velvet', 2),
        item('lemon-cheesecake', 2),
        item('biscoff', 2),
        item('white-kitkat', 2),
        item('reese-s', 2),
      ],
      mode: 'pickup',
      area: '',
      date: today,
      slot: '4pm – 6pm',
      note: 'Birthday box — extra sprinkles if there are any going.',
      total: 66,
      stage: 'baking',
    },
    {
      id: 'seed-1038',
      ref: 'CD-1038',
      name: 'Juno',
      createdAt: minutesAgo(94),
      boxSize: 6,
      items: [item('biscoff', 3), item('oreo', 3)],
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
