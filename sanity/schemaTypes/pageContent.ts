import { defineType, defineField } from 'sanity'

// Reusable block content definition
const blockContent = {
  type: 'block' as const,
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
  ],
  marks: {
    decorators: [
      { title: 'Italic', value: 'em' },
      { title: 'Bold', value: 'strong' },
    ],
  },
}

const PAGE_LABELS: Record<string, string> = {
  homepage: '🏠 Homepage',
  studio: '👤 Studio / About',
  offering: '📋 Offering / Services',
  inquire: '✉️ Inquire',
}

export const pageContentSchema = defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',

  groups: [
    { name: 'en', title: '🇬🇧 English', default: true },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { name: 'pl', title: '🇵🇱 Polski' },
  ],

  fields: [
    defineField({
      name: 'pageId',
      title: 'Page',
      type: 'string',
      description: 'Which page this content belongs to.',
      options: {
        list: [
          { title: '🏠 Homepage', value: 'homepage' },
          { title: '👤 Studio / About', value: 'studio' },
          { title: '📋 Offering / Services', value: 'offering' },
          { title: '✉️ Inquire', value: 'inquire' },
        ],
        layout: 'radio',
      },
    }),

    // ── English ────────────────────────────────────────────────────────────
    defineField({
      name: 'headingEn',
      title: 'Heading',
      type: 'string',
      group: 'en',
    }),
    defineField({
      name: 'subheadingEn',
      title: 'Subheading',
      type: 'string',
      group: 'en',
    }),
    defineField({
      name: 'bodyEn',
      title: 'Body',
      type: 'array',
      of: [blockContent],
      group: 'en',
    }),
    defineField({
      name: 'seoTitleEn',
      title: 'SEO title',
      type: 'string',
      group: 'en',
    }),
    defineField({
      name: 'seoDescriptionEn',
      title: 'SEO description',
      type: 'text',
      rows: 2,
      group: 'en',
      validation: (Rule) => Rule.max(160),
    }),

    // ── Deutsch ────────────────────────────────────────────────────────────
    defineField({
      name: 'headingDe',
      title: 'Überschrift',
      type: 'string',
      group: 'de',
    }),
    defineField({
      name: 'subheadingDe',
      title: 'Unterüberschrift',
      type: 'string',
      group: 'de',
    }),
    defineField({
      name: 'bodyDe',
      title: 'Text',
      type: 'array',
      of: [blockContent],
      group: 'de',
    }),
    defineField({
      name: 'seoTitleDe',
      title: 'SEO-Titel',
      type: 'string',
      group: 'de',
    }),
    defineField({
      name: 'seoDescriptionDe',
      title: 'SEO-Beschreibung',
      type: 'text',
      rows: 2,
      group: 'de',
      validation: (Rule) => Rule.max(160),
    }),

    // ── Polski ─────────────────────────────────────────────────────────────
    defineField({
      name: 'headingPl',
      title: 'Nagłówek',
      type: 'string',
      group: 'pl',
    }),
    defineField({
      name: 'subheadingPl',
      title: 'Podtytuł',
      type: 'string',
      group: 'pl',
    }),
    defineField({
      name: 'bodyPl',
      title: 'Treść',
      type: 'array',
      of: [blockContent],
      group: 'pl',
    }),
    defineField({
      name: 'seoTitlePl',
      title: 'Meta tytuł',
      type: 'string',
      group: 'pl',
    }),
    defineField({
      name: 'seoDescriptionPl',
      title: 'Meta opis',
      type: 'text',
      rows: 2,
      group: 'pl',
      validation: (Rule) => Rule.max(160),
    }),
  ],

  preview: {
    select: {
      pageId: 'pageId',
      headingEn: 'headingEn',
    },
    prepare({ pageId, headingEn }: { pageId: string; headingEn?: string }) {
      return {
        title: PAGE_LABELS[pageId] ?? pageId,
        subtitle: headingEn,
      }
    },
  },
})
