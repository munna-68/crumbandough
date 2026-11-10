import type { PlacedOrder } from './types'

/** Australian dollars. Every figure on this concept site is a placeholder. */
export function money(n: number): string {
  return `A$${n.toLocaleString('en-AU')}`
}

export function isoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export interface DayOption {
  iso: string
  weekday: string
  day: string
  label: string
}

/** The next five days, starting today. */
export function dayOptions(count = 5, from = new Date()): DayOption[] {
  const out: DayOption[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(from)
    d.setDate(d.getDate() + i)
    out.push({
      iso: isoDate(d),
      weekday: WEEKDAY[d.getDay()],
      day: String(d.getDate()).padStart(2, '0'),
      label: i === 0 ? 'today' : i === 1 ? 'tomorrow' : WEEKDAY[d.getDay()].toLowerCase(),
    })
  }
  return out
}

export function longDate(d = new Date()): string {
  return d.toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/** "Wed 12 Nov" from an ISO calendar date. */
export function shortDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/** "just now", "18 min ago", "1 hr 12 min ago". */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60_000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  const rest = mins % 60
  if (hours < 24) return rest ? `${hours} hr ${rest} min ago` : `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'yesterday' : `${days} days ago`
}

export function makeRef(taken: Set<string>): string {
  for (let i = 0; i < 80; i++) {
    const n = 1042 + Math.floor(Math.random() * 900)
    const ref = `CD-${n}`
    if (!taken.has(ref)) return ref
  }
  return `CD-${1042 + Math.floor(Math.random() * 900)}`
}

export function orderSummary(order: PlacedOrder): string {
  return order.items
    .map((i) => `${i.qty} ${i.name.toLowerCase()}`)
    .join(', ')
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
