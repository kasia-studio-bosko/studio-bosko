// Server component – injects FAQPage JSON-LD structured data on the offering page
export default function FAQSchema({ locale }: { locale: string }) {
  const faqData: Record<string, Array<{ name: string; text: string }>> = {
    en: [
      {
        name: 'What does a full-service interior designer do?',
        text: "A full-service interior designer handles every phase of your project — from space planning and interior architecture through to material specifications, furniture selection, procurement, art sourcing, and construction supervision. At Studio Bosko, we manage the entire process so you don't have to coordinate between architects, contractors, and suppliers yourself.",
      },
      {
        name: 'How much does interior design cost in Germany?',
        text: 'Interior design fees in Germany vary depending on the scope and complexity of the project. Full-service interior design for a residential renovation typically ranges from €150 to €350 per square metre for design fees, with total project costs (including furnishings and construction) varying widely. Studio Bosko provides detailed budget planning as part of every project to ensure transparency.',
      },
      {
        name: 'What types of projects does Studio Bosko work on?',
        text: "We specialise in full-scope residential projects: complex apartment and house renovations, interiors for new builds, and complete furnishing and curation schemes. We work across Germany, Poland, Austria, and beyond. We don't take on one-room makeovers, final-stage styling, or projects without implementation oversight.",
      },
      {
        name: 'How long does an interior design project take?',
        text: 'Timelines depend on the project scope. A full apartment renovation typically takes 6 to 12 months from initial concept to move-in, including design development, construction, and furnishing. A furnishing-only project can be completed in 3 to 5 months. We provide a detailed timeline during the initial consultation.',
      },
      {
        name: 'Do you work with clients outside Berlin?',
        text: 'Yes. Studio Bosko is based in Berlin but runs projects across Europe — including Warsaw, Vienna, and other cities in Germany, Poland, and Austria. We have an established network of trusted craftspeople and contractors in multiple locations.',
      },
      {
        name: 'What is the design process like at Studio Bosko?',
        text: "Our process begins with a complimentary consultation to understand your needs and assess fit. From there, we move through concept development, space planning, material and furniture specifications, procurement, and construction supervision. We act as your single point of contact throughout, filtering decisions and managing the complexity so you can focus on enjoying the outcome.",
      },
      {
        name: 'Can you help with art sourcing and curation?',
        text: 'Absolutely. Art sourcing and interior curation is a core part of what we do. We source artworks, objects, and decorative elements — both locally and internationally — to create layered, personality-driven compositions throughout your home. This can include commissioning custom pieces, sourcing vintage finds, and integrating your existing collection.',
      },
    ],
    de: [
      {
        name: 'Was macht ein Full-Service-Innenarchitekt?',
        text: 'Ein Full-Service-Innenarchitekt übernimmt jede Phase Ihres Projekts — von der Raumplanung und Innenarchitektur über Materialspezifikationen, Möbelauswahl und Beschaffung bis hin zur Kunstkuration und Bauüberwachung. Bei Studio Bosko managen wir den gesamten Prozess, damit Sie nicht selbst zwischen Architekten, Handwerkern und Lieferanten koordinieren müssen.',
      },
      {
        name: 'Was kostet Innenarchitektur in Deutschland?',
        text: 'Innenarchitektur-Honorare in Deutschland variieren je nach Umfang und Komplexität des Projekts. Full-Service-Innenarchitektur für eine Wohnungsrenovierung liegt typischerweise bei 150 bis 350 Euro pro Quadratmeter für Planungsleistungen, wobei die Gesamtprojektkosten (einschließlich Einrichtung und Bau) stark variieren. Studio Bosko erstellt für jedes Projekt eine detaillierte Budgetplanung.',
      },
      {
        name: 'Welche Projekte übernimmt Studio Bosko?',
        text: 'Wir spezialisieren uns auf umfassende Wohnprojekte: komplexe Wohnungs- und Haussanierungen, Innenausstattung für Neubauten sowie komplette Einrichtungs- und Kurationskonzepte. Wir arbeiten in Deutschland, Polen, Österreich und darüber hinaus. Wir übernehmen keine Einzelraum-Umgestaltungen, reines Styling oder Projekte ohne Umsetzungsbegleitung.',
      },
      {
        name: 'Wie lange dauert ein Innenarchitektur-Projekt?',
        text: 'Die Dauer hängt vom Projektumfang ab. Eine vollständige Wohnungsrenovierung dauert typischerweise 6 bis 12 Monate vom ersten Konzept bis zum Einzug, einschließlich Entwurfsplanung, Bau und Einrichtung. Ein reines Einrichtungsprojekt kann in 3 bis 5 Monaten abgeschlossen werden. Wir erstellen bereits beim Erstgespräch einen detaillierten Zeitplan.',
      },
      {
        name: 'Arbeiten Sie auch außerhalb von Berlin?',
        text: 'Ja. Studio Bosko hat seinen Sitz in Berlin, realisiert aber Projekte in ganz Europa — darunter Warschau, Wien und weitere Städte in Deutschland, Polen und Österreich. Wir verfügen über ein etabliertes Netzwerk vertrauenswürdiger Handwerker und Auftragnehmer an mehreren Standorten.',
      },
      {
        name: 'Wie sieht der Designprozess bei Studio Bosko aus?',
        text: 'Unser Prozess beginnt mit einem unverbindlichen Erstgespräch, um Ihre Bedürfnisse zu verstehen. Danach folgen Konzeptentwicklung, Raumplanung, Material- und Möbelspezifikationen, Beschaffung und Bauüberwachung. Wir sind Ihr einziger Ansprechpartner während des gesamten Projekts und filtern Entscheidungen, damit Sie sich auf das Ergebnis freuen können.',
      },
    ],
    pl: [
      {
        name: 'Co robi projektant wnętrz z pełnym zakresem usług?',
        text: 'Projektant wnętrz z pełnym zakresem usług zajmuje się każdym etapem projektu — od planowania przestrzeni i architektury wnętrz, przez specyfikacje materiałów, dobór mebli i ich zakup, po kurację sztuki i nadzór budowlany. W Studio Bosko zarządzamy całym procesem, abyś nie musiał koordynować pracy między architektami, wykonawcami i dostawcami.',
      },
      {
        name: 'Ile kosztuje projektowanie wnętrz?',
        text: 'Koszty projektowania wnętrz zależą od zakresu i złożoności projektu. Kompleksowe projektowanie wnętrz przy remoncie mieszkania to zazwyczaj od 150 do 350 euro za metr kwadratowy za usługi projektowe, przy czym całkowite koszty projektu (łącznie z wyposażeniem i budową) mogą się znacznie różnić. Studio Bosko zapewnia szczegółowe planowanie budżetu w ramach każdego projektu.',
      },
      {
        name: 'Jakimi projektami zajmuje się Studio Bosko?',
        text: 'Specjalizujemy się w kompleksowych projektach mieszkaniowych: złożone remonty mieszkań i domów, wnętrza nowych budynków oraz kompletne koncepcje wyposażenia i kuracji. Pracujemy w Niemczech, Polsce, Austrii i nie tylko. Nie podejmujemy się przeróbek pojedynczych pokoi, samego stylingu ani projektów bez nadzoru nad realizacją.',
      },
      {
        name: 'Jak długo trwa projekt wnętrzarski?',
        text: 'Harmonogram zależy od zakresu projektu. Pełny remont mieszkania trwa zazwyczaj od 6 do 12 miesięcy — od pierwszej koncepcji do zamieszkania, włącznie z fazą projektową, budową i wyposażeniem. Projekt obejmujący samo wyposażenie można zrealizować w 3 do 5 miesięcy. Szczegółowy harmonogram przedstawiamy już podczas pierwszej konsultacji.',
      },
      {
        name: 'Czy pracujecie poza Berlinem?',
        text: 'Tak. Studio Bosko ma siedzibę w Berlinie, ale realizuje projekty w całej Europie — w tym w Warszawie, Wiedniu i innych miastach w Niemczech, Polsce i Austrii. Dysponujemy sprawdzoną siecią zaufanych rzemieślników i wykonawców w wielu lokalizacjach.',
      },
      {
        name: 'Jak wygląda proces projektowy w Studio Bosko?',
        text: 'Nasz proces zaczyna się od bezpłatnej konsultacji, podczas której poznajemy Twoje potrzeby. Następnie przechodzimy przez rozwój koncepcji, planowanie przestrzeni, specyfikacje materiałów i mebli, zakupy oraz nadzór budowlany. Jesteśmy Twoim jedynym punktem kontaktu przez cały projekt, filtrujemy decyzje i zarządzamy złożonością, abyś mógł cieszyć się efektem końcowym.',
      },
    ],
  }

  const questions = faqData[locale] ?? faqData.en

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.name,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.text,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
