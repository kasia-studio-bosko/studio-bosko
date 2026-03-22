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

    // ── Ethos Bullets ─────────────────────────────────────────────────────
    defineField({
      name: 'ethosBullets',
      title: 'Ethos Bullets',
      type: 'array',
      of: [{
        type: 'object',
        title: 'Bullet',
        fields: [
          defineField({ name: 'text_en', title: 'English', type: 'string' }),
          defineField({ name: 'text_de', title: 'Deutsch', type: 'string' }),
          defineField({ name: 'text_pl', title: 'Polski',  type: 'string' }),
        ],
        preview: { select: { title: 'text_en' } },
      }],
    }),

    // ── Photos ────────────────────────────────────────────────────────────
    defineField({
      name: 'kasiaPhoto1',
      title: 'Kasia Portrait (hero, right)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'kasiaPhoto2',
      title: 'Kasia Studio (full-bleed parallax)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'studioPhoto1',
      title: 'Studio Photo 1 (furniture detail)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'studioPhoto2',
      title: 'Studio Photo 2 (altbau / second detail)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),

    // ── Yellowtrace Quote (testimonial) ───────────────────────────────────
    defineField({ name: 'yellowtraceQuote_en', title: 'Yellowtrace Quote',    type: 'text', rows: 4, group: 'en' }),
    defineField({ name: 'yellowtraceQuote_de', title: 'Yellowtrace Zitat',    type: 'text', rows: 4, group: 'de' }),
    defineField({ name: 'yellowtraceQuote_pl', title: 'Yellowtrace Cytat',    type: 'text', rows: 4, group: 'pl' }),

    defineField({ name: 'yellowtraceAttribution', title: 'Yellowtrace Attribution', type: 'string' }),

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
