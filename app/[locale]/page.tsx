import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getFeaturedProjects, FALLBACK_PROJECTS } from '@/lib/sanity/queries'
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
    title: { absolute: t('homeTitle') },
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
const TESTIMONIAL_IMAGE = 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

const FEATURED_IMAGES = [
  {
    slug: 'chroma-penthouse',
    title: 'Chroma Penthouse',
    location: 'Berlin Kreuzberg',
    year: '2024',
    coverImage: 'https://framerusercontent.com/images/l1lysvdOseg1KyDSJxHjCPPJQo.jpg',
    coverImageAlt: 'Vibrant living room in a Berlin penthouse — Chroma Penthouse',
    category: 'Apartment',
  },
  {
    slug: 'zander-rooftop',
    title: 'Zander Rooftop',
    location: 'Berlin Mitte / Kreuzberg',
    year: '2023',
    coverImage: 'https://framerusercontent.com/images/HtBz4JDvXubiEp6tEPI9Z4Cc.jpg',
    coverImageAlt: 'Red kitchen island in bespoke kitchen — Zander Rooftop, Berlin',
    category: 'Apartment',
  },
  {
    slug: 'casa-norte',
    title: 'Casa Norte',
    location: 'Szczecin, Poland',
    year: '2024',
    coverImage: 'https://framerusercontent.com/images/UdwJZtpW3JOoD1xFzqm2j3MbP0.jpg',
    coverImageAlt: 'Earthy tones and tactile wood in Casa Norte, Szczecin',
    category: 'Apartment',
  },
  {
    slug: 'time-travel',
    title: 'Time Travel',
    location: 'Berlin Neukölln',
    year: '2022',
    coverImage: 'https://framerusercontent.com/images/wxs1UdkYvpS4swIVRveRHqL8OBQ.jpg',
    coverImageAlt: 'Colour-drenched hallway corridor with Victorian floor tiles — Time Travel, Berlin',
    category: 'Apartment',
  },
]

const PRESS_MARQUEE = 'Architectural Digest · Domino · AD Spain · AD Germany · VOGUE Poland · Elle Decoration UK · est living · AD Middle East · Yellowtrace · &Living · AD100 Polska · ELLE Indonesia · BauNetz · Living Corriere · Design Alive ·'

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
    const sanityProjects = await getFeaturedProjects(locale)
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
      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <section className="relative h-screen w-full" aria-label="Hero">
        <Image
          src={HERO_IMAGE}
          alt="Studio Bosko — interior design project showcase"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={90}
        />
      </section>

      {/* ── 2. Intro section ─────────────────────────────────────────────── */}
      <section
        className="bg-[#705305] py-20 md:py-28 w-full"
        aria-label="Introduction"
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-16">
          <div className="md:w-[55%]">
            <h1 className="font-signifier font-light text-[30px] leading-snug text-[#e1cd3c] mb-6">
              {t('introH1')}
            </h1>
            <p className="font-signifier font-light text-[30px] leading-snug text-[#e1cd3c] mb-8">
              {t('introBody')}
            </p>
            <Link
              href="/inquire"
              className="font-cadiz text-[15px] text-[#e1cd3c]/70 hover:text-[#e1cd3c] transition-colors duration-200"
            >
              {t('heroCtaSeeIfFit')} ›
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. Selected Work — sticky scroll ────────────────────────────── */}
      <section className="flex w-full" aria-label="Selected Work">
        {/* Left sticky panel */}
        <div className="hidden md:flex w-[35%] sticky top-0 h-screen bg-[#d4cbc0] flex-col justify-center pl-16 pr-8">
          <p className="font-cadiz text-xs tracking-widest uppercase text-[#2d1d17]/50 mb-3">
            {t('selectedWorkSubheading')}
          </p>
          <h2 className="font-signifier font-light text-5xl text-[#2d1d17] mb-6 tracking-tight">
            {t('selectedWork')}
          </h2>
          <Link
            href="/projects"
            className="font-cadiz text-sm text-[#2d1d17]/60 hover:text-[#2d1d17] transition-colors duration-200"
          >
            {t('seeAllProjects')} →
          </Link>
        </div>

        {/* Right scrolling panel */}
        <div className="w-full md:w-[65%]">
          {/* Mobile heading */}
          <div className="md:hidden bg-[#d4cbc0] px-8 py-12">
            <p className="font-cadiz text-xs tracking-widest uppercase text-[#2d1d17]/50 mb-3">
              {t('selectedWorkSubheading')}
            </p>
            <h2 className="font-signifier font-light text-4xl text-[#2d1d17] mb-4 tracking-tight">
              {t('selectedWork')}
            </h2>
            <Link
              href="/projects"
              className="font-cadiz text-sm text-[#2d1d17]/60 hover:text-[#2d1d17] transition-colors duration-200"
            >
              {t('seeAllProjects')} →
            </Link>
          </div>

          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              href={{ pathname: '/project/[slug]', params: { slug: project.slug } }}
              className="block relative group"
              style={{ height: '85vh' }}
            >
              <Image
                src={project.coverImage}
                alt={project.coverImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 65vw"
                className="object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 p-8 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                <p className="font-signifier font-light text-2xl text-white leading-tight">
                  {project.title}
                </p>
                <p className="font-cadiz text-sm text-white/70 mt-1">
                  {project.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Offering section ──────────────────────────────────────────── */}
      <section
        className="bg-[#705305] py-20 md:py-32 px-8 md:px-16 lg:px-24 w-full"
        aria-label="Offering"
      >
        <div className="max-w-[1440px] mx-auto">
          <h2
            className="font-signifier font-light text-[#e1cd3c] mb-8 tracking-tight"
            style={{ fontSize: '50px' }}
          >
            Offering
          </h2>
          <p className="font-signifier font-light text-[22px] leading-relaxed text-[#e1cd3c]/80 max-w-3xl mb-8">
            {t('offeringBodyFull')}
          </p>
          <Link
            href="/offering"
            className="font-cadiz text-[15px] text-[#e1cd3c]/70 hover:text-[#e1cd3c] transition-colors duration-200"
          >
            {t('offeringCtaLearn')} ›
          </Link>
        </div>
      </section>

      {/* ── 5. Press marquee ─────────────────────────────────────────────── */}
      <section className="bg-[#2d1d17] py-5 overflow-hidden" aria-label="Press mentions">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="font-cadiz text-[11px] tracking-[0.2em] uppercase text-white/50 pr-16">
            {PRESS_MARQUEE}
          </span>
          <span className="font-cadiz text-[11px] tracking-[0.2em] uppercase text-white/50 pr-16">
            {PRESS_MARQUEE}
          </span>
        </div>
      </section>

      {/* ── 6. Testimonial ──────────────────────────────────────────────── */}
      <section
        className="flex flex-col md:flex-row"
        style={{ height: '85vh' }}
        aria-label="Client testimonial"
      >
        {/* Left: image */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
          <Image
            src={TESTIMONIAL_IMAGE}
            alt="Studio Bosko interior project"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Right: quote */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#60bf83] flex flex-col justify-center px-8 md:px-12 lg:px-16">
          <blockquote className="font-signifier font-light text-2xl md:text-3xl text-white leading-relaxed">
            {t('testimonialQuote')}
          </blockquote>
          <p className="font-cadiz text-sm text-white/70 mt-6">
            {t('testimonialAttribution')}
          </p>
        </div>
      </section>

      {/* ── 7. CTA section ──────────────────────────────────────────────── */}
      <section
        className="bg-[#705305] py-20 md:py-28 px-8 md:px-16 lg:px-24 w-full"
        aria-label="Start a project"
      >
        <div className="max-w-[1440px] mx-auto">
          <p className="font-signifier font-light text-[30px] leading-snug text-[#e1cd3c] max-w-2xl mb-8">
            {t('ctaBodyFull')}
          </p>
          <Link
            href="/inquire"
            className="font-cadiz text-[15px] text-[#e1cd3c]/70 hover:text-[#e1cd3c] transition-colors duration-200"
          >
            {t('ctaConsultation')} ›
          </Link>
        </div>
      </section>
    </>
  )
}
