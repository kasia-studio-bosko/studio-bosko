/**
 * Studio Bosko — Seed "Our process" section on the Offering page
 *
 * Patches the existing offeringPage singleton with English content for the
 * new processHeading, processIntro, processPhases, and processClosingLine fields.
 *
 * Usage:
 *   node scripts/seed-offering-process.mjs
 *
 * Requirements:
 *   SANITY_API_READ_TOKEN must have Editor / Write role.
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
} catch { /* no .env.local */ }

// ── Sanity client ─────────────────────────────────────────────────────────────
const client = createClient({
  projectId: 'ysq1y4zp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

// ── Portable Text helpers ─────────────────────────────────────────────────────
let _k = 0
function key() { return `proc${++_k}` }

function pt(...texts) {
  return texts.filter(Boolean).map(text => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }))
}

// ── Content ───────────────────────────────────────────────────────────────────

const processIntro_en = pt(
  'Every design project starts with a proper study of the people who\'ll live and stay in it. We call it the Deep Design Study, and it\'s the part that makes everything after it specific to you.',
  'Most design processes start with a look: a folder of references, a mood. Ours starts with you. How you actually spend your days, what you\'ve gathered over the years and why, the rooms from your past that stayed with you, what you want to feel when you walk through the door. We\'re as interested in the unglamorous stuff, where the morning chaos happens, who never has anywhere to sit, as we are in the beautiful ones.',
  'From there the work moves in clear stages.',
)

const processPhases = [
  {
    _type: 'object',
    _key: key(),
    title_en: 'Deep Design Study & Onboarding',
    description_en: 'We set up your project and dig into your habits, your needs, and the bones of the space. We sketch out your aesthetic comfort zone and the magic beyond it.',
  },
  {
    _type: 'object',
    _key: key(),
    title_en: 'Design Concept',
    description_en: 'We define a bespoke character of your home and set its direction through a functional floor plan, so the feeling and the flow get decided together. We estimate the investment.',
  },
  {
    _type: 'object',
    _key: key(),
    title_en: 'Design Development',
    description_en: 'We bring it to life with 3D models, design boards, and full product lists for you to review, so you see as much as you can, budgeted, before it gets built.',
  },
  {
    _type: 'object',
    _key: key(),
    title_en: 'Fulfilment',
    description_en: 'We prepare the spec packages the trades build from, place and manage all the orders, and supervise the install so the finished space matches the design.',
  },
]

const processClosingLine_en = pt(
  'Through all of it you have one point of contact and a clear view of where things stand. You\'re involved where it counts and spared the parts you\'d rather not carry.',
)

// ── Patch ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('Patching offeringPage with "Our process" content...')

  await client
    .patch('offeringPage')
    .setIfMissing({
      processHeading_en: 'Our process',
      processIntro_en,
      processPhases,
      processClosingLine_en,
    })
    .commit()

  console.log('Done.')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
