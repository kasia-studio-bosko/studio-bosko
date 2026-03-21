/**
 * Studio Bosko — patch gallery images onto the 5 new projects
 *
 * Usage:  npm run seed-galleries
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
const newKey = () => `g${(++_keyN).toString(36)}`

async function uploadImage(framerPath, label) {
  const url = `https://framerusercontent.com/images/${framerPath}`
  process.stdout.write(`     ↑ ${label} … `)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const ct  = res.headers.get('content-type') ?? 'image/jpeg'
  const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg'
  const asset = await client.assets.upload('image', buf, {
    filename: `${label}.${ext}`, contentType: ct,
  })
  console.log(`done (${asset._id})`)
  return asset._id
}

const galleryImg = (assetId, alt) => ({
  _type: 'image',
  _key: newKey(),
  asset: { _type: 'reference', _ref: assetId },
  alt,
})

// ── Gallery definitions ────────────────────────────────────────────────────────
const GALLERIES = [

  // ── Haus Giebelgarten ───────────────────────────────────────────────────────
  {
    _id: 'project-haus-giebelgarten',
    title: 'Haus Giebelgarten',
    images: [
      { path: 'GXONQAyD4x2ZAE1on2tg2EWuSgM.jpg', alt: 'Hausrenovierung in Berlin Lichterfelde' },
      { path: 'lQrIkhTzz8CHXKii7OWsHQFuNJQ.jpg',  alt: 'Hausrenovierung in Berlin Lichterfelde' },
      { path: 'SmIRThq6Slfv0FYN5GQ4uqw5zfo.jpg',  alt: 'Curated living room by Studio Bosko' },
      { path: 'jgMCbb9CAMwI6Iwhskg8VPeUOcM.jpg',  alt: 'Hausrenovierung in Berlin Lichterfelde' },
      { path: 'ALUzuhFG7TP7BNAsCjAltSQS4.jpg',    alt: 'Inneneinrichtung Berlin Altbau' },
      { path: 'XBH4G7tMapqSIEUaOwh9NzLUZQ.jpg',   alt: 'Schlafzimmer in Hausrenovierung in Berlin Lichterfelde' },
      { path: 'lp2LLDl2wmuTfhUtALMA9GN0jSw.jpg',  alt: 'Hausrenovierung in Berlin Lichterfelde' },
      { path: 'RFP5PMgIoIv8C0zEPXVgT0l0XU.jpg',   alt: 'Hausrenovierung in Berlin Lichterfelde' },
      { path: 'GWN0jkVXAoQ2WRYrJz3z5zy23yY.jpg',  alt: 'Green glazed tiles with marble vanity' },
      { path: 'qdZCj7hdRVfkvaTiH6WDtlPfElQ.jpg',  alt: 'Hausrenovierung in Berlin Lichterfelde' },
      { path: '77FJLraM9XRazIiYDOcAHQA6E.jpg',    alt: 'Bespoke wardrobe in Berlin Lichterfelde' },
      { path: 'ZRRd2wT14TTgG6T1yxkIHS4kTM.jpg',   alt: 'Hausrenovierung in Berlin Lichterfelde' },
      { path: 'jipAi16rZZf06epkuxXHkGLsE.jpg',    alt: 'Lime plaster and marble bathroom in Berlin' },
      { path: 'Wjr5fpy8v1DcmKlrB4GwO3EZW5Q.jpg',  alt: 'Hausrenovierung in Berlin Lichterfelde' },
      { path: '4RevEkqaD1vwO3gGWzhwXbCj2Y.jpg',   alt: 'Hausrenovierung in Berlin Lichterfelde' },
      { path: 'CgL4e2wta72jbBEUfXrWGORVqdQ.jpg',  alt: 'Vibrant home office design by Studio Bosko' },
    ],
  },

  // ── Westend Rose ────────────────────────────────────────────────────────────
  {
    _id: 'project-westend-rose',
    title: 'Westend Rose',
    images: [
      { path: 'dW6jODPB8Ns9gEO84WsoKQG4.jpg',    alt: 'Art in interiors dining room design' },
      { path: '0oRVSMM0xarvi63uyHij4eMYUc.jpg',   alt: 'Art in interiors living room design' },
      { path: 'GDBZLvRHnAqCWlABhpkT74WYgXI.jpg',  alt: 'Guest bathroom in Berlin Altbau renovation' },
      { path: '4HXoGiJGE16ozrHVUlCPVUGM.png',     alt: 'Home office design Berlin Altbau' },
      { path: 'wfa7LBAKs0Oh0ek87YmZDKXnVfk.png',  alt: 'Home office design Berlin Altbau' },
      { path: 'gylQ5egFON23sc55O4cdzBnqRO4.jpeg', alt: 'Rose microcement bathroom in Berlin Charlottenburg' },
      { path: 'cAffsCxRwxFwdEpmb1d9M2n6uqY.png',  alt: 'Altbau renovation bedroom interior design' },
      { path: 'eg6e5eNtiVUoN6YrjaO4k5CgXjo.jpg',  alt: 'Open ensuite bathroom bedroom design' },
      { path: 'EtVBQbGyCMQgaCwZ2DURcNYvl8.png',   alt: 'Rose microcement bathroom in Berlin Charlottenburg' },
      { path: 'cDu7TzjdGFbhk7BbvJHTG96UMNQ.png',  alt: 'Warm tones kids room design' },
      { path: 'm5MrnkC4mOWb3tHW852DOOe6E.png',    alt: 'Warm tones kids room design' },
    ],
  },

  // ── Wilhelm Lane ────────────────────────────────────────────────────────────
  {
    _id: 'project-wilhelm-lane',
    title: 'Wilhelm Lane',
    images: [
      { path: 'Q1Kg9dhuCvsMOXBug1zCU4Kso.jpg',    alt: 'Living room interior design details' },
      { path: 'BC7jXRSAFrfZOoUkYdsXWmRya0I.jpg',   alt: 'Art in interiors living room design' },
      { path: 'ZmGnry5Nn9Sg3XE5y6LqAwotiFs.jpg',   alt: 'Bookcase styling with table lamp' },
      { path: 'bIr483jdXsquDMlV4DSYmMTimNs.jpg',   alt: 'Art in interiors dining room design' },
      { path: 'r8zPANgS4vuebkyOISf0iX4S4g.jpg',    alt: 'Art in interiors dining room design' },
      { path: 'XxdPfWcEu40herXXqKp9Ng2zY.jpg',     alt: 'USM sideboard decor' },
      { path: 'QgdfqayD9rkbFe6ue428qBYDfs.jpg',    alt: 'Altbau furnished with Vitra sofa' },
      { path: 'fUWUsaple8rwa7C4kEfSpPFzQ.jpg',     alt: 'Home office Berlin Altbau' },
      { path: '8jPWZF2M5tB4cnN1WfTeJLsWlAM.jpg',   alt: 'Altbau bedroom interior design' },
      { path: 'MeuqtsagLUxj309QnUDNmxPS9A.jpg',    alt: 'Altbau bedroom interior design' },
    ],
  },

  // ── Side to Side ────────────────────────────────────────────────────────────
  {
    _id: 'project-side-to-side',
    title: 'Side to Side',
    images: [
      { path: 'lZcuM5wU0aRkRbNgv8XWayHG4.jpg',    alt: 'Compact penthouse in earthy tones by Studio Bosko' },
      { path: 'v5AT35W6zR5PE6KjHfpUsY2U.jpg',      alt: 'Compact penthouse in earthy tones by Studio Bosko' },
      { path: 'VxfTFwGPDDTsNeHxUZ3QtvedcM.jpg',    alt: 'Living room coffee tables by Studio Bosko' },
      { path: 'OT0Kd3Izg8DNDGw34rtPLKEfpYg.jpg',   alt: 'Compact penthouse in earthy tones by Studio Bosko' },
      { path: 'pXFalBKPqJ6BGoks7xnO21ptu08.jpg',   alt: 'Vipp table lamp in a Studio Bosko interior' },
      { path: 'ZsgjoGzSHmC1s7o4lPofTwpOqPk.jpg',   alt: 'Compact penthouse in earthy tones by Studio Bosko' },
      { path: '0Z3KLirm3BB0qoIxuChwiYhjcg.jpg',    alt: 'Compact penthouse in earthy tones by Studio Bosko' },
      { path: 'h3qaLp5hnKJdZMeGsvdmGm0KXo.jpg',    alt: 'Compact penthouse in earthy tones by Studio Bosko' },
    ],
  },

  // ── Ballet School ────────────────────────────────────────────────────────────
  {
    _id: 'project-ballet-school',
    title: 'Ballet School',
    images: [
      { path: 'h4sXSkOuHVzeSNSQ8wP9iFuQvU.jpg',   alt: 'Bespoke furniture designed by Studio Bosko' },
      { path: 'Shf6mfCjsAXok2MhkXD4bVf5kz8.jpg',  alt: 'Apartment redesign and remodel in Berlin Kreuzberg' },
      { path: 'K2CYAhpittPISUJkhKfev8Cf1zw.jpg',  alt: 'Apartment redesign and remodel in Berlin Kreuzberg' },
      { path: 'Xxhi1IxMsZcrkTBbjr2dnPGoKA.jpg',   alt: 'Apartment redesign and remodel in Berlin Kreuzberg' },
      { path: '48lqivd6XllS6dJ1gohQyYqdI.jpg',    alt: 'Blue tiles and kitchen cabinets by Studio Bosko' },
      { path: '26EtwSfiMZxlGpTxbUkgGDQOjRg.jpg',  alt: 'Bespoke kitchen designed and executed by Studio Bosko' },
      { path: 'PeaR1ScZEzMsLj9GQRvsgZnamGk.jpg',  alt: 'Bedroom with checkerboard patterns by Studio Bosko' },
      { path: 'GN5oNZBYwe42HpWkD5q0XHl7jw.jpg',   alt: 'Bespoke oak kitchen in Berlin' },
      { path: 'wO0lINczOxcvbXIXp1OURm1xu4.jpg',   alt: 'Bespoke oak kitchen in Berlin' },
      { path: 'I6iywTGsCsd8Uo6x2bysiG3sV0.jpg',   alt: 'Terracotta and blue bathroom in Berlin Kreuzberg' },
      { path: 'djHvQmFhX9yo3j9lreVTZZ4jNjQ.jpg',  alt: 'Terracotta and blue bathroom in Berlin Kreuzberg' },
    ],
  },
]

// ── Main ───────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🖼️   Studio Bosko — Seed Gallery Images for 5 Projects')
  console.log(`   Projects: ${GALLERIES.length}\n`)

  if (!process.env.SANITY_API_READ_TOKEN) {
    console.error('❌  SANITY_API_READ_TOKEN is not set.')
    process.exit(1)
  }

  for (const project of GALLERIES) {
    console.log(`\n📦  ${project.title} (${project._id}) — ${project.images.length} gallery images`)

    const galleryItems = []
    for (let i = 0; i < project.images.length; i++) {
      const img = project.images[i]
      const label = `${project._id.replace('project-', '')}-gallery-${String(i + 1).padStart(2, '0')}`
      const assetId = await uploadImage(img.path, label)
      galleryItems.push(galleryImg(assetId, img.alt))
    }

    try {
      await client
        .patch(project._id)
        .set({ gallery: galleryItems })
        .commit()
      console.log(`   ✅  Gallery patched: ${project._id} (${galleryItems.length} images)`)
    } catch (err) {
      console.error(`   ❌  Failed to patch ${project._id}: ${err.message}`)
      throw err
    }
  }

  console.log('\n✅  All galleries populated!\n')
}

seed().catch((err) => {
  console.error('\n💥 ', err.message)
  process.exit(1)
})
