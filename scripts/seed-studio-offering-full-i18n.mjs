/**
 * Studio Bosko — Make every remaining Studio/Offering text CMS-editable in all 3 languages
 *
 * Several section labels and CTA strings on the Studio and Offering pages were
 * hardcoded to messages/*.json with no Sanity backing at all (ethosHeading,
 * ethosBody, ethosSubheading, ctaOffering on Studio; scopeHeading, noHeading,
 * reachOut, projectTypesHeading on Offering). testimonialAuthor (Offering) and
 * yellowtraceAttribution (Studio) existed as single non-localized fields.
 *
 * This seeds the new *_en/_de/_pl fields (added to the schemas) with the
 * current live text so nothing changes visually, then unsets the old
 * non-localized fields now that their content has been migrated.
 *
 * Usage:
 *   node scripts/seed-studio-offering-full-i18n.mjs
 *
 * Requirements:
 *   SANITY_API_READ_TOKEN must have Editor / Write role.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// ── Load .env.local ───────────────────────────────────────────────────────────
try {
  const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    const val = t.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch { /* no .env.local */ }

const client = createClient({
  projectId: 'ysq1y4zp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

async function run() {
  console.log('Patching studioPage...')
  await client
    .patch('studioPage')
    .set({
      ethosHeading_en: 'Ethos',
      ethosHeading_de: 'Haltung',
      ethosHeading_pl: 'Filozofia',

      ethosBody_en:
        'Design for us is never about surface or spectacle but rather about self-expression and growth. Home is often our most valuable asset. Whereas the best interiors are the ones filled with character.',
      ethosBody_de:
        'Design ist für uns nie Oberfläche oder Spektakel — sondern Selbstausdruck und Entwicklung. Das Zuhause ist oft unser wertvollstes Gut. Die besten Interieurs sind jene, die Charakter atmen.',
      ethosBody_pl:
        'Dla nas design to nigdy nie powierzchnia ani spektakl — to wyraz siebie i przestrzeń do wzrostu. Dom jest często naszym najcenniejszym dobrem. Najlepsze wnętrza to te, które oddychają charakterem.',

      ethosSubheading_en: 'How we approach every project:',
      ethosSubheading_de: 'So gehen wir an jedes Projekt heran:',
      ethosSubheading_pl: 'Jak podchodzimy do każdego projektu:',

      ctaOffering_en: 'Check out what we can do for you',
      ctaOffering_de: 'Was wir für dich tun können',
      ctaOffering_pl: 'Zobacz, co możemy dla Ciebie zrobić',

      yellowtraceAttribution_en: 'Yellowtrace',
      yellowtraceAttribution_de: 'Yellowtrace',
      yellowtraceAttribution_pl: 'Yellowtrace',
    })
    .unset(['yellowtraceAttribution'])
    .commit()

  console.log('Patching offeringPage...')
  await client
    .patch('offeringPage')
    .set({
      scopeHeading_en: 'Our work typically includes:',
      scopeHeading_de: 'Unser Leistungsumfang umfasst:',
      scopeHeading_pl: 'Zakres naszych usług:',

      noHeading_en: "We don't take on:",
      noHeading_de: 'Was wir nicht anbieten:',
      noHeading_pl: 'Czego nie robimy:',

      reachOut_en: 'Reach out about a project',
      reachOut_de: 'Projekt anfragen',
      reachOut_pl: 'Zapytaj o projekt',

      projectTypesHeading_en: 'Types of projects we work on',
      projectTypesHeading_de: 'Projektarten, für die wir tätig sind',
      projectTypesHeading_pl: 'Rodzaje projektów, nad którymi pracujemy',

      testimonialAuthor_en: 'Doug, homeowner and antiques collector',
      testimonialAuthor_de: 'Doug, Hausbesitzer und Antiquitätensammler',
      testimonialAuthor_pl: 'Doug, właściciel mieszkania i kolekcjoner antyków',
    })
    .unset(['testimonialAuthor'])
    .commit()

  console.log('Done.')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
