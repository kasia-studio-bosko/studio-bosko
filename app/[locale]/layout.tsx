import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SchemaOrg from '@/components/SchemaOrg'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

type Locale = (typeof routing.locales)[number]

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const alternates: Record<string, string> = {
    'x-default': siteUrl,
    en: siteUrl,
    de: `${siteUrl}/de`,
    pl: `${siteUrl}/pl`,
  }

  return {
    title: {
      default: t('siteTitle'),
      template: `%s | Studio Bosko`,
    },
    description: t('siteDescription'),
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: locale === 'en' ? siteUrl : `${siteUrl}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      siteName: 'Studio Bosko',
      locale:
        locale === 'de' ? 'de_DE' : locale === 'pl' ? 'pl_PL' : 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@studiobosko',
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    verification: {
      google: '',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://framerusercontent.com" />
        <link rel="dns-prefetch" href="https://framerusercontent.com" />
      </head>
      <body className="bg-[#ede8e2] text-[#120b09] font-cadiz antialiased">
        <NextIntlClientProvider messages={messages}>
          <SchemaOrg locale={locale} />
          <Navigation locale={locale} />
          <main id="main-content" className="min-h-screen pt-[var(--header-height)]">
            {children}
          </main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
