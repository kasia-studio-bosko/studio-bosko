import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

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
        No horizontal or bottom padding: left/right/bottom edges of the
        logo align exactly with the viewport edges.
        w-full + h-auto scales the SVG proportionally at every breakpoint.
        block removes the default inline line-height gap beneath the image.
        width/height match the SVG viewBox (2948 × 397) for correct aspect ratio.
      */}
      <Link href="/" aria-label="Studio Bosko — home" className="block">
        <Image
          src="/logo.svg"
          alt="Studio Bosko"
          width={2948}
          height={397}
          className="w-full h-auto block"
          priority={false}
        />
      </Link>
    </footer>
  )
}
