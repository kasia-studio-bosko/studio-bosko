import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getFeaturedProjects, getHomepageContent } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import HeroCarousel, { type CarouselSlide } from '@/components/HeroCarousel'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const [t, sanity] = await Promise.all([
    getTranslations({ locale, namespace: 'meta' }),
    getHomepageContent(locale),
  ])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  const canonicalUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`

  const title       = sanity?.seoTitle ?? t('homeTitle')
  const description = sanity?.seoDescription ?? t('siteDescription')

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${siteUrl}/`,
        en: `${siteUrl}/`,
        de: `${siteUrl}/de/`,
        pl: `${siteUrl}/pl/`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
  }
}

// Fallback hero / carousel images (Framer-hosted until Sanity delivers)
const FALLBACK_CAROUSEL: CarouselSlide[] = [
  {
    slug: 'chroma-penthouse',
    title: 'Chroma Penthouse',
    location: 'Berlin Kreuzberg',
    coverImage: 'https://framerusercontent.com/images/l1lysvdOseg1KyDSJxHjCPPJQo.jpg',
    coverImageAlt: 'Vibrant living room — Chroma Penthouse, Berlin',
  },
  {
    slug: 'zander-rooftop',
    title: 'Zander Rooftop',
    location: 'Berlin Mitte',
    coverImage: 'https://framerusercontent.com/images/HtBz4JDvXubiEp6tEPI9Z4Cc.jpg',
    coverImageAlt: 'Red kitchen island — Zander Rooftop, Berlin',
  },
  {
    slug: 'casa-norte',
    title: 'Casa Norte',
    location: 'Szczecin, Poland',
    coverImage: 'https://framerusercontent.com/images/UdwJZtpW3JOoD1xFzqm2j3MbP0.jpg',
    coverImageAlt: 'Earthy tones and tactile wood — Casa Norte',
  },
  {
    slug: 'time-travel',
    title: 'Time Travel',
    location: 'Berlin Neukölln',
    coverImage: 'https://framerusercontent.com/images/wxs1UdkYvpS4swIVRveRHqL8OBQ.jpg',
    coverImageAlt: 'Colour-drenched hallway — Time Travel, Berlin',
  },
]

// Fallback testimonial image
const FALLBACK_TESTIMONIAL_IMAGE =
  'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

/**
 * Only publications that have a logo file in /public/logos/.
 * Rendered as plain <img> tags (not next/image) so height:20px + width:auto
 * work without fighting Next.js dimension constraints.
 * filter:brightness(0) renders all logos as dark ink on the beige strip.
 * Note: logo-est.png is actually a WebP file — referenced as .webp.
 */
const PRESS_LOGOS: { name: string; src: string }[] = [
  { name: 'AD',              src: '/logos/logo-ad.png'              },
  { name: 'Vogue',           src: '/logos/logo-vogue.png'           },
  { name: 'Elle Decoration', src: '/logos/logo-elle-decoration.png' },
  { name: 'Yellowtrace',     src: '/logos/logo-yellowtrace.png'     },
  { name: 'Domino',          src: '/logos/logo-domino.png'          },
  { name: 'Est Living',      src: '/logos/logo-est.webp'            },
  { name: 'Livingetc',       src: '/logos/logo-livingetc.png'       },
  { name: 'Homes & Gardens', src: '/logos/logo-homes-gardens.png'   },
]

export default async function HomePage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const [t, sanity] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getHomepageContent(locale),
  ])

  // Content — Sanity first, translation fallback
  const introH1        = sanity?.heroHeadline ?? t('introH1')
  const introBody      = sanity?.heroBody     ?? t('introBody')
  const offeringBodyFull = sanity?.offeringBody ?? t('offeringBodyFull')

  // Testimonial — Sanity first, translation fallback
  const testimonialQuote       = sanity?.testimonialQuote  ?? t('testimonialQuote')
  const testimonialAttribution = sanity?.testimonialAuthor ?? t('testimonialAttribution')
  const testimonialImageUrl    = sanity?.testimonialImage?.asset?._ref
    ? urlFor(sanity.testimonialImage).width(1200).height(900).url()
    : FALLBACK_TESTIMONIAL_IMAGE

  // CTA section
  const ctaBody = sanity?.scarcityText ?? t('ctaBodyFull')
  const ctaBtn  = sanity?.scarcityCta  ?? t('ctaConsultation')

  // Carousel slides: try Sanity first, fall back to static data
  let carouselSlides: CarouselSlide[] = FALLBACK_CAROUSEL
  try {
    const sanityProjects = await getFeaturedProjects(locale)
    if (sanityProjects.length > 0) {
      carouselSlides = sanityProjects.map((p) => ({
        slug: p.slug.current,
        title: p.title,
        location: p.location,
        coverImage: urlFor(p.coverImage).width(1920).height(1080).url(),
        coverImageAlt: p.coverImage.alt ?? p.title,
      }))
    }
  } catch {
    // Sanity not reachable — use fallback
  }

  return (
    <>
      {/* ── 1. Full-bleed hero carousel ────────────────────────────────────── */}
      <section
        className="-mt-[var(--header-height)] relative w-full overflow-hidden"
        style={{ height: '100svh' }}
        aria-label="Hero — selected projects"
      >
        <HeroCarousel
          slides={carouselSlides}
          seeIfFitLabel={sanity?.heroCta ?? t('heroCtaSeeIfFit')}
          seeAllLabel={t('seeAllProjects')}
        />
      </section>

      {/* ── 2. Intro ──────────────────────────────────────────────────────── */}
      <section className="bg-[#705305] py-20 md:py-28 w-full" aria-label="Introduction">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16">
          <div className="md:w-[58%]">
            <h1 className="font-signifier font-light text-[30px] leading-[42px] text-[#e1cd3c] mb-6" style={{ letterSpacing: '-0.2px' }}>
              {introH1}
            </h1>
            <p className="font-signifier font-light text-[30px] leading-[42px] text-[#e1cd3c]/80 mb-10" style={{ letterSpacing: '-0.6px' }}>
              {introBody}
            </p>
            <Link
              href="/inquire"
              className="font-cadiz text-[14px] tracking-widest uppercase text-[#e1cd3c]/70 hover:text-[#e1cd3c] transition-colors duration-200 border-b border-[#e1cd3c]/30 pb-0.5"
            >
              {sanity?.heroCta ?? t('heroCtaSeeIfFit')} ›
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. Selected Work — sticky-scroll stack ─────────────────────────── */}
      <section className="flex w-full" aria-label="Selected Work">
        {/* Left sticky label panel */}
        <div className="hidden md:flex w-[32%] sticky top-0 h-screen bg-[#d4cbc0] flex-col justify-center pl-14 pr-8">
          <p className="font-cadiz text-[11px] tracking-[0.2em] uppercase text-[#2d1d17]/50 mb-3">
            {t('selectedWorkSubheading')}
          </p>
          <h2 className="font-signifier font-normal text-[50px] text-[#2d1d17] mb-6 leading-[60px]">
            {sanity?.selectedWorkLabel ?? t('selectedWork')}
          </h2>
          <Link
            href="/projects"
            className="font-cadiz text-sm text-[#2d1d17]/60 hover:text-[#2d1d17] transition-colors duration-200"
          >
            {t('seeAllProjects')} →
          </Link>
        </div>

        {/* Right scrolling images */}
        <div className="w-full md:w-[68%]">
          {/* Mobile heading */}
          <div className="md:hidden bg-[#d4cbc0] px-8 py-12">
            <p className="font-cadiz text-[11px] tracking-[0.2em] uppercase text-[#2d1d17]/50 mb-3">
              {t('selectedWorkSubheading')}
            </p>
            <h2 className="font-signifier font-normal text-[50px] text-[#2d1d17] mb-4 leading-[60px]">
              {sanity?.selectedWorkLabel ?? t('selectedWork')}
            </h2>
            <Link
              href="/projects"
              className="font-cadiz text-sm text-[#2d1d17]/60"
            >
              {t('seeAllProjects')} →
            </Link>
          </div>

          {carouselSlides.map((project) => (
            <Link
              key={project.slug}
              href={{ pathname: '/project/[slug]', params: { slug: project.slug } }}
              className="block relative group overflow-hidden"
              style={{ height: '82vh' }}
            >
              <Image
                src={project.coverImage}
                alt={project.coverImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 68vw"
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
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

      {/* ── 4. Offering section ───────────────────────────────────────────── */}
      <section
        className="bg-[#705305] py-20 md:py-32 px-8 md:px-16 lg:px-24 w-full"
        aria-label="Offering"
      >
        <div className="max-w-[1440px] mx-auto">
          <p className="font-cadiz text-[11px] tracking-[0.2em] uppercase text-[#e1cd3c]/50 mb-6">
            Studio Bosko
          </p>
          <h2 className="font-signifier font-normal text-[50px] leading-[60px] text-[#e1cd3c] mb-8">
            {sanity?.offeringHeadline ?? 'Offering'}
          </h2>
          <p className="font-signifier font-light text-[20px] md:text-[24px] leading-relaxed text-[#e1cd3c]/80 max-w-3xl mb-10">
            {offeringBodyFull}
          </p>
          <Link
            href="/offering"
            className="font-cadiz text-[14px] tracking-widest uppercase text-[#e1cd3c]/70 hover:text-[#e1cd3c] transition-colors duration-200 border-b border-[#e1cd3c]/30 pb-0.5"
          >
            {sanity?.offeringCta ?? t('offeringCtaLearn')} ›
          </Link>
        </div>
      </section>

      {/* ── 5. Press marquee ──────────────────────────────────────────────── */}
      <section
        className="bg-[#ede8e2] overflow-hidden"
        style={{ minHeight: '88px' }}
        aria-label="Press mentions"
      >
        <div className="flex items-center" style={{ minHeight: '88px' }}>
          {/*
            Four identical copies inside a single animate-marquee wrapper.
            The keyframe translates by -25% (= exactly one copy's width),
            guaranteeing a seamless infinite loop with no gap or jump.
            Plain <img> (not next/image) lets height:20px + width:auto
            work reliably on local /public assets.
            filter:brightness(0) renders each logo as dark ink on the beige bg.
          */}
          <div
            className="flex animate-marquee whitespace-nowrap items-center"
            style={{ willChange: 'transform' }}
          >
            {[0, 1, 2, 3].map((copy) =>
              PRESS_LOGOS.map((logo, i) => (
                /* inline-block (not inline-flex) so the img's intrinsic
                   aspect ratio correctly determines its width at height:20px */
                <span
                  key={`${copy}-${i}`}
                  style={{ display: 'inline-block', paddingLeft: '72px', paddingRight: '72px' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    style={{
                      display: 'block',
                      height: '20px',
                      width: 'auto',
                      filter: 'brightness(0)',
                    }}
                  />
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonial ───────────────────────────────────────────────── */}
      <section
        className="flex flex-col md:flex-row"
        style={{ minHeight: '80vh' }}
        aria-label="Client testimonial"
      >
        {/* Left: image */}
        <div className="relative w-full md:w-1/2 h-[50vw] md:h-auto min-h-[320px]">
          <Image
            src={testimonialImageUrl}
            alt={sanity?.testimonialImage?.alt ?? 'Studio Bosko interior project'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Right: quote */}
        <div className="w-full md:w-1/2 bg-[#60bf83] flex flex-col justify-center px-10 md:px-14 lg:px-20 py-16">
          <blockquote className="font-signifier font-light text-[30px] leading-[42px] text-white mb-8" style={{ letterSpacing: '-0.6px' }}>
            {testimonialQuote}
          </blockquote>
          <p className="font-cadiz text-sm text-white/70 tracking-wide">
            {testimonialAttribution}
          </p>
        </div>
      </section>

      {/* ── 7. CTA section ────────────────────────────────────────────────── */}
      <section
        className="bg-[#705305] py-20 md:py-28 px-8 md:px-16 lg:px-24 w-full"
        aria-label="Start a project"
      >
        <div className="max-w-[1440px] mx-auto">
          <p className="font-signifier font-light text-[30px] leading-[42px] text-[#e1cd3c] max-w-2xl mb-10" style={{ letterSpacing: '-0.6px' }}>
            {ctaBody}
          </p>
          <Link
            href="/inquire"
            className="font-cadiz text-[14px] tracking-widest uppercase text-[#e1cd3c]/70 hover:text-[#e1cd3c] transition-colors duration-200 border-b border-[#e1cd3c]/30 pb-0.5"
          >
            {ctaBtn} ›
          </Link>
        </div>
      </section>
    </>
  )
}
