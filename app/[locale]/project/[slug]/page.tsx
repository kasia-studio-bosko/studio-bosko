import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import { getProjectBySlug, getAllProjectSlugs, type PortableTextContent } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

// Static fallback for local dev when Sanity is empty
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
  gallery: [] as Array<{ asset: { _ref: string }; alt?: string; caption?: string }>,
  featured: true,
  order: 1,
  metaTitle: undefined as string | undefined,
  metaDescription: undefined as string | undefined,
}

type Props = {
  params: { locale: string; slug: string }
}

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

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'project' })

  let project = null
  try {
    project = await getProjectBySlug(slug, locale)
  } catch {}

  // Use fallback only for the specific known slug
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

  // Description is Portable Text from Sanity, or a plain-text fallback string
  const description = data.description
  const descriptionFallback = 'descriptionFallback' in data
    ? (data as typeof FALLBACK_PROJECT).descriptionFallback
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />

      {/* ── Hero image ───────────────────────────────────────────────────── */}
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

      {/* ── Project header ───────────────────────────────────────────────── */}
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
                <h1 className="font-signifier font-light text-[30px] leading-[42px] text-balance mb-6" style={{ letterSpacing: '-0.2px' }}>
                  {data.title}
                </h1>
              </ScrollReveal>

              {/* Portable Text (from Sanity) */}
              {Array.isArray(description) && description.length > 0 && (
                <ScrollReveal delay={150}>
                  <div className="font-cadiz text-base md:text-lg leading-relaxed text-[#2d1d17]/80 max-w-prose [&>p]:mb-4 [&>h3]:font-signifier [&>h3]:font-light [&>h3]:text-xl [&>h3]:mb-3 [&>h3]:mt-6">
                    <PortableText value={description} />
                  </div>
                </ScrollReveal>
              )}

              {/* Plain-text fallback */}
              {!Array.isArray(description) && descriptionFallback && (
                <ScrollReveal delay={150}>
                  <div className="font-cadiz text-base md:text-lg leading-relaxed text-[#2d1d17]/80 max-w-prose space-y-4">
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
                    <p className="font-cadiz text-sm">{data.location}</p>
                  </div>
                )}
                {data.size && (
                  <div>
                    <p className="label-serif mb-1">Size</p>
                    <p className="font-cadiz text-sm">{data.size} m²</p>
                  </div>
                )}
                {data.year && (
                  <div>
                    <p className="label-serif mb-1">{t('year')}</p>
                    <p className="font-cadiz text-sm">{data.year}</p>
                  </div>
                )}
                {data.scope && data.scope.length > 0 && (
                  <div>
                    <p className="label-serif mb-1">{t('scope')}</p>
                    <ul className="space-y-1">
                      {data.scope.map((s: string) => (
                        <li key={s} className="font-cadiz text-sm text-[#2d1d17]/80">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.photographer && (
                  <div>
                    <p className="label-serif mb-1">{t('photographer')}</p>
                    <p className="font-cadiz text-sm">{data.photographer}</p>
                  </div>
                )}
                {data.pressMentions && data.pressMentions.length > 0 && (
                  <div>
                    <p className="label-serif mb-1">Press</p>
                    <ul className="space-y-1">
                      {data.pressMentions.map((pub: string) => (
                        <li key={pub} className="font-cadiz text-sm text-[#2d1d17]/80">{pub}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="pb-section-y" aria-label="Project gallery">
          <div className="page-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {data.gallery.map(
                (img: { asset: { _ref: string }; alt?: string; caption?: string }, i: number) => (
                  <ScrollReveal key={i} delay={Math.min(i * 80, 400)}>
                    <div
                      className={`relative bg-[#d4cbc0] overflow-hidden ${
                        i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[3/4]'
                      }`}
                    >
                      <Image
                        src={urlFor(img).width(1600).url()}
                        alt={img.alt ?? `${data.title} — image ${i + 1}`}
                        fill
                        sizes={i === 0 ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                        className="object-cover"
                      />
                    </div>
                    {img.caption && (
                      <p className="mt-2 text-xs font-cadiz text-[#2d1d17]/50">{img.caption}</p>
                    )}
                  </ScrollReveal>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="section-spacing bg-[#2d1d17] text-[#ede8e2]"
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
