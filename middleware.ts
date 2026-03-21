import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { LOCALE_COOKIE } from './lib/locale-cookie'

// ── next-intl middleware (locale detection disabled — we handle it ourselves) ──
const intlMiddleware = createMiddleware(routing)

/**
 * Parse Accept-Language header and return 'de' | 'pl' | 'en'.
 * Only German and Polish trigger a non-EN redirect; everything else → 'en'.
 */
function detectFromAcceptLanguage(req: NextRequest): 'de' | 'pl' | 'en' {
  const header = req.headers.get('accept-language') ?? ''
  for (const segment of header.split(',')) {
    const tag = segment.split(';')[0].trim().toLowerCase()
    if (tag.startsWith('de')) return 'de'
    if (tag.startsWith('pl')) return 'pl'
  }
  return 'en'
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Auto-detect only on the root path `/` ─────────────────────────────────
  // Any path that already carries a locale prefix (/de/… or /pl/…) is left
  // untouched — the user is already on the right locale URL.
  if (pathname === '/') {
    const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value

    // Explicit cookie preference wins over browser default
    const resolved: string =
      cookieLocale && (routing.locales as readonly string[]).includes(cookieLocale)
        ? cookieLocale
        : detectFromAcceptLanguage(req)

    // Only redirect if the resolved locale is non-default (de or pl)
    if (resolved === 'de' || resolved === 'pl') {
      const target = req.nextUrl.clone()
      target.pathname = `/${resolved}`
      return NextResponse.redirect(target)
    }
  }

  // ── All other paths → standard next-intl routing ──────────────────────────
  return intlMiddleware(req)
}

export const config = {
  // Match all pathnames except:
  // - /api, /_next, /_vercel  (Next.js internals)
  // - /cms                     (embedded Sanity Studio — no locale needed)
  // - files with an extension  (static assets)
  matcher: [
    '/((?!api|_next|_vercel|cms|.*\\..*).*)' ,
  ],
}
