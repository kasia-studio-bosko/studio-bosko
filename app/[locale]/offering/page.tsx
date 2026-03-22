import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'offering' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const slugMap: Record<string, string> = { en: 'offering', de: 'leistungen', pl: 'oferta' }
  const path = locale === 'en' ? '/offering' : `/${locale}/${slugMap[locale]}`

  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        'x-default': `${siteUrl}/offering`,
        en: `${siteUrl}/offering`,
        de: `${siteUrl}/de/leistungen`,
        pl: `${siteUrl}/pl/oferta`,
      },
    },
  }
}

const PHOTO_BOOKSHELF  = 'https://framerusercontent.com/images/9RomZBJL6uDE9riO4mhK43xA.jpg'
const PHOTO_MOODBOARD  = 'https://framerusercontent.com/images/rbIRqe2yxSTp84HPR7YpLWO59o.jpg'
const PHOTO_FLOORPLAN  = 'https://framerusercontent.com/images/MU12NSy3wj6azUf80fouUcr6Bpg.png'
const PHOTO_PENTHOUSE  = 'https://framerusercontent.com/images/BLcEb8zhESV8vCYUNx12PnA9d5c.jpg'


export default async function OfferingPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'offering' })

  const scopeItems = t.raw('scopeItems') as string[]
  const noItems = t.raw('noItems') as string[]
  const projectTypes = t.raw('projectTypes') as Array<{ title: string; body: string }>

  return (
    <>
      {/* ── Hero — headline left, portrait right (matches bosko.studio/offering) ── */}
      <section className="section-spacing overflow-hidden" aria-label="Offering hero">
        <div className="page-container">
          <div className="relative">
            {/* Headline — left column */}
            <div className="max-w-[55%] pr-8">
              <ScrollReveal>
                <p className="label-serif mb-4">Studio Bosko</p>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h1
                  className="font-signifier font-light text-balance text-[#2d1d17]"
                  style={{ fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.2, letterSpacing: '-0.3px' }}
                >
                  {t('headline')}
                </h1>
              </ScrollReveal>
            </div>

            {/* Bookshelf portrait — right, ~44% wide */}
            <ScrollReveal delay={60}>
              <div
                className="absolute top-0 right-0 overflow-hidden bg-[#d4cbc0]"
                style={{ width: '44%', aspectRatio: '578 / 867' }}
              >
                <Image
                  src={PHOTO_BOOKSHELF}
                  alt="Curated bookshelf — Studio Bosko"
                  fill
                  sizes="44vw"
                  className="object-cover"
                  priority
                />
              </div>
            </ScrollReveal>

            {/* Spacer */}
            <div style={{ paddingTop: 'min(calc(44vw * 867/578), 660px)' }} />
          </div>
        </div>
      </section>

      {/* ── Full-bleed moodboard photo ───────────────────────────────────────── */}
      <ScrollReveal>
        <div className="relative w-full overflow-hidden bg-[#d4cbc0]" style={{ aspectRatio: '1299 / 1948' }}>
          <Image
            src={PHOTO_MOODBOARD}
            alt="Design moodboard — Studio Bosko"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </ScrollReveal>

      {/* ── What we do ───────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Offering detail">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left */}
            <ScrollReveal>
              <p className="label-serif mb-6">Offering</p>
              <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#2d1d17]/80">
                {t('mainBody1')}
              </p>
            </ScrollReveal>

            {/* Right: scope + exclusions */}
            <div className="space-y-10">
              <ScrollReveal delay={100}>
                <p className="font-signifier font-light text-sm tracking-wide text-[#2d1d17]/60 mb-4">
                  {t('scopeHeading')}
                </p>
                <ul className="space-y-2">
                  {scopeItems.map((item) => (
                    <li key={item} className="flex gap-3 font-cadiz text-sm text-[#2d1d17]/75 leading-relaxed">
                      <span className="shrink-0 text-[#2d1d17]/30 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <p className="font-signifier font-light text-sm tracking-wide text-[#2d1d17]/60 mb-4">
                  {t('noHeading')}
                </p>
                <ul className="space-y-2 mb-6">
                  {noItems.map((item) => (
                    <li key={item} className="flex gap-3 font-cadiz text-sm text-[#2d1d17]/50 leading-relaxed">
                      <span className="shrink-0 mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-signifier font-light text-base italic text-[#2d1d17]/70">
                  {t('tagline')}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <Link href={{ pathname: '/inquire' }} className="btn-primary inline-flex">
                  {t('reachOut')} →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Floor plan image ─────────────────────────────────────────────────── */}
      <ScrollReveal>
        <div className="relative w-full overflow-hidden bg-[#ede8e2]" style={{ aspectRatio: '16 / 9' }}>
          <Image
            src={PHOTO_FLOORPLAN}
            alt="Interior design floor plan drawing — Studio Bosko"
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </ScrollReveal>

      {/* ── Project types ─────────────────────────────────────────────────────── */}
      <section className="section-spacing bg-[#d4cbc0]" aria-label="Types of projects">
        <div className="page-container">
          <ScrollReveal>
            <p className="label-serif mb-12">{t('projectTypesHeading')}</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {projectTypes.map(({ title, body }, i) => (
              <ScrollReveal key={title} delay={i * 80}>
                <h2
                  className="font-signifier font-normal mb-4"
                  style={{ fontSize: 'clamp(36px, 3.5vw, 50px)', lineHeight: 1.2 }}
                >
                  {title}
                </h2>
                <p className="font-cadiz text-sm leading-relaxed text-[#2d1d17]/70">
                  {body}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial with penthouse image background ──────────────────────── */}
      <section className="relative section-spacing overflow-hidden" aria-label="Client testimonial">
        <div className="absolute inset-0">
          <Image
            src={PHOTO_PENTHOUSE}
            alt="Penthouse living room — Studio Bosko"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#2d1d17]/70" />
        </div>
        <div className="relative page-container max-w-2xl">
          <ScrollReveal>
            <blockquote
              className="font-signifier font-light text-balance text-white mb-6"
              style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', lineHeight: 1.4, letterSpacing: '-0.3px' }}
            >
              &ldquo;{t('testimonialQuote')}&rdquo;
            </blockquote>
            <p className="font-cadiz text-sm text-white/70">{t('testimonialAttribution')}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Start your project">
        <div className="page-container max-w-2xl text-center mx-auto">
          <ScrollReveal>
            <h2
              className="font-signifier font-normal mb-8 text-balance"
              style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: 1.15 }}
            >
              Ready to begin?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href={{ pathname: '/inquire' }} className="btn-primary">
              Begin your project →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
