/**
 * Studio Bosko — Fix corporate/stiff phrasing in the Offering intro paragraph (DE/PL)
 *
 * Replaces the second sentence of offeringBody_de/pl with a less literal,
 * more natural rephrasing supplied by the owner. Offering-page only —
 * /de/studio and /pl/studio are intentionally left untouched pending a
 * separate revision of the English About page copy.
 *
 * Usage:
 *   node scripts/seed-offering-intro-rephrase.mjs
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

const offeringBody_de =
  'Wir spezialisieren uns auf vollständige Wohnprojekte und begleiten jeden Prozessschritt mit Sorgfalt und Klarheit. Du brauchst einen Partner, der deinen persönlichen Stil versteht und daraus ein unverwechselbares, zeitloses Interieur macht, ohne dass du dich um die ganze Organisation kümmern musst.'

const offeringBody_pl =
  'Specjalizujemy się w pełnozakresowych projektach mieszkalnych, prowadząc każdy etap z dbałością i precyzją. Potrzebujesz partnera, który rozumie Twój styl i przekłada go na wyjątkowe, ponadczasowe wnętrze, bez całego zachodu po Twojej stronie.'

async function run() {
  console.log('Patching offeringPage intro paragraph (DE/PL)...')

  await client
    .patch('offeringPage')
    .set({
      'offeringBody_de[_key=="k25"].children[_key=="k26"].text': offeringBody_de,
      'offeringBody_pl[_key=="k27"].children[_key=="k28"].text': offeringBody_pl,
    })
    .commit()

  console.log('Done.')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
