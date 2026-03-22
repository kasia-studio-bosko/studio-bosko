import { cache } from 'react'
import { sanityClient } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

// Portable Text block shape — _type is required by next-sanity's PortableText component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextContent = ({ _type: string } & Record<string, any>)[]

export interface GalleryImage {
  asset: { _ref: string }
  alt?: string
  caption?: string
  /** Natural width from Sanity image metadata */
  width?: number
  /** Natural height from Sanity image metadata */
  height?: number
  /** Pre-computed aspect ratio (width / height) from Sanity */
  aspectRatio?: number
}

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
  gallery: GalleryImage[]
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
  /** Locale-specific issue label, e.g. "AD Spain / January 2026" */
  issue: { en?: string; de?: string; pl?: string }
  date?: string
  externalUrl?: string
  coverImage?: { asset: { _ref: string }; alt?: string }
  featured: boolean
  order?: number
}

export interface ProjectsPageSeo {
  seoTitle?: string
  seoDescription?: string
}

export interface ImpressumContent {
  body?: PortableTextContent
  seoTitle?: string
  seoDescription?: string
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
  scope,
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
  "gallery": gallery[] {
    alt,
    caption,
    asset,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  },
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

/** Fetch all press items ordered by display order then date. */
export const getAllPressItems = cache(async (): Promise<PressItem[]> => {
  return sanityClient.fetch(
    `*[_type == "press"] | order(coalesce(order, 999) asc, date desc) {
      _id,
      publication,
      issue,
      date,
      externalUrl,
      coverImage,
      featured,
      order
    }`
  )
})

/** Fetch SEO metadata for the /projects index page. */
export const getProjectsPageSeo = cache(async (locale = 'en'): Promise<ProjectsPageSeo | null> => {
  return sanityClient.fetch(
    `*[_type == "projectsPage"][0] {
      "seoTitle": select(
        $locale == "de" => seoTitleDe,
        $locale == "pl" => seoTitlePl,
        seoTitleEn
      ),
      "seoDescription": select(
        $locale == "de" => seoDescriptionDe,
        $locale == "pl" => seoDescriptionPl,
        seoDescriptionEn
      )
    }`,
    { locale }
  )
})

/** Fetch the Impressum page content for a given locale. */
export const getImpressumContent = cache(async (locale = 'en'): Promise<ImpressumContent | null> => {
  return sanityClient.fetch(
    `*[_type == "impressum"][0] {
      "body": select(
        $locale == "de" => bodyDe,
        $locale == "pl" => bodyPl,
        bodyEn
      ),
      "seoTitle": select(
        $locale == "de" => seoTitleDe,
        $locale == "pl" => seoTitlePl,
        seoTitleEn
      ),
      "seoDescription": select(
        $locale == "de" => seoDescriptionDe,
        $locale == "pl" => seoDescriptionPl,
        seoDescriptionEn
      )
    }`,
    { locale }
  )
})

// ─── Page Content Queries ─────────────────────────────────────────────────────

/**
 * Fetch a single pageContent document by pageId and locale.
 * Wrapped in React `cache` so multiple calls with the same args
 * (e.g. from generateMetadata + the page component) share one fetch.
 */
export const getPageContent = cache(async (pageId: string, locale = 'en'): Promise<PageContent | null> => {
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
})

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
  { publication: 'Architectural Digest', issue: { en: 'AD100 2025' },           date: '2025-04-01', featured: true  },
  { publication: 'Domino',               issue: { en: 'Home Front (Fall 2025)' }, date: '2025-09-01', featured: true  },
  { publication: 'AD Spain',             issue: { en: 'January 2026' },          date: '2026-01-01', featured: true  },
  { publication: 'VOGUE Poland',         issue: { en: 'October 2025' },          date: '2025-10-01', featured: false },
  { publication: 'AD Germany',           issue: { en: 'March 2025' },            date: '2025-03-01', featured: false },
  { publication: 'est living',           issue: { en: 'April 2025' },            date: '2025-04-01', featured: false },
  { publication: 'BauNetz',             issue: { en: 'January 2025' },          date: '2025-01-01', featured: false },
  { publication: 'ELLE Indonesia',       issue: { en: 'November 2024' },         date: '2024-11-01', featured: false },
]
