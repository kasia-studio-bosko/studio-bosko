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

const STUDIO_IMAGE = 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

const SUPPLIER_LOGOS = [
  'Knoll', 'Fritz Hansen', 'Vitra', 'Flos', 'Artek', 'Cassina', 'Molteni&C',
]

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
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Studio hero">
        <div className="page-container">
          <ScrollReveal>
            <p className="label-serif mb-4">Studio Bosko</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-display-xl tracking-tight text-balance max-w-2xl mb-12">
              {t('heroHeading')}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Story section ─────────────────────────────────────────────────── */}
      <section className="pb-section-y" aria-label="Studio story">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* Image */}
            <ScrollReveal>
              <div className="aspect-[4/5] relative bg-[#d4cbc0] overflow-hidden sticky top-[calc(var(--header-height)+2rem)]">
                <Image
                  src={STUDIO_IMAGE}
                  alt="Kasia Kronberger, founder of Studio Bosko"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </ScrollReveal>

            {/* Text */}
            <div className="lg:pt-4 space-y-12">
              <ScrollReveal delay={100}>
                <p className="font-signifier font-light text-display-sm tracking-tight text-balance leading-relaxed">
                  {t('intro')}
                </p>
              </ScrollReveal>

              <div className="space-y-6">
                <ScrollReveal delay={150}>
                  <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/80">
                    {t('body1')}
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                  <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/80">
                    {t('body2')}
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={250}>
                  <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/80">
                    {t('body3')}
                  </p>
                </ScrollReveal>
              </div>

              {/* Awards */}
              <ScrollReveal delay={300}>
                <div className="border-t border-[#120b09]/10 pt-8">
                  <p className="label-serif mb-5">{t('awardsHeading')}</p>
                  <ul className="space-y-2">
                    <li className="font-cadiz text-sm text-[#120b09]/80">
                      — {t('award1')}
                    </li>
                    <li className="font-cadiz text-sm text-[#120b09]/80">
                      — {t('award2')}
                    </li>
                  </ul>
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={350}>
                <Link href="/inquire" className="btn-primary">
                  Start a project →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Collaborations ───────────────────────────────────────────────── */}
      <section className="section-spacing bg-[#d4cbc0]" aria-label="Collaborations and suppliers">
        <div className="page-container">
          <ScrollReveal>
            <p className="label-serif mb-10">{t('collaborationsHeading')}</p>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {SUPPLIER_LOGOS.map((name, i) => (
              <ScrollReveal key={name} delay={i * 50}>
                <div className="py-6 px-4 bg-[#ede8e2]/60 flex items-center justify-center text-center">
                  <span className="font-signifier font-light text-sm tracking-tight">
                    {name}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
