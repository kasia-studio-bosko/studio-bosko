/**
 * Studio Bosko — Fix "kuration" (not a real Polish word) on the Offering page
 *
 * "kuration" is a leftover half-translation (mixing German "Kuration" into
 * Polish). "Kuracja" is also wrong — it means medical treatment in Polish.
 * The correct term for curatorial work is the adjective "kuratorski", as in
 * "kuratorski dobór" (curatorial selection).
 *
 * Usage:
 *   node scripts/seed-offering-kuration-fix.mjs
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
  console.log('Patching offeringPage scopeItems + projectTypes (PL)...')

  await client
    .patch('offeringPage')
    .set({
      'scopeItems[_key=="k33"].label_pl': 'Pozyskiwanie sztuki i kuratorski dobór wnętrza',
      'projectTypes[_key=="k40"].title_pl': 'Pełny dobór kuratorski',
    })
    .commit()

  console.log('Done.')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
