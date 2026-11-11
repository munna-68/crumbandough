import { cookieSrc, flavourById } from '../lib/data'

/** A cutout cookie photo. `lg` loads the 1200px file for hero-sized use. */
export function Cookie({
  id,
  size = 'sm',
  className = '',
  alt,
  eager = false,
}: {
  id: string
  size?: 'sm' | 'lg'
  className?: string
  alt?: string
  eager?: boolean
}) {
  const name = flavourById(id)?.name ?? 'Cookie'
  return (
    <img
      src={cookieSrc(id, size)}
      alt={alt ?? name}
      width={size === 'lg' ? 1200 : 560}
      height={size === 'lg' ? 1200 : 560}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={`cookie-img ${className}`}
    />
  )
}
