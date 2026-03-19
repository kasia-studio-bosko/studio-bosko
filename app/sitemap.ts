import type { MetadataRoute } from 'next'
import { getAllProjectSlugs } from '@/lib/sanity/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

const STATIC_ROUTES = [
  '',          // homepage
  '/studio',
  '/offering',
  '/projects',
  '/press',
  '/inquire',
]

const LOCALES = ['en', 'de', 'pl'] as const

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

function buildAlternates(path: string) {
  return {
    languages: {
      'x-default': `${BASE_URL}${path}`,
      en: `${BASE_URL}${path}`,
      de: `${BASE_URL}/de${path}`,
      pl: `${BASE_URL}/pl${path}`,
    } as Record<string, string>,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  for (const route of STATIC_ROUTES) {
    // English (default, no prefix)
    entries.push({
      url: `${BASE_URL}${route || '/'}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : 'monthly' as ChangeFrequency,
      priority: route === '' ? 1 : 0.8,
      alternates: buildAlternates(route),
    })
  }

  // Project pages
  let slugs: string[] = []
  try {
    slugs = await getAllProjectSlugs()
  } catch {
    slugs = ['haus-giebelgarten', 'apartment-prenzlauer-berg', 'villa-mokotow']
  }

  for (const slug of slugs) {
    entries.push({
      url: `${BASE_URL}/project/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
      alternates: buildAlternates(`/project/${slug}`),
    })
  }

  return entries
}
