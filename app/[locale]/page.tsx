import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ProjectCarousel from '@/components/ProjectCarousel'
import ScrollReveal from '@/components/ScrollReveal'
import { getFeaturedProjects, getFeaturedPressItems, FALLBACK_PROJECTS, FALLBACK_PRESS } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  const canonicalUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`

  return {
    title: t('homeTitle'),
    description: t('siteDescription'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': siteUrl,
        en: siteUrl,
        de: `${siteUrl}/de`,
        pl: `${siteUrl}/pl`,
      },
    },
    openGraph: {
      title: t('homeTitle'),
      description: t('siteDescription'),
      url: canonicalUrl,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
  }
}

// Framer image placeholders until Sanity is populated
const HERO_IMAGE = 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

const FEATURED_IMAGES = [
  {
    slug: 'haus-giebelgarten',
    title: 'Haus Giebelgarten',
    location: 'Berlin',
    year: '2024',
    coverImage: 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg',
    coverImageAlt: 'Green tiled bathroom with marble sink — Haus Giebelgarten, Berlin',
    category: 'House',
  },
  {
    slug: 'apartment-prenzlauer-berg',
    title: 'Apartment Prenzlauer Berg',
    location: 'Berlin',
    year: '2024',
    coverImage: 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg',
    coverImageAlt: 'Warm-toned living area — Apartment Prenzlauer Berg, Berlin',
    category: 'Apartment',
  },
  {
    slug: 'villa-mokotow',
    title: 'Villa Mokotów',
    location: 'Warsaw',
    year: '2023',
    coverImage: 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg',
    coverImageAlt: 'Warsaw villa living room — Villa Mokotów',
    category: 'House',
  },
  {
    slug: 'penthouse-mitte',
    title: 'Penthouse Mitte',
    location: 'Berlin',
    year: '2023',
    coverImage: 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg',
    coverImageAlt: 'Berlin penthouse with vibrant colour palette — Penthouse Mitte',
    category: 'Apartment',
  },
]

const PRESS_LOGOS = [
  { name: 'Architectural Digest', label: 'AD100 2025' },
  { name: 'Domino', label: 'Fall 2025' },
  { name: 'VOGUE Poland', label: 'Oct 2025' },
  { name: 'AD Germany', label: 'Mar 2025' },
  { name: 'est living', label: 'Apr 2025' },
  { name: 'BauNetz', label: 'Jan 2025' },
]

export default async function HomePage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })

  // Try to load from Sanity; fall back to static data
  let featuredProjects = FEATURED_IMAGES
  try {
    const sanityProjects = await getFeaturedProjects()
    if (sanityProjects.length > 0) {
      featuredProjects = sanityProjects.map((p) => ({
        slug: p.slug.current,
        title: p.title,
        location: p.location,
        year: p.year,
        coverImage: urlFor(p.coverImage).width(960).height(1280).url(),
        coverImageAlt: p.coverImage.alt ?? p.title,
        category: p.category,
      }))
    }
  } catch {
    // Sanity not configured yet — use fallback
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[calc(100vh-var(--header-height))] flex items-end pb-12 md:pb-16 bg-[#d4cbc0]"
        aria-label="Hero"
      >
        {/* Full-bleed hero image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Studio Bosko — interior design project showcase"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2d1d17]/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 page-container w-full">
          <div className="max-w-xl">
            <ScrollReveal delay={0}>
              <p className="text-xs font-cadiz tracking-widest uppercase text-[#ede8e2]/70 mb-4">
                {t('heroTagline')} · {t('heroLocation')}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1 className="font-signifier font-light text-display-xl text-[#ede8e2] text-balance mb-6">
                Spaces that feel like home.
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-base md:text-lg font-cadiz text-[#ede8e2]/80 max-w-md mb-8 leading-relaxed">
                {t('heroBody')}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="flex flex-wrap gap-4">
                <Link href="/projects" className="btn-primary-dark">
                  {t('heroCtaProjects')} →
                </Link>
                <Link href="/inquire" className="btn-primary-dark">
                  {t('heroCtaInquire')}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Featured projects carousel ────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Featured projects">
        <div className="page-container">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10 md:mb-12">
              <div>
                <p className="label-serif mb-2">{t('featuredProjectsSubheading')}</p>
                <h2 className="font-signifier font-light text-display-md tracking-tight">
                  {t('featuredProjectsHeading')}
                </h2>
              </div>
              <Link href="/projects" className="btn-text hidden md:inline-flex">
                {t('heroCtaProjects')} →
              </Link>
            </div>
          </ScrollReveal>

          <ProjectCarousel
            projects={featuredProjects}
            locale={locale}
            viewLabel={t('heroCtaProjects')}
          />

          <div className="mt-8 md:hidden">
            <Link href="/projects" className="btn-text">
              {t('heroCtaProjects')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── About teaser ──────────────────────────────────────────────────── */}
      <section className="section-spacing bg-[#d4cbc0]" aria-label="About Studio Bosko">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Image */}
            <ScrollReveal>
              <div className="aspect-[3/4] relative bg-[#c4b9ac] overflow-hidden">
                <Image
                  src={HERO_IMAGE}
                  alt="Kasia Kronberger, interior designer at Studio Bosko"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>

            {/* Text */}
            <div>
              <ScrollReveal delay={100}>
                <p className="label-serif mb-4">About</p>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <h2 className="font-signifier font-light text-display-md tracking-tight mb-8 text-balance">
                  {t('aboutHeading')}
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/80 mb-8">
                  {t('aboutBody')}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={250}>
                <Link href="/studio" className="btn-primary">
                  {t('aboutCta')} →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Offering teaser ───────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Our offering">
        <div className="page-container max-w-3xl">
          <ScrollReveal>
            <p className="label-serif mb-4">{t('offeringHeading')}</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="font-signifier font-light text-display-lg tracking-tight text-balance mb-10">
              {t('offeringBody')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/offering" className="btn-primary">
              {t('offeringCta')} →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Press strip ───────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-[#120b09]/10" aria-label="Press mentions">
        <div className="page-container">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="label-serif mb-1">{t('pressHeading')}</p>
                <p className="font-signifier font-light text-display-sm">
                  {t('pressIntro')}
                </p>
              </div>
              <Link href="/press" className="btn-text hidden md:inline-flex">
                {t('pressCta')} →
              </Link>
            </div>
          </ScrollReveal>

          {/* Press logos grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
            {PRESS_LOGOS.map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 60}>
                <div className="flex flex-col items-center text-center py-4 px-2 border border-[#120b09]/10 hover:border-[#120b09]/30 transition-colors duration-200">
                  <span className="font-signifier font-light text-sm tracking-tight text-[#120b09]">
                    {item.name}
                  </span>
                  <span className="text-xs font-cadiz text-[#120b09]/50 mt-1">
                    {item.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link href="/press" className="btn-text">
              {t('pressCta')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA inquire ───────────────────────────────────────────────────── */}
      <section
        className="section-spacing bg-[#2d1d17] text-[#ede8e2]"
        aria-label="Start a project"
      >
        <div className="page-container max-w-2xl text-center mx-auto">
          <ScrollReveal>
            <p className="label-serif text-[#ede8e2]/60 mb-4">{t('inquireHeading')}</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="font-signifier font-light text-display-lg tracking-tight text-balance mb-8">
              {t('inquireBody')}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/inquire" className="btn-primary-dark">
              {t('inquireCta')} →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
