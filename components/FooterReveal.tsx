'use client'

/**
 * FooterReveal
 *
 * Wraps the main content so it sits above the fixed footer (z-index 10 > 0).
 * Measures the footer height on mount + resize and applies equivalent
 * padding-bottom so no content is ever hidden behind the fixed footer.
 * When the user scrolls to the very bottom, the transparent padding area
 * reveals the footer behind it — creating the "footer sticks at bottom" effect.
 */
import { useEffect, useRef, type ReactNode } from 'react'

export default function FooterReveal({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footer = document.querySelector(
      '[data-footer-fixed]'
    ) as HTMLElement | null
    if (!footer || !wrapperRef.current) return

    const sync = () => {
      if (wrapperRef.current) {
        wrapperRef.current.style.paddingBottom = `${footer.offsetHeight}px`
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
    // position:relative + z-index:10 ensures this wrapper paints above
    // the fixed footer (z-index:0), hiding the footer until the user
    // scrolls to the bottom.
    <div
      ref={wrapperRef}
      className="relative bg-[#d4cbc0]"
      style={{ zIndex: 10, isolation: 'isolate' }}
    >
      {children}
    </div>
  )
}
