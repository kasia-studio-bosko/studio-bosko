/**
 * seed-offering-images.mjs
 * Downloads the 4 offering-page images from Framer CDN,
 * uploads them to Sanity, then patches the singleton `offeringPage`
 * document so the Next.js app stops using Framer fallback URLs.
 *
 * Run once:
 *   node scripts/seed-offering-images.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')

// ── Read token from .env.local ────────────────────────────────────────────────
let token = process.env.SANITY_API_READ_TOKEN
try {
  const env = readFileSync(envPath, 'utf8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k?.trim() === 'SANITY_API_READ_TOKEN') token = v.join('=').trim()
  }
} catch { /* env file not found — fall through to process.env */ }

if (!token) {
  console.error('❌  SANITY_API_READ_TOKEN not found in .env.local or environment')
  process.exit(1)
}

const client = createClient({
  projectId: 'ysq1y4zp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ── Images to upload ──────────────────────────────────────────────────────────
const IMAGES = [
  {
    field:    'image1',
    filename: 'offering-bookshelf.jpg',
    url:      'https://framerusercontent.com/images/9RomZBJL6uDE9riO4mhK43xA.jpg',
    alt:      'Curated bookshelf — Studio Bosko',
  },
  {
    field:    'image2',
    filename: 'offering-moodboard.jpg',
    url:      'https://framerusercontent.com/images/rbIRqe2yxSTp84HPR7YpLWO59o.jpg',
    alt:      'Interior design moodboard — Studio Bosko',
  },
  {
    field:    'image3',
    filename: 'offering-floorplan.png',
    url:      'https://framerusercontent.com/images/MU12NSy3wj6azUf80fouUcr6Bpg.png',
    alt:      'Floor plan drawing — Studio Bosko',
  },
  {
    field:    'testimonialImage',
    filename: 'offering-testimonial.jpg',
    url:      'https://framerusercontent.com/images/BLcEb8zhESV8vCYUNx12PnA9d5c.jpg',
    alt:      'Studio Bosko interior project',
  },
]

async function uploadImageFromUrl(url, filename) {
  console.log(`  📥 Downloading ${filename}…`)
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || 'image/jpeg'
  console.log(`  ☁️  Uploading ${filename} (${(buffer.length / 1024).toFixed(0)} KB)…`)
  const asset = await client.assets.upload('image', buffer, { filename, contentType })
  return asset._id
}

async function main() {
  console.log('\n🖼  Seeding offering page images…\n')

  // Build patch object
  const patch = {}

  for (const img of IMAGES) {
    console.log(`→ ${img.field} (${img.filename})`)
    try {
      const assetId = await uploadImageFromUrl(img.url, img.filename)
      patch[img.field] = {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: img.alt,
      }
      console.log(`  ✅ Uploaded: ${assetId}\n`)
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}\n`)
    }
  }

  if (Object.keys(patch).length === 0) {
    console.error('❌  No images uploaded — aborting patch.')
    process.exit(1)
  }

  // Create or patch the offeringPage singleton
  console.log('📄  Patching offeringPage document…')
  await client
    .patch('offeringPage')
    .setIfMissing({ _type: 'offeringPage', _id: 'offeringPage' })
    .set(patch)
    .commit()

  console.log('✅  offeringPage patched successfully.\n')
  console.log('✨  Done — refresh the Sanity Studio to verify the images.\n')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
