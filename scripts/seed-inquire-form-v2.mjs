/**
 * Studio Bosko — Rebuild the Inquire form's dynamic questions
 *
 * The form previously ran on a hardcoded 5-field fallback (formQuestions was
 * null in Sanity) because the CMS-driven system was never actually populated.
 * This seeds formQuestions with the full field set the owner requested:
 *
 *   phone, address (now required), serviceType, investment (Under 50K
 *   removed), projectType (new), spaceSize (new), decisionStyle (new),
 *   howHeard (new), description, floorPlanLink (new)
 *
 * Once formQuestions is non-null, InquireForm.tsx switches from the legacy
 * fallback to fully rendering this array — so this single write governs the
 * form on all three locales (EN/DE/PL) at once, and makes every field/label/
 * option editable in Sanity Studio going forward.
 *
 * Usage:
 *   node scripts/seed-inquire-form-v2.mjs
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

const client = createClient({
  projectId: 'ysq1y4zp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

let _k = 0
const key = () => `fq${++_k}`

function opts(pairs) {
  return pairs.map(([en, de, pl]) => ({
    _key: key(),
    _type: 'dropdownOption',
    label_en: en,
    label_de: de,
    label_pl: pl,
  }))
}

const formQuestions = [
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'phone',
    fieldType: 'tel',
    label_en: 'Phone number',
    label_de: 'Telefonnummer',
    label_pl: 'Numer telefonu',
    required: false,
  },
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'address',
    fieldType: 'text',
    label_en: 'Project Address',
    label_de: 'Projektadresse',
    label_pl: 'Adres projektu',
    required: true,
  },
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'serviceType',
    fieldType: 'select',
    label_en: 'What type of Studio Bosko services are you interested in?',
    label_de: 'Welche Leistungen von Studio Bosko interessieren dich?',
    label_pl: 'Jakie usługi Studio Bosko Cię interesują?',
    required: true,
    options: opts([
      ['Renovating & Furnishing', 'Renovierung & Einrichtung', 'Renowacja i aranżacja'],
      ['Furnishing & Art Curation', 'Einrichtung & Kunstkuration', 'Aranżacja i kuratorski dobór sztuki'],
    ]),
  },
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'investment',
    fieldType: 'select',
    label_en: 'What is your planned interior investment to achieve your goals?',
    label_de: 'Wie hoch ist dein geplantes Investitionsbudget?',
    label_pl: 'Jaki jest Twój planowany budżet inwestycyjny?',
    required: true,
    options: opts([
      ['50–100K €', '50.000–100.000 €', '50 000–100 000 €'],
      ['100–150K €', '100.000–150.000 €', '100 000–150 000 €'],
      ['150–250K €', '150.000–250.000 €', '150 000–250 000 €'],
      ['250K €+', 'Über 250.000 €', 'Powyżej 250 000 €'],
      ["Let's discuss", 'Auf Anfrage', 'Do ustalenia'],
    ]),
  },
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'projectType',
    fieldType: 'select',
    label_en: 'Your type of project',
    label_de: 'Um welche Art von Projekt handelt es sich?',
    label_pl: 'Rodzaj Twojego projektu',
    required: true,
    options: opts([
      ['Renovation', 'Renovierung', 'Renowacja'],
      ['New Build', 'Neubau', 'Nowa budowa'],
      ['Commercial', 'Gewerblich', 'Komercyjny'],
    ]),
  },
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'spaceSize',
    fieldType: 'text',
    label_en: 'Size of space (m²)',
    label_de: 'Größe der Fläche (m²)',
    label_pl: 'Wielkość przestrzeni (m²)',
    required: true,
  },
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'decisionStyle',
    fieldType: 'select',
    label_en: "What's your decision-making style?",
    label_de: 'Wie triffst du Entscheidungen?',
    label_pl: 'Jaki jest Twój styl podejmowania decyzji?',
    required: false,
    options: opts([
      [
        'Rapid & efficient — I decide in the moment',
        'Schnell & effizient — ich entscheide im Moment',
        'Szybki i sprawny — decyduję od razu',
      ],
      [
        'Thoughtful & considered — I need 2-7 days',
        'Überlegt & bedacht — ich brauche 2–7 Tage',
        'Przemyślany i rozważny — potrzebuję 2–7 dni',
      ],
      [
        "Relaxed & cautious — I'd rather take a couple of weeks",
        'Entspannt & vorsichtig — ich nehme mir lieber ein paar Wochen',
        'Spokojny i ostrożny — wolę poświęcić kilka tygodni',
      ],
    ]),
  },
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'howHeard',
    fieldType: 'text',
    label_en: 'How did you hear about us?',
    label_de: 'Wie hast du von uns erfahren?',
    label_pl: 'Skąd dowiedziałeś/aś się o nas?',
    required: true,
  },
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'description',
    fieldType: 'textarea',
    label_en: 'Tell us about your project',
    label_de: 'Erzähl uns von deinem Projekt',
    label_pl: 'Opowiedz nam o swoim projekcie',
    required: false,
  },
  {
    _key: key(),
    _type: 'formQuestion',
    fieldId: 'floorPlanLink',
    fieldType: 'text',
    label_en: 'Share a link to the floor plan and photos (Google Drive, Dropbox, etc.)',
    label_de: 'Teile einen Link zum Grundriss und zu Fotos (Google Drive, Dropbox etc.)',
    label_pl: 'Udostępnij link do rzutu i zdjęć (Google Drive, Dropbox itp.)',
    required: false,
  },
]

async function run() {
  console.log('Patching inquirePage.formQuestions...')

  await client
    .patch('inquirePage')
    .set({ formQuestions })
    .commit()

  console.log(`Done. ${formQuestions.length} questions written.`)
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
