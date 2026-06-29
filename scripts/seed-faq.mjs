/**
 * Studio Bosko — Seed FAQ page
 *
 * Creates the faqPage singleton with English content.
 * DE and PL translations can be added via Sanity Studio.
 *
 * Usage:
 *   node scripts/seed-faq.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

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
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

let _k = 0
function key() { return `faq${++_k}` }

function pt(...texts) {
  return texts.filter(Boolean).map(text => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }))
}

function item(question_en, ...answerParas) {
  return {
    _type: 'object',
    _key: key(),
    question_en,
    answer_en: pt(...answerParas),
  }
}

const faqItems = [
  item(
    'Do you handle the whole project, or just the design?',
    'Both, though most of our clients want the whole thing. We start with the concept and stay with the project through the technical drawings, the spec packages for the trades, the ordering, and the install. One point of contact the whole way, which is us.',
    'If you only need part of it, say the curation and furnishing of a place that\'s already built, we can scope it down. But the reason people come to us is so they don\'t have to hold all the pieces themselves.',
  ),
  item(
    'How involved do I need to be?',
    'As little as you want, beyond the parts only you can do. We need you properly present at the start, when we\'re learning how you actually live, and then at a few key decision points.',
    'The rest, the hundreds of small calls about a tile edge or a socket height, are ours to make. You give feedback when it matters and you receive the deliveries. We carry the rest.',
  ),
  item(
    'How do you make sure it feels like us, and not generic?',
    'Because we start with you and not with a look. Before we design anything, we spend real time on how you live, what you\'ve collected, the places that stayed with you, what you want to feel when you come home. That\'s the part most of the work hangs on.',
    'By the time we get to materials and furniture, every choice traces back to something specific about you rather than to whatever\'s in fashion. It\'s the difference between a home that\'s well done and one that couldn\'t belong to anyone else.',
  ),
  item(
    'What does the design involve, and how do you work with contractors?',
    'We take the design from first concept through to the detailed drawings and full specifications the trades build from. On site, we provide author\'s supervision: we brief the contractors, review the work against the design, and solve the problems that come up, so the finished space matches what we promised you.',
    'To be clear about scope, this is design supervision, not technical site management. We don\'t replace a site manager or structural engineer, and on larger renovations we\'ll tell you where you need one. We work with a network of trades we trust, and where you already have your own, we coordinate with them.',
  ),
  item(
    'How is the investment structured?',
    'We work with a flat design fee, set by the size of the space and how complex the project is, rather than billing by the hour for the creative work. That covers the design, the curation and art selection, and managing the orders. Supervision during the build sits on top, scoped to how much hands-on involvement your project needs.',
    'We split the fee across project milestones, so it stays predictable and tied to what\'s been delivered. A full project with us typically starts around [FIGURE TO INSERT]. The honest reason it\'s worth it: the cost of getting this wrong and living with it for years is far higher than the fee.',
  ),
  item(
    'We\'ve been meaning to do this for years. When\'s the right time to start?',
    'Probably sooner than the moment you\'re waiting for. There\'s always a reason to put it off, a busy stretch at work, a sense that you\'ll get to it once things settle. Meanwhile you\'re living in a space that doesn\'t quite fit who you are now, and that has a cost too, it\'s just a quiet one.',
    'Good projects take time to do well, so the sooner we start the conversation, the sooner you\'re actually living in the result. We take on a limited number of projects a year, so it\'s worth reaching out before you feel completely ready.',
  ),
]

async function run() {
  console.log('Creating faqPage document...')

  await client.createOrReplace({
    _type: 'faqPage',
    _id: 'faqPage',
    heading_en: 'FAQ',
    faqItems,
    seoTitle_en: 'FAQ | Studio Bosko',
    seoDescription_en: 'Answers to common questions about working with Studio Bosko — project scope, process, investment, and how to get started.',
  })

  console.log('Done.')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
