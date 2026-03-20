import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#ede8e2] border-t border-[#120b09]/10 py-12 md:py-16">
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="block mb-3">
              <span className="font-signifier font-light text-2xl tracking-tight">
                Studio Bosko
              </span>
            </Link>
            <p className="text-sm font-cadiz text-[#120b09]/60">
              {t('tagline')}
            </p>
            <p className="text-sm font-cadiz text-[#120b09]/60">
              {t('location')}
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-3" aria-label="Footer navigation">
            <Link href="/projects" className="btn-text text-sm w-fit">
              Projects
            </Link>
            <Link href="/studio" className="btn-text text-sm w-fit">
              Studio
            </Link>
            <Link href="/offering" className="btn-text text-sm w-fit">
              Offering
            </Link>
            <Link href="/press" className="btn-text text-sm w-fit">
              Press
            </Link>
          </nav>

          {/* Contact & social */}
          <div className="flex flex-col gap-3">
            <Link href="/inquire" className="btn-primary text-sm w-fit">
              {t('inquire')} →
            </Link>
            <a
              href="https://www.instagram.com/studio.bosko/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-text text-sm w-fit"
            >
              {t('instagram')} ↗
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#120b09]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs font-cadiz text-[#120b09]/50">
            {t('copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  )
}
