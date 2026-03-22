import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import ParallaxImage from '@/components/ParallaxImage'

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

// ── Image constants (from bosko.studio) ──────────────────────────────────────
const PHOTO_BOOKSHELF  = 'https://framerusercontent.com/images/9RomZBJL6uDE9riO4mhK43xA.jpg'
const PHOTO_MOODBOARD  = 'https://framerusercontent.com/images/rbIRqe2yxSTp84HPR7YpLWO59o.jpg'
const PHOTO_FLOORPLAN  = 'https://framerusercontent.com/images/MU12NSy3wj6azUf80fouUcr6Bpg.png'
const PHOTO_HALLWAY    = 'https://framerusercontent.com/images/BLcEb8zhESV8vCYUNx12PnA9d5c.jpg'

// Project types — locale-keyed
const PROJECT_TYPES_EN = [
  {
    title: 'Complex Renovation',
    body: "Home is often your most valued asset. We know how to unlock the potential of any property and increase its worth for you and your family. Through thoughtful architectural planning, tailored curation and professional fulfilment, our interiors are both function-forward and high-design. Thanks to our experience, problem-solving attitude as well as a trusted international network of craftspeople, we're ready to realise projects across whole Europe.",
  },
  {
    title: 'Interiors Upgrade',
    body: 'From defining surface materials to final styling, we bring that tactile energy into a space through emotive textural pairings and joyful palettes. Our experience allows for accurate scope-setting and decisions that help avoid costly mistakes. Sometimes redesigning parts of the space can go a long way. We inject personality into already good bones, so at the end you can call the place uniquely yours.',
  },
  {
    title: 'Full-Scope Curation',
    body: 'We curate and source everything on your behalf — from a sofa, through lighting, to artworks and elements of decor. This can mean merging your selected existing pieces with new finds commissioned locally or sourced globally to create unique compositions throughout your home. Working on newly built or acquired spaces, we prepare a full furnishing and decor scheme based on a defined creative direction and take care of the procurement.',
  },
]

const PROJECT_TYPES_DE = [
  {
    title: 'Komplexe Renovierung',
    body: 'Das Zuhause ist oft Ihr wertvollstes Gut. Wir wissen, wie wir das Potenzial jeder Immobilie freisetzen und ihren Wert für Sie und Ihre Familie steigern können. Durch durchdachte Architekturplanung, maßgeschneiderte Kuration und professionelle Umsetzung sind unsere Interieurs sowohl funktional als auch hochkarätig gestaltet. Dank unserer Erfahrung, unserem lösungsorientierten Ansatz und einem vertrauensvollen internationalen Netzwerk aus Handwerkern realisieren wir Projekte in ganz Europa.',
  },
  {
    title: 'Interieur-Upgrade',
    body: 'Von der Materialwahl bis zum finalen Styling bringen wir taktile Energie in einen Raum — durch emotionale Materialkombinationen und lebendige Paletten. Unsere Erfahrung ermöglicht präzise Umfangsdefinitionen und Entscheidungen, die kostspielige Fehler vermeiden. Manchmal verändert die Neugestaltung von Teilen des Raums alles. Wir verleihen bereits guter Substanz Persönlichkeit — damit der Ort am Ende unverwechselbar Ihres ist.',
  },
  {
    title: 'Vollständige Kuration',
    body: 'Wir kuratieren und beschaffen alles in Ihrem Namen — vom Sofa über Leuchten bis hin zu Kunstwerken und Dekorationselementen. Das kann bedeuten, ausgewählte Bestandsstücke mit neuen Funden zu vereinen — lokal in Auftrag gegeben oder weltweit beschafft — um einzigartige Kompositionen im gesamten Zuhause zu schaffen. Bei Neubauten oder neu erworbenen Räumen erarbeiten wir ein vollständiges Einrichtungs- und Dekorationskonzept auf Basis einer definierten kreativen Ausrichtung und übernehmen die gesamte Beschaffung.',
  },
]

const PROJECT_TYPES_PL = [
  {
    title: 'Złożona renowacja',
    body: 'Dom jest często Twoim najcenniejszym dobrem. Wiemy, jak uwolnić potencjał każdej nieruchomości i zwiększyć jej wartość dla Ciebie i Twojej rodziny. Przez przemyślane planowanie architektoniczne, indywidualną kurację i profesjonalną realizację nasze wnętrza są zarówno funkcjonalne, jak i wysokiej jakości. Dzięki doświadczeniu, nastawieniu na rozwiązania i zaufanej międzynarodowej sieci rzemieślników jesteśmy gotowi realizować projekty w całej Europie.',
  },
  {
    title: 'Modernizacja wnętrza',
    body: 'Od doboru materiałów po finalny styling — wnosimy taktylną energię do przestrzeni przez emocjonalne zestawienia faktur i radosne palety. Nasze doświadczenie pozwala na precyzyjne określenie zakresu i decyzje, które pomagają uniknąć kosztownych błędów. Czasem przeprojektowanie części przestrzeni robi ogromną różnicę. Dodajemy osobowość do już dobrej substancji — żeby miejsce mogło być niepowtarzalnie Twoje.',
  },
  {
    title: 'Pełna kuration',
    body: 'Dobieramy i pozyskujemy wszystko w Twoim imieniu — od sofy, przez oświetlenie, po dzieła sztuki i elementy dekoracyjne. Może to oznaczać połączenie wybranych istniejących przedmiotów z nowymi znaleziskami zamawianymi lokalnie lub pozyskiwanymi globalnie, tworząc unikalne kompozycje w całym domu. Pracując w nowo wybudowanych lub nabytych przestrzeniach, przygotowujemy kompletny schemat aranżacji i dekoracji oparty na zdefiniowanym kierunku twórczym i zajmujemy się całą realizacją zakupów.',
  },
]

const PROJECT_TYPES_BY_LOCALE: Record<string, typeof PROJECT_TYPES_EN> = {
  en: PROJECT_TYPES_EN,
  de: PROJECT_TYPES_DE,
  pl: PROJECT_TYPES_PL,
}

export default async function OfferingPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'offering' })

  const scopeItems = t.raw('scopeItems') as string[]
  const noItems   = t.raw('noItems') as string[]
  const projectTypes = PROJECT_TYPES_BY_LOCALE[locale] ?? PROJECT_TYPES_EN

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────
          HERO — headline lower-left + bookshelf portrait upper-right
          Reference: bosko.studio/offering
            • Portrait: 578×652, right side (x=691 on 1299px = 44%)
            • H1: left 53%, bottom-aligned
            • Both bottom-aligned to the same edge
      ───────────────────────────────────────────────────────────────────── */}
      <section
        className="overflow-hidden"
        style={{ paddingTop: 'var(--section-padding-y)' }}
        aria-label="Offering hero"
      >
        <div className="page-container">
          <div
            className="relative"
            style={{ minHeight: 'min(calc(44vw * 867 / 578), 620px)' }}
          >
            {/* Left — headline, pushed to bottom */}
            <div
              className="flex flex-col justify-end pr-8 md:pr-16"
              style={{
                width: '53%',
                minHeight: 'min(calc(44vw * 867 / 578), 620px)',
              }}
            >
              <ScrollReveal>
                <p className="label-serif mb-5">Studio Bosko</p>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <h1
                  className="font-signifier font-light text-balance text-[#2d1d17]"
                  style={{
                    fontSize: 'clamp(28px, 3.2vw, 46px)',
                    lineHeight: 1.18,
                    letterSpacing: '-0.3px',
                  }}
                >
                  {t('headline')}
                </h1>
              </ScrollReveal>
            </div>

            {/* Right — bookshelf portrait, top-aligned */}
            <div
              className="absolute top-0 right-0 overflow-hidden bg-[#d4cbc0]"
              style={{ width: '44%', aspectRatio: '578 / 867' }}
            >
              <Image
                src={PHOTO_BOOKSHELF}
                alt="Curated bookshelf — Studio Bosko"
                fill
                sizes="44vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FULL-BLEED MOODBOARD — 400px tall, centred crop, parallax
      ───────────────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden bg-[#d4cbc0] mt-10 md:mt-14"
        style={{ height: '400px' }}
      >
        <ParallaxImage
          src={PHOTO_MOODBOARD}
          alt="Interior design moodboard — Studio Bosko"
          sizes="100vw"
          speed={0.25}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          SCOPE SECTION — two-column: left label | right content
          Reference: "Offering" label at x=30, body text at x=538 (41%)
      ───────────────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Offering detail">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-[41%_1fr] gap-12 md:gap-16">

            {/* Left — section label */}
            <ScrollReveal>
              <p className="label-serif pt-1">{t('scopeHeading').replace(':', '')}</p>
            </ScrollReveal>

            {/* Right — body text + scope list + exclusions + CTA */}
            <div className="space-y-10">
              <ScrollReveal delay={80}>
                <p className="font-cadiz text-base md:text-[17px] leading-relaxed text-[#2d1d17]/80 mb-6">
                  {t('mainBody1')}
                </p>
                <ul className="space-y-2 mb-8">
                  {scopeItems.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 font-cadiz text-sm md:text-[15px] text-[#2d1d17]/75 leading-relaxed"
                    >
                      <span className="shrink-0 text-[#2d1d17]/30 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={140}>
                <p className="font-signifier font-light text-sm tracking-wide text-[#2d1d17]/55 mb-3">
                  {t('noHeading')}
                </p>
                <ul className="space-y-2 mb-6">
                  {noItems.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 font-cadiz text-sm text-[#2d1d17]/50 leading-relaxed"
                    >
                      <span className="shrink-0 mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-signifier font-light text-base italic text-[#2d1d17]/65 mb-8">
                  {t('tagline')}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={180}>
                <Link href={{ pathname: '/inquire' }} className="btn-primary inline-flex">
                  Reach out about a project →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FLOOR PLAN — right-aligned, parallax
          Reference: left=538, width=731 on 1299px (41% offset, 56% width).
          object-contain so the drawing lines stay sharp.
      ───────────────────────────────────────────────────────────────────── */}
      <div className="page-container pb-[var(--section-padding-y)]">
        <ScrollReveal>
          <div className="md:ml-[41%]">
            <div
              className="relative overflow-hidden bg-[#ede8e2]"
              style={{ aspectRatio: '731 / 577' }}
            >
              <Image
                src={PHOTO_FLOORPLAN}
                alt="Interior design floor plan — Studio Bosko"
                fill
                sizes="(max-width: 768px) 100vw, 56vw"
                className="object-contain"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          PROJECT TYPES — label left | vertical stack right
          Reference: "Types of projects" label at x=30 (left column),
          each project type stacked in the right column (x=538).
      ───────────────────────────────────────────────────────────────────── */}
      <section
        className="section-spacing bg-[#d4cbc0]"
        aria-label="Types of projects"
      >
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-[41%_1fr] gap-12 md:gap-16">

            {/* Left — section label, sticks to top */}
            <ScrollReveal>
              <p className="label-serif pt-1">Types of projects we work on</p>
            </ScrollReveal>

            {/* Right — vertical stack of 3 project types */}
            <div className="space-y-12">
              {projectTypes.map(({ title, body }, i) => (
                <ScrollReveal key={title} delay={i * 100}>
                  <h2
                    className="font-signifier font-normal text-[#2d1d17] mb-4"
                    style={{ fontSize: 'clamp(28px, 3vw, 42px)', lineHeight: 1.2 }}
                  >
                    {title}
                  </h2>
                  <p className="font-cadiz text-[15px] leading-relaxed text-[#2d1d17]/70">
                    {body}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          TESTIMONIAL — 50/50 full-bleed split (no page-container padding)
          Left  50%: terracotta hallway image with parallax
          Right 50%: sage green (#60BF83) box with Doug's quote

          Reference: rgb(96, 191, 131) = #60BF83 on BOTH studio and offering
          pages. Hallway image: 650×671, left=0. Quote: x=680 in right half
          (30px left padding inside the green box), Signifier 30px, dark type.
      ───────────────────────────────────────────────────────────────────── */}
      <section
        className="flex flex-col md:flex-row overflow-hidden"
        aria-label="Client testimonial"
      >
        {/* Left — hallway photo */}
        <div
          className="relative overflow-hidden bg-[#d4cbc0] w-full md:w-1/2"
          style={{ aspectRatio: '650 / 671' }}
        >
          <Image
            src={PHOTO_HALLWAY}
            alt="Colour-drenched hallway — Studio Bosko"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Right — green box with Doug's quote */}
        <div
          className="w-full md:w-1/2 flex items-center"
          style={{ backgroundColor: '#60BF83', minHeight: 'clamp(320px, 40vw, 671px)' }}
        >
          <div className="px-8 md:px-10 lg:px-14 xl:px-16 py-12 max-w-[500px]">
            <ScrollReveal>
              <blockquote
                className="font-signifier font-light text-[#2d1d17] mb-6"
                style={{
                  fontSize: 'clamp(18px, 2.2vw, 30px)',
                  lineHeight: 1.38,
                  letterSpacing: '-0.2px',
                }}
              >
                &ldquo;{t('testimonialQuote')}&rdquo;
              </blockquote>
              <p className="font-cadiz text-sm text-[#2d1d17]/70">
                {t('testimonialAttribution')}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          CTA
      ───────────────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Start your project">
        <div className="page-container max-w-2xl text-center mx-auto">
          <ScrollReveal>
            <h2
              className="font-signifier font-normal mb-8 text-balance text-[#2d1d17]"
              style={{ fontSize: 'clamp(36px, 4vw, 54px)', lineHeight: 1.15 }}
            >
              Ready to begin?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href={{ pathname: '/inquire' }} className="btn-primary">
              Begin your project →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
