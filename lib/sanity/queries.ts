import { sanityClient } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

// Portable Text block shape (simplified — avoids hard dep on @portabletext/types)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextContent = Record<string, any>[]

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  location: string
  size?: number
  year: string
  category: string
  scope: string[]
  photographer: string
  pressMentions?: string[]
  coverImage: { asset: { _ref: string }; alt?: string }
  gallery: Array<{ asset: { _ref: string }; alt?: string; caption?: string }>
  /** Short plain-text intro for listings and meta description fallback */
  seoIntro: string
  description: PortableTextContent | null
  metaTitle?: string
  metaDescription?: string
  featured: boolean
  order: number
}

export interface PressItem {
  _id: string
  publication: string
  headline: string
  date: string
  url?: string
  logo?: { asset: { _ref: string } }
  coverImage?: { asset: { _ref: string }; alt?: string }
  featured: boolean
}

export interface PageContent {
  pageId: string
  heading?: string
  subheading?: string
  body?: PortableTextContent
  seoTitle?: string
  seoDescription?: string
}

// ─── GROQ Helpers ─────────────────────────────────────────────────────────────

/**
 * Builds a GROQ projection that returns the locale-appropriate value,
 * falling back to English if the requested locale field is empty.
 *
 * e.g. localizedField('title') produces:
 *   "title": select($locale == "de" => coalesce(titleDe, titleEn), $locale == "pl" => coalesce(titlePl, titleEn), titleEn)
 */
function localizedField(base: string): string {
  return `"${base}": select(
    $locale == "de" => coalesce(${base}De, ${base}En),
    $locale == "pl" => coalesce(${base}Pl, ${base}En),
    ${base}En
  )`
}

const projectListFields = `
  _id,
  slug,
  location,
  size,
  year,
  category,
  photographer,
  pressMentions,
  featured,
  order,
  coverImage,
  ${localizedField('title')},
  ${localizedField('seoIntro')}
`

const projectFullFields = `
  ${projectListFields},
  gallery,
  ${localizedField('description')},
  ${localizedField('metaTitle')},
  ${localizedField('metaDescription')}
`

// ─── Project Queries ──────────────────────────────────────────────────────────

export async function getAllProjects(locale = 'en'): Promise<Project[]> {
  return sanityClient.fetch(
    `*[_type == "project"] | order(order asc, year desc) { ${projectListFields} }`,
    { locale }
  )
}

export async function getFeaturedProjects(locale = 'en'): Promise<Project[]> {
  return sanityClient.fetch(
    `*[_type == "project" && featured == true] | order(order asc) [0...6] { ${projectListFields} }`,
    { locale }
  )
}

export async function getProjectBySlug(slug: string, locale = 'en'): Promise<Project | null> {
  return sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug][0] { ${projectFullFields} }`,
    { slug, locale }
  )
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await sanityClient.fetch(
    `*[_type == "project"] { "slug": slug.current }`
  )
  return projects.map((p: { slug: string }) => p.slug)
}

// ─── Press Queries ────────────────────────────────────────────────────────────

export async function getFeaturedPressItems(): Promise<PressItem[]> {
  return sanityClient.fetch(
    `*[_type == "pressItem"] | order(date desc) [0...12] {
      _id,
      publication,
      headline,
      date,
      url,
      logo,
      coverImage,
      featured
    }`
  )
}

// ─── Page Content Queries ─────────────────────────────────────────────────────

export async function getPageContent(pageId: string, locale = 'en'): Promise<PageContent | null> {
  return sanityClient.fetch(
    `*[_type == "pageContent" && pageId == $pageId][0] {
      pageId,
      ${localizedField('heading')},
      ${localizedField('subheading')},
      ${localizedField('body')},
      ${localizedField('seoTitle')},
      ${localizedField('seoDescription')}
    }`,
    { pageId, locale }
  )
}

// ─── Static fallback data ─────────────────────────────────────────────────────
// Used for local dev when Sanity has no content yet, and as seed-script reference.

export const FALLBACK_PROJECTS: Array<
  Omit<Project, '_id' | 'gallery' | 'description' | 'featured' | 'order' | 'pressMentions' | 'metaTitle' | 'metaDescription'> & {
    slug: { current: string }
  }
> = [
  {
    title: 'Chroma Penthouse',
    slug: { current: 'chroma-penthouse' },
    location: 'Berlin Kreuzberg',
    size: 143,
    year: '2024',
    category: 'Apartment',
    scope: ['Interior Design', 'Curation'],
    photographer: 'Giulia Maretti Studio',
    coverImage: {
      asset: { _ref: '' },
      alt: 'Vibrant living room in a Berlin penthouse — Chroma Penthouse',
    },
    seoIntro: 'A full-scope interior design and curation project for a newly built 143 m² penthouse in Berlin Kreuzberg — bold colour, bespoke joinery, and considered curation.',
  },
  {
    title: 'Zander Rooftop',
    slug: { current: 'zander-rooftop' },
    location: 'Berlin Kreuzberg',
    size: 170,
    year: '2023',
    category: 'Apartment',
    scope: ['Complex Renovation', 'Curation'],
    photographer: 'ONI Studio',
    coverImage: {
      asset: { _ref: '' },
      alt: 'Red kitchen island in bespoke kitchen — Zander Rooftop, Berlin',
    },
    seoIntro: 'A complex full renovation and interior design project for a 170 m² rooftop apartment in Berlin, on the border of Mitte and Kreuzberg.',
  },
  {
    title: 'Casa Norte',
    slug: { current: 'casa-norte' },
    location: 'Szczecin, Poland',
    size: 90,
    year: '2024',
    category: 'Apartment',
    scope: ['Interior Design', 'Curation'],
    photographer: 'Giulia Maretti Studio',
    coverImage: {
      asset: { _ref: '' },
      alt: 'Earthy tones and tactile wood in Casa Norte, Szczecin',
    },
    seoIntro: 'A full-scope interior design and curation of a high-end new-build 90 m² apartment in Szczecin, Poland — tactile richness with a quietly dramatic palette.',
  },
  {
    title: 'Time Travel',
    slug: { current: 'time-travel' },
    location: 'Berlin Neukölln',
    size: 95,
    year: '2022',
    category: 'Apartment',
    scope: ['Complex Renovation', 'Curation'],
    photographer: 'Giulia Maretti Studio',
    coverImage: {
      asset: { _ref: '' },
      alt: 'Colour-drenched hallway corridor with Victorian floor tiles — Time Travel, Berlin',
    },
    seoIntro: 'An unconventional bachelor pad in Berlin Neukölln rooted in Jugendstil and filled with European history — 95 m² of complex renovation and eclectic curation.',
  },
]

export const FALLBACK_PRESS: Omit<PressItem, '_id'>[] = [
  { publication: 'Architectural Digest', headline: 'AD100 2025', date: '2025-04-01', featured: true },
  { publication: 'Domino', headline: 'Home Front (Fall 2025)', date: '2025-09-01', featured: true },
  { publication: 'AD Spain', headline: 'January 2026', date: '2026-01-01', featured: true },
  { publication: 'VOGUE Poland', headline: 'October 2025', date: '2025-10-01', featured: false },
  { publication: 'AD Germany', headline: 'March 2025', date: '2025-03-01', featured: false },
  { publication: 'est living', headline: 'April 2025', date: '2025-04-01', featured: false },
  { publication: 'BauNetz', headline: 'January 2025', date: '2025-01-01', featured: false },
  { publication: 'ELLE Indonesia', headline: 'November 2024', date: '2024-11-01', featured: false },
]
