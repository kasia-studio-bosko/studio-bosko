import { sanityClient } from './client'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  location: string
  year: string
  category: string
  scope: string[]
  photographer: string
  coverImage: { asset: { _ref: string }; alt?: string }
  gallery: Array<{ asset: { _ref: string }; alt?: string; caption?: string }>
  description: string
  shortDescription: string
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

// ─── Queries ─────────────────────────────────────────────────────────────────

const projectFields = `
  _id,
  title,
  slug,
  location,
  year,
  category,
  scope,
  photographer,
  coverImage,
  shortDescription,
  featured,
  order
`

export async function getAllProjects(): Promise<Project[]> {
  return sanityClient.fetch(
    `*[_type == "project"] | order(order asc, year desc) { ${projectFields} }`
  )
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return sanityClient.fetch(
    `*[_type == "project" && featured == true] | order(order asc) [0...6] { ${projectFields} }`
  )
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      ${projectFields},
      description,
      gallery
    }`,
    { slug }
  )
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await sanityClient.fetch(
    `*[_type == "project"] { "slug": slug.current }`
  )
  return projects.map((p: { slug: string }) => p.slug)
}

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

// ─── Static fallback data (used when Sanity has no content yet) ───────────────

export const FALLBACK_PROJECTS: Omit<Project, '_id' | 'slug' | 'gallery' | 'scope' | 'description' | 'featured' | 'order'>[] = [
  {
    title: 'Haus Giebelgarten',
    location: 'Berlin, Germany',
    year: '2024',
    category: 'House',
    photographer: '',
    coverImage: {
      asset: { _ref: '' },
      alt: 'Green tiled bathroom with marble sink in Haus Giebelgarten',
    },
    shortDescription: 'A house renovation in Berlin blending midcentury modern with contemporary comfort.',
  },
  {
    title: 'Apartment Prenzlauer Berg',
    location: 'Berlin, Germany',
    year: '2024',
    category: 'Apartment',
    photographer: '',
    coverImage: {
      asset: { _ref: '' },
      alt: 'Light-filled living room with warm tones',
    },
    shortDescription: 'A Berlin penthouse using colour to create vibrant impact.',
  },
  {
    title: 'Villa Mokotów',
    location: 'Warsaw, Poland',
    year: '2023',
    category: 'House',
    photographer: '',
    coverImage: {
      asset: { _ref: '' },
      alt: 'Elegant Warsaw villa interior',
    },
    shortDescription: 'Full-scope renovation of a Warsaw villa with a considered palette of warm materials.',
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
