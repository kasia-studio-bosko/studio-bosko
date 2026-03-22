'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Attaches to a container element and returns a translateY value
 * that makes images inside scroll ~20-30% slower than page content.
 *
 * Formula: ty = (viewportCenter - elementCenter) * speed
 *
 * When the element is above viewport center → ty is positive → inner image shifts
 * down slightly → image appears to lag behind the page scroll = parallax.
 *
 * speed = 0.25: image moves at 75% of scroll speed (25% slower). Subtle and clean.
 *
 * Disabled below 768px for performance and usability.
 */
export function useParallax(speed = 0.25) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ty, setTy] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return // mobile: disable parallax

    const el = containerRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const elemCenter = rect.top + rect.height / 2
      const viewCenter = window.innerHeight / 2
      setTy((viewCenter - elemCenter) * speed)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [speed])

  return { containerRef, ty }
}
