import { defineType, defineField } from 'sanity'

/**
 * Singleton document for the /projects index page.
 * Document ID: "projectsPage"
 * Holds SEO title + description in EN / DE / PL.
 */
export const projectsPageSchema = defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',

  groups: [
    { name: 'en', title: '🇬🇧 English', default: true },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { name: 'pl', title: '🇵🇱 Polski' },
  ],

  fields: [
    // English
    defineField({ name: 'seoTitleEn',       title: 'SEO Title',       type: 'string', group: 'en' }),
    defineField({ name: 'seoDescriptionEn', title: 'SEO Description', type: 'text', rows: 2, group: 'en' }),

    // Deutsch
    defineField({ name: 'seoTitleDe',       title: 'SEO-Titel',        type: 'string', group: 'de' }),
    defineField({ name: 'seoDescriptionDe', title: 'SEO-Beschreibung', type: 'text',   rows: 2, group: 'de' }),

    // Polski
    defineField({ name: 'seoTitlePl',       title: 'Meta tytuł', type: 'string', group: 'pl' }),
    defineField({ name: 'seoDescriptionPl', title: 'Meta opis',  type: 'text',   rows: 2, group: 'pl' }),
  ],

  preview: {
    prepare() {
      return { title: '🏗️ Projects Page' }
    },
  },
})
