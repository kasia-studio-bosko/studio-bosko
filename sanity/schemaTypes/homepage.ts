import { defineType, defineField } from 'sanity'

/**
 * Singleton document for the Homepage.
 * Document ID: "homepage"
 * Field naming: fieldName_en / fieldName_de / fieldName_pl
 */
export const homepageSchema = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',

  groups: [
    { name: 'en', title: '🇬🇧 English', default: true },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { name: 'pl', title: '🇵🇱 Polski' },
    { name: 'media', title: '🖼️ Media' },
  ],

  fields: [
    // ── Hero Headline ──────────────────────────────────────────────────────
    defineField({ name: 'heroHeadline_en', title: 'Hero Headline',        type: 'string', group: 'en' }),
    defineField({ name: 'heroHeadline_de', title: 'Hero-Überschrift',     type: 'string', group: 'de' }),
    defineField({ name: 'heroHeadline_pl', title: 'Nagłówek hero',        type: 'string', group: 'pl' }),

    // ── Hero Body ──────────────────────────────────────────────────────────
    defineField({ name: 'heroBody_en', title: 'Hero Body',    type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'heroBody_de', title: 'Hero-Text',    type: 'text', rows: 3, group: 'de' }),
    defineField({ name: 'heroBody_pl', title: 'Tekst hero',   type: 'text', rows: 3, group: 'pl' }),

    // ── Hero CTA ───────────────────────────────────────────────────────────
    defineField({ name: 'heroCta_en', title: 'Hero CTA label',     type: 'string', group: 'en' }),
    defineField({ name: 'heroCta_de', title: 'Hero CTA (DE)',       type: 'string', group: 'de' }),
    defineField({ name: 'heroCta_pl', title: 'Hero CTA (PL)',       type: 'string', group: 'pl' }),

    // ── Offering Section ───────────────────────────────────────────────────
    defineField({ name: 'offeringHeadline_en', title: 'Offering Headline',        type: 'string', group: 'en' }),
    defineField({ name: 'offeringHeadline_de', title: 'Angebots-Überschrift',     type: 'string', group: 'de' }),
    defineField({ name: 'offeringHeadline_pl', title: 'Nagłówek oferty',          type: 'string', group: 'pl' }),

    defineField({ name: 'offeringBody_en', title: 'Offering Body',    type: 'text', rows: 4, group: 'en' }),
    defineField({ name: 'offeringBody_de', title: 'Angebots-Text',    type: 'text', rows: 4, group: 'de' }),
    defineField({ name: 'offeringBody_pl', title: 'Tekst oferty',     type: 'text', rows: 4, group: 'pl' }),

    defineField({ name: 'offeringCta_en', title: 'Offering CTA',     type: 'string', group: 'en' }),
    defineField({ name: 'offeringCta_de', title: 'Angebots-CTA',     type: 'string', group: 'de' }),
    defineField({ name: 'offeringCta_pl', title: 'CTA oferty',       type: 'string', group: 'pl' }),

    // ── Testimonial ────────────────────────────────────────────────────────
    defineField({ name: 'testimonialQuote_en', title: 'Testimonial Quote',     type: 'text', rows: 4, group: 'en' }),
    defineField({ name: 'testimonialQuote_de', title: 'Zitat (DE)',            type: 'text', rows: 4, group: 'de' }),
    defineField({ name: 'testimonialQuote_pl', title: 'Cytat (PL)',            type: 'text', rows: 4, group: 'pl' }),

    defineField({ name: 'testimonialAuthor', title: 'Testimonial Author', type: 'string' }),

    defineField({
      name: 'testimonialImage',
      title: 'Testimonial Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),

    // ── Scarcity / CTA Section ────────────────────────────────────────────
    defineField({ name: 'scarcityText_en', title: 'Scarcity Text',      type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'scarcityText_de', title: 'Knappheitstext',     type: 'text', rows: 3, group: 'de' }),
    defineField({ name: 'scarcityText_pl', title: 'Tekst niedoboru',    type: 'text', rows: 3, group: 'pl' }),

    defineField({ name: 'scarcityCta_en', title: 'Scarcity CTA',        type: 'string', group: 'en' }),
    defineField({ name: 'scarcityCta_de', title: 'CTA (DE)',            type: 'string', group: 'de' }),
    defineField({ name: 'scarcityCta_pl', title: 'CTA (PL)',            type: 'string', group: 'pl' }),

    // ── Selected Work Label ───────────────────────────────────────────────
    defineField({ name: 'selectedWorkLabel_en', title: 'Selected Work Label',     type: 'string', group: 'en' }),
    defineField({ name: 'selectedWorkLabel_de', title: 'Ausgewählte Arbeiten',    type: 'string', group: 'de' }),
    defineField({ name: 'selectedWorkLabel_pl', title: 'Wybrane realizacje',      type: 'string', group: 'pl' }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({ name: 'seoTitle_en', title: 'SEO Title',        type: 'string', group: 'en' }),
    defineField({ name: 'seoTitle_de', title: 'SEO-Titel',        type: 'string', group: 'de' }),
    defineField({ name: 'seoTitle_pl', title: 'Meta tytuł',       type: 'string', group: 'pl' }),

    defineField({ name: 'seoDescription_en', title: 'SEO Description',    type: 'text', rows: 2, group: 'en', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_de', title: 'SEO-Beschreibung',   type: 'text', rows: 2, group: 'de', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_pl', title: 'Meta opis',          type: 'text', rows: 2, group: 'pl', validation: (Rule) => Rule.max(160) }),
  ],

  preview: {
    prepare() {
      return { title: '🏠 Homepage' }
    },
  },
})
