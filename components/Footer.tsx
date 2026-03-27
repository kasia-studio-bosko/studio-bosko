import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LogoSvg from './LogoSvg'

export default async function Footer({ locale }: { locale: string }) {
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const year = new Date().getFullYear()

  return (
    <footer
      data-footer-fixed
      className="fixed bottom-0 left-0 right-0 bg-[#2d1d17]"
      style={{ zIndex: 0 }}
    >
      {/* ── Utility bar ──────────────────────────────────────────── */}
      <div className="px-8 md:px-12 pt-6 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
          <Link
            href="/impressum"
            className="hover:text-white transition-colors duration-200"
          >
            Impressum
          </Link>
          {' · '}
          © Studio Bosko {year}
        </p>
      </div>

      {/* ── Wordmark — edge-to-edge, bottom flush ────────────────── */}
      {/*
        viewBox crops the SVG canvas to the actual letterform bounds.
        Tracing the outer O path: 2 cubic bezier segments place the
        rightmost vertex at x≈2891 (not ~2831 as the inner O sub-path
        suggests). viewBox right edge = 40+2870 = 2910, leaving ~9px
        breathing at 1440 px — symmetric with the ~8px on the left.
        Full canvas: "0 0 2948 397".  S leftmost stroke: x≈56. O right: x≈2891.
      */}
      <Link href="/" aria-label="Studio Bosko — home" className="block leading-none">
        <LogoSvg
          color="#5fbf83"
          viewBox="40 45 2870 310"
          className="w-full h-auto block"
        />
      </Link>
    </footer>
  )
}
