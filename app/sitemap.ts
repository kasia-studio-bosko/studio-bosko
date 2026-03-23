import type { MetadataRoute } from 'next'
import { getAllProjectSlugs } from '@/lib/sanity/queries'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

// Translated static paths per locale (matches i18n/routing.ts)
const STATIC_PAGES: Array<{ en: string; de: string; pl: string; freq: ChangeFrequency; priority: number }> = [
  { en: '/',          de: '/de/',           pl: '/pl/',           freq: 'weekly',  priority: 1.0 },
  { en: '/studio',    de: '/de/studio',     pl: '/pl/studio',     freq: 'monthly', priority: 0.8 },
  { en: '/offering',  de: '/de/leistungen', pl: '/pl/oferta',     freq: 'monthly', priority: 0.8 },
  { en: '/projects',  de: '/de/projekte',   pl: '/pl/projekty',   freq: 'monthly', priority: 0.8 },
  { en: '/press',     de: '/de/presse',     pl: '/pl/prasa',      freq: 'monthly', priority: 0.7 },
  { en: '/inquire',   de: '/de/anfrage',    pl: '/pl/zapytanie',  freq: 'monthly', priority: 0.7 },
]

function buildEntry(
  url: string,
  altEn: string,
  altDe: string,
  altPl: string,
  freq: ChangeFrequency,
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
    alternates: {
      languages: {
        'x-default': `${BASE}${altEn}`,
        en: `${BASE}${altEn}`,
        de: `${BASE}${altDe}`,
        pl: `${BASE}${altPl}`,
      } as Record<string, string>,
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // ── Static pages — one entry per locale ──────────────────────────────────
  for (const page of STATIC_PAGES) {
    const alts = { en: page.en, de: page.de, pl: page.pl }
    // English (canonical)
    entries.push(buildEntry(`${BASE}${page.en}`, alts.en, alts.de, alts.pl, page.freq, page.priority))
    // German
    entries.push(buildEntry(`${BASE}${page.de}`, alts.en, alts.de, alts.pl, page.freq, page.priority))
    // Polish
    entries.push(buildEntry(`${BASE}${page.pl}`, alts.en, alts.de, alts.pl, page.freq, page.priority))
  }

  // ── Project pages — one entry per slug × locale ───────────────────────────
  let slugs: string[] = []
  try {
    slugs = await getAllProjectSlugs()
  } catch {
    slugs = ['chroma-penthouse', 'zander-rooftop', 'casa-norte', 'time-travel',
             'haus-giebelgarten', 'westend-rose', 'wilhelm-lane', 'side-to-side', 'ballet-school']
  }

  for (const slug of slugs) {
    const enPath = `/project/${slug}`
    const dePath = `/de/projekt/${slug}`
    const plPath = `/pl/projekt/${slug}`
    entries.push(buildEntry(`${BASE}${enPath}`, enPath, dePath, plPath, 'monthly', 0.7))
    entries.push(buildEntry(`${BASE}${dePath}`, enPath, dePath, plPath, 'monthly', 0.7))
    entries.push(buildEntry(`${BASE}${plPath}`, enPath, dePath, plPath, 'monthly', 0.7))
  }

  return entries
}
