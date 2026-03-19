import { defineType, defineField } from 'sanity'

export const pressItemSchema = defineType({
  name: 'pressItem',
  title: 'Press Item',
  type: 'document',
  fields: [
    defineField({
      name: 'publication',
      title: 'Publication name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline / issue',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'date',
      title: 'Publication date',
      type: 'date',
    }),
    defineField({
      name: 'url',
      title: 'Link to article',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'Publication logo',
      type: 'image',
      options: { hotspot: false },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover / feature image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured (show prominently)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'publication',
      subtitle: 'headline',
      media: 'coverImage',
    },
  },
})
