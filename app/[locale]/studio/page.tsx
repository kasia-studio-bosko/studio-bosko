import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import ParallaxImage from '@/components/ParallaxImage'
import { getStudioPageContent } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import { ptToStrings } from '@/lib/sanity/utils'
import PageNavTheme from '@/components/PageNavTheme'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const [t, sanity] = await Promise.all([
    getTranslations({ locale, namespace: 'studio' }),
    getStudioPageContent(locale),
  ])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  const path = locale === 'en' ? '/studio' : `/${locale}/studio`

  const title = sanity?.seoTitle ?? t('metaTitle')
  const description = sanity?.seoDescription ?? t('metaDescription')

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        'x-default': `${siteUrl}/studio`,
        en: `${siteUrl}/studio`,
        de: `${siteUrl}/de/studio`,
        pl: `${siteUrl}/pl/studio`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
    },
  }
}

// ── Fallback image constants (Framer-hosted) ──────────────────────────────────
const FALLBACK_KASIA_PORTRAIT   = 'https://framerusercontent.com/images/R8TMgB8ZuigjgRdDrkIq1XL8pyE.jpg'
const FALLBACK_KASIA_STUDIO     = 'https://framerusercontent.com/images/8v65b9JTdh7Lt2d0LE7LfBwg.jpg'
const FALLBACK_FURNITURE_DETAIL = 'https://framerusercontent.com/images/TmcA1nzDm35cOZWzjts2wkS6kZ0.jpg'
const FALLBACK_ALTBAU           = 'https://framerusercontent.com/images/5UTLSTSHs0DzqrK1CoNNl85Uro.jpg'
const FALLBACK_TESTIMONIAL      = 'https://framerusercontent.com/images/PHAwXxLNYORjMHEr1SMzbzN9KkM.jpg'

export default async function StudioPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const [t, sanity] = await Promise.all([
    getTranslations({ locale, namespace: 'studio' }),
    getStudioPageContent(locale),
  ])

  // Headline — Sanity first, translation fallback
  const headline = sanity?.heroHeadline ?? t('headline')

  // About body paragraphs — Sanity first, translation fallback
  const bodyParas = ptToStrings(sanity?.aboutBody)
  const aboutBody1 = bodyParas[0] ?? t('aboutBody1')
  const aboutBody2 = bodyParas[1] ?? t('aboutBody2')
  const aboutBody3 = bodyParas[2] ?? t('aboutBody3')

  // Ethos bullets — Sanity first, translation fallback
  const ethosBullets: string[] = sanity?.ethosBullets?.map((b) => b.text).filter(Boolean) as string[] ??
    (t.raw('ethosPoints') as string[])

  // Testimonial (Yellowtrace quote) — Sanity first, translation fallback
  const testimonialQuote       = sanity?.yellowtraceQuote  ?? t('testimonialQuote')
  const testimonialAttribution = sanity?.yellowtraceAttribution ?? t('testimonialAttribution')

  // Images — Sanity first, fallback to Framer-hosted URLs
  const kasiaPortraitUrl = sanity?.kasiaPhoto1?.asset?._ref
    ? urlFor(sanity.kasiaPhoto1).auto('format').url()
    : FALLBACK_KASIA_PORTRAIT

  const kasiaStudioUrl = sanity?.kasiaPhoto2?.asset?._ref
    ? urlFor(sanity.kasiaPhoto2).auto('format').url()
    : FALLBACK_KASIA_STUDIO

  const furnitureDetailUrl = sanity?.studioPhoto1?.asset?._ref
    ? urlFor(sanity.studioPhoto1).auto('format').url()
    : FALLBACK_FURNITURE_DETAIL

  const altbauUrl = sanity?.studioPhoto2?.asset?._ref
    ? urlFor(sanity.studioPhoto2).auto('format').url()
    : FALLBACK_ALTBAU

  const testimonialImageUrl = sanity?.testimonialImage?.asset?._ref
    ? urlFor(sanity.testimonialImage).auto('format').url()
    : FALLBACK_TESTIMONIAL

  return (
    <>
      <PageNavTheme color="#2d1d17" />
      {/* ─────────────────────────────────────────────────────────────────────
          HERO — headline lower-left + Kasia portrait upper-right
      ───────────────────────────────────────────────────────────────────── */}
      <section
        className="overflow-hidden"
        style={{ paddingTop: 'var(--section-padding-y)' }}
        aria-label="Studio hero"
      >
        <div className="page-container">
          <div
            className="relative"
            style={{ minHeight: 'min(calc(44vw * 738 / 578), 580px)' }}
          >
            {/* Left — headline, pushed to the bottom */}
            <div
              className="flex flex-col justify-end pr-8 md:pr-16"
              style={{
                width: '53%',
                minHeight: 'min(calc(44vw * 738 / 578), 580px)',
              }}
            >
              <ScrollReveal delay={80}>
                <h1
                  className="font-signifier font-light text-balance text-[#2d1d17]"
                  style={{
                    fontSize: 'clamp(28px, 3.2vw, 46px)',
                    lineHeight: 1.18,
                    letterSpacing: '-0.3px',
                  }}
                >
                  {headline}
                </h1>
              </ScrollReveal>
            </div>

            {/* Right — Kasia portrait, top-aligned */}
            <div
              className="absolute top-0 right-0 overflow-hidden bg-[#d4cbc0]"
              style={{ width: '44%', aspectRatio: '578 / 738' }}
            >
              <Image
                src={kasiaPortraitUrl}
                alt={sanity?.kasiaPhoto1?.alt ?? 'Kasia Kronberger, founder of Studio Bosko'}
                fill
                sizes="(max-width: 768px) 100vw, 44vw"
                className="object-cover"
                quality={90}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FULL-BLEED STUDIO PHOTO — 400px tall, centred crop, parallax
      ───────────────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden bg-[#d4cbc0] mt-10 md:mt-14"
        style={{ height: '400px' }}
      >
        <ParallaxImage
          src={kasiaStudioUrl}
          alt={sanity?.kasiaPhoto2?.alt ?? 'Kasia Kronberger at work in the studio'}
          sizes="100vw"
          speed={0.25}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ABOUT — right-column layout (~64% width, left margin ~36%)
      ───────────────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="About the studio">
        <div className="page-container">
          <ScrollReveal>
            <div className="md:ml-[36%]">
              <p className="label-serif mb-6">{sanity?.aboutHeading ?? t('aboutHeading')}</p>
              <div className="space-y-5 max-w-[660px]">
                <p className="font-cadiz text-base md:text-[17px] leading-relaxed text-[#2d1d17]/80">
                  {aboutBody1}
                </p>
                <p className="font-cadiz text-base md:text-[17px] leading-relaxed text-[#2d1d17]/80">
                  {aboutBody2}
                </p>
                <p className="font-cadiz text-base md:text-[17px] leading-relaxed text-[#2d1d17]/80">
                  {aboutBody3}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FURNITURE DETAIL — right-column, landscape
      ───────────────────────────────────────────────────────────────────── */}
      <div className="page-container">
        <ScrollReveal>
          <div className="md:ml-[36%]">
            <div
              className="relative overflow-hidden bg-[#d4cbc0]"
              style={{ aspectRatio: '747 / 498' }}
            >
              <Image
                src={furnitureDetailUrl}
                alt={sanity?.studioPhoto1?.alt ?? 'Bespoke furniture detail — Studio Bosko'}
                fill
                sizes="(max-width: 768px) 100vw, 57vw"
                className="object-cover"
                quality={90}
              />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ETHOS — right-column layout
      ───────────────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Studio ethos">
        <div className="page-container">
          <div className="md:ml-[36%] max-w-[660px]">
            <ScrollReveal>
              <p className="label-serif mb-6">{t('ethosHeading')}</p>
              <p className="font-cadiz text-base md:text-[17px] leading-relaxed text-[#2d1d17]/80 mb-8">
                {t('ethosBody')}
              </p>
              <p className="font-signifier font-light text-sm tracking-wide text-[#2d1d17]/55 mb-5">
                {t('ethosSubheading')}
              </p>
              <ul className="space-y-4 mb-10">
                {ethosBullets.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 font-cadiz text-[15px] text-[#2d1d17]/75 leading-relaxed"
                  >
                    <span className="shrink-0 text-[#2d1d17]/30 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <Link href={{ pathname: '/offering' }} className="btn-primary inline-flex">
                {t('ctaOffering')} →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          ALTBAU IMAGE — right-column, landscape
      ───────────────────────────────────────────────────────────────────── */}
      <div className="page-container pb-[var(--section-padding-y)]">
        <ScrollReveal>
          <div className="md:ml-[36%]">
            <div
              className="relative overflow-hidden bg-[#d4cbc0]"
              style={{ aspectRatio: '747 / 498' }}
            >
              <Image
                src={altbauUrl}
                alt={sanity?.studioPhoto2?.alt ?? 'Altbau renovation — Studio Bosko Berlin'}
                fill
                sizes="(max-width: 768px) 100vw, 57vw"
                className="object-cover"
                quality={90}
              />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          TESTIMONIAL — 50/50 full-bleed split
          Left  50%: penthouse photo
          Right 50%: sage green (#60BF83) box with Yellowtrace quote
      ───────────────────────────────────────────────────────────────────── */}
      <section
        className="flex flex-col md:flex-row overflow-hidden"
        aria-label="Press testimonial"
      >
        {/* Left — testimonial image */}
        <div
          className="relative overflow-hidden bg-[#d4cbc0] w-full md:w-1/2"
          style={{ aspectRatio: '650 / 671' }}
        >
          <Image
            src={testimonialImageUrl}
            alt={sanity?.testimonialImage?.alt ?? 'Studio Bosko interior project'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            quality={90}
          />
        </div>

        {/* Right — green box with Yellowtrace quote */}
        <div
          className="w-full md:w-1/2 flex items-center"
          style={{ backgroundColor: '#60BF83', minHeight: 'clamp(320px, 40vw, 671px)' }}
        >
          <div className="px-8 md:px-10 lg:px-14 xl:px-16 py-12 max-w-[500px]">
            <ScrollReveal>
              <blockquote
                className="font-signifier font-light text-[#2d1d17] mb-6"
                style={{
                  fontSize: 'clamp(18px, 2.2vw, 30px)',
                  lineHeight: 1.38,
                  letterSpacing: '-0.2px',
                }}
              >
                &ldquo;{testimonialQuote}&rdquo;
              </blockquote>
              <p className="font-cadiz text-sm text-[#2d1d17]/70">
                {testimonialAttribution}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
