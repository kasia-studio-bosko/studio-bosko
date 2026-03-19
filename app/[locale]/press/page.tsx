import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import { getFeaturedPressItems, FALLBACK_PRESS } from '@/lib/sanity/queries'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'press' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const slugMap: Record<string, string> = { en: 'press', de: 'presse', pl: 'prasa' }
  const path = locale === 'en' ? '/press' : `/${locale}/${slugMap[locale]}`

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
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

// Detailed press items with extra info
const PRESS_ITEMS = [
  {
    publication: 'Architectural Digest',
    headline: 'AD100 for 2025',
    description: 'Named to the AD100 list of the world\'s most influential interior designers.',
    date: 'April 2025',
    url: undefined,
    featured: true,
  },
  {
    publication: 'Domino',
    headline: 'Home Front — Fall 2025',
    description: 'Apartment design reinterpreting midcentury modern with colour and intelligent storage.',
    date: 'September 2025',
    url: undefined,
    featured: true,
  },
  {
    publication: 'AD Spain',
    headline: 'January 2026',
    description: 'Berlin penthouse using colour to create vibrant impact.',
    date: 'January 2026',
    url: undefined,
    featured: true,
  },
  {
    publication: 'VOGUE Poland',
    headline: 'October 2025',
    description: 'Interior design for the modern age — Warsaw and Berlin.',
    date: 'October 2025',
    url: undefined,
    featured: false,
  },
  {
    publication: 'VOGUE Poland',
    headline: 'November 2024',
    description: 'Residential interiors by Studio Bosko.',
    date: 'November 2024',
    url: undefined,
    featured: false,
  },
  {
    publication: 'AD Germany',
    headline: 'March 2025',
    description: 'How Studio Bosko layers warmth into contemporary spaces.',
    date: 'March 2025',
    url: undefined,
    featured: false,
  },
  {
    publication: '&Living',
    headline: 'June 2025',
    description: 'The studio approach: material honesty and considered restraint.',
    date: 'June 2025',
    url: undefined,
    featured: false,
  },
  {
    publication: '&Living',
    headline: 'May 2025',
    description: 'Inside a Berlin family home by Studio Bosko.',
    date: 'May 2025',
    url: undefined,
    featured: false,
  },
  {
    publication: 'est living',
    headline: 'April 2025',
    description: 'Earthy palette and natural materials ground a Warsaw penthouse.',
    date: 'April 2025',
    url: undefined,
    featured: false,
  },
  {
    publication: 'BauNetz',
    headline: 'January 2025',
    description: 'Architecture und Innenarchitektur: Studio Bosko Berlin.',
    date: 'January 2025',
    url: undefined,
    featured: false,
  },
  {
    publication: 'AD100 AD Polska',
    headline: 'December 2024',
    description: 'Kasia Kronberger named to AD100 Poland.',
    date: 'December 2024',
    url: undefined,
    featured: false,
  },
  {
    publication: 'ELLE Indonesia',
    headline: 'November 2024',
    description: 'Global design talent: Studio Bosko.',
    date: 'November 2024',
    url: undefined,
    featured: false,
  },
]

export default async function PressPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'press' })

  const featured = PRESS_ITEMS.filter((p) => p.featured)
  const rest = PRESS_ITEMS.filter((p) => !p.featured)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Press hero">
        <div className="page-container max-w-3xl">
          <ScrollReveal>
            <p className="label-serif mb-4">Studio Bosko</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-display-xl tracking-tight text-balance mb-8">
              {t('heroHeading')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/75 max-w-2xl">
              {t('heroBody')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Featured press ────────────────────────────────────────────────── */}
      <section className="pb-section-y" aria-label="Featured press">
        <div className="page-container">
          <ScrollReveal>
            <p className="label-serif mb-10">{t('featuredIn')}</p>
          </ScrollReveal>

          {/* Featured items — large cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {featured.map((item, i) => (
              <ScrollReveal key={`${item.publication}-${item.date}`} delay={i * 80}>
                <div className="border border-[#120b09]/15 p-8 flex flex-col h-full hover:border-[#120b09]/30 transition-colors duration-200">
                  <p className="press-tag mb-4">{item.date}</p>
                  <p className="font-signifier font-light text-display-sm tracking-tight mb-3">
                    {item.publication}
                  </p>
                  <p className="font-cadiz text-sm text-[#120b09]/70 mb-4 leading-relaxed flex-grow">
                    {item.description}
                  </p>
                  <p className="font-signifier font-light italic text-sm text-[#120b09]/50">
                    {item.headline}
                  </p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-text text-xs mt-4 w-fit"
                    >
                      {t('readArticle')} ↗
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Rest — compact list */}
          <div className="divide-y divide-[#120b09]/10">
            {rest.map((item, i) => (
              <ScrollReveal key={`${item.publication}-${item.date}`} delay={Math.min(i * 50, 300)}>
                <div className="py-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-6">
                    <span className="font-cadiz text-xs text-[#120b09]/40 shrink-0 w-24 mt-0.5">
                      {item.date}
                    </span>
                    <div>
                      <p className="font-signifier font-light text-base tracking-tight">
                        {item.publication}
                      </p>
                      <p className="font-cadiz text-sm text-[#120b09]/60 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-text text-xs w-fit shrink-0"
                    >
                      {t('readArticle')} ↗
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="section-spacing bg-[#2d1d17] text-[#ede8e2]"
        aria-label="Work with Studio Bosko"
      >
        <div className="page-container max-w-2xl">
          <ScrollReveal>
            <h2 className="font-signifier font-light text-display-lg tracking-tight mb-8 text-balance">
              Start a project with Studio Bosko
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href="/inquire" className="btn-primary-dark">
              Inquire →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
