import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import { getInquirePageContent } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

const FALLBACK_SIDE_IMAGE = 'https://framerusercontent.com/images/BLcEb8zhESV8vCYUNx12PnA9d5c.jpg'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'inquire' })

  return {
    title: { absolute: `${t('formSuccess')} | Studio Bosko` },
    robots: { index: false, follow: false },
  }
}

export default async function ThankYouPage({
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

  const sideImageUrl = sanity?.sideImage?.asset?._ref
    ? urlFor(sanity.sideImage).auto('format').url()
    : FALLBACK_SIDE_IMAGE

  const ctaLabel: Record<string, string> = {
    en: 'View our projects',
    de: 'Unsere Projekte ansehen',
    pl: 'Zobacz nasze projekty',
  }

  return (
    <div className="min-h-screen bg-[#2d1d17] text-[#ede8e2]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left: thank you message */}
        <div className="flex flex-col justify-center page-container lg:px-[var(--page-padding-x)] py-16 lg:py-20">
          <ScrollReveal delay={100}>
            <h1
              className="font-signifier font-light text-[30px] leading-[42px] text-balance mb-4"
              style={{ letterSpacing: '-0.2px' }}
            >
              {t('formSuccess')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="font-cadiz text-base text-[#ede8e2]/70 mb-12 max-w-md leading-relaxed">
              {t('heroBody')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href={{ pathname: '/projects' }} className="btn-primary-dark inline-flex">
              {ctaLabel[locale] ?? ctaLabel.en} →
            </Link>
          </ScrollReveal>
        </div>

        {/* Right: image — sticky on desktop */}
        <div className="hidden lg:block relative">
          <div className="sticky top-0 h-screen">
            <Image
              src={sideImageUrl}
              alt={sanity?.sideImage?.alt ?? 'Studio Bosko interior'}
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
