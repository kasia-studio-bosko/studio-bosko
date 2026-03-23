/**
 * Patch Casa Norte with localised location names.
 * Usage: node scripts/seed-casa-norte-location.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

try {
  const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
  }
} catch { /* fall back to process.env */ }

const client = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token:      process.env.SANITY_API_READ_TOKEN,
  useCdn:     false,
})

const [doc] = await client.fetch(`*[_type == "project" && slug.current == "casa-norte"]{ _id }`)
if (!doc) { console.error('casa-norte not found'); process.exit(1) }

await client.patch(doc._id).set({
  location:   'Szczecin, Poland',
  locationDe: 'Stettin, Polen',
  locationPl: 'Szczecin, Polska',
}).commit()

console.log('✓  Casa Norte location patched in EN / DE / PL.')
