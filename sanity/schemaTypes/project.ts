import { defineType, defineField } from 'sanity'

// Reusable block content definition for rich text fields
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

export const projectSchema = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',

  // ── Studio tabs ────────────────────────────────────────────────────────────
  groups: [
    { name: 'en', title: '🇬🇧 English', default: true },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { name: 'pl', title: '🇵🇱 Polski' },
    { name: 'details', title: 'Project Details' },
    { name: 'images', title: 'Images' },
  ],

  fields: [
    // ── English ────────────────────────────────────────────────────────────
    defineField({
      name: 'titleEn',
      title: 'Title',
      type: 'string',
      group: 'en',
    }),
    defineField({
      name: 'seoIntroEn',
      title: 'SEO intro (short, ~160 chars)',
      description: 'Used in project listings and as meta description fallback.',
      type: 'text',
      rows: 3,
      group: 'en',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description',
      type: 'array',
      of: [blockContent],
      group: 'en',
    }),
    defineField({
      name: 'metaTitleEn',
      title: 'Meta title (SEO)',
      description: 'Defaults to title if empty.',
      type: 'string',
      group: 'en',
    }),
    defineField({
      name: 'metaDescriptionEn',
      title: 'Meta description (SEO)',
      description: 'Defaults to SEO intro if empty. Max 160 chars.',
      type: 'text',
      rows: 2,
      group: 'en',
      validation: (Rule) => Rule.max(160),
    }),

    // ── Deutsch ────────────────────────────────────────────────────────────
    defineField({
      name: 'titleDe',
      title: 'Titel',
      description: 'Leer lassen → englischer Text wird angezeigt.',
      type: 'string',
      group: 'de',
    }),
    defineField({
      name: 'seoIntroDe',
      title: 'SEO-Intro',
      type: 'text',
      rows: 3,
      group: 'de',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'descriptionDe',
      title: 'Beschreibung',
      type: 'array',
      of: [blockContent],
      group: 'de',
    }),
    defineField({
      name: 'metaTitleDe',
      title: 'Meta-Titel (SEO)',
      type: 'string',
      group: 'de',
    }),
    defineField({
      name: 'metaDescriptionDe',
      title: 'Meta-Beschreibung (SEO)',
      type: 'text',
      rows: 2,
      group: 'de',
      validation: (Rule) => Rule.max(160),
    }),

    // ── Polski ─────────────────────────────────────────────────────────────
    defineField({
      name: 'titlePl',
      title: 'Tytuł',
      description: 'Puste → używany jest tekst angielski.',
      type: 'string',
      group: 'pl',
    }),
    defineField({
      name: 'seoIntroPl',
      title: 'SEO intro',
      type: 'text',
      rows: 3,
      group: 'pl',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'descriptionPl',
      title: 'Opis',
      type: 'array',
      of: [blockContent],
      group: 'pl',
    }),
    defineField({
      name: 'metaTitlePl',
      title: 'Meta tytuł (SEO)',
      type: 'string',
      group: 'pl',
    }),
    defineField({
      name: 'metaDescriptionPl',
      title: 'Meta opis (SEO)',
      type: 'text',
      rows: 2,
      group: 'pl',
      validation: (Rule) => Rule.max(160),
    }),

    // ── Project Details ────────────────────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'details',
      options: { source: 'titleEn', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers appear first.',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Apartment', value: 'Apartment' },
          { title: 'House', value: 'House' },
          { title: 'Villa', value: 'Villa' },
          { title: 'Commercial', value: 'Commercial' },
          { title: 'Other', value: 'Other' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'location',
      title: 'Location (English)',
      type: 'string',
      group: 'details',
      placeholder: 'e.g. Berlin Kreuzberg',
    }),
    defineField({
      name: 'locationDe',
      title: 'Location (Deutsch)',
      description: 'Leave empty to inherit English value.',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'locationPl',
      title: 'Location (Polski)',
      description: 'Leave empty to inherit English value.',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'size',
      title: 'Size (m²)',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'year',
      title: 'Year completed',
      type: 'string',
      group: 'details',
      placeholder: 'e.g. 2024',
    }),
    defineField({
      name: 'scope',
      title: 'Scope of work',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Interior Design', value: 'Interior Design' },
          { title: 'Curation', value: 'Curation' },
          { title: 'FF&E Procurement', value: 'FF&E Procurement' },
          { title: 'Complex Renovation', value: 'Complex Renovation' },
          { title: 'Construction Supervision', value: 'Construction Supervision' },
          { title: 'Styling', value: 'Styling' },
          { title: 'Lighting Design', value: 'Lighting Design' },
          { title: 'Bespoke Joinery', value: 'Bespoke Joinery' },
        ],
      },
    }),
    defineField({
      name: 'photographer',
      title: 'Photography credit',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'pressMentions',
      title: 'Press mentions',
      description: 'Publications that have featured this specific project.',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'colorTheme',
      title: 'Colour theme',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Warm Light (golden/brown)', value: 'warm-light' },
          { title: 'Dark Moody (dark brown/mint)', value: 'dark-moody' },
          { title: 'Earthy Neutral (mint green)', value: 'earthy-neutral' },
          { title: 'Cool Minimal (beige)', value: 'cool-minimal' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background colour (hex)',
      description: 'Page background hex, e.g. #705305',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'textColor',
      title: 'Text colour (hex)',
      description: 'Body text hex, e.g. #ffffff',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'headingColor',
      title: 'Heading colour (hex)',
      description: 'H1/H2 heading hex, e.g. #e1cd3c',
      type: 'string',
      group: 'details',
    }),

    // ── Images ─────────────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'images',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) =>
            Rule.warning('Alt text is strongly recommended for SEO and accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery images',
      type: 'array',
      group: 'images',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              validation: (Rule: any) =>
                Rule.warning('Alt text is strongly recommended for SEO'),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption (optional)',
            },
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'titleEn',
      subtitle: 'location',
      media: 'coverImage',
    },
  },

  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Year (newest first)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
})
