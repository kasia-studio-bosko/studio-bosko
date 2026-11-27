/**
 * Studio Bosko — Align DE/PL copy + SEO with the updated English (positioning update, Nov 2026)
 *
 * Kasia rewrote the English on Homepage, Studio and Offering (27 Nov 2026) around the new
 * positioning line "Interiors with a point of view, layered with culture, wit, and ease."
 * This patches the German (du) and Polish (Ty) fields to match, fixes three Polish typos,
 * and refreshes the SEO descriptions in all three languages. English body copy is untouched.
 *
 * Usage:
 *   node scripts/seed-positioning-i18n-nov26.mjs            # dry run, prints the patches
 *   node scripts/seed-positioning-i18n-nov26.mjs --commit   # writes to Sanity
 *
 * Requirements:
 *   SANITY_API_READ_TOKEN in .env.local must have Editor / Write role.
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
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[k]) process.env[k] = v
  }
} catch {}

const COMMIT = process.argv.includes('--commit')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ysq1y4zp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

// Portable-text helper: one paragraph per string, stable keys per field
const blocks = (prefix, paras) =>
  paras.map((text, i) => ({
    _type: 'block',
    _key: `${prefix}${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${prefix}${i}s`, marks: [], text }],
  }))

const item = (arr, key, field) => `${arr}[_key=="${key}"].${field}`

// ── HOMEPAGE ──────────────────────────────────────────────────────────────────
const homepage = {
  heroHeadline_de: 'Räume mit Persönlichkeit, voller Kultur, Witz und Leichtigkeit.',
  heroHeadline_pl: 'Wnętrza z osobowością, łączące kulturę, przekorę i swobodę.',

  heroBody_de:
    'Wir verbinden präzise Raumplanung mit überraschenden Materialfunden und gestalten Zuhause, die kunstvoll und persönlich sind und genau dafür gemacht, wie du wirklich lebst.',
  heroBody_pl:
    'Łączymy precyzyjne planowanie przestrzeni z nieoczywistymi materiałowymi odkryciami, tworząc wnętrza artystyczne, osobiste i szyte na miarę tego, jak naprawdę żyjesz.',

  offeringBody_de:
    'Studio Bosko ist ein Interior-Design-Studio mit Sitz in Berlin und Warschau unter der Leitung von Kasia Kronberger. Jedes Jahr übernehmen wir eine ausgewählte Zahl umfassender Wohnprojekte in ganz Europa. Von historischen Altbauwohnungen über weitläufige Penthäuser bis zu Neubauten verantworten wir Raumplanung, maßgefertigte Einbauten, die Suche nach Sammlerstücken und die Baukoordination, in enger Zusammenarbeit mit Architekten, Ingenieuren und Meisterhandwerkern.',
  offeringBody_pl:
    'Studio Bosko to pracownia projektowania wnętrz z siedzibą w Berlinie i Warszawie, prowadzona przez Kasię Kronberger. Każdego roku podejmujemy się wybranej liczby kompleksowych projektów mieszkaniowych w całej Europie. Od historycznych przedwojennych kamienic, przez przestronne penthouse’y, po nowe budownictwo: prowadzimy planowanie przestrzeni, autorskie zabudowy, poszukiwanie przedmiotów kolekcjonerskich i koordynację prac na budowie, blisko współpracując z architektami, inżynierami i mistrzami rzemiosła.',

  seoDescription_en:
    'Personality-driven interiors layered with culture, wit and ease. Full-scope residential design in Berlin, Warsaw & Vienna. AD100 Polska 2025.',
  seoDescription_de:
    'Räume mit Persönlichkeit, voller Kultur, Witz und Leichtigkeit. Umfassende Innenarchitektur in Berlin, Warschau & Wien. AD100 Polska 2025.',
  seoDescription_pl:
    'Wnętrza z osobowością: kultura, przekora i swoboda. Kompleksowe projekty wnętrz w Berlinie, Warszawie i Wiedniu. AD100 Polska 2025.',
}

// ── STUDIO ────────────────────────────────────────────────────────────────────
const studioPage = {
  aboutBody_de: blocks('ab_de_', [
    'Als Interior-Design-Studio, das Architectural Digest Polska 2025 in die AD100 aufgenommen hat, gestalten wir für Menschen mit einer tiefen Wertschätzung für Kunst, Kultur und Handwerk: Zuhause, die selbstbewusst, kuratiert und unverwechselbar eigen sind. Unsere Arbeit verbindet präzises architektonisches Denken mit gelebter Leichtigkeit und schafft Räume, die so mühelos wirken, wie sie durchdacht sind. Die Suche nach kunstvollem Charakter zieht sich durch alles, was wir auswählen und in Auftrag geben, für Räume, die Gespräche anstoßen und zutiefst persönlich wirken.',
    'Der Rhythmus des Alltags zählt für uns genauso viel wie die visuelle Wirkung. Deshalb entwerfen wir jeden Einbau und jeden Grundriss von Grund auf neu. Wir gestalten dafür, wie du wirklich lebst, wenn niemand zusieht: Räume, die dem echten Leben standhalten und in denen die Schultern sinken, sobald du zur Tür hereinkommst.',
    'Unter der Leitung von Kasia Kronberger verbindet Studio Bosko strukturierte Präzision mit intuitiver Kuration. Kasias Hintergrund reicht von Business und Trendforschung bis zu internationaler Designerfahrung in London, Florenz, Barcelona und Brüssel. Ihr globaler Blick prägt ihre Arbeit: Sie verbindet zeitgenössisches Handwerk, historische Referenzen und lustvolle Spannung zu Räumen, die weltoffen und lebendig sind. Bekannt ist sie für Interieurs voller Persönlichkeit, bewusster Brüche und Wärme, die nie inszeniert oder überladen wirken.',
  ]),
  aboutBody_pl: blocks('ab_pl_', [
    'Jako pracownia projektowania wnętrz wyróżniona przez Architectural Digest Polska tytułem AD100 2025 tworzymy dla osób, które głęboko cenią sztukę, kulturę i rzemiosło: wnętrza pewne siebie, kuratorskie i odważnie indywidualne. Nasza praca łączy precyzyjne myślenie architektoniczne z codzienną swobodą, tworząc przestrzenie, które wydają się tak naturalne, jak są przemyślane. Poszukiwanie artystycznego charakteru przenika wszystko, co dobieramy i zamawiamy, dając wnętrza, które prowokują do rozmowy i są głęboko osobiste.',
    'Rytm codzienności jest dla nas tak samo ważny jak efekt wizualny, dlatego każdą zabudowę i każdy układ przestrzeni projektujemy od zera. Projektujemy z myślą o tym, jak naprawdę żyjesz, gdy nikt nie patrzy: tworzymy wnętrza, które sprawdzają się w prawdziwym życiu i w których ramiona same opadają, gdy tylko przekraczasz próg.',
    'Na czele Studio Bosko stoi Kasia Kronberger, która łączy uporządkowaną precyzję z intuicyjnym, kuratorskim wyczuciem. Jej doświadczenie obejmuje biznes, prognozowanie trendów oraz międzynarodową praktykę projektową w Londynie, Florencji, Barcelonie i Brukseli. Globalna wrażliwość kształtuje jej pracę: łączy współczesne rzemiosło, historyczne odniesienia i radosne napięcie we wnętrzach, które są światowe i pełne życia. Słynie z przestrzeni pełnych osobowości, celowych zderzeń i ciepła, które nigdy nie wyglądają na wystudiowane czy przeładowane.',
  ]),

  ethosBody_de:
    'Wir gestalten nicht für Oberfläche oder Effekt, und wir bauen niemals austauschbare Showrooms. Ein Zuhause sollte ein Porträt der Menschen sein, die darin leben, ihrer Rituale, Reisen und ihres Humors. Wenn ein Raum wirklich dazu passt, wie du dich durch die Welt bewegst, verändert sich alles.',
  ethosBody_pl:
    'Nie projektujemy dla efektu ani na pokaz i nigdy nie tworzymy wymiennych salonów wystawowych. Dom powinien być portretem ludzi, którzy w nim mieszkają: ich rytuałów, podróży i poczucia humoru. Kiedy przestrzeń naprawdę pasuje do tego, jak poruszasz się po świecie, wszystko się zmienia.',

  [item('ethosBullets', 'k20', 'text_de')]:
    'Wir kuratieren für visuelle Spannung und Freude: feine Handwerkskunst trifft auf ein verschmitztes Augenzwinkern.',
  [item('ethosBullets', 'k20', 'text_pl')]:
    'Dobieramy z myślą o wizualnym napięciu i zachwycie, łącząc wyrafinowane rzemiosło z przekornym mrugnięciem oka.',
  [item('ethosBullets', 'k21', 'text_de')]:
    'Wir erzählen deine Geschichte durch Material und schichten haptischen Putz, Holz, Stein und natürliches Licht so, dass der Raum nur zu dir gehören kann.',
  [item('ethosBullets', 'k21', 'text_pl')]:
    'Opowiadamy Twoją historię materiałem, warstwując fakturowy tynk, drewno, kamień i naturalne światło tak, by wnętrze mogło należeć tylko do Ciebie.',

  seoDescription_en:
    'AD100-recognised interior design studio led by Kasia Kronberger. Based in Berlin and Warsaw, creating personality-driven homes across Europe.',
  seoDescription_de:
    'AD100-Innenarchitekturstudio unter der Leitung von Kasia Kronberger. Aus Berlin und Warschau, mit Projekten in ganz Europa. Räume mit Persönlichkeit.',
}

// ── OFFERING ──────────────────────────────────────────────────────────────────
const offeringPage = {
  offeringBody_de: blocks('ob_de_', [
    'Wir übernehmen umfassende Wohnprojekte und ausgewählte Boutique-Gewerbeaufträge und leiten jede Phase, vom ersten Raumkonzept bis zum letzten Kunstwerk an der Wand. Du bringst mit, wie du leben möchtest; wir bringen die kreative Führung, den Zugang zu europäischen Galerien und Werkstätten und eine akribische Baukoordination.',
  ]),
  offeringBody_pl: blocks('ob_pl_', [
    'Podejmujemy się kompleksowych projektów mieszkaniowych i butikowych wnętrz komercyjnych, prowadząc każdy etap: od pierwszej koncepcji przestrzennej po ostatnie dzieło sztuki na ścianie. Ty wnosisz to, jak chcesz żyć; my wnosimy kreatywne prowadzenie, dostęp do europejskich galerii i pracowni oraz skrupulatną koordynację budowy.',
  ]),

  processCtaHeading_de: 'Du planst eine Komplettsanierung oder einen Neubau?',
  processCtaHeading_pl: 'Planujesz kompleksowy remont lub nowy dom?',
  processCtaButton_de: 'Erzähl uns von deinem Projekt',
  processCtaButton_pl: 'Opowiedz nam o swoim projekcie',

  // typo fix in the last intro paragraph
  'processIntro_pl[_key=="proci18n13"].children[_key=="proci18n14"].text':
    'Dalej praca przebiega w czterech czytelnych etapach.',

  [item('processPhases', 'proc8', 'description_de')]:
    'Wir definieren den individuellen Charakter deines Zuhauses und legen einen stimmigen Grundriss fest: Atmosphäre und Tagesablauf entscheiden wir gemeinsam. Parallel dazu stecken wir den Investitionsrahmen ab, bevor eine einzige Bestellung aufgegeben wird.',
  [item('processPhases', 'proc9', 'description_de')]:
    'Wir übersetzen die Vision in 3D-Modelle, haptische Materialpaletten und detaillierte Raumpläne. Du erlebst das Zusammenspiel von Stein, Holz, maßgefertigten Einbauten und Sammlerstücken, bevor der Bau beginnt.',
  [item('processPhases', 'proc9', 'description_pl')]:
    'Przekładamy wizję na trójwymiarowe modele, namacalne palety materiałów i szczegółowe zestawienia dla każdego pomieszczenia. Doświadczasz gry kamienia, drewna, autorskich zabudów i przedmiotów kolekcjonerskich, zanim rozpocznie się budowa.',
  [item('processPhases', 'proc10', 'description_de')]:
    'Wir erstellen die Ausführungspläne für Werkstätten und Gewerke, betreuen jede Maßanfertigung und jeden Kunsterwerb und leiten die Umsetzung vor Ort, vom Rückbau bis zum finalen Styling. An den wichtigsten Meilensteinen bist du informiert, während wir die kreative Vision und den Zeitplan für dich schützen.',
  [item('processPhases', 'proc10', 'description_pl')]:
    'Przygotowujemy dokumentację wykonawczą dla pracowni i wykonawców, czuwamy nad każdym zamówieniem na wymiar i zakupem dzieł sztuki oraz prowadzimy realizację na miejscu, od rozbiórki po finalną stylizację. O kluczowych etapach jesteś na bieżąco informowana/-y, a my chronimy wizję i harmonogram w Twoim imieniu.',

  [item('projectTypes', 'k38', 'body_de')]:
    'Manche Zuhause brauchen versetzte Wände, andere einfach einen schärferen Blick. Wir leiten ganzheitliche Umgestaltungen, von Kernsanierungen, die den Raumfluss neu definieren, bis zu tiefgreifenden Material-Erneuerungen im bestehenden Grundriss. Dank unserer Erfahrung, unserer lösungsorientierten Haltung und eines verlässlichen internationalen Netzwerks von Handwerkern realisieren wir Projekte in ganz Europa.',
  [item('projectTypes', 'k39', 'body_de')]:
    'Manche unserer liebsten Projekte beginnen mit einer leeren Leinwand. Wir übernehmen Dachgeschossausbauten, Neubauten an der Seite deiner Architekten und Rohbauten von Bauträgern. Mit emotionalen Materialkombinationen und fröhlichen Farbpaletten bringen wir haptische Energie in den Raum und decken das gesamte Spektrum der Innenarchitektur ab, damit aus dem nackten Rohbau vom ersten Tag an ein Zuhause mit unverwechselbarem Charakter wird.',
  [item('projectTypes', 'k40', 'title_pl')]: 'Butikowe obiekty komercyjne',

  [item('scopeItems', 'k29', 'label_de')]: 'Interior-Konzept, Raumplanung und architektonische Lichtplanung',
  [item('scopeItems', 'k29', 'label_pl')]: 'Koncepcja wnętrz, planowanie przestrzeni i architektoniczne projekty oświetlenia',
  [item('scopeItems', 'k30', 'label_de')]: 'Maßgefertigte Einbauten, Möbeldesign und Spezifikation haptischer Oberflächen',
  [item('scopeItems', 'k30', 'label_pl')]: 'Autorskie zabudowy, projektowanie mebli i specyfikacja wykończeń',
  [item('scopeItems', 'k31', 'label_de')]: 'Detaillierte Ausführungspläne für Gewerke und Werkstätten',
  [item('scopeItems', 'k31', 'label_pl')]: 'Szczegółowe rysunki wykonawcze dla wykonawców i pracowni',
  [item('scopeItems', 'k32', 'label_de')]: 'Vintage-Sammlerstücke, Kuration zeitgenössischer Kunst und Beschaffung',
  [item('scopeItems', 'k32', 'label_pl')]: 'Kolekcjonerskie vintage, kuratorski dobór sztuki współczesnej i zakupy',
  [item('scopeItems', 'k34', 'label_de')]: 'Investitionsplanung und vollständiges Installationsmanagement',
  [item('scopeItems', 'k34', 'label_pl')]: 'Zarządzanie budżetem inwestycji i pełna koordynacja realizacji',

  seoDescription_en:
    'Full-scope interior design: spatial planning, custom joinery, vintage & art sourcing, procurement and site direction. Berlin, Warsaw, Vienna & across Europe.',
  seoDescription_de:
    'Full-Service Innenarchitektur: Raumplanung, Einbauten, Vintage- und Kunstkuration, Beschaffung und Baubegleitung. Berlin, Warschau, Wien und europaweit.',
  seoDescription_pl:
    'Kompleksowe projektowanie wnętrz: planowanie, zabudowy, vintage i sztuka, zakupy oraz nadzór autorski. Berlin, Warszawa, Wiedeń i cała Europa.',
}

export const PATCHES = { homepage, studioPage, offeringPage }

// ── Guard: SEO descriptions must stay ≤160 chars (schema validation) ─────────
for (const [id, set] of Object.entries(PATCHES)) {
  for (const [k, v] of Object.entries(set)) {
    if (k.startsWith('seoDescription') && v.length > 160) {
      throw new Error(`${id}.${k} is ${v.length} chars (max 160)`)
    }
  }
}

async function run() {
  for (const [id, set] of Object.entries(PATCHES)) {
    console.log(`\n── ${id}: ${Object.keys(set).length} fields`)
    for (const k of Object.keys(set)) console.log('   ', k)
    if (COMMIT) {
      await client.patch(id).set(set).commit()
      console.log('   ✓ committed')
    }
  }
  if (!COMMIT) console.log('\nDry run. Re-run with --commit to write to Sanity.')
}

if (process.argv[1] && process.argv[1].endsWith('seed-positioning-i18n-nov26.mjs')) {
  run().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
