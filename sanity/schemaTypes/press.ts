import { defineType, defineField } from 'sanity'

/**
 * Press / media coverage entry.
 * type name is "press" so GROQ queries can use _type == "press".
 *
 * Field groups create the three tabs visible in Sanity Studio:
 *   Content | Media | Settings
 */
export const pressSchema = defineType({
  name: 'press',
  title: 'Press Item',
  type: 'document',

  groups: [
    { name: 'content',  title: 'Content',  default: true },
    { name: 'media',    title: 'Media' },
    { name: 'settings', title: 'Settings' },
  ],

  fields: [
    defineField({
      name: 'publication',
      title: 'Publication name',
      type: 'string',
      description: 'e.g. "AD Germany", "VOGUE Poland"',
      group: 'content',
    }),

    defineField({
      name: 'issue',
      title: 'Issue / date label',
      description: 'The localised issue label shown in the UI.',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string', description: 'e.g. "AD Spain / January 2026"' }),
        defineField({ name: 'de', title: 'Deutsch',  type: 'string', description: 'e.g. "AD Spain / Januar 2026"' }),
        defineField({ name: 'pl', title: 'Polski',   type: 'string', description: 'e.g. "AD Spain / Styczeń 2026"' }),
      ],
    }),

    defineField({
      name: 'externalUrl',
      title: 'Link to article',
      type: 'url',
      group: 'content',
    }),

    // ── Media tab ─────────────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover / feature image',
      description: 'Upload the magazine cover or feature spread. Shown on the Press page when "Featured" is enabled.',
      type: 'image',
      options: { hotspot: true },
      group: 'media',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for accessibility (e.g. "AD Germany March 2025 cover")',
        }),
      ],
    }),

    // ── Settings tab ──────────────────────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Featured (show with cover image on Press page)',
      type: 'boolean',
      initialValue: false,
      group: 'settings',
    }),

    defineField({
      name: 'date',
      title: 'Publication date',
      type: 'date',
      description: 'Used for ordering when "Display order" is equal.',
      group: 'settings',
    }),

    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank to fall back to date ordering.',
      group: 'settings',
    }),
  ],

  preview: {
    select: {
      title: 'publication',
      subtitle: 'issue.en',
      media: 'coverImage',
    },
  },

  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'date',  direction: 'desc' },
      ],
    },
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})
