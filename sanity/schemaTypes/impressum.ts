import { defineType, defineField } from 'sanity'

const richText = {
  type: 'block' as const,
  styles: [
    { title: 'Normal',    value: 'normal' },
    { title: 'Heading 2', value: 'h2' },
    { title: 'Heading 3', value: 'h3' },
  ],
  marks: {
    decorators: [
      { title: 'Bold',   value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
  },
}

/**
 * Singleton document for the /impressum legal notice.
 * Document ID: "impressum"
 * type name is "impressum" so GROQ queries can use _type == "impressum".
 */
export const impressumSchema = defineType({
  name: 'impressum',
  title: 'Impressum',
  type: 'document',

  groups: [
    { name: 'en', title: '🇬🇧 English', default: true },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { name: 'pl', title: '🇵🇱 Polski' },
  ],

  fields: [
    // Body content per locale
    defineField({ name: 'bodyEn', title: 'Body (EN)', type: 'array', of: [richText], group: 'en' }),
    defineField({ name: 'bodyDe', title: 'Body (DE)', type: 'array', of: [richText], group: 'de' }),
    defineField({ name: 'bodyPl', title: 'Body (PL)', type: 'array', of: [richText], group: 'pl' }),

    // SEO per locale
    defineField({ name: 'seoTitleEn',       title: 'SEO Title (EN)',       type: 'string', group: 'en' }),
    defineField({ name: 'seoDescriptionEn', title: 'SEO Description (EN)', type: 'text', rows: 2, group: 'en' }),
    defineField({ name: 'seoTitleDe',       title: 'SEO Titel (DE)',        type: 'string', group: 'de' }),
    defineField({ name: 'seoDescriptionDe', title: 'SEO Beschreibung (DE)', type: 'text', rows: 2, group: 'de' }),
    defineField({ name: 'seoTitlePl',       title: 'Meta tytuł (PL)',       type: 'string', group: 'pl' }),
    defineField({ name: 'seoDescriptionPl', title: 'Meta opis (PL)',        type: 'text', rows: 2, group: 'pl' }),
  ],

  preview: {
    prepare() {
      return { title: '⚖️ Impressum' }
    },
  },
})
