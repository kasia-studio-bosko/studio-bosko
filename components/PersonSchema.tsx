// Server component – injects Person JSON-LD structured data on the studio page
export default function PersonSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kasia Kronberger',
    jobTitle: 'Interior Designer & Founder',
    description:
      'Founder and creative director of Studio Bosko, an AD100-recognised interior design studio based in Berlin. Known for creating personality-driven, curated residential interiors across Europe.',
    url: `${siteUrl}/studio`,
    image: `${siteUrl}/og-image.jpg`,
    worksFor: {
      '@type': 'Organization',
      name: 'Studio Bosko',
      url: siteUrl,
    },
    award: 'AD100 Polska 2025',
    knowsAbout: [
      'Interior Design',
      'Interior Architecture',
      'Art Curation',
      'Residential Design',
      'Space Planning',
    ],
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'London' },
      { '@type': 'EducationalOrganization', name: 'Florence' },
    ],
    sameAs: ['https://www.instagram.com/studio.bosko/'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
