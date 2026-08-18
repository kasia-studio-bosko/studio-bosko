/**
 * Studio Bosko — Seed DE/PL translations + CTA fields for "Our process" section
 *
 * Fixes: the "Our process" block on /de/leistungen and /pl/oferta was rendering
 * in English because processHeading_de/pl, processIntro_de/pl, processPhases[].title_de/pl,
 * processPhases[].description_de/pl, and processClosingLine_de/pl were never populated
 * (GROQ query falls back to the _en field via coalesce() when the localized value is empty).
 *
 * Also seeds the new processCtaHeading_en/de/pl and processCtaButton_en/de/pl fields,
 * which previously had no schema field at all — the CTA heading/button were hardcoded
 * English strings in app/[locale]/offering/page.tsx with no localization mechanism.
 *
 * Usage:
 *   node scripts/seed-offering-process-i18n.mjs
 *
 * Requirements:
 *   SANITY_API_READ_TOKEN must have Editor / Write role (see scripts/seed-offering-process.mjs).
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

// ── Portable Text helper ──────────────────────────────────────────────────────
let _k = 0
function key() { return `proci18n${++_k}` }

function pt(...texts) {
  return texts.filter(Boolean).map(text => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }))
}

// ── DE content ─────────────────────────────────────────────────────────────────
const processIntro_de = pt(
  'Jedes Projekt beginnt mit einer echten Auseinandersetzung mit den Menschen, die später darin leben. Wir nennen es unser Deep Design Study, und genau das macht alles Weitere zu etwas, das wirklich zu dir passt.',
  'Die meisten Designprozesse starten mit einem Blick: einem Ordner voller Referenzen, einer Stimmung. Unserer startet mit dir. Wie du deine Tage tatsächlich verbringst, was du über die Jahre gesammelt hast und warum, welche Räume aus deiner Vergangenheit hängen geblieben sind, was du fühlen willst, wenn du zur Tür hereinkommst. Uns interessiert das Unglamouröse genauso wie das Schöne, der Ort, an dem morgens das Chaos ausbricht, die Ecke, in der nie jemand einen Platz zum Sitzen findet.',
  'Von dort aus verläuft die Arbeit in klaren Phasen.',
)

const processClosingLine_de = pt(
  'Während des gesamten Prozesses hast du einen festen Ansprechpartner und immer den Überblick. Du bist eingebunden, wo es zählt, und musst dich um den Rest nicht kümmern.',
)

// ── PL content ─────────────────────────────────────────────────────────────────
const processIntro_pl = pt(
  'Każdy projekt zaczyna się od prawdziwego poznania osób, które będą w nim mieszkać. Nazywamy to Deep Design Study i to właśnie ten etap sprawia, że wszystko, co dzieje się później, jest naprawdę Twoje.',
  'Większość procesów projektowych zaczyna się od spojrzenia: folderu z inspiracjami, nastroju. Nasz zaczyna się od Ciebie. Od tego, jak spędzasz swoje dni, co przez lata gromadzisz i dlaczego, które pomieszczenia z przeszłości zostały w pamięci, co chcesz czuć, wchodząc przez drzwi. Interesuje nas to, co niezbyt efektowne, tak samo jak to, co piękne: poranny chaos, kąt, w którym nikt nigdy nie ma gdzie usiąść.',
  'Stąd praca przechodzi przez jasno określone etapy.',
)

const processClosingLine_pl = pt(
  'Przez cały ten czas masz jedną osobę kontaktową i jasny obraz tego, na jakim etapie jesteś. Bierzesz udział tam, gdzie to ważne, a resztą się nie martwisz.',
)

// ── Phases — matched to existing _key values in the live document ──────────────
// (confirmed via a read-only fetch before writing this script)
const phaseTranslations = [
  {
    _key: 'proc7', // Deep Design Study & Onboarding
    title_de: 'Deep Design Study & Onboarding',
    description_de: 'Wir starten dein Projekt und tauchen tief in deine Gewohnheiten, Bedürfnisse und die Substanz des Raums ein. Wir skizzieren deine ästhetische Komfortzone und das, was darüber hinaus möglich ist.',
    title_pl: 'Deep Design Study & Onboarding',
    description_pl: 'Uruchamiamy Twój projekt i zagłębiamy się w Twoje nawyki, potrzeby i naturę przestrzeni. Szkicujemy Twoją estetyczną strefę komfortu i to, co jest tuż za nią.',
  },
  {
    _key: 'proc8', // Design Concept
    title_de: 'Designkonzept',
    description_de: 'Wir definieren den individuellen Charakter deines Zuhauses und legen mit einem funktionalen Grundriss die Richtung fest, damit Gefühl und Ablauf gemeinsam entschieden werden. Und wir schätzen die Investition ein.',
    title_pl: 'Koncepcja projektowa',
    description_pl: 'Określamy indywidualny charakter Twojego domu i wyznaczamy jego kierunek poprzez funkcjonalny układ pomieszczeń, tak by nastrój i funkcjonalność ustalać razem. Szacujemy też inwestycję.',
  },
  {
    _key: 'proc9', // Design Development
    title_de: 'Design Development',
    description_de: 'Wir bringen es mit 3D-Modellen, Designboards und vollständigen Produktlisten zum Leben, damit du so viel wie möglich siehst, mit Budget hinterlegt, bevor gebaut wird.',
    title_pl: 'Rozwój projektu',
    description_pl: 'Ożywiamy go za pomocą modeli 3D, plansz projektowych i pełnych list produktów do przejrzenia, dzięki czemu widzisz jak najwięcej, z budżetem, zanim cokolwiek powstanie.',
  },
  {
    _key: 'proc10', // Fulfilment
    title_de: 'Umsetzung',
    description_de: 'Wir erstellen die Unterlagen, nach denen die Gewerke bauen, platzieren und verwalten alle Bestellungen und begleiten den Einbau, damit der fertige Raum dem Entwurf entspricht.',
    title_pl: 'Realizacja',
    description_pl: 'Przygotowujemy dokumentację wykonawczą, na podstawie której pracują ekipy, składamy i nadzorujemy wszystkie zamówienia oraz nadzorujemy montaż, tak by gotowa przestrzeń odpowiadała projektowi.',
  },
]

// ── Patch ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('Patching offeringPage with DE/PL "Our process" content + CTA fields...')

  let patch = client
    .patch('offeringPage')
    .set({
      processHeading_de: 'Unser Prozess',
      processHeading_pl: 'Nasz proces',
      processIntro_de,
      processIntro_pl,
      processClosingLine_de,
      processClosingLine_pl,
      processCtaHeading_en: 'Interested in working with us?',
      processCtaHeading_de: 'Interesse an einer Zusammenarbeit?',
      processCtaHeading_pl: 'Chcesz z nami współpracować?',
      processCtaButton_en: 'Book a complimentary consultation',
      processCtaButton_de: 'Kostenloses Beratungsgespräch buchen',
      processCtaButton_pl: 'Umów bezpłatną konsultację',
    })

  for (const phase of phaseTranslations) {
    patch = patch.set({
      [`processPhases[_key=="${phase._key}"].title_de`]: phase.title_de,
      [`processPhases[_key=="${phase._key}"].title_pl`]: phase.title_pl,
      [`processPhases[_key=="${phase._key}"].description_de`]: phase.description_de,
      [`processPhases[_key=="${phase._key}"].description_pl`]: phase.description_pl,
    })
  }

  await patch.commit()

  console.log('Done.')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
