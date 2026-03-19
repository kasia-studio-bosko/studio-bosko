'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { routing } from '@/i18n/routing'

const localeLabels: Record<string, string> = {
  en: 'EN',
  de: 'DE',
  pl: 'PL',
}

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (nextLocale: string) => {
    // Strip current locale prefix from pathname
    let newPath = pathname
    for (const loc of routing.locales) {
      if (loc !== routing.defaultLocale && pathname.startsWith(`/${loc}`)) {
        newPath = pathname.slice(`/${loc}`.length) || '/'
        break
      }
    }
    // Navigate to new locale
    if (nextLocale === routing.defaultLocale) {
      router.push(newPath)
    } else {
      router.push(`/${nextLocale}${newPath}`)
    }
  }

  return (
    <div className="flex items-center gap-1" role="navigation" aria-label="Language switcher">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          <button
            onClick={() => handleChange(loc)}
            className={`text-xs font-cadiz tracking-widest uppercase transition-colors duration-200 px-1 py-0.5 ${
              locale === loc
                ? 'text-[#120b09] font-semibold'
                : 'text-[#120b09]/50 hover:text-[#120b09]'
            }`}
            aria-label={`Switch to ${loc.toUpperCase()}`}
            aria-current={locale === loc ? 'true' : undefined}
            disabled={locale === loc}
          >
            {localeLabels[loc]}
          </button>
          {i < routing.locales.length - 1 && (
            <span className="text-[#120b09]/30 text-xs">·</span>
          )}
        </span>
      ))}
    </div>
  )
}
