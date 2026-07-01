import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PortableText } from 'next-sanity'
import ScrollReveal from '@/components/ScrollReveal'
import PageNavTheme from '@/components/PageNavTheme'
import { getFaqPageContent } from '@/lib/sanity/queries'
import { ptToStrings } from '@/lib/sanity/utils'
import type { PortableTextContent } from '@/lib/sanity/queries'

export const revalidate = 3600

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params
  const sanity = await getFaqPageContent(locale)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  const canonical = locale === 'en' ? `${siteUrl}/faq` : `${siteUrl}/${locale}/faq`

  return {
    title: { absolute: sanity?.seoTitle ?? 'FAQ | Studio Bosko' },
    description: sanity?.seoDescription ?? 'Frequently asked questions about working with Studio Bosko — interior design process, investment, and project scope.',
    alternates: {
      canonical,
      languages: {
        'x-default': `${siteUrl}/faq`,
        en: `${siteUrl}/faq`,
        de: `${siteUrl}/de/faq`,
        pl: `${siteUrl}/pl/faq`,
      },
    },
  }
}

// ── Plain-text extractor for JSON-LD ─────────────────────────────────────────
function ptToPlainText(content: PortableTextContent | null | undefined): string {
  return ptToStrings(content).join(' ')
}

export default async function FaqPage({ params }: Props) {
  const { locale } = params
  setRequestLocale(locale)

  const sanity = await getFaqPageContent(locale)
  const heading  = sanity?.heading  ?? 'FAQ'
  const faqItems = sanity?.faqItems ?? []

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  const canonical = locale === 'en' ? `${siteUrl}/faq` : `${siteUrl}/${locale}/faq`

  // ── FAQPage JSON-LD ────────────────────────────────────────────────────────
  const faqSchema = faqItems.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        url: canonical,
        name: heading,
        isPartOf: { '@id': `${siteUrl}/#website` },
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: ptToPlainText(item.answer),
          },
        })),
      }
    : null

  return (
    <>
      <PageNavTheme color="#2d1d17" />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className="section-spacing" aria-label="FAQ">
        <div className="page-container">

          {/* Page heading */}
          <ScrollReveal>
            <h1
              className="font-signifier font-light text-[#2d1d17] mb-14 md:mb-20"
              style={{
                fontSize: 'clamp(36px, 4vw, 60px)',
                lineHeight: 1.1,
                letterSpacing: '-0.4px',
              }}
            >
              {heading}
            </h1>
          </ScrollReveal>

          {/* Q&A list */}
          {faqItems.length > 0 ? (
            <dl className="max-w-[740px] divide-y divide-[#2d1d17]/10 [&>*:first-child>div]:pt-0 [&>*:last-child>div]:pb-0">
              {faqItems.map((item, i) => (
                <ScrollReveal key={item.question ?? i} delay={i * 60}>
                  <div className="pt-14 pb-14 md:pt-16 md:pb-16">
                    <dt
                      className="font-signifier font-light text-[#2d1d17] mb-6"
                      style={{
                        fontSize: 'clamp(18px, 1.9vw, 26px)',
                        lineHeight: 1.25,
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {item.question}
                    </dt>
                    {Array.isArray(item.answer) && item.answer.length > 0 && (
                      <dd className="font-cadiz text-[15px] md:text-base leading-relaxed text-[#2d1d17]/70 space-y-4 [&>p]:mb-0">
                        <PortableText value={item.answer as PortableTextContent} />
                      </dd>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </dl>
          ) : (
            <p className="font-cadiz text-[15px] text-[#2d1d17]/50">Loading&hellip;</p>
          )}

        </div>
      </section>
    </>
  )
}
