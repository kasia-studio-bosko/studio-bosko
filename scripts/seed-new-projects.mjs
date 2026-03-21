/**
 * Studio Bosko — seed 5 new projects
 * Adds: Haus Giebelgarten, Westend Rose, Wilhelm Lane, Side to Side, Ballet School
 *
 * Usage:  npm run seed-new
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
    const val = t.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch { /* no .env.local — use existing env */ }

// ── Sanity client ──────────────────────────────────────────────────────────────
const client = createClient({
  projectId:  'ysq1y4zp',
  dataset:    'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

// ── Helpers ────────────────────────────────────────────────────────────────────
let _keyN = 0
const newKey = () => `k${(++_keyN).toString(36)}`

const block = (text) => ({
  _type: 'block', _key: newKey(), style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: newKey(), text, marks: [] }],
})

async function uploadImage(framerPath, label) {
  const url = `https://framerusercontent.com/images/${framerPath}`
  process.stdout.write(`     ↑ ${label} … `)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const ct  = res.headers.get('content-type') ?? 'image/jpeg'
  const ext = ct.includes('png') ? 'png' : 'jpg'
  const asset = await client.assets.upload('image', buf, {
    filename: `${label}.${ext}`, contentType: ct,
  })
  console.log(`done (${asset._id})`)
  return asset._id
}

const sanityImg   = (assetId, alt) => ({ _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt })
const galleryImg  = (assetId, alt) => ({ ...sanityImg(assetId, alt), _key: newKey() })

// ── Project definitions ────────────────────────────────────────────────────────
const PROJECTS = [

  // ── 5. Haus Giebelgarten ──────────────────────────────────────────────────
  {
    _id: 'project-haus-giebelgarten',
    slug: 'haus-giebelgarten',
    order: 5,
    featured: false,

    location: 'Berlin Mariendorf',
    size: 180,
    year: '2025',
    category: 'Complex Renovation + Curation',
    scope: ['Complex Renovation', 'Curation'],
    photographer: '',
    pressMentions: [],

    titleEn: 'Haus Giebelgarten',
    seoIntroEn: 'A comprehensive renovation of a 1970s family house in Berlin Mariendorf — 180 m² transformed from a dated chalet into a contemporary home with rich materiality and custom millwork.',
    descriptionEn: [
      block('A comprehensive renovation of a 1970s house, transforming a dated chalet into a contemporary family home for three. This project reimagines the original interior structure while honouring its architectural bones, creating spaces that balance warmth with modern sophistication.'),
      block('The design language throughout draws from the natural surroundings, incorporating rich materiality — green glazed tiles, variegated marble and travertine, warm wood paneling, and custom terrazzo flooring. Key interventions include opening up the main living spaces to maximise natural light, custom millwork throughout, and carefully curated material palettes that feel both timeless and distinctly contemporary.'),
      block('The result is a home that feels both grounded in its natural setting and collected — a space that supports family life while maintaining a refined sensibility for a family with a strong appreciation for art and craftsmanship.'),
    ],
    metaTitleEn: 'Haus Giebelgarten — Family House Renovation Berlin | Studio Bosko',
    metaDescriptionEn: 'A 180 m² 1970s house renovation in Berlin Mariendorf — rich materiality, custom terrazzo, and full interior design by Studio Bosko.',

    cover: { path: 'aPcjnQyeztQ43RMKLiea9peBnZU.jpg', alt: 'Curated living room by Studio Bosko' },
    gallery: [],
  },

  // ── 6. Westend Rose ───────────────────────────────────────────────────────
  {
    _id: 'project-westend-rose',
    slug: 'westend-rose',
    order: 6,
    featured: false,

    location: 'Berlin Charlottenburg',
    size: 160,
    year: '2025',
    category: 'Complex Renovation + Curation',
    scope: ['Complex Renovation', 'Curation'],
    photographer: '',
    pressMentions: ['ELLE Indonesia', '&Living Magazine', 'Luxury Portfolio Magazine'],

    titleEn: 'Westend Rose',
    seoIntroEn: 'A total overhaul of a Fin de Siècle residence in Berlin Westend — 160 m² of structural replanning, bespoke design, and curated art. Featured in ELLE Indonesia and &Living Magazine.',
    descriptionEn: [
      block('This beautiful Fin de Siècle residence in Berlin Westend has undergone a total overhaul. We only left the good bones of the interior architecture, while changing the zone plan, moving walls and creating new openings between spaces for an optimal flow.'),
      block('Texturally rich tonal materials played the main role in the kitchen, primary bathroom and the guest powder room. Bold in personality, yet utterly soothing — each space of this apartment carries bespoke designs and a selection of curated pieces, including artworks. For our clients, a family of high-profile executives, a characterful sanctuary that would serve them for many years to come was the main goal.'),
      block('The project has been published in print ELLE Indonesia, &Living Magazine and Luxury Portfolio Magazine.'),
    ],
    metaTitleEn: 'Westend Rose — Historic Renovation Berlin Charlottenburg | Studio Bosko',
    metaDescriptionEn: 'A 160 m² Fin de Siècle apartment renovation in Berlin Westend — structural replanning, bespoke interiors, and full curation by Studio Bosko. Featured in ELLE Indonesia and &Living.',

    cover: { path: 'hmUgGU56c13Agk1TSJ8PJL7kaY.jpg', alt: 'Bespoke high end kitchen Berlin' },
    gallery: [],
  },

  // ── 7. Wilhelm Lane ───────────────────────────────────────────────────────
  {
    _id: 'project-wilhelm-lane',
    slug: 'wilhelm-lane',
    order: 7,
    featured: false,

    location: 'Berlin Wilmersdorf',
    size: 115,
    year: '2023',
    category: 'Furniture & Art Curation',
    scope: ['Furniture Curation', 'Art Curation'],
    photographer: 'Giulia Maretti Studio',
    pressMentions: ['Vogue Polska', 'Living Corriere'],

    titleEn: 'Wilhelm Lane',
    seoIntroEn: 'A full-scope furniture and art curation for a 115 m² family apartment in Berlin Wilmersdorf — artworks as the starting point for a liveable, personality-driven home.',
    descriptionEn: [
      block('The apartment has a classic layout for this type of townhouse. It\'s a long corridor with passable rooms on either side of it. Our project meant a full-scope curation of the spaces filled with original architectural elements — from big furniture pieces, through art, down to personal decor.'),
      block('We began by selecting artworks, and it was on the basis of these that the entire interior concept was built. Adding personality to the young family home was a priority for the couple of savvy, discerning professionals. Convincing them of colour, vintage investment pieces and evocative art was our role.'),
      block('The project has been featured in Vogue Polska and Italian Living Corriere.'),
    ],
    metaTitleEn: 'Wilhelm Lane — Furniture & Art Curation Berlin | Studio Bosko',
    metaDescriptionEn: 'A 115 m² family apartment in Berlin Wilmersdorf — full furniture and art curation by Studio Bosko. Featured in Vogue Polska and Living Corriere.',

    cover: { path: 'w6x3HbrGdXP5geffPt9Fp4oeL0w.jpg', alt: 'Art in interiors high end living room design' },
    gallery: [],
  },

  // ── 8. Side to Side ───────────────────────────────────────────────────────
  {
    _id: 'project-side-to-side',
    slug: 'side-to-side',
    order: 8,
    featured: false,

    location: 'Berlin Schöneberg',
    size: 78,
    year: '2023',
    category: 'Full Scope Curation',
    scope: ['Curation'],
    photographer: 'Giulia Maretti Studio',
    pressMentions: ['AD Middle East', 'Label Magazine'],

    titleEn: 'Side to Side',
    seoIntroEn: 'A compact 78 m² penthouse overlooking Gleisdreieck park in Berlin — full-scope curation balancing sensory materiality with a calming palette. Featured in AD Middle East.',
    descriptionEn: [
      block('A compact penthouse overlooking Gleisdreieck park in Berlin. Its compact size and the clients\' need for a multi-functional home made us focus on using the vertical dimension to maximise storage and direct the eye upwards.'),
      block('The design choices were aimed at creating a cosy space exuding warmth and comfort, based on a calming colour palette. The materiality of the interior elements was also very important — the touch of natural stones and shaggy wool creates a stronger connection with the physical environment for the couple of busy tech professionals. Our aim was to create an atmosphere of calmness and sensuality that can be felt in Japanese and Scandinavian spaces without using direct references.'),
      block('The project has been featured in AD Middle East and Label Magazine.'),
    ],
    metaTitleEn: 'Side to Side — Compact Penthouse Curation Berlin | Studio Bosko',
    metaDescriptionEn: 'A 78 m² rooftop apartment in Berlin Schöneberg — sensory materiality, calming palette, and full curation by Studio Bosko. Featured in AD Middle East.',

    cover: { path: '4TpyHxZg8R2tmdfzO83sjRqI4I8.jpg', alt: 'Compact penthouse in earthy tones by Studio Bosko' },
    gallery: [],
  },

  // ── 9. Ballet School ──────────────────────────────────────────────────────
  {
    _id: 'project-ballet-school',
    slug: 'ballet-school',
    order: 9,
    featured: false,

    location: 'Berlin Kreuzberg',
    size: 130,
    year: '2022',
    category: 'Complex Renovation + Curation',
    scope: ['Complex Renovation', 'Curation'],
    photographer: 'Giulia Maretti Studio',
    pressMentions: ['AD Middle East', 'AD Germany', 'AD Spain', 'Vogue Polska', 'Label Magazine'],

    titleEn: 'Ballet School',
    seoIntroEn: 'A 130 m² Altbau renovation in Berlin Kreuzberg — an earthy palette with pops of colour, natural materials, and multi-functional spaces for a worldly San Francisco couple. Featured in AD Germany, AD Spain, and Vogue Polska.',
    descriptionEn: [
      block('This former Ballet School in Berlin Kreuzberg fell into the hands of a couple of high-flyers from San Francisco a year before our partnership started. The brief had a long list of functional requirements for their multi-hyphenate lifestyle.'),
      block('In the 130 m² apartment we found space for their bedroom, office, yoga area and a home gym, guest room and a spacious living room ready to host. An earthy-toned palette with pops of juicy colours and a selection of natural materials was inspired by their worldly travels and passion for the outdoors. A mix of woods and storied patterns became a decorative vehicle for cosiness and sophistication — an understated yet sumptuous home to stand the test of time.'),
      block('The project has been featured in many editions of Architectural Digest, including AD Middle East, AD Germany and AD Spain, as well as in Vogue Polska and Label Magazine.'),
    ],
    metaTitleEn: 'Ballet School — Altbau Renovation Berlin Kreuzberg | Studio Bosko',
    metaDescriptionEn: 'A 130 m² Altbau renovation in Berlin Kreuzberg — earthy palette, natural materials, and complex renovation by Studio Bosko. Featured in AD Germany, AD Spain, Vogue Polska.',

    cover: { path: 'Nys8Hkd2YqstYuv9lsb3L2CRUIY.jpg', alt: 'Apartment redesign and remodel in Berlin Kreuzberg' },
    gallery: [],
  },
]

// ── Main ───────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱  Studio Bosko — Seed 5 New Projects')
  console.log(`   Projects: ${PROJECTS.length}\n`)

  if (!process.env.SANITY_API_READ_TOKEN) {
    console.error('❌  SANITY_API_READ_TOKEN is not set.')
    process.exit(1)
  }

  for (const project of PROJECTS) {
    console.log(`\n📦  ${project.titleEn} (${project.slug})`)

    // 1. Upload cover
    console.log('   Cover image:')
    const coverId = await uploadImage(project.cover.path, `${project.slug}-cover`)

    // 2. Upload gallery (empty for new projects — add via Sanity Studio)
    const galleryIds = []
    if (project.gallery.length > 0) {
      console.log('   Gallery images:')
      for (let i = 0; i < project.gallery.length; i++) {
        const img = project.gallery[i]
        const id = await uploadImage(img.path, `${project.slug}-gallery-${String(i + 1).padStart(2, '0')}`)
        galleryIds.push({ id, alt: img.alt })
      }
    }

    // 3. Create/replace document
    const doc = {
      _type: 'project',
      _id: project._id,
      slug:          { _type: 'slug', current: project.slug },
      featured:      project.featured,
      order:         project.order,
      category:      project.category,
      location:      project.location,
      size:          project.size,
      year:          project.year,
      scope:         project.scope,
      photographer:  project.photographer,
      pressMentions: project.pressMentions,
      titleEn:           project.titleEn,
      seoIntroEn:        project.seoIntroEn,
      descriptionEn:     project.descriptionEn,
      metaTitleEn:       project.metaTitleEn,
      metaDescriptionEn: project.metaDescriptionEn,
      coverImage: sanityImg(coverId, project.cover.alt),
      gallery:    galleryIds.map(({ id, alt }) => galleryImg(id, alt)),
    }

    try {
      const result = await client.createOrReplace(doc)
      console.log(`   ✅  Saved: ${result._id}`)
    } catch (err) {
      console.error(`   ❌  Failed: ${err.message}`)
      throw err
    }
  }

  console.log('\n✅  All 5 projects added!\n')
  console.log('Next steps:')
  console.log('  1. Open Sanity Studio → /cms')
  console.log('  2. Add gallery images to each project')
  console.log('  3. Add DE/PL translations as needed\n')
}

seed().catch((err) => {
  console.error('\n💥 ', err.message)
  process.exit(1)
})
