// Server component – injects site-wide JSON-LD structured data
export default function SchemaOrg({ locale }: { locale: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const localePath = locale === 'en' ? '' : `/${locale}`

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['ProfessionalService', 'LocalBusiness', 'Organization'],
        '@id': `${siteUrl}/#organization`,
        name: 'Studio Bosko',
        alternateName: 'Bosko Studio',
        description:
          'High-end interior designer in Berlin, led by Kasia Kronberger and named to the AD100 Polska 2025 list. Full-scope residential and hospitality interior design, complex renovations, bespoke joinery and art curation in Berlin, Warsaw, Vienna and across Europe.',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.svg`,
          contentUrl: `${siteUrl}/logo.svg`,
        },
        image: `${siteUrl}/og-image.jpg`,
        foundingDate: '2018',
        founder: {
          '@type': 'Person',
          '@id': `${siteUrl}/#kasia-kronberger`,
          name: 'Kasia Kronberger',
          jobTitle: 'Interior Designer & Founder',
          worksFor: { '@id': `${siteUrl}/#organization` },
          nationality: 'Polish',
          knowsLanguage: ['en', 'de', 'pl'],
          sameAs: [
            'https://www.instagram.com/studio.bosko/',
            'https://architecturaldigest.pl/ad100-2025-lista-najwazniejszych-architektow-i-projektantow-z-polski-i-ze-swiata/',
          ],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Waldemarstraße 37',
          postalCode: '10999',
          addressLocality: 'Berlin',
          addressRegion: 'Berlin',
          addressCountry: 'DE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 52.5036931,
          longitude: 13.4196177,
        },
        telephone: '+49 1515 5515832',
        hasMap: 'https://maps.google.com/?cid=16133170296611053217',
        areaServed: [
          { '@type': 'City',    name: 'Berlin'  },
          { '@type': 'City',    name: 'Warsaw'  },
          { '@type': 'City',    name: 'Vienna'  },
          { '@type': 'Country', name: 'Germany' },
          { '@type': 'Country', name: 'Poland'  },
          { '@type': 'Country', name: 'Austria' },
          { '@type': 'Continent', name: 'Europe' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Interior Design Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Full-Scope Interior Design',
                description: 'End-to-end residential interior design from concept through installation.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Complex Renovation',
                description: 'Structural and aesthetic transformation of apartments and houses.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Art & Object Curation',
                description: 'Sourcing and placement of art, vintage furniture, and decorative objects.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Bespoke Furniture & Joinery',
                description: 'Custom-designed furniture and built-in joinery for residential projects.',
              },
            },
          ],
        },
        award: [
          'AD100 Architectural Digest Poland 2025',
          'Callwey Best of Interior 2026 — Nominee',
        ],
        sameAs: [
          'https://www.instagram.com/studio.bosko/',
          'https://maps.google.com/?cid=16133170296611053217',
          'https://architecturaldigest.pl/ad100-2025-lista-najwazniejszych-architektow-i-projektantow-z-polski-i-ze-swiata/',
        ],
        subjectOf: [
          { '@type': 'Article', url: 'https://www.ad-magazin.de/article/zimmer-mit-dachschraege-einrichten-ideen-tipps' },
          { '@type': 'Article', url: 'https://www.ad-magazin.de/artikel/farbige-kuechen-20-ideen' },
          { '@type': 'Article', url: 'https://www.ad-magazin.de/artikel/wohnungen-in-berlin-kreuzberg' },
          { '@type': 'Article', url: 'https://www.ad-magazin.de/artikel/renovierungen-berlin' },
          { '@type': 'Article', url: 'https://www.ad-magazin.de/artikel/renovierung-altbauwohnung-berlin-jugendstil' },
          { '@type': 'Article', url: 'https://www.ad-magazin.de/artikel/sanfte-renovierung-altbauwohnung-berlin' },
          { '@type': 'Article', url: 'https://www.ad-magazin.de/artikel/wohnung-dachgeschoss-familie-berlin' },
          { '@type': 'Article', url: 'https://www.ad-magazin.de/artikel/midcentury-wohnung-polen-pied-a-terre' },
          { '@type': 'Article', url: 'https://www.ad-magazin.de/artikel/farben-badezimmer-ideen' },
          { '@type': 'Article', url: 'https://architecturaldigest.pl/ad100-2025-lista-najwazniejszych-architektow-i-projektantow-z-polski-i-ze-swiata/' },
          { '@type': 'Article', url: 'https://www.architecturaldigest.com/gallery/this-berlin-penthouse-uses-color-to-create-a-vibrant-impact' },
          { '@type': 'Article', url: 'https://www.revistaad.es/galerias/este-atico-en-berlin-apuesta-por-el-color-como-lenguaje-emocional' },
          { '@type': 'Article', url: 'https://www.elledecoration.co.uk/inspiration/bathrooms/a62364616/bathroom-sprawl-trend/' },
          { '@type': 'Article', url: 'https://www.vogue.pl/a/mieszkanie-w-berlinie-projektu-studio-boskot-pelne-dizajnerskich-mebli' },
        ],
        priceRange: '€€€€',
        email: 'hello@bosko.studio',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'hello@bosko.studio',
          url: `${siteUrl}${localePath}/inquire`,
          availableLanguage: ['English', 'German', 'Polish'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Studio Bosko',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: ['en', 'de', 'pl'],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  )
}
