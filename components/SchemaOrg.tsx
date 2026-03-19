// Server component – injects JSON-LD structured data
export default function SchemaOrg({ locale }: { locale: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesigner',
    name: 'Studio Bosko',
    description:
      'Berlin-based interior design studio specialising in full-scope residential projects across Europe.',
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    image: `${siteUrl}/og-image.jpg`,
    foundingDate: '2018',
    founder: {
      '@type': 'Person',
      name: 'Kasia Kronberger',
      jobTitle: 'Interior Designer',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressCountry: 'DE',
    },
    sameAs: [
      'https://www.instagram.com/studio.bosko/',
    ],
    areaServed: [
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'Poland' },
      { '@type': 'Continent', name: 'Europe' },
    ],
    award: 'AD100 2025 — Architectural Digest',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  )
}
