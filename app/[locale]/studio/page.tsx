import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import ParallaxImage from '@/components/ParallaxImage'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'studio' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  const path = locale === 'en' ? '/studio' : `/${locale}/studio`

  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
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
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${siteUrl}${path}`,
    },
  }
}

// ── Image constants (from bosko.studio) ──────────────────────────────────────
const PHOTO_KASIA_PORTRAIT   = 'https://framerusercontent.com/images/R8TMgB8ZuigjgRdDrkIq1XL8pyE.jpg'
const PHOTO_KASIA_STUDIO     = 'https://framerusercontent.com/images/8v65b9JTdh7Lt2d0LE7LfBwg.jpg'
const PHOTO_FURNITURE_DETAIL = 'https://framerusercontent.com/images/TmcA1nzDm35cOZWzjts2wkS6kZ0.jpg'
const PHOTO_ALTBAU           = 'https://framerusercontent.com/images/5UTLSTSHs0DzqrK1CoNNl85Uro.jpg'
const PHOTO_PENTHOUSE        = 'https://framerusercontent.com/images/PHAwXxLNYORjMHEr1SMzbzN9KkM.jpg'

export default async function StudioPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'studio' })

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────
          HERO — headline lower-left + Kasia portrait upper-right
          Reference: bosko.studio/studio
            • Portrait: 578×652 rendered, right side of page (x=691 on 1299px)
            • Headline: left 53%, bottom-aligned (flex-col justify-end)
            • Both elements share the same bottom edge
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
            {/* Left — label + headline, pushed to the bottom */}
            <div
              className="flex flex-col justify-end pr-8 md:pr-16"
              style={{
                width: '53%',
                minHeight: 'min(calc(44vw * 738 / 578), 580px)',
              }}
            >
              <ScrollReveal>
                <p className="label-serif mb-5">Studio Bosko</p>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <h1
                  className="font-signifier font-light text-balance text-[#2d1d17]"
                  style={{
                    fontSize: 'clamp(28px, 3.2vw, 46px)',
                    lineHeight: 1.18,
                    letterSpacing: '-0.3px',
                  }}
                >
                  {t('headline')}
                </h1>
              </ScrollReveal>
            </div>

            {/* Right — Kasia portrait, top-aligned, with parallax */}
            <div
              className="absolute top-0 right-0 overflow-hidden bg-[#d4cbc0]"
              style={{ width: '44%', aspectRatio: '578 / 738' }}
            >
              <ParallaxImage
                src={PHOTO_KASIA_PORTRAIT}
                alt="Kasia Kronberger, founder of Studio Bosko"
                sizes="44vw"
                speed={0.2}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FULL-BLEED STUDIO PHOTO — 100vh, parallax
          Reference: 1299×831 rendered on 831px viewport = exactly 100vh.
      ───────────────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden bg-[#d4cbc0] mt-10 md:mt-14"
        style={{ height: '100vh' }}
      >
        <ParallaxImage
          src={PHOTO_KASIA_STUDIO}
          alt="Kasia Kronberger at work in the studio"
          sizes="100vw"
          speed={0.22}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ABOUT — right-column layout (~64% width, left margin ~36%)
          Reference: text starts at x=473 on a 1299px page (36% from left).
      ───────────────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="About the studio">
        <div className="page-container">
          <ScrollReveal>
            <div className="md:ml-[36%]">
              <p className="label-serif mb-6">{t('aboutHeading')}</p>
              <div className="space-y-5 max-w-[660px]">
                <p className="font-cadiz text-base md:text-[17px] leading-relaxed text-[#2d1d17]/80">
                  {t('aboutBody1')}
                </p>
                <p className="font-cadiz text-base md:text-[17px] leading-relaxed text-[#2d1d17]/80">
                  {t('aboutBody2')}
                </p>
                <p className="font-cadiz text-base md:text-[17px] leading-relaxed text-[#2d1d17]/80">
                  {t('aboutBody3')}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FURNITURE DETAIL — right-column, landscape, parallax
          Reference: left=473, width=747 on 1299px (36% offset, 57% width).
      ───────────────────────────────────────────────────────────────────── */}
      <div className="page-container">
        <ScrollReveal>
          <div className="md:ml-[36%]">
            <div
              className="relative overflow-hidden bg-[#d4cbc0]"
              style={{ aspectRatio: '747 / 498' }}
            >
              <ParallaxImage
                src={PHOTO_FURNITURE_DETAIL}
                alt="Bespoke furniture detail — Studio Bosko"
                sizes="(max-width: 768px) 100vw, 57vw"
                speed={0.25}
              />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          ETHOS — right-column layout, matching About above
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
                {(t.raw('ethosPoints') as string[]).map((item, i) => (
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
          ALTBAU IMAGE — right-column, landscape, parallax
          Same column position as furniture detail above.
      ───────────────────────────────────────────────────────────────────── */}
      <div className="page-container pb-[var(--section-padding-y)]">
        <ScrollReveal>
          <div className="md:ml-[36%]">
            <div
              className="relative overflow-hidden bg-[#d4cbc0]"
              style={{ aspectRatio: '747 / 498' }}
            >
              <ParallaxImage
                src={PHOTO_ALTBAU}
                alt="Altbau renovation — Studio Bosko Berlin"
                sizes="(max-width: 768px) 100vw, 57vw"
                speed={0.25}
              />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          TESTIMONIAL — 50/50 full-bleed split (no page-container padding)
          Left  50%: penthouse photo with parallax
          Right 50%: sage green (#60BF83) box with Yellowtrace quote

          Reference: rgb(96, 191, 131) = #60BF83, quote at x=680 in a
          650px-wide right half = 30px left padding inside the green box.
          Image height 671px on 1299px viewport (≈ aspect 650/671).
      ───────────────────────────────────────────────────────────────────── */}
      <section
        className="flex flex-col md:flex-row overflow-hidden"
        aria-label="Press testimonial"
      >
        {/* Left — penthouse image, parallax */}
        <div
          className="relative overflow-hidden bg-[#d4cbc0] w-full md:w-1/2"
          style={{ aspectRatio: '650 / 671' }}
        >
          <ParallaxImage
            src={PHOTO_PENTHOUSE}
            alt="Penthouse interior — Studio Bosko"
            sizes="(max-width: 768px) 100vw, 50vw"
            speed={0.2}
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
                &ldquo;{t('testimonialQuote')}&rdquo;
              </blockquote>
              <p className="font-cadiz text-sm text-[#2d1d17]/70">
                {t('testimonialAttribution')}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
