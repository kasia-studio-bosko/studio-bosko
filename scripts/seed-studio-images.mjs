/**
 * seed-studio-images.mjs
 * Downloads the 5 studio-page images from Framer CDN,
 * uploads them to Sanity, then patches the singleton `studioPage`
 * document so the Next.js app stops using Framer fallback URLs.
 *
 * Run once:
 *   node scripts/seed-studio-images.mjs
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
    field:    'kasiaPhoto1',
    filename: 'studio-kasia-portrait.jpg',
    url:      'https://framerusercontent.com/images/R8TMgB8ZuigjgRdDrkIq1XL8pyE.jpg',
    alt:      'Kasia Kronberger, founder of Studio Bosko',
  },
  {
    field:    'kasiaPhoto2',
    filename: 'studio-kasia-at-work.jpg',
    url:      'https://framerusercontent.com/images/8v65b9JTdh7Lt2d0LE7LfBwg.jpg',
    alt:      'Kasia Kronberger at work in the studio',
  },
  {
    field:    'studioPhoto1',
    filename: 'studio-bespoke-furniture.jpg',
    url:      'https://framerusercontent.com/images/TmcA1nzDm35cOZWzjts2wkS6kZ0.jpg',
    alt:      'Bespoke furniture detail — Studio Bosko',
  },
  {
    field:    'studioPhoto2',
    filename: 'studio-altbau-renovation.jpg',
    url:      'https://framerusercontent.com/images/5UTLSTSHs0DzqrK1CoNNl85Uro.jpg',
    alt:      'Altbau renovation — Studio Bosko Berlin',
  },
  {
    field:    'testimonialImage',
    filename: 'studio-testimonial-penthouse.jpg',
    url:      'https://framerusercontent.com/images/PHAwXxLNYORjMHEr1SMzbzN9KkM.jpg',
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
  console.log('\n🖼  Seeding studio page images…\n')

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

  // Create or patch the studioPage singleton
  console.log('📄  Patching studioPage document…')
  await client
    .patch('studioPage')
    .setIfMissing({ _type: 'studioPage', _id: 'studioPage' })
    .set(patch)
    .commit()

  console.log('✅  studioPage patched successfully.\n')
  console.log('✨  Done — refresh the Sanity Studio to verify the images.\n')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
