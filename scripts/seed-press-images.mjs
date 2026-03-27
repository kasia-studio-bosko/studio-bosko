/**
 * seed-press-images.mjs
 * Downloads the 4 featured-press cover images from Framer CDN,
 * uploads them to Sanity, then patches each press document's
 * `coverImage` field and sets `featured: true`.
 *
 * Run once:
 *   node scripts/seed-press-images.mjs
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

// ── Featured press items to update ────────────────────────────────────────────
// publication must exactly match the `publication` field in Sanity press documents
const PRESS_IMAGES = [
  {
    publication: 'Domino',
    filename: 'press-domino-fall2025.webp',
    url: 'https://framerusercontent.com/images/yOS6IPw7UnX1byUBBlGhaPuQE.webp',
    alt: 'Domino — Home Front / Fall 2025 featuring Studio Bosko',
    contentType: 'image/webp',
  },
  {
    publication: 'AD Spain',
    filename: 'press-ad-spain-jan2026.png',
    url: 'https://framerusercontent.com/images/zzMQ5CKV47O2UDZmALsM1sXk0vA.png',
    alt: 'AD Spain — January 2026 featuring Studio Bosko',
    contentType: 'image/png',
  },
  {
    publication: 'Vogue Poland',
    filename: 'press-vogue-poland-oct2025.png',
    url: 'https://framerusercontent.com/images/9OJJz2lgse9DPsi7HVQNv0AuaVc.png',
    alt: 'VOGUE Poland — October 2025 featuring Studio Bosko',
    contentType: 'image/png',
  },
  {
    publication: 'AD Germany',
    filename: 'press-ad-germany-mar2025.png',
    url: 'https://framerusercontent.com/images/pPRFObEDAdHJISGOKhSHlHovL2s.png',
    alt: 'AD Germany — March 2025 featuring Studio Bosko',
    contentType: 'image/png',
  },
]

async function uploadImageFromUrl(url, filename, contentType) {
  console.log(`  📥 Downloading ${filename}…`)
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const ct = contentType || res.headers.get('content-type') || 'image/jpeg'
  console.log(`  ☁️  Uploading ${filename} (${(buffer.length / 1024).toFixed(0)} KB)…`)
  const asset = await client.assets.upload('image', buffer, { filename, contentType: ct })
  return asset._id
}

async function main() {
  console.log('\n📰  Seeding press cover images…\n')

  // Fetch all press documents to find IDs by publication name
  console.log('🔍  Fetching press documents from Sanity…\n')
  const pressItems = await client.fetch(
    `*[_type == "press"] { _id, publication, featured }`
  )

  if (pressItems.length === 0) {
    console.error('❌  No press documents found in Sanity. Run publish-drafts.mjs first.')
    process.exit(1)
  }

  console.log(`Found ${pressItems.length} press document(s).\n`)

  for (const img of PRESS_IMAGES) {
    console.log(`→ ${img.publication}`)

    // Find matching Sanity document (may be multiple — pick first by order/date)
    const matches = pressItems.filter(
      (p) => p.publication.toLowerCase() === img.publication.toLowerCase()
    )

    if (matches.length === 0) {
      console.error(`  ⚠️  No Sanity document found for "${img.publication}" — skipping.\n`)
      continue
    }

    // Use the first match; if there are multiple, only the first is set as featured
    const doc = matches[0]
    console.log(`  Found doc: ${doc._id}`)

    try {
      const assetId = await uploadImageFromUrl(img.url, img.filename, img.contentType)

      await client
        .patch(doc._id)
        .set({
          coverImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId },
            alt: img.alt,
          },
          featured: true,
        })
        .commit()

      console.log(`  ✅ Uploaded & patched: ${assetId}\n`)
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}\n`)
    }
  }

  console.log('✨  Done — refresh the Sanity Studio to verify the images.\n')
  console.log('💡  Note: if a publication appears multiple times in Sanity (e.g. AD Germany),')
  console.log('    only the first document was updated. Set `featured: true` on the correct')
  console.log('    issue manually in the Sanity Studio if needed.\n')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
