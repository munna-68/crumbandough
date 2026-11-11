import { useRef, type ReactNode } from 'react'
import { MOTION, SplitText, gsap, useGSAP } from '../../lib/motion'

/** The reference's centred, coloured, all-caps section word. Letters rise in when it scrolls into view. */
export function SectionTitle({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        if (!ref.current) return
        const split = SplitText.create(ref.current, { type: 'chars', mask: 'chars' })
        gsap.from(split.chars, {
          yPercent: 110,
          rotation: 8,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.04,
          scrollTrigger: { trigger: ref.current, start: 'top 88%' },
        })
        return () => split.revert()
      })
    },
    { scope: ref },
  )
  return (
    <h2 id={id} ref={ref} className={`title ${className}`}>
      {children}
    </h2>
  )
}
