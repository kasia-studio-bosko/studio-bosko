import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'offering' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const slugMap: Record<string, string> = { en: 'offering', de: 'leistungen', pl: 'oferta' }
  const path = locale === 'en' ? '/offering' : `/${locale}/${slugMap[locale]}`

  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        'x-default': `${siteUrl}/offering`,
        en: `${siteUrl}/offering`,
        de: `${siteUrl}/de/leistungen`,
        pl: `${siteUrl}/pl/oferta`,
      },
    },
  }
}

const PROJECT_TYPES = [
  {
    title: 'Complex Renovation',
    body: "Home is often your most valued asset. We know how to unlock the potential of any property and increase its worth for you and your family. Through thoughtful architectural planning, tailored curation and professional fulfilment, our interiors are both function-forward and high-design. Thanks to our experience, problem-solving attitude as well as a trusted international network of craftspeople, we\u2019re ready to realise projects across whole Europe.",
  },
  {
    title: 'Interiors Upgrade',
    body: 'From defining surface materials to final styling, we bring that tactile energy into a space through emotive textural pairings and joyful palettes. Our experience allows for accurate scope-setting and decisions that help avoid costly mistakes. Sometimes redesigning parts of the space can go a long way. We inject personality into already good bones, so at the end you can call the place uniquely yours.',
  },
  {
    title: 'Full-Scope Curation',
    body: 'We curate and source everything on your behalf—from a sofa, through lighting, to artworks and elements of decor. This can mean merging your selected existing pieces with new finds commissioned locally or sourced globally to create unique compositions throughout your home. Working on newly built or acquired spaces, we prepare a full furnishing and decor scheme based on a defined creative direction and take care of the procurement.',
  },
]

export default async function OfferingPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Offering hero">
        <div className="page-container">
          <ScrollReveal>
            <p className="label-serif mb-4">Studio Bosko</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-[30px] leading-[42px] text-balance max-w-3xl" style={{ letterSpacing: '-0.2px' }}>
              We're a full-service interior design practice based in Berlin and Warsaw, running projects internationally.
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* ── What we do ───────────────────────────────────────────────────── */}
      <section className="pb-section-y" aria-label="Offering detail">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left */}
            <ScrollReveal>
              <p className="label-serif mb-8">Offering</p>
              <div className="space-y-5">
                <p className="font-cadiz text-base md:text-lg leading-relaxed text-[#120b09]/80">
                  We specialize in full-scope residential projects, overseeing every phase of the process with care and clarity. We understand you need an expert partner to design your home—one that grasps your personal style and translates it into a unique, timeless interior, without the operational hassle. With our intuition for the emotive connections and business expertise, we articulate visions and bring them to fruition for our discerning clientele.
                </p>
                <p className="font-cadiz text-base leading-relaxed text-[#120b09]/75">
                  Our process includes thorough research—from architecture, culture to client's lifestyle—through layered design development and full spec-packages, down to author's supervision on project fulfilment, on which we work with a network of trusted craftspeople and specialists.
                </p>
              </div>
            </ScrollReveal>

            {/* Right: what's included + what we don't take on */}
            <div className="space-y-10">
              <ScrollReveal delay={100}>
                <p className="font-signifier font-light text-sm tracking-wide text-[#120b09]/60 mb-4">Our work typically includes:</p>
                <ul className="space-y-2">
                  {[
                    'Interior Architecture and Space Planning',
                    'Interior Design, Finish and Fixture Specifications',
                    'Construction Drawings, Bespoke Furnishing Specs',
                    'Furniture Selection and Procurement',
                    'Art Sourcing and Interior Curation',
                    'Budget Planning and Fulfilment Coordination',
                  ].map((item) => (
                    <li key={item} className="flex gap-3 font-cadiz text-sm text-[#120b09]/75 leading-relaxed">
                      <span className="shrink-0 text-[#120b09]/30 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <p className="font-signifier font-light text-sm tracking-wide text-[#120b09]/60 mb-4">We don't take on:</p>
                <ul className="space-y-2 mb-6">
                  {[
                    'One-room makeovers',
                    'Final-stage styling for existing homes',
                    'Projects without implementation oversight',
                  ].map((item) => (
                    <li key={item} className="flex gap-3 font-cadiz text-sm text-[#120b09]/50 leading-relaxed">
                      <span className="shrink-0 mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-signifier font-light text-base italic text-[#120b09]/70">If we're in, we're all in.</p>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <Link href="/inquire" className="btn-primary">
                  Reach out about a project →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Project types ─────────────────────────────────────────────────── */}
      <section className="section-spacing bg-[#d4cbc0]" aria-label="Types of projects">
        <div className="page-container">
          <ScrollReveal>
            <p className="label-serif mb-12">Types of projects we work on</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {PROJECT_TYPES.map(({ title, body }, i) => (
              <ScrollReveal key={title} delay={i * 80}>
                <h2 className="font-signifier font-normal text-[50px] leading-[60px] mb-4">
                  {title}
                </h2>
                <p className="font-cadiz text-sm leading-relaxed text-[#120b09]/70">
                  {body}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ──────────────────────────────────────────────────── */}
      <section className="section-spacing bg-[#2d1d17]" aria-label="Client testimonial">
        <div className="page-container max-w-2xl">
          <ScrollReveal>
            <blockquote className="font-signifier font-light text-[30px] leading-[42px] text-balance text-[#ede8e2] mb-6" style={{ letterSpacing: '-0.6px' }}>
              "Studio Bosko was a lifesaver for my apartment redesign. As an expat in Germany, tackling a renovation project was overwhelming, but Kasia's exceptional design sense and strong network of contractors made the process smooth and enjoyable."
            </blockquote>
            <p className="font-cadiz text-sm text-white/50">Doug, homeowner and antiques collector</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Start your project">
        <div className="page-container max-w-2xl text-center mx-auto">
          <ScrollReveal>
            <h2 className="font-signifier font-normal text-[50px] leading-[60px] mb-8 text-balance">
              Ready to begin?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href="/inquire" className="btn-primary">
              Begin your project →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
