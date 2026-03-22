/**
 * Studio Bosko — Press seed script
 * Creates all 23 press items (type: "press") in Sanity.
 * Featured items (4) have cover images uploaded from framerusercontent.com.
 *
 * Usage:
 *   npm run seed-press
 *
 * Requires: SANITY_API_READ_TOKEN with Editor/Write role in .env.local
 */

import { createClient } from '@sanity/client'
import { readFileSync }  from 'fs'
import { resolve }       from 'path'

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
  dataset:   'production',
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_READ_TOKEN,
  useCdn:    false,
})

// ── Image upload helper ───────────────────────────────────────────────────────
async function uploadImage(url, filename, mimeType) {
  console.log(`  ↑ Uploading ${filename}…`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buf = await res.arrayBuffer()
  const asset = await client.assets.upload('image', Buffer.from(buf), {
    filename,
    contentType: mimeType,
  })
  console.log(`  ✓ Uploaded → ${asset._id}`)
  return asset._id
}

// ── Featured items with cover images ─────────────────────────────────────────
const FEATURED = [
  {
    id:          'press-01-domino',
    publication: 'Domino',
    issue:       { en: 'Home Front / Fall 2025', de: 'Home Front / Herbst 2025', pl: 'Home Front / Jesień 2025' },
    date:        '2025-09-01',
    featured:    true,
    order:       1,
    imageUrl:    'https://framerusercontent.com/images/yOS6IPw7UnX1byUBBlGhaPuQE.webp',
    imageFile:   'domino-fall-2025.webp',
    imageMime:   'image/webp',
    imageAlt:    'Domino magazine — Home Front Fall 2025',
    externalUrl: undefined,
  },
  {
    id:          'press-05-adspain',
    publication: 'AD Spain',
    issue:       { en: 'AD Spain / January 2026', de: 'AD Spain / Januar 2026', pl: 'AD Spain / Styczeń 2026' },
    date:        '2026-01-01',
    featured:    true,
    order:       5,
    imageUrl:    'https://framerusercontent.com/images/zzMQ5CKV47O2UDZmALsM1sXk0vA.png',
    imageFile:   'adspain-jan-2026.png',
    imageMime:   'image/png',
    imageAlt:    'AD Spain magazine — January 2026',
    externalUrl: 'https://www.revistaad.es/articulos/este-piso-de-90-m-reinterpreta-el-midcentury-con-calma-color-y-soluciones-de-almacenaje-inteligentes',
  },
  {
    id:          'press-07-adgermany-mar',
    publication: 'AD Germany',
    issue:       { en: 'AD Germany / March 2025', de: 'AD Germany / März 2025', pl: 'AD Germany / Marzec 2025' },
    date:        '2025-03-01',
    featured:    true,
    order:       7,
    imageUrl:    'https://framerusercontent.com/images/pPRFObEDAdHJISGOKhSHlHovL2s.png',
    imageFile:   'adgermany-mar-2025.png',
    imageMime:   'image/png',
    imageAlt:    'AD Germany magazine — March 2025',
    externalUrl: 'https://www.ad-magazin.de/artikel/renovierungen-berlin',
  },
  {
    id:          'press-10-vogue-pl-oct',
    publication: 'VOGUE Poland',
    issue:       { en: 'VOGUE Poland / October 2025', de: 'VOGUE Poland / Oktober 2025', pl: 'VOGUE Poland / Październik 2025' },
    date:        '2025-10-01',
    featured:    true,
    order:       10,
    imageUrl:    'https://framerusercontent.com/images/9OJJz2lgse9DPsi7HVQNv0AuaVc.png',
    imageFile:   'vogue-poland-oct-2025.png',
    imageMime:   'image/png',
    imageAlt:    'VOGUE Poland — October 2025',
    externalUrl: undefined,
  },
]

// ── Archive-only items (no cover images) ──────────────────────────────────────
const ARCHIVE = [
  { id: 'press-02-living-jun',    publication: '&Living',               issue: { en: 'June 2025',          de: 'Juni 2025',      pl: 'Czerwiec 2025'    }, date: '2025-06-01', order: 2  },
  { id: 'press-03-living-may',    publication: '&Living',               issue: { en: 'May 2025',           de: 'Mai 2025',       pl: 'Maj 2025'         }, date: '2025-05-01', order: 3  },
  { id: 'press-04-ad-apr',        publication: 'Architectural Digest',  issue: { en: 'April 2025',         de: 'April 2025',     pl: 'Kwiecień 2025'    }, date: '2025-04-01', order: 4  },
  { id: 'press-06-estliving',     publication: 'est living',            issue: { en: 'April 2025',         de: 'April 2025',     pl: 'Kwiecień 2025'    }, date: '2025-04-01', order: 6  },
  { id: 'press-08-baunetz',       publication: 'BauNetz',               issue: { en: 'January 2025',       de: 'Januar 2025',    pl: 'Styczeń 2025'     }, date: '2025-01-01', order: 8  },
  { id: 'press-09-ad100-pl',      publication: 'AD100 AD Polska',       issue: { en: 'December 2024',      de: 'Dezember 2024',  pl: 'Grudzień 2024'    }, date: '2024-12-01', order: 9  },
  { id: 'press-11-elle-id',       publication: 'ELLE Indonesia',        issue: { en: 'November 2024',      de: 'November 2024',  pl: 'Listopad 2024'    }, date: '2024-11-01', order: 11 },
  { id: 'press-12-adde-nov',      publication: 'AD Germany',            issue: { en: 'November 2024',      de: 'November 2024',  pl: 'Listopad 2024'    }, date: '2024-11-01', order: 12 },
  { id: 'press-13-yellowtrace',   publication: 'Yellowtrace',           issue: { en: 'October 2024',       de: 'Oktober 2024',   pl: 'Październik 2024' }, date: '2024-10-01', order: 13 },
  { id: 'press-14-elle-uk-oct',   publication: 'Elle Decoration UK',    issue: { en: 'October 2024',       de: 'Oktober 2024',   pl: 'Październik 2024' }, date: '2024-10-01', order: 14 },
  { id: 'press-15-elle-uk-sep',   publication: 'Elle Decoration UK',    issue: { en: 'September 2024',     de: 'September 2024', pl: 'Wrzesień 2024'    }, date: '2024-09-01', order: 15 },
  { id: 'press-16-ad-me',         publication: 'AD Middle East',        issue: { en: 'April 2024',         de: 'April 2024',     pl: 'Kwiecień 2024'    }, date: '2024-04-01', order: 16 },
  { id: 'press-17-adde-aug',      publication: 'AD Germany',            issue: { en: 'August 2024',        de: 'August 2024',    pl: 'Sierpień 2024'    }, date: '2024-08-01', order: 17 },
  { id: 'press-18-vogue-pl-jan',  publication: 'VOGUE Poland',          issue: { en: 'January 2024',       de: 'Januar 2024',    pl: 'Styczeń 2024'     }, date: '2024-01-01', order: 18 },
  { id: 'press-19-living-cor',    publication: 'Living Corriere',       issue: { en: 'February 2024',      de: 'Februar 2024',   pl: 'Luty 2024'        }, date: '2024-02-01', order: 19 },
  { id: 'press-20-vogue-pl-dec',  publication: 'VOGUE Poland',          issue: { en: 'December 2023',      de: 'Dezember 2023',  pl: 'Grudzień 2023'    }, date: '2023-12-01', order: 20 },
  { id: 'press-21-label',         publication: 'Label Magazine',        issue: { en: 'January 2024',       de: 'Januar 2024',    pl: 'Styczeń 2024'     }, date: '2024-01-01', order: 21 },
  { id: 'press-22-design-alive',  publication: 'Design Alive',          issue: { en: 'October 2023',       de: 'Oktober 2023',   pl: 'Październik 2023' }, date: '2023-10-01', order: 22 },
  { id: 'press-23-ad-oct',        publication: 'Architectural Digest',  issue: { en: 'October 2023',       de: 'Oktober 2023',   pl: 'Październik 2023' }, date: '2023-10-01', order: 23 },
]

// ── Run ───────────────────────────────────────────────────────────────────────
console.log('🌱  Seeding press items…\n')

// 1. Featured items — upload images then create documents
for (const item of FEATURED) {
  console.log(`\n📰  ${item.publication} — ${item.issue.en}`)
  const assetId = await uploadImage(item.imageUrl, item.imageFile, item.imageMime)

  const doc = {
    _id:         item.id,
    _type:       'press',
    publication: item.publication,
    issue:       item.issue,
    date:        item.date,
    featured:    item.featured,
    order:       item.order,
    coverImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      alt:   item.imageAlt,
    },
  }
  if (item.externalUrl) doc.externalUrl = item.externalUrl

  await client.createOrReplace(doc)
  console.log(`  ✅  Saved ${item.id}`)
}

// 2. Archive-only items — no images
for (const item of ARCHIVE) {
  const doc = {
    _id:         item.id,
    _type:       'press',
    publication: item.publication,
    issue:       item.issue,
    date:        item.date,
    featured:    false,
    order:       item.order,
  }
  await client.createOrReplace(doc)
  console.log(`✅  ${item.id}`)
}

console.log('\n✨  Press seeding complete.')
