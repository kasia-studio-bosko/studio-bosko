import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getImpressumContent } from '@/lib/sanity/queries'
import { ptToBlocks } from '@/lib/sanity/utils'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const sanity = await getImpressumContent(locale)

  return {
    title:       { absolute: sanity?.seoTitle ?? 'Impressum | Studio Bosko' },
    description: sanity?.seoDescription ?? 'Legal notice for Studio Bosko interior design studio, Berlin.',
    // Impressum must not be indexed
    robots: { index: false, follow: false },
  }
}

export default async function ImpressumPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  setRequestLocale(locale)

  const sanity = await getImpressumContent(locale)
  const blocks = ptToBlocks(sanity?.body)

  return (
    <section className="section-spacing" aria-label="Impressum">
      <div className="page-container max-w-2xl">
        {blocks.length > 0 ? (
          <div className="space-y-4">
            {blocks.map((block, i) => {
              if (block.style === 'h2') {
                return (
                  <h1
                    key={i}
                    className="font-signifier font-light text-[30px] leading-[42px] text-[#2d1d17] mt-8 first:mt-0"
                    style={{ letterSpacing: '-0.2px' }}
                  >
                    {block.text}
                  </h1>
                )
              }
              if (block.style === 'h3') {
                return (
                  <h2
                    key={i}
                    className="font-signifier font-light text-lg text-[#2d1d17] mt-8 mb-1 first:mt-0"
                  >
                    {block.text}
                  </h2>
                )
              }
              return (
                <p
                  key={i}
                  className="font-cadiz text-[15px] leading-relaxed text-[#2d1d17]/75"
                >
                  {block.text}
                </p>
              )
            })}
          </div>
        ) : (
          // Fallback while Sanity document is being seeded
          <p className="font-cadiz text-[15px] text-[#2d1d17]/60">Loading…</p>
        )}
      </div>
    </section>
  )
}
