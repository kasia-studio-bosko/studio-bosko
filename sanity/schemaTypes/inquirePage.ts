import { defineType, defineField } from 'sanity'

/**
 * Singleton document for the Inquire / Contact page.
 * Document ID: "inquirePage"
 */
export const inquirePageSchema = defineType({
  name: 'inquirePage',
  title: 'Inquire Page',
  type: 'document',

  groups: [
    { name: 'en', title: '🇬🇧 English', default: true },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { name: 'pl', title: '🇵🇱 Polski' },
  ],

  fields: [
    // ── Headline ──────────────────────────────────────────────────────────
    defineField({ name: 'headline_en', title: 'Headline',             type: 'string', group: 'en' }),
    defineField({ name: 'headline_de', title: 'Überschrift',          type: 'string', group: 'de' }),
    defineField({ name: 'headline_pl', title: 'Nagłówek',             type: 'string', group: 'pl' }),

    // ── Subtext ───────────────────────────────────────────────────────────
    defineField({ name: 'subtext_en', title: 'Subtext',           type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'subtext_de', title: 'Untertext',         type: 'text', rows: 3, group: 'de' }),
    defineField({ name: 'subtext_pl', title: 'Podtytuł',          type: 'text', rows: 3, group: 'pl' }),

    // ── Service Options ───────────────────────────────────────────────────
    defineField({
      name: 'serviceOptions',
      title: 'Service Options (form dropdown)',
      type: 'array',
      of: [{
        type: 'object',
        title: 'Option',
        fields: [
          defineField({ name: 'label_en', title: 'English', type: 'string' }),
          defineField({ name: 'label_de', title: 'Deutsch', type: 'string' }),
          defineField({ name: 'label_pl', title: 'Polski',  type: 'string' }),
        ],
        preview: { select: { title: 'label_en' } },
      }],
    }),

    // ── Budget Options ────────────────────────────────────────────────────
    defineField({
      name: 'budgetOptions',
      title: 'Budget Options (form dropdown)',
      type: 'array',
      of: [{
        type: 'object',
        title: 'Option',
        fields: [
          defineField({ name: 'label_en', title: 'English', type: 'string' }),
          defineField({ name: 'label_de', title: 'Deutsch', type: 'string' }),
          defineField({ name: 'label_pl', title: 'Polski',  type: 'string' }),
        ],
        preview: { select: { title: 'label_en' } },
      }],
    }),

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
      return { title: '✉️ Inquire Page' }
    },
  },
})
