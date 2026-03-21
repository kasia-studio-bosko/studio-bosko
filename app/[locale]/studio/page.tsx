import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'studio' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  const path = locale === 'en' ? '/studio' : `/${locale}/studio`

  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        'x-default': `${siteUrl}/studio`,
        en: `${siteUrl}/studio`,
        de: `${siteUrl}/de/studio`,
        pl: `${siteUrl}/pl/studio`,
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${siteUrl}${path}`,
    },
  }
}

const STUDIO_IMAGE = 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'

export default async function StudioPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Studio hero">
        <div className="page-container">
          <ScrollReveal>
            <p className="label-serif mb-4">Studio Bosko</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-[28px] md:text-[34px] leading-snug tracking-tight text-balance max-w-3xl">
              We design personality-driven spaces—crafted with curatorial instinct and delivered with clarity.
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section className="pb-section-y" aria-label="About the studio">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* Sticky image */}
            <ScrollReveal>
              <div className="aspect-[4/5] relative bg-[#d4cbc0] overflow-hidden lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
                <Image
                  src={STUDIO_IMAGE}
                  alt="Kasia Kronberger, founder of Studio Bosko"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </ScrollReveal>

            {/* Text */}
            <div className="space-y-10">
              <ScrollReveal delay={100}>
                <p className="label-serif mb-8">About</p>
                <div className="space-y-6">
                  <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/80">
                    As an interior design studio named AD100 for 2025 by Architectural Digest Polska, we are tastemakers for clients who share a strong appreciation for art, culture, and craftsmanship. We create layered, personality-driven homes with a clear point of view—confident, curated, and boldly individual. Our work balances high design with lived-in ease—spaces that feel as effortless as they are intentional. A quest for artful character runs through everything we curate, shaping homes that don't just look beautiful, but feel deeply personal.
                  </p>
                  <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/80">
                    Practicality and liveability are equally important to us, so each of our designs is entirely custom. We design to support how you actually live, when no one is watching. Because great design isn't just seen — it's felt.
                  </p>
                  <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/80">
                    Led by Kasia Kronberger, Studio Bosko brings together structured precision and intuitive curation. Kasia's background spans education in business and trend forecasting, and international design experience across London, Florence, Barcelona, and Brussels. Her work is shaped by a global sensibility—layering modern craftsmanship, historical references, and joyful tension into interiors that are worldly and authentically evocative. She is recognised for creating spaces that start conversations: rooms rich with personality, intentional clashes, and emotional resonance—without ever feeling staged or overworked.
                  </p>
                </div>
              </ScrollReveal>

              {/* Ethos */}
              <ScrollReveal delay={150}>
                <div className="border-t border-[#120b09]/10 pt-10">
                  <p className="label-serif mb-6">Ethos</p>
                  <p className="font-cadiz text-base leading-relaxed text-[#120b09]/75 mb-6">
                    Design for us is never about surface or spectacle but rather about self-expression and growth. Home is often our most valuable asset. Whereas the best interiors are the ones filled with character. It's about crafting environments that evolve with our discerning clients—busy professionals and their families—and help them live their best lives.
                  </p>
                  <p className="font-signifier font-light text-sm tracking-wide text-[#120b09]/60 mb-4">How we approach every project:</p>
                  <ul className="space-y-3">
                    {[
                      'We push functionality forward—prioritising flow, storage and usability from the start, so the space supports your lifestyle effortlessly.',
                      'We curate for visual interest and emotional impact—balancing refined with playful, and old with new.',
                      'We create homes that tell your story—through materials, colours, and the way light moves inside.',
                      'We\'re your trusted advisor—guiding you through the complexity, helping you navigate decisions with confidence and problem-solving instincts.',
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 font-cadiz text-sm text-[#120b09]/75 leading-relaxed">
                        <span className="shrink-0 text-[#120b09]/30 mt-0.5">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={200}>
                <Link href="/offering" className="btn-primary">
                  Check out what we can do for you →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Yellowtrace quote ─────────────────────────────────────────────── */}
      <section className="section-spacing bg-[#d4cbc0]" aria-label="Press quote">
        <div className="page-container max-w-3xl">
          <ScrollReveal>
            <blockquote className="font-signifier font-light text-display-sm tracking-tight text-balance leading-snug text-[#2d1d17] mb-6">
              &ldquo;One of the most impressive aspects of [Studio Bosko] is how it manages to be both bold and harmonious. (&hellip;) The balance is achieved through vigilant curation of furniture and artwork, balancing the old with the new, the classic with the niche, the hallmark of Studio Bosko&rsquo;s approach.&rdquo;
            </blockquote>
            <p className="font-cadiz text-sm text-[#2d1d17]/60 tracking-widest uppercase">Yellowtrace</p>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
