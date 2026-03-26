'use client'

/**
 * ParallaxImage — wraps a Next.js Image in an overflow-hidden container
 * and applies a subtle scroll-driven translateY so the image scrolls
 * ~25% slower than page content, creating a depth/parallax effect.
 *
 * Usage:
 *   <div className="relative overflow-hidden" style={{ height: '60vh' }}>
 *     <ParallaxImage src="..." alt="..." sizes="100vw" />
 *   </div>
 *
 * The component renders as `position: absolute` filling the parent.
 * The parent must be `position: relative` with an explicit height.
 * Overflow-hidden on the parent clips the extended inner container.
 */

import Image from 'next/image'
import type { CSSProperties } from 'react'
import { useParallax } from '@/hooks/useParallax'

interface ParallaxImageProps {
  src: string
  alt: string
  sizes?: string
  speed?: number
  priority?: boolean
  quality?: number
  /** Extra className forwarded to the <Image> (e.g. object-contain) */
  imgClassName?: string
}

export default function ParallaxImage({
  src,
  alt,
  sizes = '100vw',
  speed = 0.25,
  priority = false,
  quality = 90,
  imgClassName = '',
}: ParallaxImageProps) {
  const { containerRef, ty } = useParallax(speed)

  // The inner moving div extends 15% beyond the parent on top and bottom.
  // This 30% of extra height accommodates the parallax travel without gaps.
  const innerStyle: CSSProperties = {
    position: 'absolute',
    top: '-15%',
    bottom: '-15%',
    left: 0,
    right: 0,
    transform: `translateY(${ty}px)`,
    willChange: 'transform',
  }

  return (
    // containerRef goes on an absolute div that fills the parent
    <div ref={containerRef} className="absolute inset-0">
      <div style={innerStyle}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={`object-cover ${imgClassName}`}
        />
      </div>
    </div>
  )
}
