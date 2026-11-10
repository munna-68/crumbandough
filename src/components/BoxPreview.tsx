import { useMemo, type CSSProperties } from 'react'
import { FLAVOURS } from '../lib/data'
import { money } from '../lib/format'
import { useShop } from '../lib/store'
import type { Flavour } from '../lib/types'
import { ArrowUpRight, Plus } from './Icons'

interface BoxPreviewProps {
  onPlace: () => void
}

function luminance(hex: string): number {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function slotPositions(size: number) {
  const radius = size === 12 ? 38 : 34
  return Array.from({ length: size }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / size
    return {
      left: 50 + Math.cos(angle) * radius,
      top: 50 + Math.sin(angle) * radius,
    }
  })
}

export function BoxPreview({ onPlace }: BoxPreviewProps) {
  const {
    draft,
    boxOption,
    cookieCount,
    remaining,
    boxPrice,
    deliveryFee,
    total,
    canPlace,
    missing,
  } = useShop()

  const positions = useMemo(() => slotPositions(draft.boxSize), [draft.boxSize])
  const filled = useMemo(
    () =>
      FLAVOURS.flatMap((flavour) =>
        Array.from({ length: draft.counts[flavour.id] ?? 0 }, () => flavour),
      ),
    [draft.counts],
  )

  const cookieSize = draft.boxSize === 4 ? 30 : draft.boxSize === 6 ? 25 : 18
  const buttonLabel =
    remaining > 0
      ? `add ${remaining} more cookie${remaining === 1 ? '' : 's'}`
      : !canPlace
        ? 'finish your details'
        : 'place order'

  return (
    <aside className="box-panel" aria-label="Your box">
      <div className="box-panel__head">
        <div>
          <p className="eyebrow eyebrow--pink">the live box</p>
          <h2>your box</h2>
        </div>
        <span className="box-panel__size">{draft.boxSize} cookies</span>
      </div>

      <div className="box-platter" aria-hidden="true">
        {positions.map((position, index) => {
          const flavour: Flavour | undefined = filled[index]
          return (
            <span
              key={flavour ? `${index}-${flavour.id}` : `empty-${index}`}
              className={`box-slot ${flavour ? 'box-slot--filled' : ''}`}
              style={
                {
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                  '--cookie-size': `${cookieSize}%`,
                  '--cookie-accent': flavour?.accent,
                  '--cookie-chip': flavour
                    ? luminance(flavour.accent) < 105
                      ? '#f4e8d7'
                      : '#4a2b1e'
                    : undefined,
                } as CSSProperties
              }
            >
              {flavour && (
                <span className="box-cookie">
                  <span className="box-cookie__chip" />
                  <span className="box-cookie__chip" />
                  <span className="box-cookie__chip" />
                  <span className="box-cookie__chip" />
                </span>
              )}
            </span>
          )
        })}

        <span className="box-platter__centre" aria-live="polite">
          <strong>{cookieCount}</strong>
          <span>of {draft.boxSize}</span>
        </span>
        <span className="box-platter__ring" />
      </div>

      <div className="box-panel__note">
        {remaining > 0 ? (
          <>
            <span className="box-panel__note-dot" />
            {remaining} spot{remaining === 1 ? '' : 's'} left. Mix the flavours or go all
            in on one.
          </>
        ) : (
          <>
            <span className="box-panel__note-dot box-panel__note-dot--full" />
            Box full. It is a good one.
          </>
        )}
      </div>

      <div className="box-panel__lines">
        <div>
          <span>{boxOption.name}</span>
          <span>{money(boxPrice)}</span>
        </div>
        {draft.mode === 'delivery' && (
          <div>
            <span>delivery · placeholder</span>
            <span>{money(deliveryFee)}</span>
          </div>
        )}
        <div className="box-panel__total">
          <span>total</span>
          <span>
            {money(total)} <em>placeholder price</em>
          </span>
        </div>
      </div>

      {!canPlace && (
        <p className="box-panel__missing">
          Still needed: <strong>{missing.join(' · ')}</strong>
        </p>
      )}

      <button
        type="button"
        className="box-panel__submit"
        onClick={onPlace}
        disabled={!canPlace}
      >
        {canPlace ? <ArrowUpRight className="box-panel__submit-icon" /> : <Plus className="box-panel__submit-icon" />}
        {buttonLabel}
      </button>

      <p className="box-panel__fineprint">
        Demo checkout — no payment is taken and nothing is sent.
      </p>
    </aside>
  )
}
