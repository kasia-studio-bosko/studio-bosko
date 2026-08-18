/**
 * Studio Bosko — Restore dropped closing sentences on the three project-type
 * blurbs (Offering page, "Types of projects" section) for DE and PL.
 *
 * The DE/PL translations were truncated mid-thought compared to the EN
 * source (confirmed by comparing body_en against body_de/body_pl before
 * writing this script). This appends the missing closing sentence(s).
 *
 * Usage:
 *   node scripts/seed-offering-projecttypes-closing.mjs
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

// Full replacement text (existing paragraph + restored closing sentence(s)).
const body_de_k38 =
  'Das Zuhause ist oft dein wertvollstes Gut. Wir wissen, wie wir das Potenzial jeder Immobilie freisetzen und ihren Wert für dich und deine Familie steigern können. Durch durchdachte Architekturplanung, maßgeschneiderte Kuration und professionelle Umsetzung sind unsere Interieurs sowohl funktional als auch hochkarätig gestaltet. Dank unserer Erfahrung, unserer Problemlösungsfreude und einem verlässlichen internationalen Netzwerk an Handwerkern realisieren wir Projekte in ganz Europa.'

const body_de_k39 =
  'Von der Materialwahl bis zum finalen Styling bringen wir taktile Energie in einen Raum — durch emotionale Materialkombinationen und lebendige Paletten. Unsere Erfahrung ermöglicht präzise Umfangsdefinitionen und Entscheidungen, die kostspielige Fehler vermeiden. Manchmal reicht es schon, einzelne Bereiche neu zu denken. Wir bringen Persönlichkeit in bereits gute Bausubstanz, damit der Ort am Ende wirklich deiner wird.'

const body_de_k40 =
  'Wir kuratieren und beschaffen alles in deinem Namen — vom Sofa über Leuchten bis hin zu Kunstwerken und Dekorationselementen. Das kann bedeuten, ausgewählte Bestandsstücke mit neuen Funden zu vereinen — lokal in Auftrag gegeben oder weltweit beschafft, um einzigartige Kompositionen in deinem gesamten Zuhause zu schaffen. Bei Neubauten oder frisch erworbenen Räumen entwickeln wir ein vollständiges Einrichtungs- und Dekokonzept auf Basis einer klaren kreativen Richtung und übernehmen die Beschaffung.'

const body_pl_k38 =
  'Dom jest często Twoim najcenniejszym dobrem. Wiemy, jak uwolnić potencjał każdej nieruchomości i zwiększyć jej wartość dla Ciebie i Twojej rodziny. Przez przemyślane planowanie architektoniczne, indywidualną kurację i profesjonalną realizację nasze wnętrza są zarówno funkcjonalne, jak i wysokiej jakości. Dzięki doświadczeniu, zamiłowaniu do rozwiązywania problemów oraz zaufanej, międzynarodowej sieci rzemieślników, realizujemy projekty w całej Europie.'

const body_pl_k39 =
  'Od doboru materiałów po finalny styling — wnosimy taktylną energię do przestrzeni przez emocjonalne zestawienia faktur i radosne palety. Nasze doświadczenie pozwala na precyzyjne określenie zakresu i decyzje, które pomagają uniknąć kosztownych błędów. Czasem wystarczy przeprojektować część przestrzeni, by wiele zmienić. Wprowadzamy osobowość w już dobre fundamenty, dzięki czemu na końcu miejsce staje się naprawdę Twoje.'

const body_pl_k40 =
  'Dobieramy i pozyskujemy wszystko w Twoim imieniu — od sofy, przez oświetlenie, po dzieła sztuki i elementy dekoracyjne. Może to oznaczać połączenie wybranych istniejących przedmiotów z nowymi znaleziskami zamawianymi lokalnie lub pozyskiwanymi globalnie, tworząc unikalne kompozycje w całym Twoim domu. Przy nowo budowanych lub świeżo nabytych przestrzeniach przygotowujemy pełną koncepcję umeblowania i dekoracji opartą na jasno określonym kierunku kreatywnym oraz zajmujemy się zakupami.'

async function run() {
  console.log('Patching offeringPage project-type closing sentences (DE/PL)...')

  await client
    .patch('offeringPage')
    .set({
      'projectTypes[_key=="k38"].body_de': body_de_k38,
      'projectTypes[_key=="k39"].body_de': body_de_k39,
      'projectTypes[_key=="k40"].body_de': body_de_k40,
      'projectTypes[_key=="k38"].body_pl': body_pl_k38,
      'projectTypes[_key=="k39"].body_pl': body_pl_k39,
      'projectTypes[_key=="k40"].body_pl': body_pl_k40,
    })
    .commit()

  console.log('Done.')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
