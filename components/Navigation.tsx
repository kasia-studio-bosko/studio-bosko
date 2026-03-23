'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import LocaleSwitcher from './LocaleSwitcher'
import { Link } from '@/i18n/navigation'

const navItems = [
  { key: 'projects', href: '/projects' as const },
  { key: 'studio', href: '/studio' as const },
  { key: 'offering', href: '/offering' as const },
  { key: 'press', href: '/press' as const },
  { key: 'inquire', href: '/inquire' as const },
] as const

export default function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  // null = use default white; string = colour from project theme provider
  const [navLinkColor, setNavLinkColor] = useState<string | null>(null)

  const readNavColor = useCallback(() => {
    const v = document.documentElement.style.getPropertyValue('--nav-link-color').trim()
    setNavLinkColor(v || null)
  }, [])

  useEffect(() => {
    // Read on mount and on every route change (theme provider may have updated it)
    readNavColor()
    window.addEventListener('nav-theme-change', readNavColor)
    return () => window.removeEventListener('nav-theme-change', readNavColor)
  }, [readNavColor])

  useEffect(() => {
    setMenuOpen(false)
    // Re-read theme colour when pathname changes (new page may not have a theme)
    readNavColor()
  }, [pathname, readNavColor])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        style={{ height: 'var(--header-height)' }}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 h-full flex items-center justify-between">
          {/* Left: nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-7 w-[35%]" aria-label="Primary navigation">
            {navItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="text-[15px] font-cadiz transition-colors duration-200"
                style={{ color: navLinkColor ?? 'rgba(255,255,255,0.9)' }}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Center: logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" aria-label="Studio Bosko — home">
              <Image
                src="/logo.svg"
                alt="Studio Bosko"
                width={192}
                height={26}
                className="h-[26px] w-auto transition-[filter] duration-200"
                style={navLinkColor && navLinkColor !== '#ffffff' && navLinkColor !== 'rgba(255,255,255,0.9)' ? { filter: 'invert(1)' } : undefined}
                priority
              />
            </Link>
          </div>

          {/* Right: locale switcher + mobile hamburger */}
          <div className="flex items-center gap-4 w-auto md:w-[35%] justify-end">
            <LocaleSwitcher />

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex flex-col justify-center gap-[6px] w-6 h-6 relative z-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            >
              {[
                menuOpen ? 'rotate-45 translate-y-[7px]' : '',
                menuOpen ? 'opacity-0' : '',
                menuOpen ? '-rotate-45 -translate-y-[7px]' : '',
              ].map((extra, i) => (
                <span
                  key={i}
                  className={`block w-full h-px transition-all duration-300 ${extra}`}
                  style={{ backgroundColor: navLinkColor ?? '#ffffff' }}
                />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#2d1d17] flex flex-col pt-[var(--header-height)] nav-mobile-overlay"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col px-8 py-12 gap-2">
            {navItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="font-signifier font-light text-4xl tracking-tight py-3 border-b border-white/10 text-[#60bf83] transition-colors duration-200 hover:text-white"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
