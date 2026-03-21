import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import { getProjectBySlug, getAllProjectSlugs, type PortableTextContent, type GalleryImage } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

// ─── Static fallback for local dev when Sanity is empty ──────────────────────
const FALLBACK_PROJECT = {
  _id: 'fallback',
  title: 'Chroma Penthouse',
  slug: { current: 'chroma-penthouse' },
  location: 'Berlin Kreuzberg',
  size: 143,
  year: '2024',
  category: 'Apartment',
  scope: ['Interior Design', 'Curation'],
  photographer: '',
  pressMentions: [],
  seoIntro: 'A colour-forward penthouse in Berlin Kreuzberg — 143 m² of layered character, custom furniture, and considered curation.',
  description: null as PortableTextContent | null,
  descriptionFallback: 'Chroma Penthouse is a full interior design and curation project for a 143 m² penthouse in Berlin Kreuzberg.\n\nThe brief centred on colour — using it boldly to create distinct moods across the apartment while maintaining a coherent whole. Each room takes its cue from a different part of the client\'s life: the kitchen from markets in Morocco, the living room from a favourite painting, the bedroom from quiet mornings in the countryside.',
  coverImage: { asset: { _ref: '' }, alt: 'Chroma Penthouse — a bold, colour-layered penthouse in Berlin Kreuzberg' },
  gallery: [] as GalleryImage[],
  featured: true,
  order: 1,
  metaTitle: undefined as string | undefined,
  metaDescription: undefined as string | undefined,
}

type Props = {
  params: { locale: string; slug: string }
}

// ─── Smart gallery row grouping ───────────────────────────────────────────────

type GalleryRow =
  | { type: 'full'; image: GalleryImage }
  | { type: 'pair'; images: [GalleryImage, GalleryImage] }

function getAspectRatio(img: GalleryImage): number {
  if (img.aspectRatio) return img.aspectRatio
  if (img.width && img.height) return img.width / img.height
  return 1.5 // default to landscape
}

/**
 * Groups gallery images into editorial rows:
 * - Image 0 always starts as a full-width hero row
 * - Two consecutive portraits → side-by-side pair
 * - Two consecutive landscapes → side-by-side pair
 * - Everything else → full-width
 */
function groupGalleryRows(images: GalleryImage[]): GalleryRow[] {
  if (images.length === 0) return []

  const rows: GalleryRow[] = []
  rows.push({ type: 'full', image: images[0] })

  let i = 1
  while (i < images.length) {
    const cur = images[i]
    const curRatio = getAspectRatio(cur)
    const isPortrait = curRatio < 0.85
    const isLandscape = curRatio > 1.2

    const next = images[i + 1]
    if (next) {
      const nextRatio = getAspectRatio(next)
      const nextIsPortrait = nextRatio < 0.85
      const nextIsLandscape = nextRatio > 1.2

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
    return locales.flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug }))
    )
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
  try {
    project = await getProjectBySlug(slug, locale)
  } catch {}

  const title = project?.metaTitle ?? project?.title ?? FALLBACK_PROJECT.title
  const description = project?.metaDescription ?? project?.seoIntro ?? FALLBACK_PROJECT.seoIntro
  const ogImage = project?.coverImage?.asset?._ref
    ? urlFor(project.coverImage).width(1200).height(630).fit('crop').url()
    : `${siteUrl}/og-image.jpg`

  const slugPrefixMap: Record<string, string> = { en: 'project', de: 'projekt', pl: 'projekt' }
  const canonical = locale === 'en'
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
  try {
    project = await getProjectBySlug(slug, locale)
  } catch {}

  const data = project ?? (slug === 'chroma-penthouse' ? FALLBACK_PROJECT : null)
  if (!data) notFound()

  const heroImage = data.coverImage?.asset?._ref
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
    image: heroImage,
  }

  const description = data.description
  const descriptionFallback = 'descriptionFallback' in data
    ? (data as typeof FALLBACK_PROJECT).descriptionFallback
    : null

  const galleryRows = groupGalleryRows(data.gallery ?? [])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />

      {/* ── Cover image hero ──────────────────────────────────────────────── */}
      <section className="relative h-[60vh] md:h-[80vh] bg-[#d4cbc0]" aria-label="Project hero">
        <Image
          src={heroImage}
          alt={data.coverImage?.alt ?? data.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={90}
        />
      </section>

      {/* ── Project header ────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Project details">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">

            {/* Title & description */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <Link
                  href={{ pathname: '/projects' }}
                  className="btn-text text-xs mb-8 block"
                >
                  ← {t('backToProjects')}
                </Link>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h1
                  className="font-signifier font-light text-[28px] md:text-[36px] leading-[1.25] text-balance mb-6 text-[#2d1d17]"
                  style={{ letterSpacing: '-0.3px' }}
                >
                  {data.title}
                </h1>
              </ScrollReveal>

              {/* Portable Text (from Sanity) */}
              {Array.isArray(description) && description.length > 0 && (
                <ScrollReveal delay={150}>
                  <div className="font-cadiz text-base md:text-lg leading-relaxed text-[#2d1d17]/75 max-w-prose [&>p]:mb-4 [&>h3]:font-signifier [&>h3]:font-light [&>h3]:text-xl [&>h3]:mb-3 [&>h3]:mt-6">
                    <PortableText value={description} />
                  </div>
                </ScrollReveal>
              )}

              {/* Plain-text fallback */}
              {!Array.isArray(description) && descriptionFallback && (
                <ScrollReveal delay={150}>
                  <div className="font-cadiz text-base md:text-lg leading-relaxed text-[#2d1d17]/75 max-w-prose space-y-4">
                    {descriptionFallback.split('\n\n').map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Meta sidebar */}
            <ScrollReveal delay={200}>
              <div className="space-y-6 lg:pt-[5.5rem]">
                {data.location && (
                  <div>
                    <p className="label-serif mb-1">{t('location')}</p>
                    <p className="font-cadiz text-sm text-[#2d1d17]">{data.location}</p>
                  </div>
                )}
                {data.size && (
                  <div>
                    <p className="label-serif mb-1">Size</p>
                    <p className="font-cadiz text-sm text-[#2d1d17]">{data.size} m²</p>
                  </div>
                )}
                {data.year && (
                  <div>
                    <p className="label-serif mb-1">{t('year')}</p>
                    <p className="font-cadiz text-sm text-[#2d1d17]">{data.year}</p>
                  </div>
                )}
                {data.scope && data.scope.length > 0 && (
                  <div>
                    <p className="label-serif mb-1">{t('scope')}</p>
                    <ul className="space-y-1">
                      {data.scope.map((s: string) => (
                        <li key={s} className="font-cadiz text-sm text-[#2d1d17]/75">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.photographer && (
                  <div>
                    <p className="label-serif mb-1">{t('photographer')}</p>
                    <p className="font-cadiz text-sm text-[#2d1d17]">{data.photographer}</p>
                  </div>
                )}
                {data.pressMentions && data.pressMentions.length > 0 && (
                  <div>
                    <p className="label-serif mb-1">Press</p>
                    <ul className="space-y-1">
                      {data.pressMentions.map((pub: string) => (
                        <li key={pub} className="font-cadiz text-sm text-[#2d1d17]/75">{pub}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Editorial gallery ─────────────────────────────────────────────── */}
      {galleryRows.length > 0 && (
        <section className="pb-[var(--section-padding-y)]" aria-label="Project gallery">
          <div className="flex flex-col gap-10 md:gap-12">
            {galleryRows.map((row, rowIndex) => {
              if (row.type === 'full') {
                const img = row.image
                const w = img.width ?? 1600
                const h = img.height ?? 1067
                const ar = getAspectRatio(img)
                const imgSrc = img.asset._ref
                  ? urlFor(img).width(1920).quality(85).url()
                  : 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

                return (
                  <ScrollReveal key={rowIndex} delay={rowIndex === 0 ? 0 : 100}>
                    <div>
                      <div
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: `${w}/${h}` }}
                      >
                        <Image
                          src={imgSrc}
                          alt={img.alt ?? `${data.title} — image ${rowIndex + 1}`}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          quality={85}
                        />
                      </div>
                      {img.caption && (
                        <p className="mt-3 px-6 md:px-12 lg:px-16 text-xs font-cadiz text-[#2d1d17]/50">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </ScrollReveal>
                )
              }

              // Paired row — two images side by side
              const [imgA, imgB] = row.images
              const wA = imgA.width ?? 800; const hA = imgA.height ?? 1067
              const wB = imgB.width ?? 800; const hB = imgB.height ?? 1067
              const srcA = imgA.asset._ref
                ? urlFor(imgA).width(960).quality(85).url()
                : 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'
              const srcB = imgB.asset._ref
                ? urlFor(imgB).width(960).quality(85).url()
                : 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

              return (
                <ScrollReveal key={rowIndex} delay={100}>
                  <div className="flex gap-2 md:gap-3">
                    {/* Image A */}
                    <div className="flex-1 flex flex-col">
                      <div
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: `${wA}/${hA}` }}
                      >
                        <Image
                          src={srcA}
                          alt={imgA.alt ?? `${data.title} — image ${rowIndex + 1}a`}
                          fill
                          sizes="(max-width: 768px) 50vw, 50vw"
                          className="object-cover"
                          quality={85}
                        />
                      </div>
                      {imgA.caption && (
                        <p className="mt-2 text-xs font-cadiz text-[#2d1d17]/50">
                          {imgA.caption}
                        </p>
                      )}
                    </div>

                    {/* Image B */}
                    <div className="flex-1 flex flex-col">
                      <div
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: `${wB}/${hB}` }}
                      >
                        <Image
                          src={srcB}
                          alt={imgB.alt ?? `${data.title} — image ${rowIndex + 1}b`}
                          fill
                          sizes="(max-width: 768px) 50vw, 50vw"
                          className="object-cover"
                          quality={85}
                        />
                      </div>
                      {imgB.caption && (
                        <p className="mt-2 text-xs font-cadiz text-[#2d1d17]/50">
                          {imgB.caption}
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
            <h2 className="font-signifier font-normal text-[50px] leading-[60px] text-balance mb-8">
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
