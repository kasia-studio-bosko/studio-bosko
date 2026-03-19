import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'studio-bosko',
  title: 'Studio Bosko',

  projectId: 'ysq1y4zp',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Studio Bosko CMS')
          .items([
            S.listItem()
              .title('Projects')
              .child(
                S.documentList()
                  .title('Projects')
                  .filter('_type == "project"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.divider(),
            S.listItem()
              .title('Press')
              .child(
                S.documentList()
                  .title('Press Items')
                  .filter('_type == "pressItem"')
                  .defaultOrdering([{ field: 'date', direction: 'desc' }])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    productionUrl: async (prev, { document }) => {
      const siteUrl = 'https://bosko.studio'
      if (document._type === 'project') {
        const slug = (document as { slug?: { current?: string } }).slug?.current
        if (slug) return `${siteUrl}/project/${slug}`
      }
      return prev
    },
  },
})
