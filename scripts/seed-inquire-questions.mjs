/**
 * Seed the inquirePage singleton with the default form questions.
 *
 * This populates the CMS with the original 5 questions so the form keeps
 * working exactly as before — now fully editable from the Sanity Studio.
 *
 * Usage:
 *   node scripts/seed-inquire-questions.mjs
 *
 * Safe to re-run: it patches (merges) rather than replacing the whole document.
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually (no dotenv dependency needed)
try {
  const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
  }
} catch { /* fall back to process.env */ }

const client = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token:      process.env.SANITY_API_READ_TOKEN,
  useCdn:     false,
})

// ── Default questions ─────────────────────────────────────────────────────────
// These mirror the original static form exactly.
// After seeding, all questions are editable / reorderable / deletable in Studio.

const formQuestions = [
  {
    _key:      'phone',
    _type:     'formQuestion',
    fieldId:   'phone',
    fieldType: 'tel',
    label_en:  'Phone number',
    label_de:  'Telefonnummer',
    label_pl:  'Numer telefonu',
    required:  false,
  },
  {
    _key:      'address',
    _type:     'formQuestion',
    fieldId:   'address',
    fieldType: 'text',
    label_en:  'Project address',
    label_de:  'Projektadresse',
    label_pl:  'Adres projektu',
    required:  false,
  },
  {
    _key:      'serviceType',
    _type:     'formQuestion',
    fieldId:   'serviceType',
    fieldType: 'select',
    label_en:  'Type of service',
    label_de:  'Art der Dienstleistung',
    label_pl:  'Rodzaj usługi',
    required:  true,
    options: [
      { _key: 's1', _type: 'dropdownOption', label_en: 'Full interior design',        label_de: 'Vollständige Innenarchitektur', label_pl: 'Pełny projekt wnętrz'   },
      { _key: 's2', _type: 'dropdownOption', label_en: 'Interior design consultation', label_de: 'Innenarchitektur-Beratung',    label_pl: 'Konsultacja projektowa' },
      { _key: 's3', _type: 'dropdownOption', label_en: 'Space planning',               label_de: 'Raumplanung',                  label_pl: 'Planowanie przestrzeni' },
      { _key: 's4', _type: 'dropdownOption', label_en: 'Furniture & styling',          label_de: 'Möbel & Styling',              label_pl: 'Meble i stylizacja'     },
      { _key: 's5', _type: 'dropdownOption', label_en: 'Other',                        label_de: 'Sonstiges',                    label_pl: 'Inne'                   },
    ],
  },
  {
    _key:      'investment',
    _type:     'formQuestion',
    fieldId:   'investment',
    fieldType: 'select',
    label_en:  'Investment budget',
    label_de:  'Investitionsbudget',
    label_pl:  'Budżet inwestycyjny',
    required:  true,
    options: [
      { _key: 'b1', _type: 'dropdownOption', label_en: 'Under €50,000',     label_de: 'Unter 50.000 €',       label_pl: 'Poniżej 50 000 €'    },
      { _key: 'b2', _type: 'dropdownOption', label_en: '€50,000 – €100,000', label_de: '50.000 – 100.000 €',   label_pl: '50 000 – 100 000 €'  },
      { _key: 'b3', _type: 'dropdownOption', label_en: '€100,000 – €250,000', label_de: '100.000 – 250.000 €', label_pl: '100 000 – 250 000 €' },
      { _key: 'b4', _type: 'dropdownOption', label_en: '€250,000 – €500,000', label_de: '250.000 – 500.000 €', label_pl: '250 000 – 500 000 €' },
      { _key: 'b5', _type: 'dropdownOption', label_en: 'Over €500,000',       label_de: 'Über 500.000 €',      label_pl: 'Powyżej 500 000 €'   },
    ],
  },
  {
    _key:      'description',
    _type:     'formQuestion',
    fieldId:   'description',
    fieldType: 'textarea',
    label_en:  'Tell us about your project',
    label_de:  'Erzählen Sie uns von Ihrem Projekt',
    label_pl:  'Opowiedz nam o swoim projekcie',
    required:  false,
  },
]

// ── Contact label defaults ────────────────────────────────────────────────────
const contactLabels = {
  labelFirstName_en: 'First name',  labelFirstName_de: 'Vorname',   labelFirstName_pl: 'Imię',
  labelLastName_en:  'Last name',   labelLastName_de:  'Nachname',  labelLastName_pl:  'Nazwisko',
  labelEmail_en:     'Email',       labelEmail_de:     'E-Mail',    labelEmail_pl:     'E-mail',
  labelSubmit_en:    'Send inquiry', labelSubmit_de:   'Anfrage senden', labelSubmit_pl: 'Wyślij zapytanie',
}

// ── Upsert ────────────────────────────────────────────────────────────────────

const doc = await client.fetch(`*[_type == "inquirePage" && _id == "inquirePage"][0]{ _id }`)

if (doc?._id) {
  // Document exists — patch in the new fields
  await client
    .patch('inquirePage')
    .set({ formQuestions, ...contactLabels })
    .commit()
  console.log('✓  inquirePage patched with formQuestions + contact labels.')
} else {
  // Create the singleton document
  await client.create({
    _id:   'inquirePage',
    _type: 'inquirePage',
    formQuestions,
    ...contactLabels,
  })
  console.log('✓  inquirePage created with formQuestions + contact labels.')
}
