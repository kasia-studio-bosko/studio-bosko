import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import PageNavTheme from '@/components/PageNavTheme'
import ScrollReveal from '@/components/ScrollReveal'

export default async function NotFound() {
  // The locale was already set by the parent [locale]/layout.tsx via
  // setRequestLocale(), so getTranslations() picks it up automatically.
  const t = await getTranslations('notFound')

  return (
    <>
      <PageNavTheme color="#2d1d17" />

      <section
        className="min-h-[80vh] flex items-center section-spacing"
        aria-label="Page not found"
      >
        <div className="page-container max-w-3xl">
          {/* Eyebrow */}
          <ScrollReveal>
            <p className="label-serif mb-6 text-[#2d1d17]/40">
              {t('eyebrow')}
            </p>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal delay={80}>
            <h1
              className="font-signifier font-light text-[clamp(32px,6vw,64px)] leading-[1.15] tracking-[-0.02em] text-balance text-[#2d1d17] mb-6"
            >
              {t('heading')}
            </h1>
          </ScrollReveal>

          {/* Body */}
          <ScrollReveal delay={140}>
            <p className="font-cadiz text-[15px] leading-[1.6] text-[#2d1d17]/65 max-w-md mb-10">
              {t('body')}
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal delay={200}>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={{ pathname: '/' }}
                className="btn-primary text-[#2d1d17] border-[#2d1d17] hover:bg-[#2d1d17] hover:text-[#ede8e2]"
              >
                {t('backHome')}
              </Link>
              <Link
                href={{ pathname: '/projects' }}
                className="btn-text text-[#2d1d17]"
              >
                {t('viewProjects')} →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
