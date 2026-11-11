import { useRef } from 'react'
import { FLAVOURS, cookieSrc } from '../../lib/data'
import { prefersReducedMotion } from '../../lib/format'
import { gsap } from '../../lib/motion'
import { useShop } from '../../lib/store'
import type { Flavour } from '../../lib/types'
import { Cookie } from '../Cookie'
import { Minus, Plus } from './Icons'

/**
 * Throw a copy of the cookie from the card into its new slot. The slot that
 * just filled is the last one showing this flavour in whichever grid is on
 * screen (the desktop panel or the phone strip).
 */
function flyToSlot(from: HTMLElement, flavour: Flavour) {
  if (prefersReducedMotion()) return
  requestAnimationFrame(() => {
    const grids = Array.from(document.querySelectorAll<HTMLElement>('.slots--panel, .slots--strip')).filter(
      (g) => g.offsetParent !== null,
    )
    const grid = grids[0]
    if (!grid) return
    const hits = Array.from(grid.querySelectorAll<HTMLImageElement>(`.slot.is-filled img[alt="${CSS.escape(flavour.name)}"]`))
    const target = hits[hits.length - 1]
    if (!target) return
    const a = from.getBoundingClientRect()
    const b = target.getBoundingClientRect()
    if (b.width === 0) return

    const ghost = document.createElement('img')
    ghost.src = cookieSrc(flavour.id)
    ghost.alt = ''
    ghost.className = 'fly'
    Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` })
    document.body.appendChild(ghost)
    // The slot keeps looking empty (dashed ring and number) until the cookie lands in it.
    const slot = target.closest('.slot')
    slot?.classList.add('is-incoming')

    const dx = b.left + b.width / 2 - (a.left + a.width / 2)
    const dy = b.top + b.height / 2 - (a.top + a.height / 2)
    const s = b.width / a.width
    gsap
      .timeline({
        onComplete: () => {
          ghost.remove()
          slot?.classList.remove('is-incoming')
          gsap.fromTo(target, { scale: 1.35 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })
        },
      })
      .to(ghost, { x: dx, duration: 0.62, ease: 'power2.inOut' }, 0)
      .to(ghost, { y: dy, duration: 0.62, ease: 'back.in(1.4)' }, 0)
      .to(ghost, { scale: s, rotation: 300, duration: 0.62, ease: 'power2.in' }, 0)
  })
}

export function Rack() {
  return (
    <ul className="rack">
      {FLAVOURS.map((f) => (
        <RackCard key={f.id} flavour={f} />
      ))}
    </ul>
  )
}

function RackCard({ flavour }: { flavour: Flavour }) {
  const { qtyInActive, qtyInOrder, canAdd, add, remove, activeBox, boxes } = useShop()
  const img = useRef<HTMLDivElement>(null)
  const inBox = qtyInActive(flavour.id)
  const inOrder = qtyInOrder(flavour.id)
  const full = !canAdd()
  const boxNo = boxes.findIndex((b) => b.id === activeBox.id) + 1

  const onAdd = () => {
    if (!canAdd()) return
    add(flavour.id)
    const el = img.current?.querySelector('img')
    if (el) flyToSlot(el, flavour)
  }

  return (
    <li className={`card ${inBox > 0 ? 'is-in' : ''}`} style={{ ['--tint' as string]: flavour.tint }}>
      <div className="card__art" ref={img}>
        <span className="card__disc" aria-hidden="true" />
        <Cookie id={flavour.id} />
        {inOrder > 0 ? (
          <span key={inOrder} className="card__badge count-pop" aria-hidden="true">
            {inOrder}
          </span>
        ) : null}
      </div>
      <div className="card__body">
        <h3 className="card__name">{flavour.name}</h3>
        <p className="card__desc">{flavour.desc}</p>
        <ul className="card__tags" aria-label="Allergens">
          {flavour.allergens.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <div className="card__foot">
        <p className="card__state">
          {inBox > 0
            ? `${inBox} in box ${boxNo}`
            : full
              ? `Box ${boxNo} is full`
              : flavour.note}
        </p>
        {inBox > 0 ? (
          <span className="stepper">
            <button type="button" onClick={() => remove(flavour.id)} aria-label={`Remove one ${flavour.name}`}>
              <Minus />
            </button>
            <span key={inBox} className="count-pop" aria-live="polite">
              {inBox}
            </span>
            <button type="button" onClick={onAdd} disabled={full} aria-label={`Add another ${flavour.name}`}>
              <Plus />
            </button>
          </span>
        ) : (
          <button type="button" className="btn btn--outline btn--sm" onClick={onAdd} disabled={full} aria-label={`Add ${flavour.name} to your box`}>
            Add
          </button>
        )}
      </div>
    </li>
  )
}
