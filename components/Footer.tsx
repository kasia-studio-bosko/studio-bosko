import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function Footer({ locale }: { locale: string }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const year = new Date().getFullYear()

  return (
    // data-footer-fixed is read by FooterReveal to measure footer height
    <footer
      data-footer-fixed
      className="fixed bottom-0 left-0 right-0 bg-[#2d1d17] overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* ── Large full-width wordmark (+20% via scale) ────────────── */}
      <div className="px-6 sm:px-8 md:px-10 pt-14 pb-8">
        <Link href="/" aria-label="Studio Bosko — home">
          {/*
            scale-[1.2] enlarges the logo 20% beyond its container width.
            overflow-hidden on the parent clips any bleed.
          */}
          <div className="scale-[1.2] origin-center">
            <Image
              src="/logo.svg"
              alt="Studio Bosko"
              width={1400}
              height={90}
              className="w-full h-auto"
              priority={false}
            />
          </div>
        </Link>
      </div>

      {/* ── Utility bar ──────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 pb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-5">
        <nav className="flex flex-wrap items-center gap-5" aria-label="Footer navigation">
          {[
            { key: 'projects', href: '/projects' },
            { key: 'studio',   href: '/studio'   },
            { key: 'offering', href: '/offering' },
            { key: 'press',    href: '/press'    },
            { key: 'inquire',  href: '/inquire'  },
          ].map(({ key, href }) => (
            <Link
              key={key}
              href={href as '/projects' | '/studio' | '/offering' | '/press' | '/inquire'}
              className="text-xs font-cadiz text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
            >
              {tNav(key as 'projects' | 'studio' | 'offering' | 'press' | 'inquire')}
            </Link>
          ))}
        </nav>

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
