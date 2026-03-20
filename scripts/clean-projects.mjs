/**
 * Deletes any Sanity project documents whose slug is NOT in the known-good list.
 * Run with: npm run clean-projects
 *
 * This removes stale/placeholder projects (Haus Giebelgarten, Apartment Prenzlauer Berg, etc.)
 * while preserving the real seeded projects.
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (key && val && !process.env[key]) process.env[key] = val
  }
}

const GOOD_SLUGS = new Set([
  'chroma-penthouse',
  'zander-rooftop',
  'casa-norte',
  'time-travel',
])

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  console.error('❌  SANITY_API_READ_TOKEN is not set in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: 'ysq1y4zp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function main() {
  console.log('🔍  Fetching all project documents from Sanity…')
  const projects = await client.fetch(
    `*[_type == "project"] { _id, "slug": slug.current, titleEn }`
  )

  console.log(`Found ${projects.length} project(s):`)
  for (const p of projects) {
    console.log(`  - ${p.titleEn ?? '(no title)'} [${p.slug}] (${p._id})`)
  }

  const toDelete = projects.filter((p) => !GOOD_SLUGS.has(p.slug))

  if (toDelete.length === 0) {
    console.log('\n✅  No stale projects found — nothing to delete.')
    return
  }

  console.log(`\n🗑  Deleting ${toDelete.length} stale project(s)…`)
  for (const p of toDelete) {
    console.log(`  Deleting: ${p.titleEn ?? p.slug} (${p._id})`)
    await client.delete(p._id)
  }

  console.log('\n✅  Done. Remaining projects:')
  const remaining = await client.fetch(
    `*[_type == "project"] | order(order asc) { "slug": slug.current, titleEn }`
  )
  for (const p of remaining) {
    console.log(`  ✓ ${p.titleEn} [${p.slug}]`)
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
