import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

// Static fallback project data
const FALLBACK_PROJECT = {
  _id: 'fallback',
  title: 'Haus Giebelgarten',
  slug: { current: 'haus-giebelgarten' },
  location: 'Berlin, Germany',
  year: '2024',
  category: 'House',
  scope: ['Interior design', 'FF&E', 'Construction supervision', 'Styling'],
  photographer: '',
  shortDescription: 'A house renovation in Berlin blending midcentury modern with contemporary comfort.',
  description: 'Haus Giebelgarten is a full renovation of a 1960s Berlin house. The brief was to create a family home that felt warm, considered, and personal — a retreat from city life while remaining connected to it.\n\nThe palette is anchored by earthy greens and warm terracotta tiles, with oak joinery running throughout. Custom furniture and vintage pieces from our network of suppliers sit alongside bespoke built-in storage designed to disappear into the architecture.',
  coverImage: {
    asset: { _ref: '' },
    alt: 'Green tiled bathroom with marble sink — Haus Giebelgarten',
  },
  gallery: [],
  featured: true,
  order: 1,
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
    // Return minimal params if Sanity not configured
    return [
      { locale: 'en', slug: 'haus-giebelgarten' },
      { locale: 'de', slug: 'haus-giebelgarten' },
      { locale: 'pl', slug: 'haus-giebelgarten' },
    ]
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params
  const t = await getTranslations({ locale, namespace: 'project' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  let project = null
  try {
    project = await getProjectBySlug(slug)
  } catch {}

  const title = project?.title ?? FALLBACK_PROJECT.title
  const description = project?.shortDescription ?? FALLBACK_PROJECT.shortDescription

  return {
    title: `${title} — Interior Design Project`,
    description,
    openGraph: {
      title: `${title} | Studio Bosko`,
      description,
      type: 'article',
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'project' })

  let project = null
  try {
    project = await getProjectBySlug(slug)
  } catch {}

  // Use fallback if Sanity returns nothing
  const data = project ?? (slug === 'haus-giebelgarten' ? FALLBACK_PROJECT : null)

  if (!data) {
    notFound()
  }

  const heroImage = data.coverImage?.asset?._ref
    ? urlFor(data.coverImage).width(1920).height(1080).url()
    : 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

  const projectsPath = '/projects' as const

  // JSON-LD for the project (CreativeWork schema)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.title,
    description: data.shortDescription,
    creator: {
      '@type': 'Organization',
      name: 'Studio Bosko',
      url: siteUrl,
    },
    locationCreated: {
      '@type': 'Place',
      name: data.location,
    },
    dateCreated: data.year,
    image: heroImage,
  }

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
                <Link href={projectsPath} className="btn-text text-xs mb-8 block">
                  ← {t('backToProjects')}
                </Link>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h1 className="font-signifier font-light text-display-lg tracking-tight text-balance mb-6">
                  {data.title}
                </h1>
              </ScrollReveal>
              {data.description && (
                <ScrollReveal delay={150}>
                  <div className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/80 max-w-prose space-y-4">
                    {data.description.split('\n\n').map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Meta */}
            <ScrollReveal delay={200}>
              <div className="space-y-6 lg:pt-[5.5rem]">
                {data.location && (
                  <div>
                    <p className="label-serif mb-1">{t('location')}</p>
                    <p className="font-cadiz text-sm">{data.location}</p>
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
                        <li key={s} className="font-cadiz text-sm text-[#120b09]/80">
                          {s}
                        </li>
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
              {data.gallery.map((img: { asset: { _ref: string }; alt?: string; caption?: string }, i: number) => (
                <ScrollReveal key={i} delay={Math.min(i * 80, 400)}>
                  <div className={`relative bg-[#d4cbc0] overflow-hidden ${
                    i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[3/4]'
                  }`}>
                    <Image
                      src={urlFor(img).width(1600).url()}
                      alt={img.alt ?? `${data.title} — image ${i + 1}`}
                      fill
                      sizes={i === 0 ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                      className="object-cover"
                    />
                  </div>
                  {img.caption && (
                    <p className="mt-2 text-xs font-cadiz text-[#120b09]/50">
                      {img.caption}
                    </p>
                  )}
                </ScrollReveal>
              ))}
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
            <h2 className="font-signifier font-light text-display-lg tracking-tight text-balance mb-8">
              Interested in working together?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href="/inquire" className="btn-primary-dark">
              Start a project →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
