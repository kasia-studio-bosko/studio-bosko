import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
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

const PRESS_ITEMS = [
  { publication: 'Domino', issue: 'Home Front / Fall 2025' },
  { publication: '&Living', issue: 'June 2025' },
  { publication: '&Living', issue: 'May 2025' },
  { publication: 'Architectural Digest', issue: 'April 2025' },
  { publication: 'AD Spain', issue: 'April 2025' },
  { publication: 'est living', issue: 'April 2025' },
  { publication: 'AD Germany', issue: 'March 2025' },
  { publication: 'BauNetz', issue: 'January 2025' },
  { publication: 'AD100 AD Polska', issue: 'December 2024' },
  { publication: 'VOGUE Poland', issue: 'November 2024' },
  { publication: 'ELLE Indonesia', issue: 'November 2024' },
  { publication: 'AD Germany', issue: 'November 2024' },
  { publication: 'Yellowtrace', issue: 'October 2024' },
  { publication: 'Elle Decoration UK', issue: 'October 2024' },
  { publication: 'Elle Decoration UK', issue: 'September 2024' },
  { publication: 'AD Middle East', issue: 'April 2024' },
  { publication: 'AD Germany', issue: 'August 2024' },
  { publication: 'VOGUE Poland', issue: 'January 2024' },
  { publication: 'Living Corriere', issue: 'February 2024' },
  { publication: 'VOGUE Poland', issue: 'December 2023' },
  { publication: 'Label Magazine', issue: 'January 2024' },
  { publication: 'Design Alive', issue: 'October 2023' },
  { publication: 'Architectural Digest', issue: 'October 2023' },
]

export default async function PressPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)

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
              Press
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="font-cadiz text-[15px] leading-[21px] text-[#120b09]/75 max-w-2xl">
              Studio Bosko has been named AD100 for 2025 and featured in print and online across international publications and platforms. Browse our archive of stories and features.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Press list ────────────────────────────────────────────────────── */}
      <section className="pb-section-y" aria-label="Press coverage">
        <div className="page-container max-w-3xl">
          <div className="divide-y divide-[#120b09]/10">
            {PRESS_ITEMS.map((item, i) => (
              <ScrollReveal key={`${item.publication}-${item.issue}`} delay={Math.min(i * 30, 300)}>
                <div className="py-5 flex items-baseline justify-between gap-6">
                  <p className="font-cadiz text-[15px] leading-[21px] text-[#120b09]">
                    {item.publication}
                  </p>
                  <p className="font-cadiz text-sm text-[#120b09]/50 shrink-0">
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
              Start a project with Studio Bosko
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <a href="/inquire" className="btn-primary-dark">
              Inquire →
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
