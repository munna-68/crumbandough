import { forwardRef, useState, type CSSProperties } from 'react'
import {
  IMAGE_SLOTS_BY_NAME,
  labelsRequested,
  type ImageSlotDefinition,
  type ImageSlotName,
} from '../lib/images'

interface BrandImageProps {
  slot: ImageSlotName
  className?: string
  priority?: boolean
  /** Omit the alt text when the same information is already written next to it. */
  decorative?: boolean
  showLabel?: boolean
}

const SOURCE_EXTENSIONS = ['webp', 'png'] as const

function isDark(hex: string): boolean {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b < 105
}

export const BrandImage = forwardRef<HTMLDivElement, BrandImageProps>(function BrandImage(
  { slot, className = '', priority = false, decorative = false, showLabel = true },
  ref,
) {
  const definition = IMAGE_SLOTS_BY_NAME[slot]
  const [attempts, setAttempts] = useState<Partial<Record<ImageSlotName, number>>>({})
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)

  const attempt = attempts[slot] ?? 0
  const extension = SOURCE_EXTENSIONS[attempt]
  const src = extension ? `/images/${slot}.${extension}` : null
  const loaded = src !== null && loadedSrc === src
  const labels = labelsRequested()

  return (
    <div
      ref={ref}
      className={`brand-image brand-image--${definition.kind} ${className}`}
      data-slot={slot}
      data-image-state={loaded ? 'ready' : 'placeholder'}
    >
      {!loaded && (
        <SlotPlaceholder definition={definition} decorative={decorative} />
      )}
      {src && (
        <img
          key={src}
          className="brand-image__img"
          src={src}
          alt={decorative ? '' : definition.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setLoadedSrc(src)}
          onError={() =>
            setAttempts((prev) => ({
              ...prev,
              [slot]: (prev[slot] ?? 0) + 1,
            }))
          }
        />
      )}
      {labels && showLabel && (
        <span className="image-slot-label" aria-hidden="true">
          {slot}
          <em>/images/{slot}.webp</em>
        </span>
      )}
    </div>
  )
})

function SlotPlaceholder({
  definition,
  decorative,
}: {
  definition: ImageSlotDefinition
  decorative: boolean
}) {
  return (
    <div
      className={`slot-placeholder slot-placeholder--${definition.kind}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : definition.alt}
      aria-hidden={decorative ? true : undefined}
      style={{ '--slot-accent': definition.accent } as CSSProperties}
    >
      {definition.kind === 'cookie' && <CookieGlyph accent={definition.accent} />}
      {definition.kind === 'box' && <BoxGlyph name={definition.name} accent={definition.accent} />}
      {definition.kind === 'scene' && <SceneGlyph accent={definition.accent} />}
      <span className="slot-placeholder__mark" aria-hidden="true">
        c+d
      </span>
    </div>
  )
}

function CookieGlyph({ accent }: { accent: string }) {
  const dark = isDark(accent)
  const chip = dark ? '#f4e8d7' : '#4a2b1e'
  const shine = dark ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.28)'

  return (
    <svg
      className="slot-cookie"
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M100 13C118 13 130 24 146 30C163 36 182 45 183 65C184 84 172 96 175 115C178 134 167 151 151 161C135 171 124 188 105 189C86 190 73 178 57 170C41 162 23 154 21 136C19 118 30 105 27 87C24 69 34 53 48 43C62 33 82 13 100 13Z"
        fill={accent}
      />
      <path
        d="M100 13C118 13 130 24 146 30C163 36 182 45 183 65C184 84 172 96 175 115C178 134 167 151 151 161C135 171 124 188 105 189C86 190 73 178 57 170C41 162 23 154 21 136C19 118 30 105 27 87C24 69 34 53 48 43C62 33 82 13 100 13Z"
        fill="none"
        stroke={shine}
        strokeWidth="7"
        opacity=".45"
      />
      <path
        d="M46 77C61 57 82 47 103 50"
        fill="none"
        stroke={shine}
        strokeWidth="9"
        strokeLinecap="round"
        opacity=".55"
      />
      <path
        d="M107 43C100 55 107 63 101 75C96 85 104 94 99 105"
        fill="none"
        stroke={dark ? 'rgba(244,232,215,.28)' : 'rgba(74,43,30,.22)'}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="73" cy="72" rx="10" ry="7" fill={chip} transform="rotate(-24 73 72)" />
      <ellipse cx="123" cy="60" rx="8" ry="6" fill={chip} transform="rotate(14 123 60)" />
      <ellipse cx="139" cy="111" rx="11" ry="8" fill={chip} transform="rotate(-8 139 111)" />
      <ellipse cx="92" cy="126" rx="9" ry="7" fill={chip} transform="rotate(32 92 126)" />
      <ellipse cx="58" cy="112" rx="7" ry="5" fill={chip} transform="rotate(-4 58 112)" />
      <ellipse cx="112" cy="157" rx="7" ry="5" fill={chip} transform="rotate(18 112 157)" />
      <circle cx="153" cy="80" r="2.6" fill={chip} opacity=".7" />
      <circle cx="82" cy="164" r="2.2" fill={chip} opacity=".6" />
      <circle cx="43" cy="94" r="2" fill={chip} opacity=".5" />
    </svg>
  )
}

function BoxGlyph({ name, accent }: { name: string; accent: string }) {
  const label = name === 'box-4' ? '4 cookies' : name === 'box-6' ? '6 cookies' : '12 cookies'

  return (
    <svg
      className="slot-box"
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="100" cy="177" rx="63" ry="9" fill="#4a2b1e" opacity=".12" />
      <circle cx="74" cy="73" r="16" fill="#c58b52" />
      <circle cx="100" cy="66" r="17" fill="#b3733b" />
      <circle cx="126" cy="74" r="15" fill="#d9b95c" />
      <circle cx="74" cy="73" r="16" fill="none" stroke="#4a2b1e" strokeWidth="2.5" />
      <circle cx="100" cy="66" r="17" fill="none" stroke="#4a2b1e" strokeWidth="2.5" />
      <circle cx="126" cy="74" r="15" fill="none" stroke="#4a2b1e" strokeWidth="2.5" />
      <circle cx="80" cy="69" r="2.4" fill="#4a2b1e" />
      <circle cx="103" cy="61" r="2.6" fill="#4a2b1e" />
      <circle cx="130" cy="72" r="2.2" fill="#4a2b1e" />
      <path
        d="M42 84H158L146 166C145.4 171 142 174 137 174H63C58 174 54.6 171 54 166L42 84Z"
        fill="#f7ecdd"
        stroke="#4a2b1e"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M38 70C38 63 42 59 49 59H151C158 59 162 63 162 70V83C162 89 158 93 152 93H48C42 93 38 89 38 83V70Z"
        fill="#e8c9b5"
        stroke="#4a2b1e"
        strokeWidth="3"
      />
      <rect
        x="68"
        y="58"
        width="64"
        height="36"
        rx="7"
        fill={accent}
        stroke="#4a2b1e"
        strokeWidth="2.5"
      />
      <text
        x="100"
        y="80"
        textAnchor="middle"
        fontFamily="DM Sans, system-ui, sans-serif"
        fontSize="11.5"
        fontWeight="700"
        fill="#4a2b1e"
      >
        {label}
      </text>
      <path d="M57 107C62 106 68 109 71 114" stroke="#4a2b1e" strokeWidth="2.2" opacity=".22" strokeLinecap="round" />
      <circle cx="80" cy="149" r="2" fill="#4a2b1e" opacity=".2" />
      <circle cx="122" cy="136" r="1.6" fill="#4a2b1e" opacity=".18" />
      <path d="M130 150C134 150 137 152 138 156" stroke="#4a2b1e" strokeWidth="1.8" opacity=".18" strokeLinecap="round" />
    </svg>
  )
}

function SceneGlyph({ accent }: { accent: string }) {
  return (
    <svg
      className="slot-scene"
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="500" fill={accent} />
      <circle cx="336" cy="86" r="126" fill="#f1c5d8" />
      <path d="M0 340H400V500H0Z" fill="#ead7bf" />
      <path d="M54 500V256C54 184 110 128 182 128C254 128 310 184 310 256V500Z" fill="#f4e8d7" />
      <path d="M54 500V256C54 184 110 128 182 128C254 128 310 184 310 256V500" fill="none" stroke="#4a2b1e" strokeWidth="2.5" opacity=".16" />
      <ellipse cx="200" cy="452" rx="136" ry="21" fill="#4a2b1e" opacity=".1" />
      <circle cx="174" cy="358" r="77" fill="#c58b52" />
      <circle cx="174" cy="358" r="77" fill="none" stroke="#4a2b1e" strokeWidth="3" opacity=".35" />
      <ellipse cx="152" cy="330" rx="10" ry="7" fill="#4a2b1e" transform="rotate(-20 152 330)" />
      <ellipse cx="194" cy="318" rx="8" ry="6" fill="#4a2b1e" transform="rotate(12 194 318)" />
      <ellipse cx="205" cy="372" rx="11" ry="7" fill="#4a2b1e" transform="rotate(-8 205 372)" />
      <ellipse cx="154" cy="390" rx="8" ry="6" fill="#4a2b1e" transform="rotate(26 154 390)" />
      <path d="M174 275C168 289 176 298 170 312" fill="none" stroke="#4a2b1e" strokeWidth="3" strokeLinecap="round" opacity=".25" />
      <rect x="288" y="300" width="66" height="110" rx="12" fill="#4a2b1e" opacity=".92" />
      <path d="M354 322C372 330 372 386 354 394" fill="none" stroke="#4a2b1e" strokeWidth="9" opacity=".92" />
      <ellipse cx="321" cy="300" rx="33" ry="8" fill="#f4e8d7" opacity=".8" />
      <path d="M302 304C302 340 304 368 306 392" stroke="#f4e8d7" strokeWidth="2" opacity=".18" />
      <path d="M108 470C118 456 130 452 144 456" fill="none" stroke="#4a2b1e" strokeWidth="2" opacity=".18" strokeLinecap="round" />
      <circle cx="94" cy="450" r="3" fill="#b3733b" opacity=".5" />
      <circle cx="246" cy="464" r="2.4" fill="#b3733b" opacity=".4" />
      <path d="M348 26C354 56 366 70 392 74" fill="none" stroke="#f4e8d7" strokeWidth="2" opacity=".45" strokeLinecap="round" />
      <circle cx="352" cy="32" r="4" fill="#f4e8d7" opacity=".55" />
    </svg>
  )
}
