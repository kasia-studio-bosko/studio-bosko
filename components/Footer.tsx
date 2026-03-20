import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function Footer({ locale }: { locale: string }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#2d1d17]">

      {/* ── Large full-width wordmark ───────────────────────────── */}
      <div className="px-6 sm:px-8 md:px-10 pt-16 pb-10">
        <Link href="/" aria-label="Studio Bosko — home">
          <Image
            src="/logo.svg"
            alt="Studio Bosko"
            width={1400}
            height={90}
            className="w-full h-auto"
            priority={false}
          />
        </Link>
      </div>

      {/* ── Utility bar ────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
        {/* Nav links */}
        <nav className="flex flex-wrap items-center gap-5" aria-label="Footer navigation">
          <Link href="/projects" className="text-xs font-cadiz text-white/60 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('projects')}
          </Link>
          <Link href="/studio" className="text-xs font-cadiz text-white/60 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('studio')}
          </Link>
          <Link href="/offering" className="text-xs font-cadiz text-white/60 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('offering')}
          </Link>
          <Link href="/press" className="text-xs font-cadiz text-white/60 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('press')}
          </Link>
          <Link href="/inquire" className="text-xs font-cadiz text-white/60 hover:text-white transition-colors duration-200 tracking-wide">
            {tNav('inquire')}
          </Link>
        </nav>

        {/* Instagram + copyright */}
        <p className="text-xs font-cadiz text-white/60 whitespace-nowrap">
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

    </footer>
  )
}
