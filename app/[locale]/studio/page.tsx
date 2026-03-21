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

// Photos from bosko.studio
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
      {/* ── Hero — headline left, portrait right (matches bosko.studio/studio) ── */}
      <section className="section-spacing overflow-hidden" aria-label="Studio hero">
        <div className="page-container">
          <div className="relative">
            {/* Headline — left column, ~55% width */}
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

            {/* Kasia portrait — right, ~44% wide, absolute top-right */}
            <ScrollReveal delay={60}>
              <div
                className="absolute top-0 right-0 overflow-hidden bg-[#d4cbc0]"
                style={{ width: '44%', aspectRatio: '578 / 738' }}
              >
                <Image
                  src={PHOTO_KASIA_PORTRAIT}
                  alt="Kasia Kronberger, founder of Studio Bosko"
                  fill
                  sizes="44vw"
                  className="object-cover"
                  priority
                />
              </div>
            </ScrollReveal>

            {/* Spacer — height of the portrait so content flows below it */}
            <div style={{ paddingTop: 'min(calc(44vw * 738/578), 600px)' }} />
          </div>
        </div>
      </section>

      {/* ── Full-bleed studio photo (matches bosko.studio) ──────────────────── */}
      <ScrollReveal>
        <div className="relative w-full overflow-hidden bg-[#d4cbc0]" style={{ aspectRatio: '1299 / 1948' }}>
          <Image
            src={PHOTO_KASIA_STUDIO}
            alt="Kasia Kronberger at work in the studio"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </ScrollReveal>

      {/* ── About ──────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="About the studio">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="space-y-10">
              <ScrollReveal>
                <p className="label-serif mb-6">{t('aboutHeading')}</p>
                <div className="space-y-5">
                  <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#2d1d17]/80">
                    {t('aboutBody1')}
                  </p>
                  <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#2d1d17]/80">
                    {t('aboutBody2')}
                  </p>
                  <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#2d1d17]/80">
                    {t('aboutBody3')}
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Ethos */}
            <div className="space-y-8">
              <ScrollReveal delay={100}>
                <div className="border-t border-[#2d1d17]/10 pt-10">
                  <p className="label-serif mb-4">{t('ethosHeading')}</p>
                  <p className="font-cadiz text-base leading-relaxed text-[#2d1d17]/75 mb-8">
                    {t('ethosBody')}
                  </p>
                  <p className="font-signifier font-light text-sm tracking-wide text-[#2d1d17]/60 mb-4">
                    How we approach every project:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'We push functionality forward—prioritising flow, storage and usability from the start, so the space supports your lifestyle effortlessly.',
                      'We curate for visual interest and emotional impact—balancing refined with playful, and old with new.',
                      'We create homes that tell your story—through materials, colours, and the way light moves inside.',
                      'We\'re your trusted advisor—guiding you through the complexity, helping you navigate decisions with confidence and problem-solving instincts.',
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 font-cadiz text-sm text-[#2d1d17]/75 leading-relaxed">
                        <span className="shrink-0 text-[#2d1d17]/30 mt-0.5">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={180}>
                <Link href={{ pathname: '/offering' }} className="btn-primary inline-flex">
                  {t('ctaOffering')} →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Editorial photo trio ────────────────────────────────────────────── */}
      <section className="pb-section-y" aria-label="Studio work">
        {/* Full-bleed landscape: furniture detail */}
        <ScrollReveal>
          <div className="relative w-full overflow-hidden bg-[#d4cbc0] mb-3 md:mb-4" style={{ aspectRatio: '16 / 9' }}>
            <Image
              src={PHOTO_FURNITURE_DETAIL}
              alt="Bespoke furniture detail — Studio Bosko"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </ScrollReveal>

        {/* Side-by-side: Altbau + Penthouse */}
        <div className="flex gap-3 md:gap-4">
          <ScrollReveal className="flex-1">
            <div className="relative w-full overflow-hidden bg-[#d4cbc0]" style={{ aspectRatio: '4 / 5' }}>
              <Image
                src={PHOTO_ALTBAU}
                alt="Altbau renovation — Studio Bosko"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80} className="flex-1">
            <div className="relative w-full overflow-hidden bg-[#d4cbc0]" style={{ aspectRatio: '4 / 5' }}>
              <Image
                src={PHOTO_PENTHOUSE}
                alt="Penthouse interior — Studio Bosko"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Yellowtrace quote ────────────────────────────────────────────────── */}
      <section className="section-spacing bg-[#d4cbc0]" aria-label="Press quote">
        <div className="page-container max-w-3xl">
          <ScrollReveal>
            <blockquote
              className="font-signifier font-light text-balance text-[#2d1d17] mb-6"
              style={{ fontSize: 'clamp(24px, 2.5vw, 34px)', lineHeight: 1.35, letterSpacing: '-0.4px' }}
            >
              &ldquo;One of the most impressive aspects of [Studio Bosko] is how it manages to be both bold and harmonious. (&hellip;) The balance is achieved through vigilant curation of furniture and artwork, balancing the old with the new, the classic with the niche, the hallmark of Studio Bosko&rsquo;s approach.&rdquo;
            </blockquote>
            <p className="font-cadiz text-sm text-[#2d1d17]/60 tracking-widest uppercase">Yellowtrace</p>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
