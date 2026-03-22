/**
 * Studio Bosko — Seed all dedicated page singleton documents
 *
 * Creates/updates:
 *   - homepage     (_id: "homepage")
 *   - studioPage   (_id: "studioPage")
 *   - offeringPage (_id: "offeringPage")
 *   - pressPage    (_id: "pressPage")
 *   - inquirePage  (_id: "inquirePage")
 *
 * Usage:
 *   npm run seed-pages
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

// ── Image upload helper ────────────────────────────────────────────────────────
async function uploadImage(url) {
  console.log(`  ↑ Uploading ${url.split('/').pop()}…`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`)
  const buffer = await res.arrayBuffer()
  const ext    = url.split('.').pop().split('?')[0] || 'jpg'
  const asset  = await client.assets.upload('image', Buffer.from(buffer), {
    filename:    url.split('/').pop(),
    contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

// ── Portable Text helpers ──────────────────────────────────────────────────────
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
const pt = (...texts) => texts.filter(Boolean).map(t => block('normal', t))

// ── Main seeder ───────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Studio Bosko — seeding page singleton documents\n')

  // ── Upload images ────────────────────────────────────────────────────────────
  console.log('📸  Uploading images…')
  const [
    testimonialImgHome,
    kasiaPhoto1,
    kasiaPhoto2,
    studioPhoto1,
    studioPhoto2,
    offeringImg1,
    offeringImg2,
    offeringImg3,
    offeringTestimonialImg,
    homepageTestimonialImg,
  ] = await Promise.all([
    // Homepage testimonial — hallway (as specified in task)
    uploadImage('https://framerusercontent.com/images/BLcEb8zhESV8vCYUNx12PnA9d5c.jpg'),
    // Studio photos
    uploadImage('https://framerusercontent.com/images/R8TMgB8ZuigjgRdDrkIq1XL8pyE.jpg'),
    uploadImage('https://framerusercontent.com/images/8v65b9JTdh7Lt2d0LE7LfBwg.jpg'),
    uploadImage('https://framerusercontent.com/images/TmcA1nzDm35cOZWzjts2wkS6kZ0.jpg'),
    uploadImage('https://framerusercontent.com/images/5UTLSTSHs0DzqrK1CoNNl85Uro.jpg'),
    // Offering page images
    uploadImage('https://framerusercontent.com/images/9RomZBJL6uDE9riO4mhK43xA.jpg'),
    uploadImage('https://framerusercontent.com/images/rbIRqe2yxSTp84HPR7YpLWO59o.jpg'),
    uploadImage('https://framerusercontent.com/images/MU12NSy3wj6azUf80fouUcr6Bpg.png'),
    // Offering testimonial (Doug — hallway)
    uploadImage('https://framerusercontent.com/images/wxs1UdkYvpS4swIVRveRHqL8OBQ.jpg'),
    // Homepage testimonial (Lana — separate image)
    uploadImage('https://framerusercontent.com/images/yfc2vkVeKbvCu6ku142CbqwMx0g.jpg'),
  ])
  console.log('  ✅  All images uploaded\n')

  // Helper: add alt to a Sanity image object
  const img = (ref, alt) => ({ ...ref, alt })

  // ── Documents ────────────────────────────────────────────────────────────────
  const docs = [

    // ── HOMEPAGE ──────────────────────────────────────────────────────────────
    {
      _id:   'homepage',
      _type: 'homepage',

      // Hero Headline
      heroHeadline_en: 'Personality-driven interiors layered with character, culture, and craftsmanship.',
      heroHeadline_de: 'Räume mit Persönlichkeit — geschichtet mit Charakter, Kultur und Handwerkskunst.',
      heroHeadline_pl: 'Przestrzenie z osobowością — budowane z charakterem, kulturą i rzemiosłem.',

      // Hero Body
      heroBody_en: 'Blending spatial planning with emotive curation, we craft homes that feel artful, personal, and true to how you actually live.',
      heroBody_de: 'Wir verbinden Raumplanung mit emotionaler Kuration und gestalten Zuhause, die so mühelos wirken wie sie durchdacht sind.',
      heroBody_pl: 'Łączymy projektowanie przestrzeni z emocjonalną kuracją, tworząc domy, które są równie przemyślane, co naturalne w odbiorze.',

      // Hero CTA
      heroCta_en: "See if we're a fit",
      heroCta_de: 'Schauen Sie, ob wir zusammenpassen',
      heroCta_pl: 'Sprawdź, czy do siebie pasujemy',

      // Offering section
      offeringHeadline_en: 'Offering',
      offeringHeadline_de: 'Leistungen',
      offeringHeadline_pl: 'Oferta',

      offeringBody_en: 'Studio Bosko is a Berlin-based interior design studio running full-scope residential projects across Europe — from historic renovations and high-end new builds in Berlin and Warsaw, to complete interior design and furnishing schemes in Germany, Austria and beyond. Founded by Kasia Kronberger, the studio focuses on custom residential and boutique commercial projects.',
      offeringBody_de: 'Studio Bosko ist ein Berliner Innenarchitekturstudio, das umfassende Wohnprojekte in ganz Europa realisiert — von historischen Sanierungen und hochwertigen Neubauten in Berlin und Warschau bis hin zu kompletten Innenarchitektur- und Einrichtungskonzepten in Deutschland, Österreich und darüber hinaus.',
      offeringBody_pl: 'Studio Bosko to berlińskie studio projektowania wnętrz realizujące kompleksowe projekty mieszkaniowe w całej Europie — od historycznych renowacji i luksusowych nowych budynków w Berlinie i Warszawie, po pełne projekty wnętrz i aranżacji w Niemczech, Austrii i nie tylko.',

      offeringCta_en: 'Learn what we offer',
      offeringCta_de: 'Unser Angebot kennenlernen',
      offeringCta_pl: 'Poznaj naszą ofertę',

      // Testimonial (Lana)
      testimonialQuote_en: 'With Studio Bosko taking care of everything, we could lean back and enjoy our beautiful place. While initially unsure if interior design would be worth it, we now have no doubt that it added value to our place and enhanced our wellbeing.',
      testimonialQuote_de: 'Da Studio Bosko sich um alles gekümmert hat, konnten wir zurücklehnen und unsere wunderschöne neue Wohnung genießen. Anfangs waren wir unsicher, ob Innenarchitektur den Aufwand wert ist — heute zweifeln wir keinen Moment daran.',
      testimonialQuote_pl: 'Dzięki temu, że Studio Bosko zadbało o wszystko, mogliśmy się odprężyć i cieszyć pięknym miejscem. Początkowo nie byliśmy pewni, czy projektowanie wnętrz jest warte inwestycji — dziś nie mamy co do tego wątpliwości.',
      testimonialAuthor: 'Lana, homeowner and tech executive',
      testimonialImage: img(homepageTestimonialImg, 'Studio Bosko interior — Lana testimonial'),

      // Scarcity CTA
      scarcityText_en: "We take on a limited number of projects each year. If you're considering a renovation or new home, we'd love to hear about it.",
      scarcityText_de: 'Wir nehmen jedes Jahr eine begrenzte Anzahl von Projekten an. Wenn Sie über eine Renovierung oder ein neues Zuhause nachdenken, würden wir gerne davon hören.',
      scarcityText_pl: 'Przyjmujemy ograniczoną liczbę projektów każdego roku. Jeśli rozważasz renowację lub nowe mieszkanie, chętnie o tym porozmawiamy.',

      scarcityCta_en: 'Tell us about your project',
      scarcityCta_de: 'Erzählen Sie uns von Ihrem Projekt',
      scarcityCta_pl: 'Opowiedz nam o swoim projekcie',

      // Selected work label
      selectedWorkLabel_en: 'Selected Work',
      selectedWorkLabel_de: 'Ausgewählte Arbeiten',
      selectedWorkLabel_pl: 'Wybrane realizacje',

      // SEO
      seoTitle_en: 'Studio Bosko — Interior Design Studio Berlin & Warsaw',
      seoTitle_de: 'Studio Bosko — Innenarchitektur Studio Berlin & Warschau',
      seoTitle_pl: 'Studio Bosko — Studio Projektowania Wnętrz Berlin i Warszawa',
      seoDescription_en: 'Full-scope residential interior design by Studio Bosko — Berlin, Warsaw & Vienna. Curated homes for discerning professionals. AD100 Polska 2025.',
      seoDescription_de: 'Umfassende Wohnraum-Innenarchitektur von Studio Bosko — Berlin, Warschau & Wien. Charakterstarke Zuhause für anspruchsvolle Auftraggeber. AD100 Polska 2025.',
      seoDescription_pl: 'Kompleksowe projektowanie wnętrz mieszkalnych — Berlin, Warszawa i Wiedeń. Charakterne wnętrza dla wymagających klientów. AD100 Polska 2025.',
    },

    // ── STUDIO PAGE ───────────────────────────────────────────────────────────
    {
      _id:   'studioPage',
      _type: 'studioPage',

      // Hero Headline
      heroHeadline_en: 'We design personality-driven spaces—crafted with curatorial instinct and delivered with clarity.',
      heroHeadline_de: 'Wir gestalten Räume mit Persönlichkeit — mit kuratorischem Instinkt und kompromissloser Klarheit.',
      heroHeadline_pl: 'Projektujemy przestrzenie z osobowością — z kuratorskim instynktem i bezkompromisową precyzją.',

      // About Heading
      aboutHeading_en: 'About',
      aboutHeading_de: 'Über uns',
      aboutHeading_pl: 'O nas',

      // About Body (Portable Text)
      aboutBody_en: pt(
        'As an interior design studio named AD100 for 2025 by Architectural Digest Polska, we are tastemakers for clients who share a strong appreciation for art, culture, and craftsmanship. We create layered, personality-driven homes with a clear point of view—confident, curated, and boldly individual. Our work balances high design with lived-in ease—spaces that feel as effortless as they are intentional. A quest for artful character runs through everything we curate, shaping homes that don\'t just look beautiful, but feel deeply personal.',
        'Practicality and liveability are equally important to us, so each of our designs is entirely custom. We design to support how you actually live, when no one is watching. Because great design isn\'t just seen — it\'s felt.',
        'Led by Kasia Kronberger, Studio Bosko brings together structured precision and intuitive curation. Kasia\'s background spans education in business and trend forecasting, and international design experience across London, Florence, Barcelona, and Brussels. Her work is shaped by a global sensibility—layering modern craftsmanship, historical references, and joyful tension into interiors that are worldly and authentically evocative. She is recognised for creating spaces that start conversations: rooms rich with personality, intentional clashes, and emotional resonance—without ever feeling staged or overworked.',
      ),
      aboutBody_de: pt(
        'Als AD100-ausgezeichnetes Innenarchitektur-Studio — nominiert von Architectural Digest Polska 2025 — arbeiten wir für Auftraggeber, die Kunst, Kultur und Handwerkskunst wirklich schätzen. Wir entwerfen vielschichtige, charakterstarke Zuhause mit einer klaren Haltung — selbstbewusst, kuratiert, unverwechselbar.',
        'Praktikabilität und Alltagstauglichkeit sind uns ebenso wichtig. Jedes unserer Projekte ist vollständig individuell gestaltet — für das Leben, wie es wirklich gelebt wird. Denn großes Design wird nicht nur gesehen. Es wird gespürt.',
        'Unter der Leitung von Kasia Kronberger vereint Studio Bosko strukturelle Präzision mit intuitiver Kuration. Kasias Hintergrund umfasst Business und Trendforschung sowie internationale Designerfahrung in London, Florenz, Barcelona und Brüssel.',
      ),
      aboutBody_pl: pt(
        'Jako pracownia wyróżniona tytułem AD100 przez Architectural Digest Polska 2025, tworzymy dla klientów, którzy naprawdę cenią sztukę, kulturę i rzemiosło. Nasze realizacje to wielowarstwowe, charakterne wnętrza z wyraźnym punktem widzenia — pewne siebie, wyselekcjonowane, niepowtarzalne.',
        'Praktyczność i codzienna funkcjonalność są dla nas równie ważne. Każdy projekt jest w pełni indywidualny — zaprojektowany dla życia takim, jakim naprawdę jest. Bo dobre wnętrze nie tylko się widzi — czuje się je.',
        'Studio Bosko prowadzi Kasia Kronberger — projektantka łącząca strukturalną precyzję z intuicyjną kuracją. Jej wykształcenie w zakresie biznesu i prognozowania trendów oraz doświadczenie projektowe w Londynie, Florencji, Barcelonie i Brukseli ukształtowały globalną wrażliwość.',
      ),

      // Ethos Bullets
      ethosBullets: [
        {
          _key: k(),
          text_en: 'We push functionality forward — prioritising flow, storage and usability from the start, so the space supports your lifestyle effortlessly.',
          text_de: 'Wir priorisieren Funktionalität von Anfang an — Raumfluss, Stauraum und Nutzbarkeit stehen im Mittelpunkt, damit der Raum Ihren Lebensstil mühelos unterstützt.',
          text_pl: 'Priorytetowo traktujemy funkcjonalność — przepływ przestrzeni, przechowywanie i użyteczność od samego początku, by przestrzeń wspierała Twój styl życia bez wysiłku.',
        },
        {
          _key: k(),
          text_en: 'We curate for visual interest and emotional impact — balancing refined with playful, and old with new.',
          text_de: 'Wir kuratieren für visuelles Interesse und emotionale Wirkung — ausgewogen zwischen Raffinesse und Verspieltheit, Alt und Neu.',
          text_pl: 'Dobieramy z myślą o wizualnej atrakcyjności i emocjonalnym wpływie — równoważąc wyrafinowanie z lekkością, stare z nowym.',
        },
        {
          _key: k(),
          text_en: 'We create homes that tell your story — through materials, colours, and the way light moves inside.',
          text_de: 'Wir gestalten Zuhause, die Ihre Geschichte erzählen — durch Materialien, Farben und die Art, wie das Licht im Raum spielt.',
          text_pl: 'Tworzymy domy opowiadające Twoją historię — przez materiały, kolory i sposób, w jaki światło porusza się wewnątrz.',
        },
        {
          _key: k(),
          text_en: "We're your trusted advisor — guiding you through the complexity, helping you navigate decisions with confidence and problem-solving instincts.",
          text_de: 'Wir sind Ihr vertrauensvoller Berater — wir begleiten Sie durch die Komplexität und helfen Ihnen, Entscheidungen mit Zuversicht und Lösungsinstinkt zu treffen.',
          text_pl: 'Jesteśmy Twoim zaufanym doradcą — prowadzimy Cię przez zawiłości, pomagając podejmować decyzje z pewnością siebie i instynktem rozwiązywania problemów.',
        },
      ],

      // Photos
      kasiaPhoto1: img(kasiaPhoto1, 'Kasia Kronberger, founder of Studio Bosko'),
      kasiaPhoto2: img(kasiaPhoto2, 'Kasia Kronberger at work in the studio'),
      studioPhoto1: img(studioPhoto1, 'Bespoke furniture detail — Studio Bosko'),
      studioPhoto2: img(studioPhoto2, 'Altbau renovation — Studio Bosko Berlin'),

      // Yellowtrace Quote
      yellowtraceQuote_en: 'One of the most impressive aspects of [Studio Bosko] is how it manages to be both bold and harmonious. The balance is achieved through vigilant curation of furniture and artwork, balancing the old with the new, the classic with the niche, the hallmark of Studio Bosko\'s approach.',
      yellowtraceQuote_de: 'Einer der beeindruckendsten Aspekte von [Studio Bosko] ist, wie es gelingt, gleichzeitig kühn und harmonisch zu sein. Die Balance entsteht durch sorgfältige Kuration von Möbeln und Kunstwerken — zwischen Alt und Neu, Klassischem und Nischigem.',
      yellowtraceQuote_pl: 'Jednym z najbardziej imponujących aspektów [Studio Bosko] jest to, jak udaje się być jednocześnie śmiałym i harmonijnym. Równowaga jest osiągana przez staranne dobieranie mebli i dzieł sztuki — balansowanie między starym a nowym, klasycznym a niszowym.',
      yellowtraceAttribution: 'Yellowtrace',

      // SEO
      seoTitle_en: 'About Studio Bosko — Interior Designer Kasia Kronberger, Berlin',
      seoTitle_de: 'Über Studio Bosko — Innenarchitektin Kasia Kronberger, Berlin',
      seoTitle_pl: 'O Studio Bosko — Projektantka wnętrz Kasia Kronberger, Berlin',
      seoDescription_en: 'AD100-recognised interior design studio led by Kasia Kronberger. Based in Berlin, working internationally. Personality-driven homes crafted with curatorial instinct.',
      seoDescription_de: 'AD100-ausgezeichnetes Innenarchitektur-Studio unter der Leitung von Kasia Kronberger. Berlin-basiert, international tätig. Räume mit Persönlichkeit und kuratorischer Präzision.',
      seoDescription_pl: 'Pracownia wyróżniona AD100, prowadzona przez Kasię Kronberger. Siedziba w Berlinie, projekty w całej Europie. Wnętrza z osobowością i kuratorską precyzją.',
    },

    // ── OFFERING PAGE ─────────────────────────────────────────────────────────
    {
      _id:   'offeringPage',
      _type: 'offeringPage',

      // Hero Headline
      heroHeadline_en: "We're a full-service interior design practice based in Berlin and Warsaw, running projects internationally.",
      heroHeadline_de: 'Full-Service Innenarchitektur — mit Sitz in Berlin und Warschau, tätig in ganz Europa.',
      heroHeadline_pl: 'Kompleksowa pracownia projektowania wnętrz — Berlin i Warszawa, projekty w całej Europie.',

      // Offering Body
      offeringBody_en: pt(
        'We specialize in full-scope residential projects, overseeing every phase of the process with care and clarity. We understand you need an expert partner to design your home—one that grasps your personal style and translates it into a unique, timeless interior, without the operational hassle. With our intuition for the emotive connections and business expertise, we articulate visions and bring them to fruition for our discerning clientele.',
      ),
      offeringBody_de: pt(
        'Wir spezialisieren uns auf vollständige Wohnprojekte und begleiten jeden Prozessschritt mit Sorgfalt und Klarheit. Sie brauchen einen Partner, der Ihren persönlichen Stil versteht und ihn in ein unverwechselbares, zeitloses Interieur übersetzt — ohne operativen Aufwand Ihrerseits.',
      ),
      offeringBody_pl: pt(
        'Specjalizujemy się w pełnozakresowych projektach mieszkalnych, prowadząc każdy etap z dbałością i precyzją. Potrzebujesz partnera, który zrozumie Twój styl i przełoży go na wyjątkowe, ponadczasowe wnętrze — bez operacyjnego obciążenia z Twojej strony.',
      ),

      // Scope Items
      scopeItems: [
        { _key: k(), label_en: 'Interior Architecture and Space Planning',        label_de: 'Innenarchitektur und Raumplanung',                      label_pl: 'Architektura wnętrz i planowanie przestrzeni' },
        { _key: k(), label_en: 'Interior Design, Finish and Fixture Specifications', label_de: 'Innenarchitektur, Material- und Ausstattungsspezifikation', label_pl: 'Projektowanie wnętrz, specyfikacja wykończeń i armatury' },
        { _key: k(), label_en: 'Construction Drawings, Bespoke Furnishing Specs',  label_de: 'Ausführungspläne, maßgeschneiderte Einrichtungsspezifikationen', label_pl: 'Rysunki wykonawcze, specyfikacje mebli na zamówienie' },
        { _key: k(), label_en: 'Furniture Selection and Procurement',               label_de: 'Möbelauswahl und -beschaffung',                           label_pl: 'Dobór i zakup mebli' },
        { _key: k(), label_en: 'Art Sourcing and Interior Curation',               label_de: 'Kunstbeschaffung und Innenraumkuration',                   label_pl: 'Pozyskiwanie sztuki i kuration wnętrza' },
        { _key: k(), label_en: 'Budget Planning and Fulfilment Coordination',      label_de: 'Budgetplanung und Projektkoordination',                    label_pl: 'Planowanie budżetu i koordynacja realizacji' },
      ],

      // No Items
      noItems: [
        { _key: k(), label_en: 'One-room makeovers',                         label_de: 'Einzelraum-Umgestaltungen',         label_pl: 'Metamorfozy jednego pokoju' },
        { _key: k(), label_en: 'Final-stage styling for existing homes',     label_de: 'Finales Styling für bestehende Räume', label_pl: 'Styling końcowy istniejących wnętrz' },
        { _key: k(), label_en: 'Projects without implementation oversight',  label_de: 'Projekte ohne Umsetzungsbegleitung', label_pl: 'Projekty bez nadzoru realizacji' },
      ],

      // Tagline
      tagline_en: "If we're in, we're all in.",
      tagline_de: 'Wenn wir dabei sind, dann ganz.',
      tagline_pl: 'Jeśli wchodzimy — wchodzimy w całości.',

      // Project Types
      projectTypes: [
        {
          _key: k(),
          title_en: 'Complex Renovation',
          title_de: 'Komplexe Renovierung',
          title_pl: 'Złożona renowacja',
          body_en: "Home is often your most valued asset. We know how to unlock the potential of any property and increase its worth for you and your family. Through thoughtful architectural planning, tailored curation and professional fulfilment, our interiors are both function-forward and high-design. Thanks to our experience, problem-solving attitude as well as a trusted international network of craftspeople, we're ready to realise projects across whole Europe.",
          body_de: 'Das Zuhause ist oft Ihr wertvollstes Gut. Wir wissen, wie wir das Potenzial jeder Immobilie freisetzen und ihren Wert für Sie und Ihre Familie steigern können. Durch durchdachte Architekturplanung, maßgeschneiderte Kuration und professionelle Umsetzung sind unsere Interieurs sowohl funktional als auch hochkarätig gestaltet.',
          body_pl: 'Dom jest często Twoim najcenniejszym dobrem. Wiemy, jak uwolnić potencjał każdej nieruchomości i zwiększyć jej wartość dla Ciebie i Twojej rodziny. Przez przemyślane planowanie architektoniczne, indywidualną kurację i profesjonalną realizację nasze wnętrza są zarówno funkcjonalne, jak i wysokiej jakości.',
        },
        {
          _key: k(),
          title_en: 'Interiors Upgrade',
          title_de: 'Interieur-Upgrade',
          title_pl: 'Modernizacja wnętrza',
          body_en: 'From defining surface materials to final styling, we bring that tactile energy into a space through emotive textural pairings and joyful palettes. Our experience allows for accurate scope-setting and decisions that help avoid costly mistakes. Sometimes redesigning parts of the space can go a long way. We inject personality into already good bones, so at the end you can call the place uniquely yours.',
          body_de: 'Von der Materialwahl bis zum finalen Styling bringen wir taktile Energie in einen Raum — durch emotionale Materialkombinationen und lebendige Paletten. Unsere Erfahrung ermöglicht präzise Umfangsdefinitionen und Entscheidungen, die kostspielige Fehler vermeiden.',
          body_pl: 'Od doboru materiałów po finalny styling — wnosimy taktylną energię do przestrzeni przez emocjonalne zestawienia faktur i radosne palety. Nasze doświadczenie pozwala na precyzyjne określenie zakresu i decyzje, które pomagają uniknąć kosztownych błędów.',
        },
        {
          _key: k(),
          title_en: 'Full-Scope Curation',
          title_de: 'Vollständige Kuration',
          title_pl: 'Pełna kuration',
          body_en: 'We curate and source everything on your behalf — from a sofa, through lighting, to artworks and elements of decor. This can mean merging your selected existing pieces with new finds commissioned locally or sourced globally to create unique compositions throughout your home. Working on newly built or acquired spaces, we prepare a full furnishing and decor scheme based on a defined creative direction and take care of the procurement.',
          body_de: 'Wir kuratieren und beschaffen alles in Ihrem Namen — vom Sofa über Leuchten bis hin zu Kunstwerken und Dekorationselementen. Das kann bedeuten, ausgewählte Bestandsstücke mit neuen Funden zu vereinen — lokal in Auftrag gegeben oder weltweit beschafft.',
          body_pl: 'Dobieramy i pozyskujemy wszystko w Twoim imieniu — od sofy, przez oświetlenie, po dzieła sztuki i elementy dekoracyjne. Może to oznaczać połączenie wybranych istniejących przedmiotów z nowymi znaleziskami zamawianymi lokalnie lub pozyskiwanymi globalnie.',
        },
      ],

      // Testimonial (Doug)
      testimonialQuote_en: "Studio Bosko was a lifesaver for my apartment redesign. As an expat in Germany, tackling a renovation project was overwhelming, but Kasia's exceptional design sense and strong network of contractors made the process smooth and enjoyable.",
      testimonialQuote_de: 'Studio Bosko war eine Rettung für meine Wohnungsrenovierung. Als Expat in Deutschland war die Umsetzung eines Renovierungsprojekts überwältigend — aber Kasias außergewöhnliches Designgefühl und ihr starkes Netzwerk an Handwerkern machten den Prozess reibungslos und angenehm.',
      testimonialQuote_pl: 'Studio Bosko było wybawieniem przy przeprojektowaniu mojego mieszkania. Jako ekspatka w Niemczech realizacja projektu renowacji była przytłaczająca — ale wyjątkowe wyczucie Kasi i jej silna sieć wykonawców sprawiły, że proces był płynny i przyjemny.',
      testimonialAuthor: 'Doug, homeowner and antiques collector',
      testimonialImage: img(offeringTestimonialImg, 'Colour-drenched hallway — Studio Bosko Time Travel project'),

      // Images
      image1: img(offeringImg1, 'Curated bookshelf — Studio Bosko'),
      image2: img(offeringImg2, 'Interior design moodboard — Studio Bosko'),
      image3: img(offeringImg3, 'Interior design floor plan — Studio Bosko'),

      // SEO
      seoTitle_en: 'Interior Design Services — Full-Scope Residential Projects | Studio Bosko',
      seoTitle_de: 'Innenarchitektur-Leistungen — Wohnprojekte aus einer Hand | Studio Bosko',
      seoTitle_pl: 'Usługi projektowania wnętrz — kompleksowe projekty mieszkaniowe | Studio Bosko',
      seoDescription_en: 'Full-scope interior design services: space planning, bespoke specifications, procurement, art sourcing and project supervision. Berlin, Warsaw, Vienna and across Europe.',
      seoDescription_de: 'Full-Service Innenarchitektur: Raumplanung, Materialspezifikation, Beschaffung, Kunstkuration und Baubegleitung. Berlin, Warschau, Wien und europaweit.',
      seoDescription_pl: 'Kompleksowe projektowanie wnętrz: planowanie przestrzeni, specyfikacje, zakupy, pozyskiwanie sztuki i nadzór autorski. Berlin, Warszawa, Wiedeń i Europa.',
    },

    // ── PRESS PAGE ────────────────────────────────────────────────────────────
    {
      _id:   'pressPage',
      _type: 'pressPage',

      headline_en: 'Press',
      headline_de: 'Presse',
      headline_pl: 'Prasa',

      heroBody_en: 'Studio Bosko has been named AD100 for 2025 and featured in print and online across international publications and platforms. Browse our archive of stories and features.',
      heroBody_de: 'Studio Bosko wurde für 2025 mit dem AD100-Titel ausgezeichnet und in Druck- und Online-Publikationen weltweit vorgestellt. Stöbern Sie in unserem Archiv.',
      heroBody_pl: 'Studio Bosko zostało wyróżnione tytułem AD100 na 2025 rok i zaprezentowane w drukowanych i internetowych publikacjach na całym świecie. Przeglądaj nasze archiwum.',

      seoTitle_en: 'Press & Recognition | Studio Bosko',
      seoTitle_de: 'Presse & Auszeichnungen | Studio Bosko',
      seoTitle_pl: 'Prasa i wyróżnienia | Studio Bosko',
      seoDescription_en: 'Studio Bosko featured in Elle Decoration UK, Architectural Digest Polska, Vogue Poland, Yellowtrace, AD Spain and more.',
      seoDescription_de: 'Studio Bosko in Elle Decoration UK, Architectural Digest Polska, Vogue Poland, Yellowtrace, AD Spain und mehr.',
      seoDescription_pl: 'Studio Bosko w Elle Decoration UK, Architectural Digest Polska, Vogue Poland, Yellowtrace, AD Spain i innych.',
    },

    // ── INQUIRE PAGE ──────────────────────────────────────────────────────────
    {
      _id:   'inquirePage',
      _type: 'inquirePage',

      headline_en: "We're currently welcoming inquiries for spring 2026 and beyond.",
      headline_de: 'Wir freuen uns auf Anfragen für Frühjahr 2026 und darüber hinaus.',
      headline_pl: 'Przyjmujemy zapytania na wiosnę 2026 i kolejne miesiące.',

      subtext_en: 'Thank you for your interest! To get started, please inquire below and we will be in touch within 24–48 business hours.',
      subtext_de: 'Danke für Ihr Interesse. Teilen Sie uns unten die Details mit — wir melden uns innerhalb von 24–48 Stunden.',
      subtext_pl: 'Dziękujemy za zainteresowanie. Wypełnij formularz poniżej — odezwiemy się w ciągu 24–48 godzin.',

      serviceOptions: [
        { _key: k(), label_en: 'Renovating & Furnishing',  label_de: 'Renovieren & Einrichten',    label_pl: 'Renowacja i aranżacja' },
        { _key: k(), label_en: 'Furnishing & Art Curation', label_de: 'Einrichten & Kunstkuration', label_pl: 'Aranżacja i kuration sztuki' },
      ],

      budgetOptions: [
        { _key: k(), label_en: 'Under 50K €',    label_de: 'Unter 50.000 €',  label_pl: 'Poniżej 50 000 €' },
        { _key: k(), label_en: '50–100K €',      label_de: '50–100.000 €',    label_pl: '50–100 000 €' },
        { _key: k(), label_en: '100–150K €',     label_de: '100–150.000 €',   label_pl: '100–150 000 €' },
        { _key: k(), label_en: '150–250K €',     label_de: '150–250.000 €',   label_pl: '150–250 000 €' },
        { _key: k(), label_en: '250K €+',        label_de: '250.000 €+',      label_pl: '250 000 €+' },
        { _key: k(), label_en: "Let's discuss",  label_de: 'Sprechen wir darüber', label_pl: 'Porozmawiajmy' },
      ],

      seoTitle_en: 'Start an Interior Design Project | Studio Bosko',
      seoTitle_de: 'Innenarchitektur-Projekt anfragen | Studio Bosko',
      seoTitle_pl: 'Rozpocznij projekt wnętrz | Studio Bosko',
      seoDescription_en: "Begin a conversation with Studio Bosko. We're welcoming new residential interior design projects across Berlin, Warsaw, Vienna and Europe for spring 2026.",
      seoDescription_de: 'Starten Sie ein Gespräch mit Studio Bosko. Wir nehmen neue Wohnprojekte in Berlin, Warschau, Wien und ganz Europa für Frühjahr 2026 an.',
      seoDescription_pl: 'Rozpocznij rozmowę ze Studio Bosko. Przyjmujemy nowe projekty mieszkalne w Berlinie, Warszawie, Wiedniu i całej Europie na wiosnę 2026.',
    },
  ]

  // ── Write documents ───────────────────────────────────────────────────────
  console.log('📄  Writing page documents to Sanity…\n')
  for (const doc of docs) {
    try {
      await client.createOrReplace(doc)
      console.log(`  ✅  ${doc._id} (${doc._type})`)
    } catch (err) {
      console.error(`  ❌  ${doc._id}:`, err.message)
      process.exit(1)
    }
  }

  console.log('\n✨  Done — all page documents created/updated.')
  console.log('\n🔍  Verify with GROQ:')
  console.log("    *[_type in ['homepage','studioPage','offeringPage','pressPage','inquirePage']]{_type, heroHeadline_en, testimonialQuote_en}")
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
