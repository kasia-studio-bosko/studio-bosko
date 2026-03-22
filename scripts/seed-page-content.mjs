/**
 * Studio Bosko — Page Content seed script
 * Populates all four pageContent documents (homepage, studio, offering, inquire)
 * with the full EN / DE / PL content currently maintained in messages/*.json.
 *
 * Usage:
 *   node scripts/seed-page-content.mjs
 *
 * Requirements:
 *   SANITY_API_READ_TOKEN must have Editor / Write role.
 *   (Sanity dashboard → API → Tokens → Add API token → Editor)
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
const client = createClient({
  projectId: 'ysq1y4zp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

// ── Portable Text helpers ─────────────────────────────────────────────────────
let _keyCounter = 0
function key() { return `k${++_keyCounter}` }

/** Wrap plain-text strings as Portable Text paragraph blocks */
function pt(...texts) {
  return texts.filter(Boolean).map(text => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }))
}

// ── Page documents ────────────────────────────────────────────────────────────

const pages = [

  // ── HOMEPAGE ─────────────────────────────────────────────────────────────
  {
    _id: 'pageContent-homepage',
    _type: 'pageContent',
    pageId: 'homepage',

    // English
    headingEn: 'Interior design studio based in Berlin and working across Europe.',
    subheadingEn: 'Interior Design Studio · Berlin & Warsaw',
    bodyEn: pt(
      'Personality-driven interiors layered with character, culture, and craftsmanship. Blending spatial planning with emotive curation, we craft homes that feel artful, personal, and true to how you actually live.',
      'Studio Bosko is a Berlin-based interior design studio running full-scope residential projects across Europe — from historic renovations and high-end new builds in Berlin and Warsaw, to complete interior design and furnishing schemes in Germany, Austria and beyond. Founded by Kasia Kronberger, the studio focuses on custom residential and boutique commercial projects.',
    ),
    seoTitleEn: 'Studio Bosko — Interior Design Studio Berlin & Warsaw',
    seoDescriptionEn: 'Full-scope residential interior design by Studio Bosko — Berlin, Warsaw & Vienna. Curated homes for discerning professionals. AD100 Polska 2025.',

    // Deutsch
    headingDe: 'Räume mit Persönlichkeit — geschichtet mit Charakter, Kultur und Handwerkskunst.',
    subheadingDe: 'Innenarchitektur Studio · Berlin & Warschau',
    bodyDe: pt(
      'Persönlichkeitsgetriebene Innenräume, geprägt von Charakter, Kultur und Handwerkskunst. Wir verbinden Raumplanung mit emotionaler Kuration und gestalten Zuhause, die so mühelos wirken wie sie durchdacht sind.',
      'Studio Bosko ist ein Berliner Innenarchitekturstudio, das umfassende Wohnprojekte in ganz Europa realisiert — von historischen Sanierungen und hochwertigen Neubauten in Berlin und Warschau bis hin zu kompletten Innenarchitektur- und Einrichtungskonzepten in Deutschland, Österreich und darüber hinaus. Das von Kasia Kronberger gegründete Studio konzentriert sich auf individuelle Wohn- und Boutique-Gewerbeprojekte.',
    ),
    seoTitleDe: 'Studio Bosko — Innenarchitektur Studio Berlin & Warschau',
    seoDescriptionDe: 'Umfassende Wohnraum-Innenarchitektur von Studio Bosko — Berlin, Warschau & Wien. Charakterstarke Zuhause für anspruchsvolle Auftraggeber. AD100 Polska 2025.',

    // Polski
    headingPl: 'Przestrzenie z osobowością — budowane z charakterem, kulturą i rzemiosłem.',
    subheadingPl: 'Studio Projektowania Wnętrz · Berlin i Warszawa',
    bodyPl: pt(
      'Łączymy projektowanie przestrzeni z emocjonalną kuracją, tworząc domy, które są równie przemyślane, co naturalne w odbiorze.',
      'Studio Bosko to berlińskie studio projektowania wnętrz realizujące kompleksowe projekty mieszkaniowe w całej Europie — od historycznych renowacji i luksusowych nowych budynków w Berlinie i Warszawie, po pełne projekty wnętrz i aranżacji w Niemczech, Austrii i nie tylko. Studio założone przez Kasię Kronberger skupia się na indywidualnych projektach mieszkaniowych i butikowych projektach komercyjnych.',
    ),
    seoTitlePl: 'Studio Bosko — Studio Projektowania Wnętrz Berlin i Warszawa',
    seoDescriptionPl: 'Kompleksowe projektowanie wnętrz mieszkalnych — Berlin, Warszawa i Wiedeń. Charakterne wnętrza dla wymagających klientów. AD100 Polska 2025.',
  },

  // ── STUDIO / ABOUT ────────────────────────────────────────────────────────
  {
    _id: 'pageContent-studio',
    _type: 'pageContent',
    pageId: 'studio',

    // English
    headingEn: 'We design personality-driven spaces—crafted with curatorial instinct and delivered with clarity.',
    subheadingEn: 'About',
    bodyEn: pt(
      'As an interior design studio named AD100 for 2025 by Architectural Digest Polska, we are tastemakers for clients who share a strong appreciation for art, culture, and craftsmanship. We create layered, personality-driven homes with a clear point of view—confident, curated, and boldly individual. Our work balances high design with lived-in ease—spaces that feel as effortless as they are intentional. A quest for artful character runs through everything we curate, shaping homes that don\'t just look beautiful, but feel deeply personal.',
      'Practicality and liveability are equally important to us, so each of our designs is entirely custom. We design to support how you actually live, when no one is watching. Because great design isn\'t just seen — it\'s felt.',
      'Led by Kasia Kronberger, Studio Bosko brings together structured precision and intuitive curation. Kasia\'s background spans education in business and trend forecasting, and international design experience across London, Florence, Barcelona, and Brussels. Her work is shaped by a global sensibility—layering modern craftsmanship, historical references, and joyful tension into interiors that are worldly and authentically evocative. She is recognised for creating spaces that start conversations: rooms rich with personality, intentional clashes, and emotional resonance—without ever feeling staged or overworked.',
    ),
    seoTitleEn: 'About Studio Bosko — Interior Designer Kasia Kronberger, Berlin',
    seoDescriptionEn: 'AD100-recognised interior design studio led by Kasia Kronberger. Based in Berlin, working internationally. Personality-driven homes crafted with curatorial instinct.',

    // Deutsch
    headingDe: 'Wir gestalten Räume mit Persönlichkeit — mit kuratorischem Instinkt und kompromissloser Klarheit.',
    subheadingDe: 'Studio',
    bodyDe: pt(
      'Als AD100-ausgezeichnetes Innenarchitektur-Studio — nominiert von Architectural Digest Polska 2025 — arbeiten wir für Auftraggeber, die Kunst, Kultur und Handwerkskunst wirklich schätzen. Wir entwerfen vielschichtige, charakterstarke Zuhause mit einer klaren Haltung — selbstbewusst, kuratiert, unverwechselbar. Unsere Arbeit verbindet hochkarätiges Design mit gelebter Leichtigkeit. Räume, die so selbstverständlich wirken wie sie sorgfältig gedacht sind. Ein Gespür für künstlerischen Charakter durchzieht alles, was wir kuratieren — und formt Zuhause, die nicht nur schön aussehen, sondern tief persönlich sind.',
      'Praktikabilität und Alltagstauglichkeit sind uns ebenso wichtig. Jedes unserer Projekte ist vollständig individuell gestaltet — für das Leben, wie es wirklich gelebt wird. Denn großes Design wird nicht nur gesehen. Es wird gespürt.',
      'Unter der Leitung von Kasia Kronberger vereint Studio Bosko strukturelle Präzision mit intuitiver Kuration. Kasias Hintergrund umfasst Business und Trendforschung sowie internationale Designerfahrung in London, Florenz, Barcelona und Brüssel. Ihre Arbeit trägt eine globale Sensibilität — Handwerkskunst der Gegenwart trifft historische Referenzen und bewusste Spannung. Räume, die Gespräche auslösen: reich an Persönlichkeit, gewollten Kontrasten und emotionaler Dichte — ohne je inszeniert zu wirken.',
    ),
    seoTitleDe: 'Über Studio Bosko — Innenarchitektin Kasia Kronberger, Berlin',
    seoDescriptionDe: 'AD100-ausgezeichnetes Innenarchitektur-Studio unter der Leitung von Kasia Kronberger. Berlin-basiert, international tätig. Räume mit Persönlichkeit und kuratorischer Präzision.',

    // Polski
    headingPl: 'Projektujemy przestrzenie z osobowością — z kuratorskim instynktem i bezkompromisową precyzją.',
    subheadingPl: 'Studio',
    bodyPl: pt(
      'Jako pracownia wyróżniona tytułem AD100 przez Architectural Digest Polska 2025, tworzymy dla klientów, którzy naprawdę cenią sztukę, kulturę i rzemiosło. Nasze realizacje to wielowarstwowe, charakterne wnętrza z wyraźnym punktem widzenia — pewne siebie, wyselekcjonowane, niepowtarzalne. Łączymy wysokie wzornictwo z naturalną lekkością użytkowania. Przestrzenie, które wyglądają tak, jakby zawsze tu były.',
      'Praktyczność i codzienna funkcjonalność są dla nas równie ważne. Każdy projekt jest w pełni indywidualny — zaprojektowany dla życia takim, jakim naprawdę jest. Bo dobre wnętrze nie tylko się widzi — czuje się je.',
      'Studio Bosko prowadzi Kasia Kronberger — projektantka łącząca strukturalną precyzję z intuicyjną kuracją. Jej wykształcenie w zakresie biznesu i prognozowania trendów oraz doświadczenie projektowe w Londynie, Florencji, Barcelonie i Brukseli ukształtowały globalną wrażliwość, którą wnosi do każdej realizacji.',
    ),
    seoTitlePl: 'O Studio Bosko — Projektantka wnętrz Kasia Kronberger, Berlin',
    seoDescriptionPl: 'Pracownia wyróżniona AD100, prowadzona przez Kasię Kronberger. Siedziba w Berlinie, projekty w całej Europie. Wnętrza z osobowością i kuratorską precyzją.',
  },

  // ── OFFERING / SERVICES ───────────────────────────────────────────────────
  {
    _id: 'pageContent-offering',
    _type: 'pageContent',
    pageId: 'offering',

    // English
    headingEn: 'We\'re a full-service interior design practice based in Berlin and Warsaw, running projects internationally.',
    subheadingEn: 'Full-scope residential interior design',
    bodyEn: pt(
      'We specialize in full-scope residential projects, overseeing every phase of the process with care and clarity. We understand you need an expert partner to design your home—one that grasps your personal style and translates it into a unique, timeless interior, without the operational hassle. With our intuition for the emotive connections and business expertise, we articulate visions and bring them to fruition for our discerning clientele.',
    ),
    seoTitleEn: 'Interior Design Services — Full-Scope Residential Projects | Studio Bosko',
    seoDescriptionEn: 'Full-scope interior design services: space planning, bespoke specifications, procurement, art sourcing and project supervision. Berlin, Warsaw, Vienna and across Europe.',

    // Deutsch
    headingDe: 'Full-Service Innenarchitektur — mit Sitz in Berlin und Warschau, tätig in ganz Europa.',
    subheadingDe: 'Ganzheitliche Innenarchitektur für Wohnräume',
    bodyDe: pt(
      'Wir spezialisieren uns auf vollständige Wohnprojekte und begleiten jeden Prozessschritt mit Sorgfalt und Klarheit. Sie brauchen einen Partner, der Ihren persönlichen Stil versteht und ihn in ein unverwechselbares, zeitloses Interieur übersetzt — ohne operativen Aufwand Ihrerseits. Mit unserem Gespür für emotionale Zusammenhänge und unternehmerischem Denken übersetzen wir Visionen in Wirklichkeit.',
    ),
    seoTitleDe: 'Innenarchitektur-Leistungen — Wohnprojekte aus einer Hand | Studio Bosko',
    seoDescriptionDe: 'Full-Service Innenarchitektur: Raumplanung, Materialspezifikation, Beschaffung, Kunstkuration und Baubegleitung. Berlin, Warschau, Wien und europaweit.',

    // Polski
    headingPl: 'Kompleksowa pracownia projektowania wnętrz — Berlin i Warszawa, projekty w całej Europie.',
    subheadingPl: 'Kompleksowe projektowanie wnętrz mieszkalnych',
    bodyPl: pt(
      'Specjalizujemy się w pełnozakresowych projektach mieszkalnych, prowadząc każdy etap z dbałością i precyzją. Potrzebujesz partnera, który zrozumie Twój styl i przełoży go na wyjątkowe, ponadczasowe wnętrze — bez operacyjnego obciążenia z Twojej strony.',
    ),
    seoTitlePl: 'Usługi projektowania wnętrz — kompleksowe projekty mieszkaniowe | Studio Bosko',
    seoDescriptionPl: 'Kompleksowe projektowanie wnętrz: planowanie przestrzeni, specyfikacje, zakupy, pozyskiwanie sztuki i nadzór autorski. Berlin, Warszawa, Wiedeń i Europa.',
  },

  // ── INQUIRE ───────────────────────────────────────────────────────────────
  {
    _id: 'pageContent-inquire',
    _type: 'pageContent',
    pageId: 'inquire',

    // English
    headingEn: 'We\'re currently welcoming inquiries for spring 2026 and beyond.',
    subheadingEn: 'Start a project',
    bodyEn: pt(
      'Thank you for your interest! To get started, please inquire below and we will be in touch within 24–48 business hours.',
    ),
    seoTitleEn: 'Start an Interior Design Project | Studio Bosko',
    seoDescriptionEn: 'Begin a conversation with Studio Bosko. We\'re welcoming new residential interior design projects across Berlin, Warsaw, Vienna and Europe for spring 2026.',

    // Deutsch
    headingDe: 'Wir freuen uns auf Anfragen für Frühjahr 2026 und darüber hinaus.',
    subheadingDe: 'Projekt anfragen',
    bodyDe: pt(
      'Danke für Ihr Interesse. Teilen Sie uns unten die Details mit — wir melden uns innerhalb von 24–48 Stunden.',
    ),
    seoTitleDe: 'Innenarchitektur-Projekt anfragen | Studio Bosko',
    seoDescriptionDe: 'Starten Sie ein Gespräch mit Studio Bosko. Wir nehmen neue Wohnprojekte in Berlin, Warschau, Wien und ganz Europa für Frühjahr 2026 an.',

    // Polski
    headingPl: 'Przyjmujemy zapytania na wiosnę 2026 i kolejne miesiące.',
    subheadingPl: 'Zacznij projekt',
    bodyPl: pt(
      'Dziękujemy za zainteresowanie. Wypełnij formularz poniżej — odezwiemy się w ciągu 24–48 godzin.',
    ),
    seoTitlePl: 'Rozpocznij projekt wnętrz | Studio Bosko',
    seoDescriptionPl: 'Rozpocznij rozmowę ze Studio Bosko. Przyjmujemy nowe projekty mieszkalne w Berlinie, Warszawie, Wiedniu i całej Europie na wiosnę 2026.',
  },
]

// ── Run ───────────────────────────────────────────────────────────────────────
console.log('🌱  Seeding page content documents…\n')

for (const page of pages) {
  try {
    await client.createOrReplace(page)
    console.log(`✅  ${page._id}`)
  } catch (err) {
    console.error(`❌  ${page._id}:`, err.message)
    process.exit(1)
  }
}

console.log('\n✨  Done — all page content documents created/updated.')
