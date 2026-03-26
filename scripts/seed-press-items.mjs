/**
 * seed-press-items.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates / updates all 24 press items in Sanity.
 * For each item that has a Framer-hosted image this script:
 *   1. Downloads the image from Framer CDN
 *   2. Uploads it to Sanity as an image asset
 *   3. Creates or replaces the press document with all metadata
 *
 * Run:  node scripts/seed-press-items.mjs
 * Needs: SANITY_API_READ_TOKEN in .env.local  (must have write permissions)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load env vars from .env.local ────────────────────────────────────────────
const envPath = resolve(__dirname, '../.env.local')
let token = process.env.SANITY_API_READ_TOKEN
try {
  const env = readFileSync(envPath, 'utf8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k?.trim() === 'SANITY_API_READ_TOKEN') {
      token = v.join('=').trim()
    }
  }
} catch { /* env file not found — use process.env */ }

if (!token) {
  console.error('❌  SANITY_API_READ_TOKEN not found in .env.local or environment')
  process.exit(1)
}

const client = createClient({
  projectId: 'ysq1y4zp',
  dataset:   'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ── Press item data ───────────────────────────────────────────────────────────
// Each entry: { id, publication, issue_en, date, order, featured, imgUrl, link }
const PRESS_ITEMS = [
  {
    id: 'press-domino-fall-2025',
    publication: 'Domino',
    issue_en: 'Domino Home Front / Fall 2025',
    date: '2025-09-01',
    order: 1,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/yOS6IPw7UnX1byUBBlGhaPuQE.webp',
    link: 'https://drive.google.com/file/d/1oNm84ihBrttqqyfmOCN1GBPiVv-o01ti/view',
  },
  {
    id: 'press-and-living-jun-2025',
    publication: '&Living',
    issue_en: '&Living / June 2025',
    date: '2025-06-01',
    order: 2,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/oyc71tpo8DtLUVEA0dOzKFCQ.webp',
    link: 'https://drive.google.com/file/d/1nlJHNtYTkYETscdXxhY0WmSn2o7RpOcP/view',
  },
  {
    id: 'press-and-living-may-2025',
    publication: '&Living',
    issue_en: '&Living / May 2025',
    date: '2025-05-01',
    order: 3,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/sfVAP2KbSFHtM0SurugH2O4Ly4.png',
    link: null,
  },
  {
    id: 'press-ad-april-2025',
    publication: 'Architectural Digest',
    issue_en: 'Architectural Digest / April 2025',
    date: '2025-04-01',
    order: 4,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/P5dw6q7vZUIYSSxHPjMS6VLLjg.png',
    link: 'https://www.architecturaldigest.com/gallery/this-berlin-penthouse-uses-color-to-create-a-vibrant-impact',
  },
  {
    id: 'press-ad-spain-april-2025',
    publication: 'AD Spain',
    issue_en: 'AD Spain / April 2025',
    date: '2025-04-01',
    order: 5,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/UhPrpcaoIijS2kUocONfWS0nWBQ.png',
    link: 'https://www.revistaad.es/galerias/este-atico-en-berlin-apuesta-por-el-color-como-lenguaje-emocional',
  },
  {
    id: 'press-est-living-april-2025',
    publication: 'est living',
    issue_en: 'est living / April 2025',
    date: '2025-04-01',
    order: 6,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/wx1E4Lf4SgJf3Wo5q9BFgCZY3KI.png',
    link: 'https://estliving.com/design-covet-tiled-kitchen-worktops/',
  },
  {
    id: 'press-ad-germany-march-2025',
    publication: 'AD Germany',
    issue_en: 'AD Germany / March 2025',
    date: '2025-03-01',
    order: 7,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/Fyiudd7WPn0gvlF1FMN6CSuz9JI.png',
    link: 'https://www.ad-magazin.de/artikel/wohnung-dachgeschoss-familie-berlin',
  },
  {
    id: 'press-baunetz-jan-2025',
    publication: 'BauNetz',
    issue_en: 'BauNetz / January 2025',
    date: '2025-01-01',
    order: 8,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/9ZxLmtzyV3roclRanR0mshelFNc.png',
    link: null,
  },
  {
    id: 'press-ad100-polska-dec-2024',
    publication: 'AD Polska',
    issue_en: 'AD100 AD Polska / December 2024',
    date: '2024-12-01',
    order: 9,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/uhNGEeAI1RMlkyv0HpXOuo2lnQ.jpg',
    link: 'https://architecturaldigest.pl/ad100-2025-lista-najwazniejszych-architektow-i-projektantow-z-polski-i-ze-swiata/',
  },
  {
    id: 'press-vogue-poland-nov-2024',
    publication: 'VOGUE Poland',
    issue_en: 'VOGUE Poland / November 2024',
    date: '2024-11-01',
    order: 10,
    featured: false, // no cover image on source page
    imgUrl: null,
    link: 'https://www.vogue.pl/a/berlinskie-wnetrze-w-secesyjnej-kamienicy-zachwyca-eklektyzmem-zaprojektowala-je-polka',
  },
  {
    id: 'press-elle-indonesia-nov-2024',
    publication: 'ELLE Indonesia',
    issue_en: 'ELLE Indonesia / November 2024',
    date: '2024-11-01',
    order: 11,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/zNCrmV8DOtRNKaPfM4LhZc8kbL8.png',
    link: null,
  },
  {
    id: 'press-ad-germany-nov-2024',
    publication: 'AD Germany',
    issue_en: 'AD Germany / November 2024',
    date: '2024-11-01',
    order: 12,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/gkPyw3NT8akw3C7gL9JQ5iHT7Cg.png',
    link: 'https://www.ad-magazin.de/artikel/renovierung-altbauwohnung-berlin-jugendstil',
  },
  {
    id: 'press-yellowtrace-oct-2024',
    publication: 'Yellowtrace',
    issue_en: 'Yellowtrace / October 2024',
    date: '2024-10-01',
    order: 13,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/NahwEvGJX3T2aWLzQh5KMzzgtc.png',
    link: 'https://www.yellowtrace.com.au/studio-bosko-colourful-berlin-penthouse-interior-renovation/',
  },
  {
    id: 'press-elle-decoration-uk-oct-2024',
    publication: 'Elle Decoration UK',
    issue_en: 'Elle Decoration UK / October 2024',
    date: '2024-10-01',
    order: 14,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/uZQDS2glLJM7wolw7rFrYkVW9r4.png',
    link: 'https://www.elledecoration.co.uk/inspiration/bathrooms/a62364616/bathroom-sprawl-trend/',
  },
  {
    id: 'press-elle-decoration-uk-sep-2024',
    publication: 'Elle Decoration UK',
    issue_en: 'Elle Decoration UK / September 2024',
    date: '2024-09-01',
    order: 15,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/uBnzijkTLgGf7FLmECrSkwlqo.png',
    link: 'https://drive.google.com/file/d/1ZMIKyr-1zKm1XPcB7I5kdWOT2ufXG5Sm/view',
  },
  {
    id: 'press-ad-middle-east-apr-2024-shelves',
    publication: 'AD Middle East',
    issue_en: 'AD Middle East / April 2024',
    date: '2024-04-15',
    order: 16,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/IqJpFcTQ7cjCPUSocANUzCFRRE.png',
    link: 'https://www.admiddleeast.com/story/guide-to-styling-shelves-like-an-expert',
  },
  {
    id: 'press-ad-germany-aug-2024',
    publication: 'AD Germany',
    issue_en: 'AD Germany / August 2024',
    date: '2024-08-01',
    order: 17,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/KdQeO4Tbt6om7pmfc6vYIztvvM.png',
    link: 'https://www.ad-magazin.de/artikel/sanfte-renovierung-altbauwohnung-berlin',
  },
  {
    id: 'press-vogue-poland-jan-2024',
    publication: 'VOGUE Poland',
    issue_en: 'VOGUE Poland / January 2024',
    date: '2024-01-01',
    order: 18,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/q7BTqCdh2nrDrInycUn0zrLfbU.png',
    link: null,
  },
  {
    id: 'press-ad-middle-east-apr-2024-earthy',
    publication: 'AD Middle East',
    issue_en: 'AD Middle East / April 2024',
    date: '2024-04-01',
    order: 19,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/pVeJHivUcbAKQNran4gnuBc1g.png',
    link: 'https://www.admiddleeast.com/story/this-earthy-toned-apartment-in-berlin-comes-alive-with-pops-of-colour',
  },
  {
    id: 'press-living-corriere-feb-2024',
    publication: 'Living Corriere',
    issue_en: 'Living Corriere / February 2024',
    date: '2024-02-01',
    order: 20,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/WwIwU0naobt8RFBUIvW7NAkMtmM.png',
    link: 'https://living.corriere.it/case/new-classic/appartamento-classico-ristrutturato-pareti-bianche-berlino-studio-bosko/',
  },
  {
    id: 'press-vogue-poland-dec-2023',
    publication: 'VOGUE Poland',
    issue_en: 'VOGUE Poland / December 2023',
    date: '2023-12-01',
    order: 21,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/Jsfll3L9B3z44BjjDG7JMMlKKxg.png',
    link: 'https://www.vogue.pl/a/mieszkanie-w-berlinie-projektu-studio-boskot-pelne-dizajnerskich-mebli',
  },
  {
    id: 'press-label-magazine-jan-2024',
    publication: 'Label Magazine',
    issue_en: 'Label Magazine / January 2024',
    date: '2024-01-15',
    order: 22,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/OVUpVugjJrbUiHZQBYZKkpUT7bo.png',
    link: null,
  },
  {
    id: 'press-design-alive-oct-2023',
    publication: 'Design Alive',
    issue_en: 'Design Alive / October 2023',
    date: '2023-10-01',
    order: 23,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/KKdcDAPs0kSSKym4Fps7B4tadQ.png',
    link: null,
  },
  {
    id: 'press-ad-oct-2023',
    publication: 'Architectural Digest',
    issue_en: 'Architectural Digest / October 2023',
    date: '2023-10-01',
    order: 24,
    featured: true,
    imgUrl: 'https://framerusercontent.com/images/BFICw0ozBtUWEMqwSb40uJfFg.png',
    link: null,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
async function uploadImageFromUrl(url, filename) {
  console.log(`  📥 Downloading ${filename}…`)
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StudioBosko/1.0)' }
  })
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || 'image/png'
  console.log(`  ☁️  Uploading ${filename} (${(buffer.length / 1024).toFixed(0)} KB)…`)
  const asset = await client.assets.upload('image', buffer, { filename, contentType })
  return asset._id
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🗞  Seeding ${PRESS_ITEMS.length} press items into Sanity…\n`)

  let ok = 0, failed = 0

  for (const item of PRESS_ITEMS) {
    console.log(`\n[${item.order}/${PRESS_ITEMS.length}] ${item.issue_en}`)

    try {
      // Build the Sanity document
      const doc = {
        _id:   item.id,
        _type: 'press',
        publication: item.publication,
        issue: { en: item.issue_en },
        date:  item.date,
        order: item.order,
        featured: item.featured,
      }

      // Link (only if valid http URL)
      if (item.link && item.link.startsWith('http')) {
        doc.externalUrl = item.link
      }

      // Image
      if (item.imgUrl) {
        const ext   = item.imgUrl.split('.').pop().split('?')[0] || 'png'
        const fname = `${item.id}.${ext}`
        const assetId = await uploadImageFromUrl(item.imgUrl, fname)
        doc.coverImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          alt: `${item.publication} — Studio Bosko feature`,
        }
      }

      // createOrReplace is idempotent — safe to run multiple times
      await client.createOrReplace(doc)
      console.log(`  ✅ Saved: ${item.id}`)
      ok++
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`)
      failed++
    }
  }

  console.log(`\n✨ Done — ${ok} saved, ${failed} failed.\n`)
  if (failed > 0) process.exit(1)
}

main()
