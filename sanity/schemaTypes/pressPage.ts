import { defineType, defineField } from 'sanity'

/**
 * Singleton document for the Press page hero content + SEO.
 * Document ID: "pressPage"
 * Individual press entries are managed via the "press" document type.
 */
export const pressPageSchema = defineType({
  name: 'pressPage',
  title: 'Press Page',
  type: 'document',

  groups: [
    { name: 'en', title: '🇬🇧 English', default: true },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { name: 'pl', title: '🇵🇱 Polski' },
  ],

  fields: [
    // ── Headline ──────────────────────────────────────────────────────────
    defineField({ name: 'headline_en', title: 'Hero Headline',      type: 'string', group: 'en' }),
    defineField({ name: 'headline_de', title: 'Hero-Überschrift',   type: 'string', group: 'de' }),
    defineField({ name: 'headline_pl', title: 'Nagłówek hero',      type: 'string', group: 'pl' }),

    // ── Hero Body ─────────────────────────────────────────────────────────
    defineField({ name: 'heroBody_en', title: 'Hero Body',     type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'heroBody_de', title: 'Hero-Text',     type: 'text', rows: 3, group: 'de' }),
    defineField({ name: 'heroBody_pl', title: 'Tekst hero',    type: 'text', rows: 3, group: 'pl' }),

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
      return { title: '📰 Press Page' }
    },
  },
})
