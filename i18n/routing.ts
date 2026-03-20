import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'de', 'pl'],
  defaultLocale: 'en',
  localePrefix: 'as-needed', // en at /, de at /de/, pl at /pl/
  localeDetection: false,    // never redirect based on Accept-Language header
  pathnames: {
    '/': '/',
    '/studio': {
      en: '/studio',
      de: '/studio',
      pl: '/studio',
    },
    '/offering': {
      en: '/offering',
      de: '/leistungen',
      pl: '/oferta',
    },
    '/projects': {
      en: '/projects',
      de: '/projekte',
      pl: '/projekty',
    },
    '/press': {
      en: '/press',
      de: '/presse',
      pl: '/prasa',
    },
    '/inquire': {
      en: '/inquire',
      de: '/anfrage',
      pl: '/zapytanie',
    },
    '/project/[slug]': {
      en: '/project/[slug]',
      de: '/projekt/[slug]',
      pl: '/projekt/[slug]',
    },
  },
})

export type Locale = (typeof routing.locales)[number]
