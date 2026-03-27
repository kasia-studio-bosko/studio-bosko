import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import InquireForm from '@/components/InquireForm'
import ScrollReveal from '@/components/ScrollReveal'
import { getInquirePageContent } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const [t, sanity] = await Promise.all([
    getTranslations({ locale, namespace: 'inquire' }),
    getInquirePageContent(locale),
  ])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const slugMap: Record<string, string> = { en: 'inquire', de: 'anfrage', pl: 'zapytanie' }
  const path = locale === 'en' ? '/inquire' : `/${locale}/${slugMap[locale]}`

  const title       = sanity?.seoTitle ?? t('metaTitle')
  const description = sanity?.seoDescription ?? t('metaDescription')

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        'x-default': `${siteUrl}/inquire`,
        en: `${siteUrl}/inquire`,
        de: `${siteUrl}/de/anfrage`,
        pl: `${siteUrl}/pl/zapytanie`,
      },
    },
  }
}

const FALLBACK_SIDE_IMAGE = 'https://framerusercontent.com/images/BLcEb8zhESV8vCYUNx12PnA9d5c.jpg'

export default async function InquirePage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const [t, sanity] = await Promise.all([
    getTranslations({ locale, namespace: 'inquire' }),
    getInquirePageContent(locale),
  ])

  const heroHeading  = sanity?.headline ?? t('heroHeading')
  const heroBody     = sanity?.subtext  ?? t('heroBody')
  const sideImageUrl = sanity?.sideImage?.asset?._ref
    ? urlFor(sanity.sideImage).auto('format').url()
    : FALLBACK_SIDE_IMAGE

  return (
    // Dark background for this page — overrides the layout bg
    <div className="min-h-screen bg-[#2d1d17] text-[#ede8e2]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left: form */}
        <div className="flex flex-col justify-center page-container lg:px-[var(--page-padding-x)] py-16 lg:py-20">
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-[30px] leading-[42px] text-balance mb-4" style={{ letterSpacing: '-0.2px' }}>
              {heroHeading}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="font-cadiz text-base text-[#ede8e2]/70 mb-12 max-w-md leading-relaxed">
              {heroBody}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <InquireForm
              formQuestions={sanity?.formQuestions}
              labelFirstName={sanity?.labelFirstName}
              labelLastName={sanity?.labelLastName}
              labelEmail={sanity?.labelEmail}
              labelSubmit={sanity?.labelSubmit}
            />
          </ScrollReveal>
        </div>

        {/* Right: image — sticky on desktop */}
        <div className="hidden lg:block relative">
          <div className="sticky top-0 h-screen">
            <Image
              src={sideImageUrl}
              alt={sanity?.sideImage?.alt ?? 'Studio Bosko interior — inquire about your project'}
              fill
              sizes="50vw"
              className="object-cover"
              quality={90}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
