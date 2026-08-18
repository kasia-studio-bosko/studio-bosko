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
 * Singleton document for the Offering / Services page.
 * Document ID: "offeringPage"
 */
export const offeringPageSchema = defineType({
  name: 'offeringPage',
  title: 'Offering / Services Page',
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

    // ── Offering Body (rich text) ──────────────────────────────────────────
    defineField({ name: 'offeringBody_en', title: 'Offering Body',     type: 'array', of: [blockContent], group: 'en' }),
    defineField({ name: 'offeringBody_de', title: 'Angebotstext',      type: 'array', of: [blockContent], group: 'de' }),
    defineField({ name: 'offeringBody_pl', title: 'Tekst oferty',      type: 'array', of: [blockContent], group: 'pl' }),

    // ── Scope Items ────────────────────────────────────────────────────────
    defineField({
      name: 'scopeItems',
      title: 'Scope Items (what we do)',
      type: 'array',
      of: [{
        type: 'object',
        title: 'Scope Item',
        groups: [
          { name: 'en', title: '🇬🇧 English', default: true },
          { name: 'de', title: '🇩🇪 Deutsch' },
          { name: 'pl', title: '🇵🇱 Polski' },
        ],
        fields: [
          defineField({ name: 'label_en', title: 'English', type: 'string', group: 'en' }),
          defineField({ name: 'label_de', title: 'Deutsch', type: 'string', group: 'de' }),
          defineField({ name: 'label_pl', title: 'Polski',  type: 'string', group: 'pl' }),
        ],
        preview: { select: { title: 'label_en' } },
      }],
    }),

    // ── Scope Heading ──────────────────────────────────────────────────────
    defineField({ name: 'scopeHeading_en', title: 'Scope Heading',      type: 'string', group: 'en' }),
    defineField({ name: 'scopeHeading_de', title: 'Umfang-Überschrift',  type: 'string', group: 'de' }),
    defineField({ name: 'scopeHeading_pl', title: 'Nagłówek zakresu',    type: 'string', group: 'pl' }),

    // ── No Items ───────────────────────────────────────────────────────────
    defineField({
      name: 'noItems',
      title: "No Items (what we don't do)",
      type: 'array',
      of: [{
        type: 'object',
        title: 'No Item',
        groups: [
          { name: 'en', title: '🇬🇧 English', default: true },
          { name: 'de', title: '🇩🇪 Deutsch' },
          { name: 'pl', title: '🇵🇱 Polski' },
        ],
        fields: [
          defineField({ name: 'label_en', title: 'English', type: 'string', group: 'en' }),
          defineField({ name: 'label_de', title: 'Deutsch', type: 'string', group: 'de' }),
          defineField({ name: 'label_pl', title: 'Polski',  type: 'string', group: 'pl' }),
        ],
        preview: { select: { title: 'label_en' } },
      }],
    }),

    // ── No Heading ─────────────────────────────────────────────────────────
    defineField({ name: 'noHeading_en', title: 'No Heading',       type: 'string', group: 'en' }),
    defineField({ name: 'noHeading_de', title: 'Nicht-Überschrift', type: 'string', group: 'de' }),
    defineField({ name: 'noHeading_pl', title: 'Nagłówek wykluczeń', type: 'string', group: 'pl' }),

    // ── Reach Out CTA ──────────────────────────────────────────────────────
    defineField({ name: 'reachOut_en', title: 'Reach Out CTA',   type: 'string', group: 'en' }),
    defineField({ name: 'reachOut_de', title: 'Kontakt-CTA',     type: 'string', group: 'de' }),
    defineField({ name: 'reachOut_pl', title: 'CTA kontaktu',    type: 'string', group: 'pl' }),

    // ── Our Process ───────────────────────────────────────────────────────────
    defineField({ name: 'processHeading_en', title: 'Process Section Heading',       type: 'string', group: 'en' }),
    defineField({ name: 'processHeading_de', title: 'Abschnittsüberschrift Prozess', type: 'string', group: 'de' }),
    defineField({ name: 'processHeading_pl', title: 'Nagłówek sekcji procesu',       type: 'string', group: 'pl' }),

    defineField({ name: 'processIntro_en', title: 'Process Intro',  type: 'array', of: [blockContent], group: 'en' }),
    defineField({ name: 'processIntro_de', title: 'Prozess Intro',  type: 'array', of: [blockContent], group: 'de' }),
    defineField({ name: 'processIntro_pl', title: 'Intro procesu',  type: 'array', of: [blockContent], group: 'pl' }),

    defineField({
      name: 'processPhases',
      title: 'Process Phases',
      type: 'array',
      of: [{
        type: 'object',
        title: 'Phase',
        groups: [
          { name: 'en', title: '🇬🇧 English', default: true },
          { name: 'de', title: '🇩🇪 Deutsch' },
          { name: 'pl', title: '🇵🇱 Polski' },
        ],
        fields: [
          defineField({ name: 'title_en', title: 'Title (EN)',            type: 'string', group: 'en' }),
          defineField({ name: 'title_de', title: 'Title (DE)',            type: 'string', group: 'de' }),
          defineField({ name: 'title_pl', title: 'Title (PL)',            type: 'string', group: 'pl' }),
          defineField({ name: 'description_en', title: 'Description (EN)', type: 'text', rows: 3, group: 'en' }),
          defineField({ name: 'description_de', title: 'Description (DE)', type: 'text', rows: 3, group: 'de' }),
          defineField({ name: 'description_pl', title: 'Description (PL)', type: 'text', rows: 3, group: 'pl' }),
          defineField({ name: 'duration_en', title: 'Duration (EN)',      type: 'string', group: 'en' }),
          defineField({ name: 'duration_de', title: 'Duration (DE)',      type: 'string', group: 'de' }),
          defineField({ name: 'duration_pl', title: 'Duration (PL)',      type: 'string', group: 'pl' }),
        ],
        preview: { select: { title: 'title_en' } },
      }],
    }),

    defineField({ name: 'processClosingLine_en', title: 'Process Closing Line',    type: 'array', of: [blockContent], group: 'en' }),
    defineField({ name: 'processClosingLine_de', title: 'Abschlusszeile Prozess',  type: 'array', of: [blockContent], group: 'de' }),
    defineField({ name: 'processClosingLine_pl', title: 'Zdanie zamykające proces', type: 'array', of: [blockContent], group: 'pl' }),

    defineField({ name: 'processCtaHeading_en', title: 'Process CTA Heading',      type: 'string', group: 'en' }),
    defineField({ name: 'processCtaHeading_de', title: 'Prozess-CTA-Überschrift',  type: 'string', group: 'de' }),
    defineField({ name: 'processCtaHeading_pl', title: 'Nagłówek CTA procesu',     type: 'string', group: 'pl' }),

    defineField({ name: 'processCtaButton_en', title: 'Process CTA Button',        type: 'string', group: 'en' }),
    defineField({ name: 'processCtaButton_de', title: 'Prozess-CTA-Button',        type: 'string', group: 'de' }),
    defineField({ name: 'processCtaButton_pl', title: 'Przycisk CTA procesu',      type: 'string', group: 'pl' }),

    // ── Tagline ────────────────────────────────────────────────────────────
    defineField({ name: 'tagline_en', title: 'Tagline',      type: 'string', group: 'en' }),
    defineField({ name: 'tagline_de', title: 'Tagline (DE)', type: 'string', group: 'de' }),
    defineField({ name: 'tagline_pl', title: 'Tagline (PL)', type: 'string', group: 'pl' }),

    // ── Project Types Heading ─────────────────────────────────────────────
    defineField({ name: 'projectTypesHeading_en', title: 'Project Types Heading',  type: 'string', group: 'en' }),
    defineField({ name: 'projectTypesHeading_de', title: 'Projektarten-Überschrift', type: 'string', group: 'de' }),
    defineField({ name: 'projectTypesHeading_pl', title: 'Nagłówek rodzajów projektów', type: 'string', group: 'pl' }),

    // ── Project Types ─────────────────────────────────────────────────────
    defineField({
      name: 'projectTypes',
      title: 'Project Types',
      type: 'array',
      of: [{
        type: 'object',
        title: 'Project Type',
        groups: [
          { name: 'en', title: '🇬🇧 English', default: true },
          { name: 'de', title: '🇩🇪 Deutsch' },
          { name: 'pl', title: '🇵🇱 Polski' },
        ],
        fields: [
          defineField({ name: 'title_en', title: 'Title (EN)', type: 'string', group: 'en' }),
          defineField({ name: 'title_de', title: 'Title (DE)', type: 'string', group: 'de' }),
          defineField({ name: 'title_pl', title: 'Title (PL)', type: 'string', group: 'pl' }),
          defineField({ name: 'body_en',  title: 'Body (EN)',  type: 'text', rows: 4, group: 'en' }),
          defineField({ name: 'body_de',  title: 'Body (DE)',  type: 'text', rows: 4, group: 'de' }),
          defineField({ name: 'body_pl',  title: 'Body (PL)',  type: 'text', rows: 4, group: 'pl' }),
        ],
        preview: { select: { title: 'title_en' } },
      }],
    }),

    // ── Testimonial ────────────────────────────────────────────────────────
    defineField({ name: 'testimonialQuote_en', title: 'Testimonial Quote',     type: 'text', rows: 4, group: 'en' }),
    defineField({ name: 'testimonialQuote_de', title: 'Zitat (DE)',            type: 'text', rows: 4, group: 'de' }),
    defineField({ name: 'testimonialQuote_pl', title: 'Cytat (PL)',            type: 'text', rows: 4, group: 'pl' }),

    defineField({ name: 'testimonialAuthor_en', title: 'Testimonial Author',    type: 'string', group: 'en' }),
    defineField({ name: 'testimonialAuthor_de', title: 'Testimonial-Autor',     type: 'string', group: 'de' }),
    defineField({ name: 'testimonialAuthor_pl', title: 'Autor referencji',      type: 'string', group: 'pl' }),

    defineField({
      name: 'testimonialImage',
      title: 'Testimonial Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),

    // ── Page Images (drag to reorder) ────────────────────────────────────
    defineField({
      name: 'pageImages',
      title: 'Page Images',
      description: 'Drag to reorder. Position 1 = hero right image, Position 2 = full-bleed image (below headline), Position 3 = floor plan / scope image.',
      type: 'array',
      group: 'media',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
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
      return { title: '📋 Offering / Services Page' }
    },
  },
})
