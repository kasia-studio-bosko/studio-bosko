import { defineType, defineField } from 'sanity'

const blockContent = {
  type: 'block' as const,
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H3', value: 'h3' },
  ],
  marks: {
    decorators: [
      { title: 'Italic', value: 'em' },
      { title: 'Bold', value: 'strong' },
    ],
  },
}

/**
 * Singleton document for the Studio / About page.
 * Document ID: "studioPage"
 */
export const studioPageSchema = defineType({
  name: 'studioPage',
  title: 'Studio / About Page',
  type: 'document',

  groups: [
    { name: 'en', title: '🇬🇧 English', default: true },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { name: 'pl', title: '🇵🇱 Polski' },
    { name: 'media', title: '🖼️ Media' },
  ],

  fields: [
    // ── Hero Headline ──────────────────────────────────────────────────────
    defineField({ name: 'heroHeadline_en', title: 'Hero Headline',      type: 'string', group: 'en' }),
    defineField({ name: 'heroHeadline_de', title: 'Hero-Überschrift',   type: 'string', group: 'de' }),
    defineField({ name: 'heroHeadline_pl', title: 'Nagłówek hero',      type: 'string', group: 'pl' }),

    // ── About Heading ──────────────────────────────────────────────────────
    defineField({ name: 'aboutHeading_en', title: 'About Heading',       type: 'string', group: 'en' }),
    defineField({ name: 'aboutHeading_de', title: 'Über uns (Titel)',    type: 'string', group: 'de' }),
    defineField({ name: 'aboutHeading_pl', title: 'Nagłówek o nas',      type: 'string', group: 'pl' }),

    // ── About Body (rich text) ─────────────────────────────────────────────
    defineField({ name: 'aboutBody_en', title: 'About Body', type: 'array', of: [blockContent], group: 'en' }),
    defineField({ name: 'aboutBody_de', title: 'Über uns Text', type: 'array', of: [blockContent], group: 'de' }),
    defineField({ name: 'aboutBody_pl', title: 'Tekst o nas', type: 'array', of: [blockContent], group: 'pl' }),

    // ── Ethos Heading / Body / Subheading ────────────────────────────────
    defineField({ name: 'ethosHeading_en', title: 'Ethos Heading',      type: 'string', group: 'en' }),
    defineField({ name: 'ethosHeading_de', title: 'Haltung-Überschrift', type: 'string', group: 'de' }),
    defineField({ name: 'ethosHeading_pl', title: 'Nagłówek filozofii',  type: 'string', group: 'pl' }),

    defineField({ name: 'ethosBody_en', title: 'Ethos Body',   type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'ethosBody_de', title: 'Haltung Text', type: 'text', rows: 3, group: 'de' }),
    defineField({ name: 'ethosBody_pl', title: 'Tekst filozofii', type: 'text', rows: 3, group: 'pl' }),

    defineField({ name: 'ethosSubheading_en', title: 'Ethos Subheading',    type: 'string', group: 'en' }),
    defineField({ name: 'ethosSubheading_de', title: 'Haltung-Unterzeile',  type: 'string', group: 'de' }),
    defineField({ name: 'ethosSubheading_pl', title: 'Podtytuł filozofii',  type: 'string', group: 'pl' }),

    // ── Ethos Bullets ─────────────────────────────────────────────────────
    defineField({
      name: 'ethosBullets',
      title: 'Ethos Bullets',
      type: 'array',
      group: ['en', 'de', 'pl'],
      of: [{
        type: 'object',
        title: 'Bullet',
        groups: [
          { name: 'en', title: '🇬🇧 English', default: true },
          { name: 'de', title: '🇩🇪 Deutsch' },
          { name: 'pl', title: '🇵🇱 Polski' },
        ],
        fields: [
          defineField({ name: 'text_en', title: 'English', type: 'string', group: 'en' }),
          defineField({ name: 'text_de', title: 'Deutsch', type: 'string', group: 'de' }),
          defineField({ name: 'text_pl', title: 'Polski',  type: 'string', group: 'pl' }),
        ],
        preview: { select: { title: 'text_en' } },
      }],
    }),

    // ── Offering CTA ───────────────────────────────────────────────────────
    defineField({ name: 'ctaOffering_en', title: 'Offering CTA',   type: 'string', group: 'en' }),
    defineField({ name: 'ctaOffering_de', title: 'Angebots-CTA',   type: 'string', group: 'de' }),
    defineField({ name: 'ctaOffering_pl', title: 'CTA oferty',     type: 'string', group: 'pl' }),

    // ── Page Images (drag to reorder) ────────────────────────────────────
    defineField({
      name: 'pageImages',
      title: 'Page Images',
      description: 'Drag to reorder. Position 1 = hero portrait (right of headline), Position 2 = full-bleed parallax, Position 3 = detail photo after About, Position 4 = detail photo after Ethos.',
      type: 'array',
      group: 'media',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
      }],
    }),
    defineField({
      name: 'testimonialImage',
      title: 'Testimonial Image (left side of Yellowtrace quote block)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),

    // ── Yellowtrace Quote (testimonial) ───────────────────────────────────
    defineField({ name: 'yellowtraceQuote_en', title: 'Yellowtrace Quote',    type: 'text', rows: 4, group: 'en' }),
    defineField({ name: 'yellowtraceQuote_de', title: 'Yellowtrace Zitat',    type: 'text', rows: 4, group: 'de' }),
    defineField({ name: 'yellowtraceQuote_pl', title: 'Yellowtrace Cytat',    type: 'text', rows: 4, group: 'pl' }),

    defineField({ name: 'yellowtraceAttribution_en', title: 'Yellowtrace Attribution', type: 'string', group: 'en' }),
    defineField({ name: 'yellowtraceAttribution_de', title: 'Yellowtrace Quelle (DE)', type: 'string', group: 'de' }),
    defineField({ name: 'yellowtraceAttribution_pl', title: 'Yellowtrace Źródło (PL)', type: 'string', group: 'pl' }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({ name: 'seoTitle_en', title: 'SEO Title',        type: 'string', group: 'en' }),
    defineField({ name: 'seoTitle_de', title: 'SEO-Titel',        type: 'string', group: 'de' }),
    defineField({ name: 'seoTitle_pl', title: 'Meta tytuł',       type: 'string', group: 'pl' }),

    defineField({ name: 'seoDescription_en', title: 'SEO Description',  type: 'text', rows: 2, group: 'en', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_de', title: 'SEO-Beschreibung', type: 'text', rows: 2, group: 'de', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_pl', title: 'Meta opis',        type: 'text', rows: 2, group: 'pl', validation: (Rule) => Rule.max(160) }),
  ],

  preview: {
    prepare() {
      return { title: '👤 Studio / About Page' }
    },
  },
})
