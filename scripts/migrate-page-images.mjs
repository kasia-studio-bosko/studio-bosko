/**
 * migrate-page-images.mjs
 * Migrates named image fields → pageImages[] array for studioPage and offeringPage.
 * Safe to re-run: skips if pageImages is already populated.
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
let token = process.env.SANITY_API_READ_TOKEN
try {
  const env = readFileSync(envPath, 'utf8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k?.trim() === 'SANITY_API_READ_TOKEN') token = v.join('=').trim()
  }
} catch {}

if (!token) { console.error('❌  SANITY_API_READ_TOKEN not found'); process.exit(1) }

const client = createClient({
  projectId: 'ysq1y4zp', dataset: 'production',
  apiVersion: '2024-01-01', token, useCdn: false,
})

async function migrate() {
  // ── Studio Page ──────────────────────────────────────────────────────────
  const studio = await client.fetch('*[_id == "studioPage"][0] { kasiaPhoto1, kasiaPhoto2, studioPhoto1, studioPhoto2, pageImages }')
  if (!studio) { console.log('⚠️  studioPage not found'); }
  else if (studio.pageImages?.length) { console.log('⏩ studioPage already has pageImages, skipping') }
  else {
    const slots = [studio.kasiaPhoto1, studio.kasiaPhoto2, studio.studioPhoto1, studio.studioPhoto2]
    const pageImages = slots
      .filter(img => img?.asset?._ref)
      .map((img, i) => ({ ...img, _type: 'image', _key: `img${i}` }))
    if (pageImages.length === 0) { console.log('⚠️  studioPage: no source images found') }
    else {
      await client.patch('studioPage').set({ pageImages }).commit()
      console.log(`✅ studioPage: migrated ${pageImages.length} images to pageImages[]`)
    }
  }

  // ── Offering Page ────────────────────────────────────────────────────────
  const offering = await client.fetch('*[_id == "offeringPage"][0] { image1, image2, image3, pageImages }')
  if (!offering) { console.log('⚠️  offeringPage not found') }
  else if (offering.pageImages?.length) { console.log('⏩ offeringPage already has pageImages, skipping') }
  else {
    const slots = [offering.image1, offering.image2, offering.image3]
    const pageImages = slots
      .filter(img => img?.asset?._ref)
      .map((img, i) => ({ ...img, _type: 'image', _key: `img${i}` }))
    if (pageImages.length === 0) { console.log('⚠️  offeringPage: no source images found') }
    else {
      await client.patch('offeringPage').set({ pageImages }).commit()
      console.log(`✅ offeringPage: migrated ${pageImages.length} images to pageImages[]`)
    }
  }

  console.log('\n✨ Done.')
}

migrate().catch(e => { console.error(e.message); process.exit(1) })
