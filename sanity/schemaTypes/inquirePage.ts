import { defineType, defineField } from 'sanity'

/**
 * Singleton document for the Inquire / Contact page.
 * Document ID: "inquirePage"
 *
 * formQuestions — the dynamic form builder.
 * Each entry renders as one question in the contact form.
 * Drag to reorder, delete to remove, "Add item" to add new questions.
 *
 * Contact fields (First name / Last name / Email) are always shown
 * and cannot be removed because they are required for submissions.
 * Their labels can be overridden in the "Contact labels" group.
 */
export const inquirePageSchema = defineType({
  name: 'inquirePage',
  title: 'Inquire Page',
  type: 'document',

  groups: [
    { name: 'content',  title: '📝 Content',         default: true },
    { name: 'media',    title: '🖼️ Media'             },
    { name: 'form',     title: '📋 Form Questions'  },
    { name: 'labels',   title: '🏷️  Contact Labels'  },
    { name: 'seo',      title: '🔍 SEO'              },
  ],

  fields: [
    // ── Page headline & subtext ───────────────────────────────────────────
    defineField({ name: 'headline_en', title: 'Headline (EN)', type: 'string', group: 'content' }),
    defineField({ name: 'headline_de', title: 'Headline (DE)', type: 'string', group: 'content' }),
    defineField({ name: 'headline_pl', title: 'Headline (PL)', type: 'string', group: 'content' }),

    defineField({ name: 'subtext_en', title: 'Subtext (EN)', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'subtext_de', title: 'Subtext (DE)', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'subtext_pl', title: 'Subtext (PL)', type: 'text', rows: 3, group: 'content' }),

    // ── Side image ────────────────────────────────────────────────────────
    defineField({
      name: 'sideImage',
      title: 'Side Image (right column, sticky on desktop)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),

    // ── Dynamic form questions ────────────────────────────────────────────
    defineField({
      name: 'formQuestions',
      title: 'Form Questions',
      description: 'Drag to reorder · Delete to remove · "Add item" to add a new question. First Name, Last Name and Email are always shown above these.',
      type: 'array',
      group: 'form',
      of: [
        {
          type: 'object',
          name: 'formQuestion',
          title: 'Question',
          fields: [
            defineField({
              name: 'fieldId',
              title: 'Field ID',
              type: 'string',
              description: 'Unique identifier used in form submission (no spaces, e.g. "projectAddress"). Do not change after going live.',
              validation: (Rule) => Rule.required().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, { name: 'Field ID', invert: false }).error('Must start with a letter, no spaces or special characters'),
            }),
            defineField({
              name: 'fieldType',
              title: 'Field type',
              type: 'string',
              options: {
                list: [
                  { title: 'Short text',            value: 'text'     },
                  { title: 'Phone number',           value: 'tel'      },
                  { title: 'Long text (textarea)',   value: 'textarea' },
                  { title: 'Dropdown (select)',      value: 'select'   },
                ],
                layout: 'radio',
              },
              initialValue: 'text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'label_en', title: 'Label (EN)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'label_de', title: 'Label (DE)', type: 'string', description: 'Leave empty to inherit EN' }),
            defineField({ name: 'label_pl', title: 'Label (PL)', type: 'string', description: 'Leave empty to inherit EN' }),
            defineField({ name: 'required', title: 'Required field?', type: 'boolean', initialValue: false }),
            defineField({
              name: 'options',
              title: 'Dropdown options',
              description: 'Only used when Field type = Dropdown',
              type: 'array',
              of: [{
                type: 'object',
                name: 'dropdownOption',
                title: 'Option',
                fields: [
                  defineField({ name: 'label_en', title: 'Option (EN)', type: 'string', validation: (Rule) => Rule.required() }),
                  defineField({ name: 'label_de', title: 'Option (DE)', type: 'string', description: 'Leave empty to inherit EN' }),
                  defineField({ name: 'label_pl', title: 'Option (PL)', type: 'string', description: 'Leave empty to inherit EN' }),
                ],
                preview: { select: { title: 'label_en' } },
              }],
            }),
          ],
          preview: {
            select: { title: 'label_en', subtitle: 'fieldType', req: 'required' },
            prepare({ title, subtitle, req }: { title?: string; subtitle?: string; req?: boolean }) {
              const icons: Record<string, string> = { text: '𝐓', tel: '📞', textarea: '¶', select: '▾' }
              return {
                title: `${title ?? '(untitled)'}${req ? ' *' : ''}`,
                subtitle: icons[subtitle ?? ''] ? `${icons[subtitle!]} ${subtitle}` : subtitle,
              }
            },
          },
        },
      ],
    }),

    // ── Contact field label overrides ─────────────────────────────────────
    // (First Name / Last Name / Email are always shown — labels only)
    defineField({ name: 'labelFirstName_en', title: 'First name label (EN)', type: 'string', group: 'labels', placeholder: 'First name' }),
    defineField({ name: 'labelFirstName_de', title: 'First name label (DE)', type: 'string', group: 'labels', placeholder: 'Vorname' }),
    defineField({ name: 'labelFirstName_pl', title: 'First name label (PL)', type: 'string', group: 'labels', placeholder: 'Imię' }),

    defineField({ name: 'labelLastName_en', title: 'Last name label (EN)', type: 'string', group: 'labels', placeholder: 'Last name' }),
    defineField({ name: 'labelLastName_de', title: 'Last name label (DE)', type: 'string', group: 'labels', placeholder: 'Nachname' }),
    defineField({ name: 'labelLastName_pl', title: 'Last name label (PL)', type: 'string', group: 'labels', placeholder: 'Nazwisko' }),

    defineField({ name: 'labelEmail_en', title: 'Email label (EN)', type: 'string', group: 'labels', placeholder: 'Email' }),
    defineField({ name: 'labelEmail_de', title: 'Email label (DE)', type: 'string', group: 'labels', placeholder: 'E-Mail' }),
    defineField({ name: 'labelEmail_pl', title: 'Email label (PL)', type: 'string', group: 'labels', placeholder: 'E-mail' }),

    defineField({ name: 'labelSubmit_en', title: 'Submit button (EN)', type: 'string', group: 'labels', placeholder: 'Send inquiry' }),
    defineField({ name: 'labelSubmit_de', title: 'Submit button (DE)', type: 'string', group: 'labels', placeholder: 'Anfrage senden' }),
    defineField({ name: 'labelSubmit_pl', title: 'Submit button (PL)', type: 'string', group: 'labels', placeholder: 'Wyślij zapytanie' }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({ name: 'seoTitle_en', title: 'SEO Title (EN)',        type: 'string', group: 'seo' }),
    defineField({ name: 'seoTitle_de', title: 'SEO Title (DE)',        type: 'string', group: 'seo' }),
    defineField({ name: 'seoTitle_pl', title: 'SEO Title (PL)',        type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription_en', title: 'SEO Description (EN)', type: 'text', rows: 2, group: 'seo', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_de', title: 'SEO Description (DE)', type: 'text', rows: 2, group: 'seo', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_pl', title: 'SEO Description (PL)', type: 'text', rows: 2, group: 'seo', validation: (Rule) => Rule.max(160) }),

    // ── Legacy — kept for backward compatibility ───────────────────────────
    defineField({ name: 'serviceOptions', title: '(Legacy) Service Options', type: 'array', group: 'seo',
      description: 'Superseded by Form Questions above. Kept for data migration only.',
      of: [{ type: 'object', fields: [
        defineField({ name: 'label_en', type: 'string' }),
        defineField({ name: 'label_de', type: 'string' }),
        defineField({ name: 'label_pl', type: 'string' }),
      ], preview: { select: { title: 'label_en' } } }],
    }),
    defineField({ name: 'budgetOptions', title: '(Legacy) Budget Options', type: 'array', group: 'seo',
      description: 'Superseded by Form Questions above. Kept for data migration only.',
      of: [{ type: 'object', fields: [
        defineField({ name: 'label_en', type: 'string' }),
        defineField({ name: 'label_de', type: 'string' }),
        defineField({ name: 'label_pl', type: 'string' }),
      ], preview: { select: { title: 'label_en' } } }],
    }),
  ],

  preview: {
    prepare() {
      return { title: '✉️ Inquire Page' }
    },
  },
})
