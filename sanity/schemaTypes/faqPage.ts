import { defineType, defineField } from 'sanity'

const blockContent = {
  type: 'block' as const,
  styles: [{ title: 'Normal', value: 'normal' }],
  marks: {
    decorators: [
      { title: 'Bold',   value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
  },
}

/**
 * Singleton document for the /faq page.
 * Document ID: "faqPage"
 */
export const faqPageSchema = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',

  groups: [
    { name: 'en', title: '🇬🇧 English', default: true },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { name: 'pl', title: '🇵🇱 Polski' },
  ],

  fields: [
    // ── Page heading ──────────────────────────────────────────────────────────
    defineField({ name: 'heading_en', title: 'Page Heading',         type: 'string', group: 'en' }),
    defineField({ name: 'heading_de', title: 'Seitenüberschrift',    type: 'string', group: 'de' }),
    defineField({ name: 'heading_pl', title: 'Nagłówek strony',      type: 'string', group: 'pl' }),

    // ── FAQ Items ─────────────────────────────────────────────────────────────
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      of: [{
        type: 'object',
        title: 'FAQ Item',
        fields: [
          defineField({ name: 'question_en', title: 'Question (EN)', type: 'string' }),
          defineField({ name: 'question_de', title: 'Question (DE)', type: 'string' }),
          defineField({ name: 'question_pl', title: 'Question (PL)', type: 'string' }),
          defineField({ name: 'answer_en', title: 'Answer (EN)', type: 'array', of: [blockContent] }),
          defineField({ name: 'answer_de', title: 'Answer (DE)', type: 'array', of: [blockContent] }),
          defineField({ name: 'answer_pl', title: 'Answer (PL)', type: 'array', of: [blockContent] }),
        ],
        preview: { select: { title: 'question_en' } },
      }],
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({ name: 'seoTitle_en', title: 'SEO Title',        type: 'string', group: 'en' }),
    defineField({ name: 'seoTitle_de', title: 'SEO-Titel',        type: 'string', group: 'de' }),
    defineField({ name: 'seoTitle_pl', title: 'Meta tytuł',       type: 'string', group: 'pl' }),
    defineField({ name: 'seoDescription_en', title: 'SEO Description',  type: 'text', rows: 2, group: 'en', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_de', title: 'SEO-Beschreibung', type: 'text', rows: 2, group: 'de', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_pl', title: 'Meta opis',        type: 'text', rows: 2, group: 'pl', validation: (Rule) => Rule.max(160) }),
  ],

  preview: {
    prepare() {
      return { title: '❓ FAQ Page' }
    },
  },
})
