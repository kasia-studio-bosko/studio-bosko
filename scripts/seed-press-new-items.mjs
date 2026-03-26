/**
 * seed-press-new-items.mjs
 * Adds 2 new press items that appeared on bosko.studio/press after the
 * initial seed: VOGUE Poland Oct 2025 and AD Spain Jan 2026.
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

async function uploadImageFromUrl(url, filename) {
  console.log(`  📥 Downloading ${filename}…`)
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || 'image/png'
  console.log(`  ☁️  Uploading ${filename} (${(buffer.length/1024).toFixed(0)} KB)…`)
  const asset = await client.assets.upload('image', buffer, { filename, contentType })
  return asset._id
}

const NEW_ITEMS = [
  {
    id: 'press-vogue-poland-oct-2025',
    publication: 'VOGUE Poland',
    issue_en: 'VOGUE Poland / October 2025',
    date: '2025-10-01',
    order: 0,   // appears before Domino (order:1) at top of list
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/9OJJz2lgse9DPsi7HVQNv0AuaVc.png',
    link: null,
  },
  {
    id: 'press-ad-spain-jan-2026',
    publication: 'AD Spain',
    issue_en: 'AD Spain / January 2026',
    date: '2026-01-01',
    order: -1,  // newest — appears first
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/zzMQ5CKV47O2UDZmALsM1sXk0vA.png',
    link: 'https://www.revistaad.es/articulos/este-piso-de-90-m-reinterpreta-el-midcentury-con-calma-color-y-soluciones-de-almacenaje-inteligentes',
  },
]

async function main() {
  console.log(`\n🗞  Adding ${NEW_ITEMS.length} new press items…\n`)
  for (const item of NEW_ITEMS) {
    console.log(`\n→ ${item.issue_en}`)
    try {
      const doc = {
        _id: item.id, _type: 'press',
        publication: item.publication,
        issue: { en: item.issue_en },
        date: item.date, order: item.order, featured: item.featured,
      }
      if (item.link) doc.externalUrl = item.link
      if (item.imgUrl) {
        const ext = item.imgUrl.split('.').pop().split('?')[0] || 'png'
        const assetId = await uploadImageFromUrl(item.imgUrl, `${item.id}.${ext}`)
        doc.coverImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          alt: `${item.publication} — Studio Bosko feature`,
        }
      }
      await client.createOrReplace(doc)
      console.log(`  ✅ Saved: ${item.id}`)
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`)
    }
  }
  console.log('\n✨ Done.\n')
}
main()
