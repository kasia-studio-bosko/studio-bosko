/**
 * Seed script: populate descriptionDe and descriptionPl for all projects.
 *
 * Usage:
 *   SANITY_API_TOKEN=<your-write-token> node scripts/seed-descriptions.mjs
 *
 * Requires a Sanity API token with write permissions.
 * Create one at: https://www.sanity.io/manage → project → API → Tokens
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'ysq1y4zp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

/** Convert plain text (paragraphs separated by \n\n) into minimal Portable Text */
function toBlocks(text) {
  return text
    .split('\n\n')
    .filter(Boolean)
    .map((para) => ({
      _type: 'block',
      _key: Math.random().toString(36).slice(2, 10),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).slice(2, 10),
          text: para.trim(),
          marks: [],
        },
      ],
    }))
}

const DESCRIPTIONS = {
  'chroma-penthouse': {
    de: `Mit dem schlichten Brief „so wenig Weiß wie möglich" hatten wir das Vergnügen, die Innenräume eines neu gebauten Penthouses in einem Wohngebäude in Kreuzberg zu gestalten und zu kuratieren. Die Farben wurden bewusst eingesetzt, um den offenen Grundriss funktional zu gliedern — die Küche leuchtet in sattem Gelb, der Essbereich hält sich in Rottönen, das Wohnzimmer ist in Grün getaucht.

Für den privaten Bereich wurde eine atmosphärischere, nuanciertere Gestaltung gewählt, während alle Ecken sorgfältig kuratiert wurden. Das Ziel: ein Rhythmus aus Elementen, der Interesse weckt und Gespräche auslöst — vollkommen nützlich und nie zu kostbar.

Jede Designentscheidung in diesem Projekt wurde mit vollem Commitment getroffen. Keine halben Maßnahmen. Und das spürt man.`,
    pl: `Z prostym briefem „jak najmniej bieli" mieliśmy przyjemność zaprojektować i zaaranżować wnętrza nowo wybudowanego penthouse'u w budynku mieszkalnym na Kreuzbergu. Kolory zostały świadomie użyte do funkcjonalnego zdefiniowania otwartej przestrzeni — kuchnia jest intensywnie żółta, strefa jadalna utrzymana w odcieniach czerwieni, a salon skąpany w zieleni.

Dla prywatnej strefy apartamentu wybrano bardziej atmosferyczny, niuansowany projekt, podczas gdy wszystkie zakątki zostały starannie wyselekcjonowane. Cel: rytm elementów, który przyciąga uwagę i inicjuje rozmowy — całkowicie użyteczny i nigdy zbyt wyjątkowy, by z niego korzystać.`,
  },
  'zander-rooftop': {
    de: `An der Grenze zwischen Berlin Mitte und Kreuzberg gelegen, blickt die Wohnung auf die historischen Innenhöfe von Zander & Palm mit ihrem atmosphärischen Industriebackstein. Als dunkles, staubiges Dachgeschoss erworben, wurde der Raum innerhalb von zwei Jahren in ein gemütliches, lichtdurchflutetes Familienzuhause mit beeindruckenden Deckenhöhen verwandelt.

Eine warme Palette — getragen von verschiedenen Holzarten (Eiche, Teak, Palisander) — lässt helle Töne und Texturen durch experimentelle Holzbehandlungen und Materialmixe sowie kuratierte Kunstwerke aufleuchten.`,
    pl: `Zlokalizowany na granicy berlińskiego Mitte i Kreuzberga, apartament z widokiem na historyczne podwórza Zander & Palm z ich nastrojową industrialną cegłą. Kupiony jako ciemne, zakurzone poddasze, w ciągu dwóch lat przestrzeń została przekształcona w przytulne, wypełnione światłem rodzinne mieszkanie z imponującą wysokością sufitów.

Ciepła paleta dzięki obecności różnych rodzajów drewna (dąb, teak, palisander) sprawia, że jasne odcienie i faktury wyskakują przez eksperymentalne traktowanie drewna i mixy materiałów.`,
  },
  'casa-norte': {
    de: `Ein durchdachtes Innenarchitekturprojekt für eine Wohnung in Berlin Charlottenburg. Studio Bosko hat alle Oberflächen, Einbauten und die Einrichtung durchgängig geplant und spezifiziert — einschließlich des charakteristischen Badezimmers in Roségold-Mikrozement.

Ein raffiniertes, persönlichkeitsstarkes Wohninterieur im Westen Berlins.`,
    pl: `Przemyślany projekt aranżacji wnętrz dla mieszkania w berlińskim Charlottenburgu. Studio Bosko zaprojektowało i określiło wszystkie wykończenia, zabudowę i wyposażenie — w tym charakterystyczną łazienkę w różowym mikrocemencie.

Wyrafinowane, pełne osobowości wnętrze mieszkalne w zachodnim Berlinie.`,
  },
  'time-travel': {
    de: `Ein Wohninterieur von Studio Bosko in Berlin. Dieses Projekt erkundet satte, stimmungsvolle Töne und geschichtete Materialkombinationen — ein zutiefst persönliches Interieur für einen anspruchsvollen Auftraggeber, der einen Raum mit Charakter, Wärme und einer klaren Haltung wollte.`,
    pl: `Projekt wnętrza mieszkalnego Studio Bosko w Berlinie. Ten projekt eksploruje bogate, nastrojowe tony i wielowarstwowe kontrasty materiałów — głęboko osobiste wnętrze dla wymagającego właściciela, który chciał przestrzeni z charakterem, ciepłem i wyraźnym punktem widzenia.`,
  },
  'haus-giebelgarten': {
    de: `Ein großzügiges Einfamilienhaus, das Studio Bosko mit einer durchdachten Mischung aus zeitgenössischem Design und wohnlicher Wärme neu interpretiert hat. Jeder Raum wurde mit Blick auf Atmosphäre und Alltag gestaltet — Materialien mit Geschichte, Farben mit Haltung, Möbel mit Charakter.`,
    pl: `Przestronny dom jednorodzinny, który Studio Bosko na nowo zinterpretowało, łącząc współczesny design z mieszkalną ciepłotą. Każde pomieszczenie zostało zaprojektowane z myślą o atmosferze i codziennym użytkowaniu — materiały z historią, kolory z charakterem, meble z osobowością.`,
  },
  'westend-rose': {
    de: `Ein elegantes Berliner Apartment, das Studio Bosko mit einer gedämpften, nuancierten Palette und sorgsam kuratierten Einrichtungsstücken ausgestattet hat. Das Projekt verbindet klassische Berliner Altbau-Qualitäten mit einer modernen, persönlichkeitsstarken Innenraumgestaltung.`,
    pl: `Elegancki berlińskie mieszkanie, które Studio Bosko wyposażyło w stonowaną, niuansowaną paletę i starannie wybrane elementy wyposażenia. Projekt łączy klasyczne cechy berlińskiej kamienicy z nowoczesnym, pełnym osobowości projektowaniem wnętrz.`,
  },
  'wilhelm-lane': {
    de: `Ein Berliner Wohnprojekt, bei dem Studio Bosko Raumarchitektur und Kuration nahtlos miteinander verbunden hat. Bespoke Einbauten, eine durchdachte Materialsprache und kuratierte Kunst- und Dekorationsstücke schaffen ein Interieur, das unverwechselbar persönlich wirkt.`,
    pl: `Berliński projekt mieszkalny, w którym Studio Bosko płynnie połączyło architekturę wnętrz z kuracją. Meble na zamówienie, przemyślany język materiałów oraz starannie dobrane dzieła sztuki i elementy dekoracyjne tworzą wnętrze, które jest niepowtarzalnie osobiste.`,
  },
  'side-to-side': {
    de: `Ein Wohninterieur, das von Studio Bosko mit Blick auf Kontrast und Ausgewogenheit entwickelt wurde. Dunkle und helle Flächen, strukturierte und glatte Oberflächen, Alt und Neu — das Projekt lebt von der Spannung zwischen gegensätzlichen Elementen, die gemeinsam eine stimmige Einheit bilden.`,
    pl: `Wnętrze mieszkalne opracowane przez Studio Bosko z myślą o kontraście i równowadze. Ciemne i jasne płaszczyzny, faktury i gładkie powierzchnie, stare i nowe — projekt żyje napięciem między przeciwstawnymi elementami, które razem tworzą spójną całość.`,
  },
  'ballet-school': {
    de: `Ein besonderes Projekt: Studio Bosko hat die Innenräume einer Ballettschule mit derselben Sorgfalt und Haltung gestaltet wie seine Wohnprojekte — funktional durchdacht, ästhetisch konsistent und mit einem klaren Gespür für Atmosphäre und Identität.`,
    pl: `Wyjątkowy projekt: Studio Bosko zaprojektowało wnętrza szkoły baletowej z taką samą starannością i podejściem, jak swoje projekty mieszkalne — przemyślane funkcjonalnie, spójne estetycznie i z wyraźnym wyczuciem atmosfery i tożsamości miejsca.`,
  },
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('Error: SANITY_API_TOKEN environment variable is required.')
    console.error('Create a write token at https://www.sanity.io/manage → API → Tokens')
    process.exit(1)
  }

  // Fetch all projects to get their _id by slug
  const projects = await client.fetch(
    `*[_type == "project"] { _id, "slug": slug.current }`
  )

  console.log(`Found ${projects.length} projects in Sanity.`)

  for (const project of projects) {
    const slug = project.slug
    const descriptions = DESCRIPTIONS[slug]

    if (!descriptions) {
      console.log(`⚠️  No DE/PL descriptions for slug "${slug}" — skipping.`)
      continue
    }

    const patch = {}
    if (descriptions.de) patch.descriptionDe = toBlocks(descriptions.de)
    if (descriptions.pl) patch.descriptionPl = toBlocks(descriptions.pl)

    await client.patch(project._id).set(patch).commit()
    console.log(`✓  Updated "${slug}" with DE/PL descriptions.`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
