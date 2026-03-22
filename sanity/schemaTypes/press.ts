import { defineType, defineField } from 'sanity'

/**
 * Press / media coverage entry.
 * type name is "press" so GROQ queries can use _type == "press".
 */
export const pressSchema = defineType({
  name: 'press',
  title: 'Press Item',
  type: 'document',

  fields: [
    defineField({
      name: 'publication',
      title: 'Publication name',
      type: 'string',
      description: 'e.g. "AD Germany", "VOGUE Poland"',
    }),

    defineField({
      name: 'issue',
      title: 'Issue / date label',
      description: 'The localised issue label shown in the UI.',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string', description: 'e.g. "AD Spain / January 2026"' }),
        defineField({ name: 'de', title: 'Deutsch',  type: 'string', description: 'e.g. "AD Spain / Januar 2026"' }),
        defineField({ name: 'pl', title: 'Polski',   type: 'string', description: 'e.g. "AD Spain / Styczeń 2026"' }),
      ],
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover / feature image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'externalUrl',
      title: 'Link to article',
      type: 'url',
    }),

    defineField({
      name: 'date',
      title: 'Publication date',
      type: 'date',
      description: 'Used for ordering when "Display order" is equal.',
    }),

    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank to fall back to date ordering.',
    }),

    defineField({
      name: 'featured',
      title: 'Featured (show with cover image)',
      type: 'boolean',
      initialValue: false,
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
