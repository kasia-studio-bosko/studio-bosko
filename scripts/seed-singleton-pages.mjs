/**
 * Studio Bosko — Seed singleton page documents
 * Creates/updates:
 *   - projectsPage  (SEO for /projects)
 *   - impressum     (legal notice + SEO for /impressum)
 *
 * Usage:
 *   npm run seed-singletons
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
  projectId:  'ysq1y4zp',
  dataset:    'production',
  apiVersion: '2024-01-01',
  token:      process.env.SANITY_API_READ_TOKEN,
  useCdn:     false,
})

// ── Portable Text helpers ─────────────────────────────────────────────────────
let _k = 0
const k = () => `k${++_k}`

function block(style, text) {
  return {
    _type:    'block',
    _key:     k(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  }
}
const h2     = (t) => block('h2',     t)
const h3     = (t) => block('h3',     t)
const normal = (t) => block('normal', t)

// ── Impressum body (same legal text for all locales — German law) ─────────────
const impressumBody = [
  h2    ('Impressum'),
  h3    ('Angaben gemäß § 5 TMG'),
  normal('Studio Bosko'),
  normal('Kasia Kronberger'),
  normal('10999 Berlin, Germany'),
  h3    ('Kontakt'),
  normal('E-Mail: hello@bosko.studio'),
  normal('Website: https://bosko.studio'),
  h3    ('Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG'),
  normal('DE454962108'),
  h3    ('Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV'),
  normal('Kasia Kronberger'),
  h3    ('Streitschlichtung'),
  normal('Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr'),
  normal('Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'),
]

// ── Documents ─────────────────────────────────────────────────────────────────
const docs = [
  // ── Projects Page (SEO) ───────────────────────────────────────────────────
  {
    _id:   'projectsPage',
    _type: 'projectsPage',
    seoTitleEn:       'Interior Design Projects — Berlin, Warsaw & Europe | Studio Bosko',
    seoTitleDe:       'Innenarchitektur Projekte — Berlin, Warschau & Europa | Studio Bosko',
    seoTitlePl:       'Projekty Wnętrz — Berlin, Warszawa i Europa | Studio Bosko',
    seoDescriptionEn: 'Portfolio of residential projects by Studio Bosko — penthouse renovations, high-end new builds and complete curation schemes across Berlin, Warsaw and Vienna.',
    seoDescriptionDe: 'Projektportfolio von Studio Bosko — Penthouse-Renovierungen, Neubauprojekte und vollständige Einrichtungskonzepte in Berlin, Warschau und Wien.',
    seoDescriptionPl: 'Portfolio realizacji Studio Bosko — renowacje penthousey, ekskluzywne nowe inwestycje i kompleksowe projekty w Berlinie, Warszawie i Wiedniu.',
  },

  // ── Impressum ─────────────────────────────────────────────────────────────
  {
    _id:   'impressum',
    _type: 'impressum',
    // Same German legal text for all locales
    bodyEn: impressumBody,
    bodyDe: impressumBody,
    bodyPl: impressumBody,
    seoTitleEn:        'Impressum | Studio Bosko',
    seoTitleDe:        'Impressum | Studio Bosko',
    seoTitlePl:        'Impressum | Studio Bosko',
    seoDescriptionEn:  'Legal notice for Studio Bosko interior design studio, Berlin.',
    seoDescriptionDe:  'Rechtliche Hinweise für Studio Bosko Innenarchitekturstudio, Berlin.',
    seoDescriptionPl:  'Nota prawna studia projektowania wnętrz Studio Bosko, Berlin.',
  },
]

// ── Run ───────────────────────────────────────────────────────────────────────
console.log('🌱  Seeding singleton page documents…\n')
for (const doc of docs) {
  await client.createOrReplace(doc)
  console.log(`✅  ${doc._id} (${doc._type})`)
}
console.log('\n✨  Done.')
