/**
 * Studio Bosko — patch colour themes onto all 9 project documents
 *
 * Usage:  npm run seed-themes
 * Requires SANITY_API_READ_TOKEN with Editor role in .env.local
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// ── Load .env.local ────────────────────────────────────────────────────────────
try {
  const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    process.env[key] = val
  }
} catch {
  // .env.local not found — fall back to process.env
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token:     process.env.SANITY_API_READ_TOKEN,
  useCdn:    false,
})

// ── Theme palettes (extracted from live bosko.studio pages) ───────────────────

const THEMES = {
  'warm-light': {
    colorTheme:      'warm-light',
    backgroundColor: '#705305',
    headingColor:    '#e1cd3c',
    textColor:       '#ffffff',
  },
  'dark-moody': {
    colorTheme:      'dark-moody',
    backgroundColor: '#2d1d17',
    headingColor:    '#60bf83',
    textColor:       '#ffffff',
  },
  'earthy-neutral': {
    colorTheme:      'earthy-neutral',
    backgroundColor: '#60bf83',
    headingColor:    '#2d1d17',
    textColor:       '#000000',
  },
  'cool-minimal': {
    colorTheme:      'cool-minimal',
    backgroundColor: '#d4cbc0',
    headingColor:    '#705305',
    textColor:       '#705305',
  },
}

// ── Project → theme mapping ───────────────────────────────────────────────────

const SLUG_THEMES = {
  'chroma-penthouse':  'warm-light',
  'zander-rooftop':   'warm-light',
  'time-travel':      'dark-moody',
  'casa-norte':       'dark-moody',
  'side-to-side':     'earthy-neutral',
  'wilhelm-lane':     'earthy-neutral',
  'haus-giebelgarten':'earthy-neutral',
  'ballet-school':    'cool-minimal',
  'westend-rose':     'cool-minimal',
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching all project documents…')
  const projects = await client.fetch(
    `*[_type == "project"]{ _id, "slug": slug.current }`
  )
  console.log(`Found ${projects.length} project(s)`)

  for (const project of projects) {
    const slug = project.slug
    const themeName = SLUG_THEMES[slug]
    if (!themeName) {
      console.log(`  ⏭  ${slug} — no theme assigned, skipping`)
      continue
    }
    const patch = THEMES[themeName]
    await client.patch(project._id).set(patch).commit()
    console.log(`  ✓  ${slug} → ${themeName}`)
  }

  console.log('\nDone — all project themes seeded.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
