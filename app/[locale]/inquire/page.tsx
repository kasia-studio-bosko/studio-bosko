import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import InquireForm from '@/components/InquireForm'
import ScrollReveal from '@/components/ScrollReveal'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'inquire' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const slugMap: Record<string, string> = { en: 'inquire', de: 'anfrage', pl: 'zapytanie' }
  const path = locale === 'en' ? '/inquire' : `/${locale}/${slugMap[locale]}`

  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
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

const INQUIRE_IMAGE = 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

export default async function InquirePage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'inquire' })

  return (
    // Dark background for this page — overrides the layout bg
    <div className="min-h-screen bg-[#2d1d17] text-[#ede8e2]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left: form */}
        <div className="flex flex-col justify-center page-container lg:px-[var(--page-padding-x)] py-16 lg:py-20">
          <ScrollReveal>
            <p className="label-serif text-[#ede8e2]/50 mb-4">Studio Bosko</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-display-lg tracking-tight text-balance mb-4">
              {t('heroHeading')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="font-cadiz text-base text-[#ede8e2]/70 mb-12 max-w-md leading-relaxed">
              {t('heroBody')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <InquireForm />
          </ScrollReveal>
        </div>

        {/* Right: image — sticky on desktop */}
        <div className="hidden lg:block relative">
          <div className="sticky top-0 h-screen">
            <Image
              src={INQUIRE_IMAGE}
              alt="Studio Bosko interior — inquire about your project"
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
