/**
 * Studio Bosko — Sanity seed script
 * Populates the production dataset with the 4 real projects, including
 * uploading all images directly from the live Framer site.
 *
 * Usage:
 *   npm run seed
 *
 * Requirements:
 *   - SANITY_API_READ_TOKEN must have WRITE / Editor role
 *     (Sanity dashboard → API → Tokens → Add API token → Editor)
 *   - Node 18+ (uses built-in fetch)
 *   - Run from the project root
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

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
} catch {
  /* no .env.local — use existing environment */
}

// ── Sanity client ─────────────────────────────────────────────────────────────
// projectId and dataset are hardcoded — they're public, non-sensitive values.
// Only the token is read from env (it IS sensitive).
const SANITY_PROJECT_ID = 'ysq1y4zp'
const SANITY_DATASET    = 'production'

const client = createClient({
  projectId:  SANITY_PROJECT_ID,
  dataset:    SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

// ── Helpers ───────────────────────────────────────────────────────────────────
let _keyN = 0
const newKey = () => `k${(++_keyN).toString(36)}`

/** Build a Portable Text block from a plain string */
const block = (text) => ({
  _type: 'block',
  _key: newKey(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: newKey(), text, marks: [] }],
})

/** Upload a single image from a Framer URL; returns the Sanity asset _id */
async function uploadImage(framerPath, label) {
  const url = `https://framerusercontent.com/images/${framerPath}`
  process.stdout.write(`     ↑ ${label} … `)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const ct  = res.headers.get('content-type') ?? 'image/jpeg'
  const ext = ct.includes('png') ? 'png' : 'jpg'
  const asset = await client.assets.upload('image', buf, {
    filename: `${label}.${ext}`,
    contentType: ct,
  })
  console.log(`done (${asset._id})`)
  return asset._id
}

/** Build a Sanity image object from an already-uploaded asset _id */
const sanityImg = (assetId, altText) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
  alt: altText,
})

/** Build a Sanity gallery image (needs a _key) */
const galleryImg = (assetId, altText) => ({
  ...sanityImg(assetId, altText),
  _key: newKey(),
})

// ── Project definitions ───────────────────────────────────────────────────────
// cover = image used in the projects grid (portrait crop)
// hero  = first image shown on the project detail page (placed first in gallery)
// gallery = remaining project images in order

const PROJECTS = [
  // ── 1. Chroma Penthouse ───────────────────────────────────────────────────
  {
    _id: 'project-chroma-penthouse',
    slug: 'chroma-penthouse',
    order: 1,
    featured: true,

    // non-translated
    location: 'Berlin Kreuzberg',
    size: 143,
    year: '2024',
    category: 'Apartment',
    scope: ['Interior Design', 'Curation'],
    photographer: 'Giulia Maretti Studio',
    pressMentions: ['Elle Decoration UK', 'Elle Indonesia', 'Architectural Digest Polska', 'Yellowtrace', 'AD Spain'],

    // translated EN
    titleEn: 'Chroma Penthouse',
    seoIntroEn: 'A full-scope interior design and curation project for a newly built 143 m² penthouse in Berlin Kreuzberg — bold colour, bespoke joinery, and considered curation.',
    descriptionEn: [
      block('A full-scope interior design and curation project for a newly built penthouse in Berlin Kreuzberg. Studio Bosko handled the complete interior architecture, colour concept, bespoke joinery design, furniture selection, and art curation for this 143 m² top-floor apartment.'),
      block('With a simple brief of \'as little white as possible\', we had the pleasure of designing and curating the interiors of a newly built penthouse in a residential building in Kreuzberg. The colours were consciously used to functionally define the open plan space — the kitchen is bright yellow, the dining area is kept in shades of red, and the living room is drenched in green. A more atmospheric, nuanced design was chosen for the private area of the apartment, whereas all corners are carefully curated for a vibrant, lived-in composition.'),
      block('The goal was to create a rhythm of elements that pull interest and spark conversations, while being totally useful and not too precious. Each design decision in this project was taken with a full commitment — there are no half-measures here. And that adds to the joy, thinking of the final effect.'),
    ],
    metaTitleEn: 'Chroma Penthouse — Interior Design Berlin Kreuzberg | Studio Bosko',
    metaDescriptionEn: 'A 143 m² penthouse in Berlin Kreuzberg — bold colour, bespoke joinery, and full interior design by Studio Bosko. Featured in Elle Decoration UK, AD Polska, Yellowtrace.',

    // images
    cover: { path: 'l1lysvdOseg1KyDSJxHjCPPJQo.jpg', alt: 'Vibrant living room in a Berlin penthouse — Chroma Penthouse' },
    gallery: [
      { path: 'x0Yr03cqa4e6lUblxUJf7tBu0Eo.jpg', alt: 'Yellow zellige tile kitchen in a Berlin penthouse' },
      { path: 'BOggBhRkQi7PiQzHbSqCsKik6k4.jpg', alt: 'Chroma Penthouse red textured dining room' },
      { path: 'eA192QaMc9LvVLgtQ7zSVACiw.jpg',   alt: 'Chroma Penthouse yellow zellige tile bespoke kitchen in Berlin' },
      { path: 'ZRSU4czuR7ybMOztJOc5CgYL00Q.jpg', alt: 'Details of dining room with curated furniture' },
      { path: 'vzWV8eSxKZhufwaBAdT6EUw66Y.jpg',  alt: 'Chroma Penthouse red textured open space with Camaleonda sofa' },
      { path: 'SY8dwD9sl3s8IKFxiaUP5FiQts.jpg',  alt: 'Penthouse dining room in red and green' },
      { path: 'ECkGfjOuxcMFpnbmJHLb8m4Bts.jpg',  alt: 'Details of green living room with Camaleonda sofa' },
      { path: 'UhB15NmgkaaVJVcwA5JL4JfGls.jpg',  alt: 'Cosy bedroom with a moiré wallpaper' },
      { path: 'gNSbIgK148lBmnWWLAKknV5l4MY.jpg', alt: 'Green zellige tiles in an English-style bathroom' },
      { path: 'LXdG65VLKBq0omCnMjGGFgLPvO4.jpg', alt: 'Tiger Mountain velvet in a custom reading nook' },
      { path: 'jyYIOUo3uivQGg9bbafaOZpO0.jpg',   alt: 'Cosy bedroom with moiré wallpaper — second view' },
    ],
  },

  // ── 2. Zander Rooftop ─────────────────────────────────────────────────────
  {
    _id: 'project-zander-rooftop',
    slug: 'zander-rooftop',
    order: 2,
    featured: true,

    location: 'Berlin Kreuzberg',
    size: 170,
    year: '2023',
    category: 'Apartment',
    scope: ['Complex Renovation', 'Curation'],
    photographer: 'ONI Studio',
    pressMentions: ['AD Germany', '&Living Magazine'],

    titleEn: 'Zander Rooftop',
    seoIntroEn: 'A complex full renovation and interior design project for a 170 m² rooftop apartment in Berlin, on the border of Mitte and Kreuzberg — structural planning, bespoke joinery, and full curation.',
    descriptionEn: [
      block('A complex full renovation and interior design project for a 170 m² rooftop apartment in Berlin, on the border of Mitte and Kreuzberg. Studio Bosko managed the complete scope — from structural planning with an engineering architect, through interior architecture, bespoke joinery, material specifications, furniture procurement, and art curation — for a family dwelling with impressive ceiling heights.'),
      block('Located on the border between Berlin Mitte and Kreuzberg, the apartment overlooks the historic courtyards of Zander & Palm with their soulful industrial brickwork. Bought as a dark and dusty attic, within two years the space was transformed into a cosy and light-filled family dwelling with impressive ceiling heights.'),
      block('A warm palette thanks to the presence of various types of wood — oak, teak, palisander — makes bright hues and textures pop through experimental treatment of timber and material mixes, as well as curated art pieces. With two small kids and regular dinner parties, the couple needed the kitchen to be both practical and joyful. After 2.5 years of developing, the interiors feel lived in and very liveable — which is what Studio Bosko aims for with every design project they take on.'),
    ],
    metaTitleEn: 'Zander Rooftop — Complex Renovation Berlin | Studio Bosko',
    metaDescriptionEn: 'Full renovation of a 170 m² rooftop apartment in Berlin Mitte/Kreuzberg — structural redesign, bespoke joinery, and curation by Studio Bosko. Cover story for &Living Magazine.',

    cover: { path: 'HtBz4JDvXubiEp6tEPI9Z4Cc.jpg',  alt: 'Red kitchen island in bespoke kitchen — Zander Rooftop, Berlin' },
    gallery: [
      { path: 'ZYVBJZ8Ab5ttNRzXrTI5lyfm0us.jpg', alt: 'Berlin rooftop penthouse — Zander Rooftop exterior view' },
      { path: '2KxrtfvIJuBJlDRIvzOnYP4vw.jpg',   alt: 'Berlin Penthouse Dachgeschoss Ausbau — living area' },
      { path: 'XeroLE8FbkwLQgnCXUGvp5qIcU.jpg',  alt: 'Painting by Max Freund in a Berlin apartment' },
      { path: 'w3cYr7c0LafpfWciYoEj2KM6DVA.jpg', alt: 'Custom kitchen furniture with kitchen seat, Berlin' },
      { path: 'syIJo0tlUKMGAXuqvC6odXAXfI.jpg',  alt: 'Berlin Penthouse bathroom in marble, oak, and zellige tiles' },
      { path: 'Opb5D8ZcpZ2KEaNG9Tp0eMIto.jpg',   alt: 'Berlin Penthouse living room with custom furniture and art by Max Freund' },
      { path: 'z4x0qyAAM0JbB1BEgjkonBCVN7E.jpg', alt: 'Berlin Dachgeschoss kids room design' },
      { path: 'qnXD5gvRyLtSQt7X0LjRTE3w2tA.jpg', alt: 'Reading nook in kids room' },
      { path: 'AHFwrWppE6tvHXOjJpylSEcGw.jpg',   alt: 'Berlin Penthouse bathroom with a pop of red' },
      { path: '7SFoSNJiU9WYwvp5J5IcSYWwA.jpg',   alt: 'Berlin Penthouse bedroom interior design' },
      { path: 'DU73TCyRicrp6gzQ83fvwK9cDo.jpg',  alt: 'Oak wall panelling in bedroom' },
      { path: 'Op0xKFefqGA9vfwsrzwmImQsk.jpg',   alt: 'Curated bedroom interior design — Dachgeschoss Ausbau' },
      { path: 'GZ5f7yKekel7n7eU2mjZkttUVuM.jpg', alt: 'Berlin Penthouse bathroom in marble, oak, and zellige tiles — second view' },
    ],
  },

  // ── 3. Casa Norte ─────────────────────────────────────────────────────────
  {
    _id: 'project-casa-norte',
    slug: 'casa-norte',
    order: 3,
    featured: true,

    location: 'Szczecin, Poland',
    size: 90,
    year: '2024',
    category: 'Apartment',
    scope: ['Interior Design', 'Curation'],
    photographer: 'Giulia Maretti Studio',
    pressMentions: ['Vogue Poland', 'Architectural Digest'],

    titleEn: 'Casa Norte',
    seoIntroEn: 'A full-scope interior design and curation of a high-end new-build apartment in Szczecin, Poland — 90 m² balancing tactile richness with a quietly dramatic palette.',
    descriptionEn: [
      block('A full-scope interior design and curation of a high-end new-build apartment in the heart of Szczecin, Poland. Studio Bosko crafted Casa Norte — a 90 m² refuge for a couple of entrepreneurs who split their time between Poland and southern Spain.'),
      block('The clients wanted a place that will make them want to stay there more. Designed as a true anchor point, the home balances tactile richness with a quietly dramatic palette: lime-wash walls and a burnt sand tone ceiling wrap the interior in softness, while sculptural volumes and custom millwork bring rhythm and energy.'),
      block('A rounded kitchen bench fused with the island invites conversation, and a bespoke bookcase hiding a TV becomes a textured focal point in the open-plan living area. The material story includes hammered and etched oak, lacquered timbers, hand-glazed ceramic tiles, wool, and steel accents — layered to feel both curated and effortless. The result is a residence that gently insists on staying in, hosting openly, and living fully.'),
    ],
    metaTitleEn: 'Casa Norte — Interior Design Szczecin | Studio Bosko',
    metaDescriptionEn: 'A 90 m² new-build apartment in Szczecin — tactile materials, custom joinery, and full interior design by Studio Bosko. Featured in Vogue Poland and Architectural Digest.',

    cover: { path: 'UdwJZtpW3JOoD1xFzqm2j3MbP0.jpg', alt: 'Earthy tones and tactile wood in Casa Norte, Szczecin' },
    gallery: [
      { path: 'Myy45W3wvYbWz3tx1Cbz0HktBI.jpg',  alt: 'Earthy tones and tactile wood in a Polish penthouse' },
      { path: 'ISAxGDSF6nygVnJV8sb6m8YdYLQ.jpg',  alt: 'Open-plan living area in Casa Norte' },
      { path: 'f4m65iZYc0ZzqW5ylxRT7ayiVqs.jpg',  alt: 'Dining room and kitchen by Studio Bosko' },
      { path: 'ghmieBwCVGO072vZEVmBJpfKP4.jpg',   alt: 'Casa Norte — bespoke kitchen with rounded bench' },
      { path: 'DUXRYGQ69eNZUeAvRHxbAS45s.jpg',    alt: 'Bespoke bookcase in tactile oak wood' },
      { path: 'M5eoju9UotbIH0g53g9ORvIk8.jpg',    alt: 'Built-in kitchen bench in Casa Norte' },
      { path: 'rz0DIaxbLCCDYQdlLOOMHMcOjg.jpg',   alt: 'Sideboard styling with tactile materials' },
      { path: 'MNlHNzotREMTKhkHoujLMFE.jpg',      alt: 'Burgundy-drenched bathroom' },
      { path: 'd3r1ooKswfWiCVioYwfZr66nIWU.jpg',  alt: 'Burgundy checkerboard bathroom floor' },
      { path: '6vQA7gxkU6hvNH73gEbNZGuDTqg.jpg',  alt: 'Earthy tones and tactile wood — bedroom view' },
      { path: 'ndilgcJRhc5hGvB4C0iuZMiKFZw.jpg',  alt: 'Quartz, oak, and limewash plaster bathroom' },
      { path: 'jfFFAPR6FKQsrilGnT9DsdkjGI.jpg',   alt: 'Bathroom drenched in green tones' },
      { path: 'OSpOViLQ362bfZAJTEVHfJjwx8.jpg',   alt: 'Earthy tones and tactile wood — living room detail' },
    ],
  },

  // ── 4. Time Travel ────────────────────────────────────────────────────────
  {
    _id: 'project-time-travel',
    slug: 'time-travel',
    order: 4,
    featured: true,

    location: 'Berlin Neukölln',
    size: 95,
    year: '2022',
    category: 'Apartment',
    scope: ['Complex Renovation', 'Curation'],
    photographer: 'Giulia Maretti Studio',
    pressMentions: ['AD Germany', 'AD France', 'AD Italia', 'AD Spain', 'AD Mexico', 'Vogue Polska'],

    titleEn: 'Time Travel',
    seoIntroEn: 'An unconventional bachelor pad in Berlin Neukölln rooted in Jugendstil and filled with European history — 95 m² of complex renovation and eclectic curation.',
    descriptionEn: [
      block('A complex renovation and curation project for a 95 m² Altbau apartment in Berlin Neukölln. The building dates back to the Jugendstil period, which Studio Bosko symbolically brought back to life with various details during the six-month renovation.'),
      block('The client — a 35-year-old bachelor with a great appreciation for European history, literature, and art — wanted a home that painted a portrait of its owner. Our eclectic compositions of vintage and modern furniture and artwork became a curated journey through continental and British design: from English Victorian and German Art Nouveau tiles to Polish Art Deco and Italian Modernism.'),
      block('During the remodelling, the kitchen was opened to the entrance area by replacing a brick wall with a glass wall. The result is an apartment that is both cosy and sophisticated — it has depth, created by a complex colour palette and interesting details, while unexpected elements take the heaviness out of history.'),
    ],
    metaTitleEn: 'Time Travel — Complex Renovation Berlin Neukölln | Studio Bosko',
    metaDescriptionEn: 'A 95 m² Jugendstil apartment renovation in Berlin Neukölln — eclectic curation, vintage furniture, and complex renovation by Studio Bosko. Featured in AD Germany, AD France, Vogue Polska.',

    cover: { path: 'wxs1UdkYvpS4swIVRveRHqL8OBQ.jpg', alt: 'Colour-drenched hallway corridor with Victorian floor tiles — Time Travel, Berlin' },
    gallery: [
      { path: '2yxX7pUHxKMcwfCJlvYKrk5vXOE.jpg',  alt: 'Chocolate brown bedroom in Berlin interior design' },
      { path: 'Mwy2aJGiV2Cja1GMMm8rbXiekc.jpg',   alt: 'Chocolate brown bedroom with vintage collectible design furniture' },
      { path: 'Uvi7kalLqcWcKX6c1lIisDvFlo.jpg',   alt: 'Time Travel — living room with eclectic curation' },
      { path: '382y0fbOEvzrsXd1XDFQvc7w0.jpg',    alt: 'Green vibrant bathroom with wallpaper' },
      { path: 'N5pxlIJQ73mJH0peeVVLq04DE.jpg',    alt: 'Complex renovation Berlin — vintage shower bathroom' },
      { path: 'eIzBrK1KphwUELt56d5uSY5dMM.jpg',   alt: 'Furniture curation — collectible design and Italian midcentury furniture' },
      { path: 'nvAaIcTzPglQEMT9jznBkk1j3PM.jpg',  alt: 'Bespoke bookcase in living room — Altbau apartment' },
      { path: 'CMOu8d98uAuc5SYy67UaLY1YSe0.jpg',  alt: 'Bespoke bookcase detail — Altbau apartment' },
      { path: 'xCbHqJQx419LVSTrGQM5pPTOiV8.jpg',  alt: 'Vintage furniture curation in Berlin Altbau apartment' },
      { path: 'ebU1xjoGUAChK9haMvVggoVT0.jpg',    alt: 'Living room styling by Studio Bosko' },
      { path: 'AmZGmP2iW5jDFFAM3e0sk2ZaXHU.jpg',  alt: 'Kitchen bench seat in shades of green' },
      { path: 'mLX6aL4JQlxVRWgfqcLX1QSnDZM.jpg',  alt: 'Colour-drenching hallway corridor with Victorian floor tiles' },
      { path: 'mFHu0EftzhgMheSgqQeykwpo0N4.jpg',  alt: 'Bespoke kitchen — Berlin interior design and renovation' },
    ],
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱  Studio Bosko — Sanity Seed Script')
  console.log(`   Project : ${SANITY_PROJECT_ID}`)
  console.log(`   Dataset : ${SANITY_DATASET}`)
  console.log(`   Projects: ${PROJECTS.length}\n`)

  if (!process.env.SANITY_API_READ_TOKEN) {
    console.error('❌  SANITY_API_READ_TOKEN is not set.')
    console.error('   Add a token with Editor role in your Sanity dashboard:')
    console.error('   https://sanity.io/manage → API → Tokens → Add API token\n')
    process.exit(1)
  }

  for (const project of PROJECTS) {
    console.log(`\n📦  ${project.titleEn} (${project.slug})`)

    // 1. Upload cover image
    console.log('   Cover image:')
    const coverId = await uploadImage(project.cover.path, `${project.slug}-cover`)

    // 2. Upload gallery images
    console.log('   Gallery images:')
    const galleryIds = []
    for (let i = 0; i < project.gallery.length; i++) {
      const img = project.gallery[i]
      const id = await uploadImage(img.path, `${project.slug}-gallery-${String(i + 1).padStart(2, '0')}`)
      galleryIds.push({ id, alt: img.alt })
    }

    // 3. Create/replace the project document
    const doc = {
      _type: 'project',
      _id: project._id,

      // non-translated
      slug:         { _type: 'slug', current: project.slug },
      featured:     project.featured,
      order:        project.order,
      category:     project.category,
      location:     project.location,
      size:         project.size,
      year:         project.year,
      scope:        project.scope,
      photographer: project.photographer,
      pressMentions: project.pressMentions,

      // translated EN (DE/PL left empty — fill in Sanity Studio)
      titleEn:             project.titleEn,
      seoIntroEn:          project.seoIntroEn,
      descriptionEn:       project.descriptionEn,
      metaTitleEn:         project.metaTitleEn,
      metaDescriptionEn:   project.metaDescriptionEn,

      // images
      coverImage: sanityImg(coverId, project.cover.alt),
      gallery: galleryIds.map(({ id, alt }) => galleryImg(id, alt)),
    }

    try {
      const result = await client.createOrReplace(doc)
      console.log(`   ✅  Saved: ${result._id}`)
    } catch (err) {
      console.error(`   ❌  Failed to save document: ${err.message}`)
      throw err
    }
  }

  console.log('\n✅  All done!\n')
  console.log('Next steps:')
  console.log('  1. Open Sanity Studio → http://localhost:3000/studio')
  console.log('  2. Add DE translations in each project\'s 🇩🇪 Deutsch tab')
  console.log('  3. Add PL translations in each project\'s 🇵🇱 Polski tab')
  console.log('  4. Adjust display order and featured flags as needed\n')
}

seed().catch((err) => {
  console.error('\n💥 ', err.message)
  process.exit(1)
})
