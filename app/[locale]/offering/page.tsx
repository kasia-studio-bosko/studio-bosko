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

const SERVICE_IMAGE = 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

export default async function OfferingPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'offering' })

  const services = [
    { number: '01', title: t('service1Title'), body: t('service1Body') },
    { number: '02', title: t('service2Title'), body: t('service2Body') },
    { number: '03', title: t('service3Title'), body: t('service3Body') },
    { number: '04', title: t('service4Title'), body: t('service4Body') },
    { number: '05', title: t('service5Title'), body: t('service5Body') },
  ]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Offering hero">
        <div className="page-container">
          <ScrollReveal>
            <p className="label-serif mb-4">{t('heroSubheading')}</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-display-xl tracking-tight text-balance max-w-2xl">
              {t('heroHeading')}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="pb-section-y" aria-label="Services">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: sticky image */}
            <div className="hidden lg:block">
              <div className="sticky top-[calc(var(--header-height)+3rem)]">
                <ScrollReveal>
                  <div className="aspect-[4/5] relative bg-[#d4cbc0] overflow-hidden mr-12">
                    <Image
                      src={SERVICE_IMAGE}
                      alt="Interior design process — Studio Bosko"
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Right: services list */}
            <div className="space-y-0 divide-y divide-[#120b09]/10">
              {services.map(({ number, title, body }, i) => (
                <ScrollReveal key={number} delay={i * 80}>
                  <div className="py-10 md:py-12">
                    <div className="flex items-start gap-6">
                      <span className="font-cadiz text-xs text-[#120b09]/40 mt-1.5 shrink-0 w-6">
                        {number}
                      </span>
                      <div>
                        <h2 className="font-signifier font-light text-display-sm tracking-tight mb-4">
                          {title}
                        </h2>
                        <p className="font-cadiz text-base leading-relaxed text-[#120b09]/75 max-w-prose">
                          {body}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="section-spacing bg-[#d4cbc0]" aria-label="Process">
        <div className="page-container max-w-3xl">
          <ScrollReveal>
            <p className="label-serif mb-4">{t('processHeading')}</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="font-signifier font-light text-display-md tracking-tight text-balance">
              {t('processBody')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="section-spacing bg-[#2d1d17] text-[#ede8e2]"
        aria-label="Start your project"
      >
        <div className="page-container max-w-2xl">
          <ScrollReveal>
            <p className="label-serif text-[#ede8e2]/60 mb-4">{t('ctaBody')}</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="font-signifier font-light text-display-lg tracking-tight mb-8 text-balance">
              Ready to begin?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/inquire" className="btn-primary-dark">
              {t('cta')} →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
