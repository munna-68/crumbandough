import type { CSSProperties } from 'react'
import { Cookie } from '../Cookie'

/*
 * The still-life kit: plinths, spheres and standing cookies, positioned in a
 * 100 × 70 unit box (1u = --u). It stands in for the studio photo the
 * reference uses until generated photography lands in /public/images.
 */

type Pos = { x: number; y: number }

function u(n: number) {
  return `calc(var(--u) * ${n})`
}

/** Floor line sits 11u above the scene's bottom so front pieces can stand below it. */
const FLOOR = 11
function b(y: number) {
  return u(y + FLOOR)
}

export function Plinth({
  x,
  y,
  w,
  h,
  tone,
  depth = 1,
  round = false,
}: Pos & { w: number; h: number; tone: 'pink' | 'rose' | 'milk' | 'cocoa' | 'butter'; depth?: number; round?: boolean }) {
  const style = { left: u(x), bottom: b(y), width: u(w), height: u(h), '--top': u(Math.min(3.2, w * 0.14)) } as CSSProperties
  return (
    <div className={`plinth plinth--${tone} ${round ? 'plinth--round' : ''}`} style={style} data-depth={depth} data-piece="block">
      <span className="plinth__top" />
    </div>
  )
}

export function Sphere({ x, y, d, tone, depth = 1 }: Pos & { d: number; tone: 'pink' | 'milk' | 'cocoa' | 'butter'; depth?: number }) {
  return (
    <div
      className={`sphere sphere--${tone}`}
      style={{ left: u(x), bottom: b(y), width: u(d), height: u(d) }}
      data-depth={depth}
      data-piece="sphere"
    />
  )
}

export function Standing({
  id,
  x,
  y,
  d,
  tilt = 0,
  depth = 1,
  eager = false,
}: Pos & { id: string; d: number; tilt?: number; depth?: number; eager?: boolean }) {
  return (
    <div className="standing" style={{ left: u(x), bottom: b(y), width: u(d), height: u(d) }} data-depth={depth} data-piece="cookie">
      <div className="standing__spin" style={{ transform: `rotate(${tilt}deg)` }}>
        <Cookie id={id} size="lg" eager={eager} alt="" />
      </div>
    </div>
  )
}

/** The hero arrangement. Desktop and phone share pieces, positioned per layout in CSS vars. */
export function HeroStillLife() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="scene__arch" data-depth={0.3} />
      {/* back row */}
      <Plinth x={40} y={0} w={17} h={34} tone="rose" depth={0.6} />
      <Plinth x={57} y={0} w={15} h={21} tone="milk" depth={0.7} />
      <Plinth x={22} y={0} w={18} h={14} tone="pink" depth={0.8} />
      <Plinth x={74} y={0} w={14} h={27} tone="cocoa" depth={0.65} />
      {/* spheres */}
      <Sphere x={18} y={14} d={7} tone="milk" depth={1.2} />
      <Sphere x={70} y={21} d={5} tone="pink" depth={1.1} />
      <Sphere x={88.5} y={0} d={8} tone="butter" depth={1.4} />
      {/* cookies standing on the plinths */}
      <Standing id="oreo" x={40.5} y={33.4} d={16} tilt={-8} depth={0.9} eager />
      <Standing id="red-velvet" x={57.5} y={20.4} d={14} tilt={6} depth={1} eager />
      <Standing id="biscoff" x={74.2} y={26.4} d={13.4} tilt={-4} depth={0.95} eager />
      <Standing id="classic-chocolate" x={23} y={13.4} d={15} tilt={10} depth={1.1} eager />
      {/* front row on the floor */}
      <Plinth x={30} y={-10} w={26} h={7} tone="butter" depth={1.5} />
      <Standing id="reese-s" x={33} y={-3.6} d={12} tilt={-12} depth={1.6} eager />
      <Standing id="lemon-cheesecake" x={58} y={-10.4} d={11} tilt={14} depth={1.8} eager />
      <Sphere x={50} y={-3} d={4.2} tone="cocoa" depth={1.7} />
    </div>
  )
}
