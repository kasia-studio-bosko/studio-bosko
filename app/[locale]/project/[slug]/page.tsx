import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import {
  getProjectBySlug,
  getAllProjectSlugs,
  type PortableTextContent,
  type GalleryImage,
} from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import ProjectThemeProvider from '@/components/ProjectThemeProvider'

// ─── Theme palettes (mirrors seed-project-themes.mjs) ────────────────────────

const THEME_PALETTES: Record<string, { bg: string; text: string; heading: string; nav: string }> = {
  'warm-light':     { bg: '#705305', text: '#ffffff', heading: '#e1cd3c', nav: '#ffffff' },
  'dark-moody':     { bg: '#2d1d17', text: '#ffffff', heading: '#60bf83', nav: '#ffffff' },
  'earthy-neutral': { bg: '#60bf83', text: '#000000', heading: '#2d1d17', nav: '#000000' },
  'cool-minimal':   { bg: '#d4cbc0', text: '#705305', heading: '#705305', nav: '#000000' },
}

function resolveTheme(project: { colorTheme?: string; backgroundColor?: string; textColor?: string; headingColor?: string }) {
  const preset = project.colorTheme ? THEME_PALETTES[project.colorTheme] : null
  return {
    bg:      project.backgroundColor ?? preset?.bg ?? '#ede8e2',
    text:    project.textColor       ?? preset?.text ?? '#2d1d17',
    heading: project.headingColor    ?? preset?.heading ?? '#2d1d17',
    nav:     preset?.nav ?? '#ffffff',
  }
}

// ─── Fallback for local dev when Sanity is empty ─────────────────────────────
const FALLBACK_PROJECT = {
  _id: 'fallback',
  title: 'Chroma Penthouse',
  slug: { current: 'chroma-penthouse' },
  location: 'Berlin Kreuzberg',
  size: 143,
  year: '2024',
  category: 'Apartment',
  scope: ['Interior Design', 'Curation'],
  photographer: 'Giulia Maretti Studio',
  pressMentions: [] as string[],
  colorTheme: 'warm-light' as string | undefined,
  backgroundColor: undefined as string | undefined,
  textColor: undefined as string | undefined,
  headingColor: undefined as string | undefined,
  seoIntro:
    'A colour-forward penthouse in Berlin Kreuzberg — 143 m² of layered character, custom furniture, and considered curation.',
  description: null as PortableTextContent | null,
  descriptionFallback:
    'Chroma Penthouse is a full interior design and curation project for a 143 m² penthouse in Berlin Kreuzberg.\n\nThe brief centred on colour — using it boldly to create distinct moods across the apartment while maintaining a coherent whole. Each room takes its cue from a different part of the client\'s life: the kitchen from markets in Morocco, the living room from a favourite painting, the bedroom from quiet mornings in the countryside.',
  coverImage: {
    asset: { _ref: '' },
    alt: 'Chroma Penthouse — a bold, colour-layered penthouse in Berlin Kreuzberg',
  },
  gallery: [] as GalleryImage[],
  featured: true,
  order: 1,
  metaTitle: undefined as string | undefined,
  metaDescription: undefined as string | undefined,
}

type Props = { params: { locale: string; slug: string } }

// ─── Smart gallery row algorithm ─────────────────────────────────────────────

type GalleryRow =
  | { type: 'full'; image: GalleryImage }
  | { type: 'pair'; images: [GalleryImage, GalleryImage] }

function imgRatio(img: GalleryImage): number {
  if (img.aspectRatio) return img.aspectRatio
  if (img.width && img.height) return img.width / img.height
  return 1.5 // landscape default
}

/**
 * Groups gallery images into editorial rows:
 * - First image always full-width hero
 * - Two consecutive portraits (ratio < 0.85) → side-by-side pair
 * - Two consecutive landscapes (ratio > 1.3) → side-by-side pair
 * - All other images → full-width
 */
function buildRows(images: GalleryImage[]): GalleryRow[] {
  if (!images.length) return []

  const rows: GalleryRow[] = [{ type: 'full', image: images[0] }]
  let i = 1

  while (i < images.length) {
    const cur = images[i]
    const curR = imgRatio(cur)
    const isPortrait = curR < 0.85
    const isLandscape = curR > 1.3

    const next = images[i + 1]
    if (next) {
      const nextR = imgRatio(next)
      const nextIsPortrait = nextR < 0.85
      const nextIsLandscape = nextR > 1.3

      if ((isPortrait && nextIsPortrait) || (isLandscape && nextIsLandscape)) {
        rows.push({ type: 'pair', images: [cur, next] })
        i += 2
        continue
      }
    }

    rows.push({ type: 'full', image: cur })
    i += 1
  }

  return rows
}

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const slugs = await getAllProjectSlugs()
    const locales = ['en', 'de', 'pl']
    return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
  } catch {
    return [
      { locale: 'en', slug: 'chroma-penthouse' },
      { locale: 'de', slug: 'chroma-penthouse' },
      { locale: 'pl', slug: 'chroma-penthouse' },
    ]
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  let project = null
  try { project = await getProjectBySlug(slug, locale) } catch {}

  const title = project?.metaTitle ?? project?.title ?? FALLBACK_PROJECT.title
  const description =
    project?.metaDescription ?? project?.seoIntro ?? FALLBACK_PROJECT.seoIntro
  const ogImage = project?.coverImage?.asset?._ref
    ? urlFor(project.coverImage).width(1200).height(630).fit('crop').url()
    : `${siteUrl}/og-image.jpg`

  const slugPrefixMap: Record<string, string> = { en: 'project', de: 'projekt', pl: 'projekt' }
  const canonical =
    locale === 'en'
      ? `${siteUrl}/project/${slug}`
      : `${siteUrl}/${locale}/${slugPrefixMap[locale]}/${slug}`

  return {
    title: { absolute: `${title} — Interior Design Project | Studio Bosko` },
    description,
    alternates: {
      canonical,
      languages: {
        'x-default': `${siteUrl}/project/${slug}`,
        en: `${siteUrl}/project/${slug}`,
        de: `${siteUrl}/de/projekt/${slug}`,
        pl: `${siteUrl}/pl/projekt/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | Studio Bosko`,
      description,
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'project' })

  let project = null
  try { project = await getProjectBySlug(slug, locale) } catch {}

  const data = project ?? (slug === 'chroma-penthouse' ? FALLBACK_PROJECT : null)
  if (!data) notFound()

  const theme = resolveTheme(data)

  const heroSrc = data.coverImage?.asset?._ref
    ? urlFor(data.coverImage).width(1920).height(1080).url()
    : 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.title,
    description: data.seoIntro,
    creator: { '@type': 'Organization', name: 'Studio Bosko', url: siteUrl },
    locationCreated: { '@type': 'Place', name: data.location },
    dateCreated: data.year,
    image: heroSrc,
  }

  const description = data.description
  const descriptionFallback =
    'descriptionFallback' in data ? (data as typeof FALLBACK_PROJECT).descriptionFallback : null

  // Build metadata one-liner: "Apartment · Berlin Kreuzberg · 143 m²"
  const metaLine = [
    data.category,
    data.location,
    data.size ? `${data.size} m²` : null,
    data.year,
  ]
    .filter(Boolean)
    .join(' · ')

  const galleryRows = buildRows(data.gallery ?? [])

  return (
    <>
      <ProjectThemeProvider
        backgroundColor={theme.bg}
        textColor={theme.text}
        headingColor={theme.heading}
        navColor={theme.nav}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />

      {/* ── Full-bleed cover image ────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: 'min(85vh, 900px)', backgroundColor: theme.bg }}
        aria-label="Project hero"
      >
        <Image
          src={heroSrc}
          alt={data.coverImage?.alt ?? data.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={90}
        />
      </section>

      {/* ── Project header ────────────────────────────────────────────────── */}
      <section
        className="section-spacing"
        style={{ backgroundColor: theme.bg }}
        aria-label="Project details"
      >
        <div className="page-container">

          {/* Back link */}
          <ScrollReveal>
            <Link
              href={{ pathname: '/projects' }}
              className="btn-text text-xs mb-10 block"
              style={{ color: theme.text, opacity: 0.6 }}
            >
              ← {t('backToProjects')}
            </Link>
          </ScrollReveal>

          {/* Title + meta + description in a single left-aligned column */}
          <div className="max-w-[760px]">

            <ScrollReveal delay={80}>
              <h1
                className="font-signifier font-light text-balance mb-5"
                style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: 1.12, letterSpacing: '-0.4px', color: theme.heading }}
              >
                {data.title}
              </h1>
            </ScrollReveal>

            {/* Metadata: Category · Location · Size · Year */}
            <ScrollReveal delay={130}>
              <p
                className="font-cadiz text-xs tracking-[0.12em] uppercase mb-10"
                style={{ color: theme.text, opacity: 0.55 }}
              >
                {metaLine}
              </p>
            </ScrollReveal>

            {/* Description — Portable Text from Sanity */}
            {Array.isArray(description) && description.length > 0 && (
              <ScrollReveal delay={180}>
                <div
                  className="font-cadiz text-base md:text-[17px] leading-relaxed space-y-4 [&>p]:mb-0 [&>h3]:font-signifier [&>h3]:font-light [&>h3]:text-xl [&>h3]:mb-3 [&>h3]:mt-6"
                  style={{ color: theme.text, opacity: 0.85 }}
                >
                  <PortableText value={description} />
                </div>
              </ScrollReveal>
            )}

            {/* Description — plain-text fallback */}
            {!Array.isArray(description) && descriptionFallback && (
              <ScrollReveal delay={180}>
                <div
                  className="font-cadiz text-base md:text-[17px] leading-relaxed space-y-4"
                  style={{ color: theme.text, opacity: 0.85 }}
                >
                  {descriptionFallback.split('\n\n').map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Scope tags */}
            {data.scope && data.scope.length > 0 && (
              <ScrollReveal delay={210}>
                <div className="flex flex-wrap gap-2 mt-8">
                  {data.scope.map((s: string) => (
                    <span
                      key={s}
                      className="font-cadiz text-xs tracking-[0.1em] uppercase px-3 py-1"
                      style={{ border: `1px solid ${theme.text}40`, color: `${theme.text}99` }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Photographer credit */}
            {data.photographer && (
              <ScrollReveal delay={230}>
                <p className="mt-6 font-cadiz text-sm" style={{ color: theme.text, opacity: 0.4 }}>
                  Photos: {data.photographer}
                </p>
              </ScrollReveal>
            )}

            {/* Press mentions */}
            {data.pressMentions && data.pressMentions.length > 0 && (
              <ScrollReveal delay={250}>
                <p className="mt-3 font-cadiz text-sm" style={{ color: theme.text, opacity: 0.4 }}>
                  As seen in: {data.pressMentions.join(', ')}
                </p>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Editorial gallery ─────────────────────────────────────────────── */}
      {galleryRows.length > 0 && (
        <section
          className="pb-[var(--section-padding-y)]"
          style={{ backgroundColor: theme.bg }}
          aria-label="Project gallery"
        >
          <div className="flex flex-col" style={{ gap: 'clamp(20px, 3vw, 48px)' }}>

            {galleryRows.map((row, ri) => {

              /* ── Full-width row ─────────────────────────────────────────── */
              if (row.type === 'full') {
                const img = row.image
                const w = img.width ?? 1600
                const h = img.height ?? 1067
                const src = img.asset._ref
                  ? urlFor(img).width(1920).quality(88).url()
                  : heroSrc

                return (
                  <ScrollReveal key={ri} delay={ri === 0 ? 0 : 80}>
                    <div>
                      {/* Edge-to-edge: no horizontal padding */}
                      <div
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: `${w} / ${h}`, backgroundColor: theme.bg }}
                      >
                        <Image
                          src={src}
                          alt={img.alt ?? `${data.title} — photo ${ri + 1}`}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          quality={88}
                        />
                      </div>
                      {img.caption && (
                        <p className="mt-3 px-6 md:px-12 lg:px-16 font-cadiz text-xs tracking-wide" style={{ color: theme.text, opacity: 0.45 }}>
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </ScrollReveal>
                )
              }

              /* ── Side-by-side pair ──────────────────────────────────────── */
              const [a, b] = row.images
              const [wA, hA] = [a.width ?? 800, a.height ?? 1067]
              const [wB, hB] = [b.width ?? 800, b.height ?? 1067]
              const srcA = a.asset._ref ? urlFor(a).width(960).quality(88).url() : heroSrc
              const srcB = b.asset._ref ? urlFor(b).width(960).quality(88).url() : heroSrc

              return (
                <ScrollReveal key={ri} delay={80}>
                  {/* Edge-to-edge pair — gap is page background showing through */}
                  <div className="flex gap-[12px] md:gap-[16px]">

                    {/* Image A */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: `${wA} / ${hA}`, backgroundColor: theme.bg }}
                      >
                        <Image
                          src={srcA}
                          alt={a.alt ?? `${data.title} — photo ${ri + 1}a`}
                          fill
                          sizes="(max-width: 768px) 50vw, 50vw"
                          className="object-cover"
                          quality={88}
                        />
                      </div>
                      {a.caption && (
                        <p className="mt-2 font-cadiz text-xs tracking-wide" style={{ color: theme.text, opacity: 0.45 }}>
                          {a.caption}
                        </p>
                      )}
                    </div>

                    {/* Image B */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: `${wB} / ${hB}`, backgroundColor: theme.bg }}
                      >
                        <Image
                          src={srcB}
                          alt={b.alt ?? `${data.title} — photo ${ri + 1}b`}
                          fill
                          sizes="(max-width: 768px) 50vw, 50vw"
                          className="object-cover"
                          quality={88}
                        />
                      </div>
                      {b.caption && (
                        <p className="mt-2 font-cadiz text-xs tracking-wide" style={{ color: theme.text, opacity: 0.45 }}>
                          {b.caption}
                        </p>
                      )}
                    </div>

                  </div>
                </ScrollReveal>
              )
            })}

          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        className="section-spacing bg-[#2d1d17] text-[#d4cbc0]"
        aria-label="Start a project"
      >
        <div className="page-container max-w-2xl">
          <ScrollReveal>
            <h2
              className="font-signifier font-normal text-balance mb-8"
              style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: 1.15 }}
            >
              Interested in working together?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href={{ pathname: '/inquire' }} className="btn-primary-dark">
              Start a project →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
