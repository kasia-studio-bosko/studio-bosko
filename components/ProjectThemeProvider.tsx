'use client'

import { useEffect } from 'react'

interface ProjectThemeProviderProps {
  backgroundColor: string
  textColor: string
  headingColor: string
  /** Nav link colour — white for dark pages, black for light pages */
  navColor: string
}

/**
 * Sets CSS custom properties on <html> for the project page theme.
 * Cleans up on unmount so other pages are unaffected.
 */
export default function ProjectThemeProvider({
  backgroundColor,
  textColor,
  headingColor,
  navColor,
}: ProjectThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--page-bg', backgroundColor)
    root.style.setProperty('--page-text', textColor)
    root.style.setProperty('--page-heading', headingColor)
    root.style.setProperty('--nav-link-color', navColor)
    // Notify Navigation that the theme changed
    window.dispatchEvent(new CustomEvent('nav-theme-change', { detail: { navColor } }))

    return () => {
      root.style.removeProperty('--page-bg')
      root.style.removeProperty('--page-text')
      root.style.removeProperty('--page-heading')
      root.style.removeProperty('--nav-link-color')
      window.dispatchEvent(new CustomEvent('nav-theme-change', { detail: { navColor: null } }))
    }
  }, [backgroundColor, textColor, headingColor, navColor])

  return null
}
