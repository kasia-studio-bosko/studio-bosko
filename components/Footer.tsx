import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function Footer({ locale }: { locale: string }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tFooter = await getTranslations({ locale, namespace: 'footer' })
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#2d1d17] overflow-hidden">
      {/* Top row */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 pt-10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: nav links */}
        <nav className="flex flex-wrap items-center gap-5" aria-label="Footer navigation">
          <Link href="/projects" className="text-xs font-cadiz text-white/70 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('projects')}
          </Link>
          <Link href="/studio" className="text-xs font-cadiz text-white/70 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('studio')}
          </Link>
          <Link href="/offering" className="text-xs font-cadiz text-white/70 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('offering')}
          </Link>
          <Link href="/press" className="text-xs font-cadiz text-white/70 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('press')}
          </Link>
          <Link href="/inquire" className="text-xs font-cadiz text-white/70 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('inquire')}
          </Link>
        </nav>

        {/* Right: Instagram + copyright */}
        <p className="text-xs font-cadiz text-white/70 whitespace-nowrap">
          <a
            href="https://www.instagram.com/studio.bosko/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            Instagram
          </a>
          {' · '}
          © Studio Bosko {year}
        </p>
      </div>

      {/* Full-width logo wordmark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt=""
        aria-hidden="true"
        className="w-full h-auto block"
      />
    </footer>
  )
}
