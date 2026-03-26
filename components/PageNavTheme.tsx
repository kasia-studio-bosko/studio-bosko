'use client'

import { useEffect } from 'react'

/**
 * Drop this into any non-project page that needs a specific nav colour.
 * It sets the same CSS custom property that ProjectThemeProvider uses,
 * so Navigation picks it up automatically.
 *
 * Usage: <PageNavTheme color="#2d1d17" />
 */
export default function PageNavTheme({ color }: { color: string }) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--nav-link-color', color)
    window.dispatchEvent(new CustomEvent('nav-theme-change'))
    return () => {
      root.style.removeProperty('--nav-link-color')
      window.dispatchEvent(new CustomEvent('nav-theme-change'))
    }
  }, [color])

  return null
}
