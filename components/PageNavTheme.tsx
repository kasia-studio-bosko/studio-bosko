'use client'

import { useEffect } from 'react'

/**
 * Drop this into any non-project page that needs a specific nav colour.
 * It sets the same CSS custom properties that ProjectThemeProvider uses,
 * so Navigation picks them up automatically.
 *
 * Usage:
 *   <PageNavTheme color="#ffffff" />                        — links + logo both white
 *   <PageNavTheme color="#ffffff" logoColor="#60bf83" />    — white links, mint logo
 */
export default function PageNavTheme({
  color,
  logoColor,
}: {
  color: string
  /** Optional override for the logo fill — defaults to `color` when omitted. */
  logoColor?: string
}) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--nav-link-color', color)
    if (logoColor) root.style.setProperty('--nav-logo-color', logoColor)
    window.dispatchEvent(new CustomEvent('nav-theme-change'))
    return () => {
      root.style.removeProperty('--nav-link-color')
      root.style.removeProperty('--nav-logo-color')
      window.dispatchEvent(new CustomEvent('nav-theme-change'))
    }
  }, [color, logoColor])

  return null
}
