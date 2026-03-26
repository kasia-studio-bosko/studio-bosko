import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import { getAllPressItems, getPressPageContent, type PressItem } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import PageNavTheme from '@/components/PageNavTheme'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const [t, sanity] = await Promise.all([
    getTranslations({ locale, namespace: 'press' }),
    getPressPageContent(locale),
  ])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const slugMap: Record<string, string> = { en: 'press', de: 'presse', pl: 'prasa' }
  const path = locale === 'en' ? '/press' : `/${locale}/${slugMap[locale]}`

  const title       = sanity?.seoTitle       ?? t('metaTitle')
  const description = sanity?.seoDescription ?? t('metaDescription')

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        'x-default': `${siteUrl}/press`,
        en: `${siteUrl}/press`,
        de: `${siteUrl}/de/presse`,
        pl: `${siteUrl}/pl/prasa`,
      },
    },
  }
}

/** Pick the locale-appropriate issue label, falling back to EN. */
function getIssue(item: PressItem, locale: string): string {
  if (locale === 'de') return item.issue?.de || item.issue?.en || ''
  if (locale === 'pl') return item.issue?.pl || item.issue?.en || ''
  return item.issue?.en || ''
}

type FeaturedItem = { publication: string; issue: string; image: string; url?: string }

export default async function PressPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const [t, sanityPage] = await Promise.all([
    getTranslations({ locale, namespace: 'press' }),
    getPressPageContent(locale),
  ])

  const heroHeading = sanityPage?.headline ?? t('heroHeading')
  const heroBody    = sanityPage?.heroBody  ?? t('heroBody')

  // ── Fetch from Sanity; fall back to translation files ────────────────────
  let featuredItems: FeaturedItem[] = []

  try {
    const sanityItems = await getAllPressItems()
    if (sanityItems.length > 0) {
      featuredItems = sanityItems
        .filter((p) => p.featured && p.coverImage?.asset?._ref)
        .map((p) => ({
          publication: p.publication,
          issue:       getIssue(p, locale),
          image:       urlFor(p.coverImage!).auto('format').url(),
          url:         p.externalUrl,
        }))
    }
  } catch {
    /* Sanity not reachable — use fallback */
  }

  if (featuredItems.length === 0) {
    featuredItems = t.raw('featuredItems') as FeaturedItem[]
  }

  return (
    <>
      <PageNavTheme color="#2d1d17" />
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Press hero">
        <div className="page-container max-w-3xl">
          <ScrollReveal>
            <p className="label-serif mb-4">Studio Bosko</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-[30px] leading-[42px] text-balance mb-8" style={{ letterSpacing: '-0.2px' }}>
              {heroHeading}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="font-cadiz text-[15px] leading-[21px] text-[#2d1d17]/75 max-w-2xl">
              {heroBody}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Featured press — 2×2 / 4-col image grid ──────────────────────── */}
      {featuredItems.length > 0 && (
        <section className="pb-section-y" aria-label="Featured press coverage">
          <div className="page-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {featuredItems.map((item, i) => (
                <ScrollReveal key={`${item.publication}-${i}`} delay={i * 60}>
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full overflow-hidden bg-[#d4cbc0]" style={{ aspectRatio: '3 / 4' }}>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block absolute inset-0">
                          <Image
                            src={item.image}
                            alt={`${item.publication} — ${item.issue}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover hover:scale-105 transition-transform duration-500"
                            quality={90}
                          />
                        </a>
                      ) : (
                        <Image
                          src={item.image}
                          alt={`${item.publication} — ${item.issue}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                          quality={90}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-cadiz text-[13px] font-medium text-[#2d1d17] leading-tight">
                        {item.publication}
                      </p>
                      <p className="font-cadiz text-[12px] text-[#2d1d17]/50 leading-tight mt-0.5">
                        {item.issue}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

{/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="section-spacing bg-[#2d1d17] text-[#ede8e2]"
        aria-label="Work with Studio Bosko"
      >
        <div className="page-container max-w-2xl">
          <ScrollReveal>
            <h2 className="font-signifier font-normal text-[50px] leading-[60px] mb-8 text-balance">
              {t('ctaHeading')}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href={{ pathname: '/inquire' }} className="btn-primary-dark">
              {t('ctaButton')}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
