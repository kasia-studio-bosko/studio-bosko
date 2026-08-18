/**
 * Studio Bosko — Convert remaining German copy from formal "Sie" to informal "du"
 *
 * Follow-up to the "Our process" DE/PL fix: that section was written in "du",
 * which exposed that the rest of the German site (homepage, studio, offering
 * body copy, press, inquire) was still in formal "Sie". Owner decided to
 * convert the whole German site to "du" for consistency.
 *
 * Patches the live homepage / studioPage / offeringPage / pressPage / inquirePage
 * documents. Corresponding fallback strings in messages/de.json were already
 * updated by hand.
 *
 * Usage:
 *   node scripts/seed-de-du-register.mjs
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

const client = createClient({
  projectId: 'ysq1y4zp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

async function run() {
  console.log('Patching homepage...')
  await client
    .patch('homepage')
    .set({
      heroCta_de: 'Schau, ob wir zusammenpassen',
      scarcityCta_de: 'Erzähl uns von deinem Projekt',
      scarcityText_de:
        'Wir nehmen jedes Jahr eine begrenzte Anzahl von Projekten an. Wenn du über eine Renovierung oder ein neues Zuhause nachdenkst, würden wir gerne davon hören.',
    })
    .commit()

  console.log('Patching studioPage ethos bullets...')
  await client
    .patch('studioPage')
    .set({
      'ethosBullets[_key=="k19"].text_de':
        'Wir priorisieren Funktionalität von Anfang an — Raumfluss, Stauraum und Nutzbarkeit stehen im Mittelpunkt, damit der Raum deinen Lebensstil mühelos unterstützt.',
      'ethosBullets[_key=="k21"].text_de':
        'Wir gestalten Zuhause, die deine Geschichte erzählen — durch Materialien, Farben und die Art, wie das Licht im Raum spielt.',
      'ethosBullets[_key=="k22"].text_de':
        'Wir sind dein vertrauensvoller Berater — wir begleiten dich durch die Komplexität und helfen dir, Entscheidungen mit Zuversicht und Lösungsinstinkt zu treffen.',
    })
    .commit()

  console.log('Patching offeringPage body + project types...')
  await client
    .patch('offeringPage')
    .set({
      'offeringBody_de[_key=="k25"].children[_key=="k26"].text':
        'Wir spezialisieren uns auf vollständige Wohnprojekte und begleiten jeden Prozessschritt mit Sorgfalt und Klarheit. Du brauchst einen Partner, der deinen persönlichen Stil versteht und ihn in ein unverwechselbares, zeitloses Interieur übersetzt — ohne operativen Aufwand deinerseits.',
      'projectTypes[_key=="k38"].body_de':
        'Das Zuhause ist oft dein wertvollstes Gut. Wir wissen, wie wir das Potenzial jeder Immobilie freisetzen und ihren Wert für dich und deine Familie steigern können. Durch durchdachte Architekturplanung, maßgeschneiderte Kuration und professionelle Umsetzung sind unsere Interieurs sowohl funktional als auch hochkarätig gestaltet.',
      'projectTypes[_key=="k40"].body_de':
        'Wir kuratieren und beschaffen alles in deinem Namen — vom Sofa über Leuchten bis hin zu Kunstwerken und Dekorationselementen. Das kann bedeuten, ausgewählte Bestandsstücke mit neuen Funden zu vereinen — lokal in Auftrag gegeben oder weltweit beschafft.',
    })
    .commit()

  console.log('Patching pressPage...')
  await client
    .patch('pressPage')
    .set({
      heroBody_de:
        'Studio Bosko wurde für 2025 mit dem AD100-Titel ausgezeichnet und in Druck- und Online-Publikationen weltweit vorgestellt. Stöbere in unserem Archiv.',
    })
    .commit()

  console.log('Patching inquirePage...')
  await client
    .patch('inquirePage')
    .set({
      subtext_de:
        'Danke für dein Interesse. Teile uns unten die Details mit — wir melden uns innerhalb von 24–48 Stunden.',
    })
    .commit()

  console.log('Done.')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
