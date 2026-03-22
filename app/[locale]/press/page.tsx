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
  const t = await getTranslations({ locale, namespace: 'press' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const slugMap: Record<string, string> = { en: 'press', de: 'presse', pl: 'prasa' }
  const path = locale === 'en' ? '/press' : `/${locale}/${slugMap[locale]}`

  return {
    title: { absolute: t('metaTitle') },
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

type FeaturedItem = { publication: string; issue: string; image: string }
type ArchiveItem = { publication: string; issue: string }

export default async function PressPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'press' })

  const featuredItems = t.raw('featuredItems') as FeaturedItem[]
  const archiveItems = t.raw('archiveItems') as ArchiveItem[]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Press hero">
        <div className="page-container max-w-3xl">
          <ScrollReveal>
            <p className="label-serif mb-4">Studio Bosko</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-[30px] leading-[42px] text-balance mb-8" style={{ letterSpacing: '-0.2px' }}>
              {t('heroHeading')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="font-cadiz text-[15px] leading-[21px] text-[#2d1d17]/75 max-w-2xl">
              {t('heroBody')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Featured press — 2×2 image grid ─────────────────────────────── */}
      <section className="pb-section-y" aria-label="Featured press coverage">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {featuredItems.map((item, i) => (
              <ScrollReveal key={`${item.publication}-${i}`} delay={i * 60}>
                <div className="flex flex-col gap-3">
                  <div className="relative w-full overflow-hidden bg-[#d4cbc0]" style={{ aspectRatio: '3 / 4' }}>
                    <Image
                      src={item.image}
                      alt={`${item.publication} — ${item.issue}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
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

      {/* ── Archive list ──────────────────────────────────────────────────── */}
      <section className="pb-section-y" aria-label="Press archive">
        <div className="page-container max-w-3xl">
          <ScrollReveal>
            <p className="label-serif mb-8">{t('featuredIn')}</p>
          </ScrollReveal>
          <div className="divide-y divide-[#2d1d17]/10">
            {archiveItems.map((item, i) => (
              <ScrollReveal key={`${item.publication}-${item.issue}-${i}`} delay={Math.min(i * 25, 300)}>
                <div className="py-5 flex items-baseline justify-between gap-6">
                  <p className="font-cadiz text-[15px] leading-[21px] text-[#2d1d17]">
                    {item.publication}
                  </p>
                  <p className="font-cadiz text-sm text-[#2d1d17]/50 shrink-0">
                    {item.issue}
                  </p>
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
