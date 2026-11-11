import { useEffect, useRef, type RefObject } from 'react'
import { lockScroll, unlockScroll } from './scroll'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Dialog plumbing (ported from Bake House): locks the page, moves focus in,
 * traps Tab, closes on Escape and hands focus back to the trigger.
 */
export function useDialog(open: boolean, onClose: () => void): { ref: RefObject<HTMLDivElement> } {
  const ref = useRef<HTMLDivElement>(null)
  const restore = useRef<HTMLElement | null>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    restore.current = document.activeElement as HTMLElement | null
    lockScroll()

    const visible = (el: HTMLElement) => el.offsetParent !== null && !el.closest('[inert]')
    const node = ref.current
    const first = Array.from(node?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).find(visible)
    ;(first ?? node)?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const host = ref.current
      if (!host) return
      const items = Array.from(host.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(visible)
      if (items.length === 0) return
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (!active || !host.contains(active)) {
        e.preventDefault()
        firstItem.focus()
      } else if (!e.shiftKey && active === lastItem) {
        e.preventDefault()
        firstItem.focus()
      } else if (e.shiftKey && active === firstItem) {
        e.preventDefault()
        lastItem.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      unlockScroll()
      restore.current?.focus?.({ preventScroll: true })
    }
  }, [open])

  return { ref }
}
