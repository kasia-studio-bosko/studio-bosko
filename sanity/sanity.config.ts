import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'studio-bosko',
  title: 'Studio Bosko',

  projectId: 'ysq1y4zp',
  dataset: 'production',

  // Tells the embedded Studio that it lives at /cms, so all
  // internal navigation (document open, tool switching) stays
  // within /cms/... rather than trying to route to /.
  basePath: '/cms',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Studio Bosko CMS')
          .items([
            S.listItem()
              .title('Projects')
              .icon(() => '🏗️')
              .child(
                S.documentList()
                  .title('Projects')
                  .filter('_type == "project"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.divider(),
            S.listItem()
              .title('Pages')
              .icon(() => '📄')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem()
                      .title('🏠 Homepage')
                      .child(
                        S.document()
                          .schemaType('pageContent')
                          .documentId('pageContent-homepage')
                      ),
                    S.listItem()
                      .title('👤 Studio / About')
                      .child(
                        S.document()
                          .schemaType('pageContent')
                          .documentId('pageContent-studio')
                      ),
                    S.listItem()
                      .title('📋 Offering / Services')
                      .child(
                        S.document()
                          .schemaType('pageContent')
                          .documentId('pageContent-offering')
                      ),
                    S.listItem()
                      .title('✉️ Inquire')
                      .child(
                        S.document()
                          .schemaType('pageContent')
                          .documentId('pageContent-inquire')
                      ),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title('Press')
              .icon(() => '📰')
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
