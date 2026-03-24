'use client'

/**
 * FooterReveal
 *
 * Two-element approach for the fixed-footer parallax reveal:
 *
 *   1. Opaque content wrapper  (z-index 10, bg #d4cbc0)
 *      Sits above the fixed footer while the user scrolls through content,
 *      hiding the footer until it should be revealed.
 *
 *   2. Transparent spacer      (z-index 5, no background)
 *      Matches the fixed footer's height exactly.
 *      Being transparent, the footer shows through it — revealing the footer
 *      once the user scrolls past the end of the page content.
 *
 * Without this split, a single div with both a background AND padding-bottom
 * would paint over the footer even at the very bottom of the page.
 */
import { useEffect, useRef, type ReactNode } from 'react'

export default function FooterReveal({ children }: { children: ReactNode }) {
  const spacerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footer = document.querySelector(
      '[data-footer-fixed]'
    ) as HTMLElement | null

    if (!footer || !spacerRef.current) return

    const sync = () => {
      if (spacerRef.current) {
        spacerRef.current.style.height = `${footer.offsetHeight}px`
      }
    }

    sync()

    const ro = new ResizeObserver(sync)
    ro.observe(footer)
    window.addEventListener('resize', sync)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [])

  return (
    <>
      {/* ── Opaque wrapper — hides the fixed footer while scrolling ── */}
      <div
        className="relative bg-[#d4cbc0]"
        style={{ zIndex: 10, isolation: 'isolate' }}
      >
        {children}
      </div>

      {/* ── Transparent spacer — lets the fixed footer show through ── */}
      {/* pointer-events: none so clicks pass through to the footer links below */}
      <div ref={spacerRef} style={{ position: 'relative', zIndex: 5, pointerEvents: 'none' }} />
    </>
  )
}
