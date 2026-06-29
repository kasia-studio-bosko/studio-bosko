// Server component – injects site-wide JSON-LD structured data
export default function SchemaOrg({ locale }: { locale: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const localePath = locale === 'en' ? '' : `/${locale}`

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['ProfessionalService', 'Organization'],
        '@id': `${siteUrl}/#organization`,
        name: 'Studio Bosko',
        alternateName: 'Bosko Studio',
        description:
          'Berlin-based interior design studio by Kasia Kronberger, specialising in full-scope residential and hospitality projects across Europe. Known for bold colour, bespoke joinery, and deeply considered curation.',
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
            'https://www.architecturaldigest.com/story/ad100-2025',
          ],
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Berlin',
          addressRegion: 'Berlin',
          addressCountry: 'DE',
        },
        areaServed: [
          { '@type': 'City',    name: 'Berlin'  },
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
          'https://www.architecturaldigest.com/story/ad100-2025',
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
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/projects`,
          },
          'query-input': 'required name=search_term_string',
        },
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
