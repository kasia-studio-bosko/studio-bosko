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
  /** Separate image for the /projects index grid (falls back to coverImage) */
  listingImage?: { asset: { _ref: string }; alt?: string }
  /** Separate image for the homepage "Selected Work" carousel (falls back to coverImage) */
  featuredImage?: { asset: { _ref: string }; alt?: string }
  gallery: GalleryImage[]
  /** Short plain-text intro for listings and meta description fallback */
  seoIntro: string
  description: PortableTextContent | null
  metaTitle?: string
  metaDescription?: string
  featured: boolean
  order: number
  colorTheme?: string
  backgroundColor?: string
  textColor?: string
  headingColor?: string
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
 * Builds a GROQ projection for camelCase-suffixed fields (titleEn/titleDe/titlePl).
 * Used by project / legacy pageContent queries.
 */
function localizedField(base: string): string {
  return `"${base}": select(
    $locale == "de" => coalesce(${base}De, ${base}En),
    $locale == "pl" => coalesce(${base}Pl, ${base}En),
    ${base}En
  )`
}

/**
 * Builds a GROQ projection for underscore-suffixed fields (field_en/field_de/field_pl).
 * Used by the new dedicated page singleton schemas.
 */
function localField(base: string): string {
  return `"${base}": select(
    $locale == "de" => coalesce(${base}_de, ${base}_en),
    $locale == "pl" => coalesce(${base}_pl, ${base}_en),
    ${base}_en
  )`
}

const projectListFields = `
  _id,
  slug,
  "location": select(
    $locale == "de" => coalesce(locationDe, location),
    $locale == "pl" => coalesce(locationPl, location),
    location
  ),
  size,
  year,
  category,
  scope,
  photographer,
  pressMentions,
  featured,
  order,
  coverImage,
  listingImage,
  featuredImage,
  colorTheme,
  backgroundColor,
  textColor,
  headingColor,
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

// ─── New Page Content Types ───────────────────────────────────────────────────

export interface SanityImageRef {
  asset: { _ref: string }
  alt?: string
}

export interface HomepageContent {
  heroHeadline?: string
  heroBody?: string
  heroCta?: string
  offeringHeadline?: string
  offeringBody?: string
  offeringCta?: string
  testimonialQuote?: string
  testimonialAuthor?: string
  testimonialImage?: SanityImageRef
  scarcityText?: string
  scarcityCta?: string
  selectedWorkLabel?: string
  seoTitle?: string
  seoDescription?: string
}

export interface StudioPageContent {
  heroHeadline?: string
  aboutHeading?: string
  aboutBody?: PortableTextContent
  ethosBullets?: { text: string }[]
  kasiaPhoto1?: SanityImageRef
  kasiaPhoto2?: SanityImageRef
  studioPhoto1?: SanityImageRef
  studioPhoto2?: SanityImageRef
  testimonialImage?: SanityImageRef
  yellowtraceQuote?: string
  yellowtraceAttribution?: string
  seoTitle?: string
  seoDescription?: string
}

export interface OfferingProjectType {
  title: string
  body: string
}

export interface OfferingPageContent {
  heroHeadline?: string
  offeringBody?: PortableTextContent
  scopeItems?: { label: string }[]
  noItems?: { label: string }[]
  tagline?: string
  projectTypes?: OfferingProjectType[]
  testimonialQuote?: string
  testimonialAuthor?: string
  testimonialImage?: SanityImageRef
  image1?: SanityImageRef
  image2?: SanityImageRef
  image3?: SanityImageRef
  seoTitle?: string
  seoDescription?: string
}

export interface PressPageContent {
  headline?: string
  heroBody?: string
  seoTitle?: string
  seoDescription?: string
}

export interface FormQuestion {
  fieldId: string
  fieldType: 'text' | 'tel' | 'textarea' | 'select'
  label: string
  required: boolean
  options?: { label: string }[]
}

export interface InquirePageContent {
  headline?: string
  subtext?: string
  sideImage?: SanityImageRef
  /** CMS-managed dynamic questions rendered after the fixed contact fields */
  formQuestions?: FormQuestion[]
  /** Override labels for the always-visible contact fields */
  labelFirstName?: string
  labelLastName?: string
  labelEmail?: string
  labelSubmit?: string
  /** @deprecated Legacy — superseded by formQuestions */
  serviceOptions?: { label: string }[]
  /** @deprecated Legacy — superseded by formQuestions */
  budgetOptions?: { label: string }[]
  seoTitle?: string
  seoDescription?: string
}

// ─── New Page Queries ─────────────────────────────────────────────────────────

export const getHomepageContent = cache(async (locale = 'en'): Promise<HomepageContent | null> => {
  return sanityClient.fetch(
    `*[_type == "homepage" && _id == "homepage"][0] {
      ${localField('heroHeadline')},
      ${localField('heroBody')},
      ${localField('heroCta')},
      ${localField('offeringHeadline')},
      ${localField('offeringBody')},
      ${localField('offeringCta')},
      ${localField('testimonialQuote')},
      testimonialAuthor,
      testimonialImage,
      ${localField('scarcityText')},
      ${localField('scarcityCta')},
      ${localField('selectedWorkLabel')},
      ${localField('seoTitle')},
      ${localField('seoDescription')}
    }`,
    { locale }
  )
})

export const getStudioPageContent = cache(async (locale = 'en'): Promise<StudioPageContent | null> => {
  return sanityClient.fetch(
    `*[_type == "studioPage" && _id == "studioPage"][0] {
      ${localField('heroHeadline')},
      ${localField('aboutHeading')},
      "aboutBody": select(
        $locale == "de" => coalesce(aboutBody_de, aboutBody_en),
        $locale == "pl" => coalesce(aboutBody_pl, aboutBody_en),
        aboutBody_en
      ),
      "ethosBullets": ethosBullets[]{
        "text": select(
          $locale == "de" => coalesce(text_de, text_en),
          $locale == "pl" => coalesce(text_pl, text_en),
          text_en
        )
      },
      kasiaPhoto1,
      kasiaPhoto2,
      studioPhoto1,
      studioPhoto2,
      testimonialImage,
      ${localField('yellowtraceQuote')},
      yellowtraceAttribution,
      ${localField('seoTitle')},
      ${localField('seoDescription')}
    }`,
    { locale }
  )
})

export const getOfferingPageContent = cache(async (locale = 'en'): Promise<OfferingPageContent | null> => {
  return sanityClient.fetch(
    `*[_type == "offeringPage" && _id == "offeringPage"][0] {
      ${localField('heroHeadline')},
      "offeringBody": select(
        $locale == "de" => coalesce(offeringBody_de, offeringBody_en),
        $locale == "pl" => coalesce(offeringBody_pl, offeringBody_en),
        offeringBody_en
      ),
      "scopeItems": scopeItems[]{
        "label": select(
          $locale == "de" => coalesce(label_de, label_en),
          $locale == "pl" => coalesce(label_pl, label_en),
          label_en
        )
      },
      "noItems": noItems[]{
        "label": select(
          $locale == "de" => coalesce(label_de, label_en),
          $locale == "pl" => coalesce(label_pl, label_en),
          label_en
        )
      },
      ${localField('tagline')},
      "projectTypes": projectTypes[]{
        "title": select(
          $locale == "de" => coalesce(title_de, title_en),
          $locale == "pl" => coalesce(title_pl, title_en),
          title_en
        ),
        "body": select(
          $locale == "de" => coalesce(body_de, body_en),
          $locale == "pl" => coalesce(body_pl, body_en),
          body_en
        )
      },
      ${localField('testimonialQuote')},
      testimonialAuthor,
      testimonialImage,
      image1,
      image2,
      image3,
      ${localField('seoTitle')},
      ${localField('seoDescription')}
    }`,
    { locale }
  )
})

export const getPressPageContent = cache(async (locale = 'en'): Promise<PressPageContent | null> => {
  return sanityClient.fetch(
    `*[_type == "pressPage" && _id == "pressPage"][0] {
      ${localField('headline')},
      ${localField('heroBody')},
      ${localField('seoTitle')},
      ${localField('seoDescription')}
    }`,
    { locale }
  )
})

export const getInquirePageContent = cache(async (locale = 'en'): Promise<InquirePageContent | null> => {
  return sanityClient.fetch(
    `*[_type == "inquirePage" && _id == "inquirePage"][0] {
      ${localField('headline')},
      ${localField('subtext')},
      sideImage,
      "formQuestions": formQuestions[]{
        fieldId,
        fieldType,
        "label": select(
          $locale == "de" => coalesce(label_de, label_en),
          $locale == "pl" => coalesce(label_pl, label_en),
          label_en
        ),
        required,
        "options": options[]{
          "label": select(
            $locale == "de" => coalesce(label_de, label_en),
            $locale == "pl" => coalesce(label_pl, label_en),
            label_en
          )
        }
      },
      "labelFirstName": select(
        $locale == "de" => coalesce(labelFirstName_de, labelFirstName_en),
        $locale == "pl" => coalesce(labelFirstName_pl, labelFirstName_en),
        labelFirstName_en
      ),
      "labelLastName": select(
        $locale == "de" => coalesce(labelLastName_de, labelLastName_en),
        $locale == "pl" => coalesce(labelLastName_pl, labelLastName_en),
        labelLastName_en
      ),
      "labelEmail": select(
        $locale == "de" => coalesce(labelEmail_de, labelEmail_en),
        $locale == "pl" => coalesce(labelEmail_pl, labelEmail_en),
        labelEmail_en
      ),
      "labelSubmit": select(
        $locale == "de" => coalesce(labelSubmit_de, labelSubmit_en),
        $locale == "pl" => coalesce(labelSubmit_pl, labelSubmit_en),
        labelSubmit_en
      ),
      "serviceOptions": serviceOptions[]{
        "label": select(
          $locale == "de" => coalesce(label_de, label_en),
          $locale == "pl" => coalesce(label_pl, label_en),
          label_en
        )
      },
      "budgetOptions": budgetOptions[]{
        "label": select(
          $locale == "de" => coalesce(label_de, label_en),
          $locale == "pl" => coalesce(label_pl, label_en),
          label_en
        )
      },
      ${localField('seoTitle')},
      ${localField('seoDescription')}
    }`,
    { locale }
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
