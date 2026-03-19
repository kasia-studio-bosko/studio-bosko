'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import LocaleSwitcher from './LocaleSwitcher'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'

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
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
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

  const isActive = (href: string) => {
    const normalizedPathname = pathname.replace(/^\/(de|pl)/, '') || '/'
    return normalizedPathname.startsWith(href) && href !== '/'
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#ede8e2]/95 backdrop-blur-sm shadow-sm' : 'bg-[#ede8e2]'
        }`}
        style={{ height: 'var(--header-height)' }}
      >
        <div className="page-container h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Studio Bosko — home">
            <span className="font-signifier font-light text-lg tracking-tight leading-none">
              Studio Bosko
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
            {navItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className={`nav-link text-sm ${
                  isActive(href) ? 'nav-link-active' : 'text-[#120b09]/80'
                }`}
              >
                {t(key)}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/studio.bosko/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-sm text-[#120b09]/80"
            >
              {t('instagram')}
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Locale switcher */}
            <LocaleSwitcher />

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex flex-col justify-center gap-[6px] w-6 h-6 relative z-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            >
              <span
                className={`block w-full h-px bg-current transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block w-full h-px bg-current transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-full h-px bg-current transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#ede8e2] flex flex-col pt-[var(--header-height)] nav-mobile-overlay"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col page-container py-12 gap-2">
            {navItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className={`font-signifier font-light text-4xl tracking-tight py-3 border-b border-current/10 transition-colors duration-200 ${
                  isActive(href) ? 'text-[#f5500a]' : 'text-[#120b09]'
                }`}
              >
                {t(key)}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/studio.bosko/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-signifier font-light text-4xl tracking-tight py-3 border-b border-current/10 text-[#120b09] transition-colors duration-200 hover:text-[#f5500a]"
            >
              {t('instagram')}
            </a>
          </nav>
        </div>
      )}
    </>
  )
}
