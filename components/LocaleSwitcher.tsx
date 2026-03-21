'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from '@/lib/locale-cookie'

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
    // ── Persist explicit user choice in a cookie ─────────────────────────────
    // This overrides Accept-Language detection on future visits.
    document.cookie = [
      `${LOCALE_COOKIE}=${nextLocale}`,
      `path=/`,
      `max-age=${LOCALE_COOKIE_MAX_AGE}`,
      `SameSite=Lax`,
    ].join('; ')

    // ── Navigate to the same page in the new locale ──────────────────────────
    // Strip current non-default locale prefix (/de/… or /pl/…) from pathname
    let basePath = pathname
    for (const loc of routing.locales) {
      if (loc !== routing.defaultLocale && pathname.startsWith(`/${loc}`)) {
        basePath = pathname.slice(`/${loc}`.length) || '/'
        break
      }
    }

    if (nextLocale === routing.defaultLocale) {
      router.push(basePath)
    } else {
      router.push(`/${nextLocale}${basePath}`)
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
                ? 'text-white font-semibold'
                : 'text-white/50 hover:text-white'
            }`}
            aria-label={`Switch to ${loc.toUpperCase()}`}
            aria-current={locale === loc ? 'true' : undefined}
            disabled={locale === loc}
          >
            {localeLabels[loc]}
          </button>
          {i < routing.locales.length - 1 && (
            <span className="text-white/30 text-xs">·</span>
          )}
        </span>
      ))}
    </div>
  )
}
