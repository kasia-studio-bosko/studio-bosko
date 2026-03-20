import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import { getAllProjects, FALLBACK_PROJECTS } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'projects' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'

  const slugMap: Record<string, string> = { en: 'projects', de: 'projekte', pl: 'projekty' }
  const path = locale === 'en' ? '/projects' : `/${locale}/${slugMap[locale]}`

  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        'x-default': `${siteUrl}/projects`,
        en: `${siteUrl}/projects`,
        de: `${siteUrl}/de/projekte`,
        pl: `${siteUrl}/pl/projekty`,
      },
    },
  }
}

// Cover images for each project (used in fallback grid before Sanity is seeded)
const FALLBACK_COVER_IMAGES: Record<string, string> = {
  'chroma-penthouse': 'https://framerusercontent.com/images/l1lysvdOseg1KyDSJxHjCPPJQo.jpg',
  'zander-rooftop':   'https://framerusercontent.com/images/HtBz4JDvXubiEp6tEPI9Z4Cc.jpg',
  'casa-norte':       'https://framerusercontent.com/images/UdwJZtpW3JOoD1xFzqm2j3MbP0.jpg',
  'time-travel':      'https://framerusercontent.com/images/wxs1UdkYvpS4swIVRveRHqL8OBQ.jpg',
}

// Static fallback grid — real project names, shown when Sanity has no content
const FALLBACK_GRID = FALLBACK_PROJECTS.map((p) => ({
  slug: p.slug.current,
  title: p.title,
  location: p.location,
  year: p.year ?? '',
  category: p.category,
  coverImage: FALLBACK_COVER_IMAGES[p.slug.current] ?? 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg',
  coverImageAlt: p.coverImage.alt ?? p.title,
}))

export default async function ProjectsPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'projects' })

  let projects = FALLBACK_GRID
  try {
    const sanityProjects = await getAllProjects(locale)
    if (sanityProjects.length > 0) {
      projects = sanityProjects.map((p) => ({
        slug: p.slug.current,
        title: p.title,
        location: p.location,
        year: p.year ?? '',
        category: p.category,
        coverImage: p.coverImage?.asset?._ref
          ? urlFor(p.coverImage).width(960).height(1280).url()
          : 'https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg',
        coverImageAlt: p.coverImage?.alt ?? p.title,
      }))
    }
  } catch {
    // Sanity not configured — use fallback
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-spacing" aria-label="Projects hero">
        <div className="page-container">
          <ScrollReveal>
            <p className="label-serif mb-4">Studio Bosko</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-signifier font-light text-display-xl tracking-tight text-balance max-w-2xl mb-4">
              {t('heroHeading')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="font-cadiz text-base text-[#120b09]/60">
              {t('heroSubheading')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Projects grid ─────────────────────────────────────────────────── */}
      <section className="pb-section-y" aria-label="Projects grid">
        <div className="page-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
            {projects.map((project, i) => (
              <ScrollReveal key={project.slug} delay={Math.min(i * 60, 300)}>
                <Link
                  href={{ pathname: '/project/[slug]', params: { slug: project.slug } }}
                  className="group block"
                >
                  <div className="img-zoom-wrap aspect-[3/4] relative bg-[#d4cbc0] overflow-hidden mb-5">
                    <Image
                      src={project.coverImage}
                      alt={project.coverImageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-signifier font-light text-lg tracking-tight group-hover:text-[#f5500a] transition-colors duration-200">
                        {project.title}
                      </h2>
                      <p className="mt-1 text-sm font-cadiz text-[#120b09]/60">
                        {project.location}
                        {project.year ? ` · ${project.year}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-cadiz tracking-widest uppercase text-[#120b09]/40 group-hover:text-[#f5500a] transition-colors duration-200 whitespace-nowrap mt-1">
                      {t('viewProject')} →
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
