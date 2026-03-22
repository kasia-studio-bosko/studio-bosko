import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'studio-bosko',
  title: 'Studio Bosko',

  projectId: 'ysq1y4zp',
  dataset: 'production',

  basePath: '/cms',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Studio Bosko CMS')
          .items([
            // ── Projects ──────────────────────────────────────────────────────
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

            // ── Pages (singletons) ────────────────────────────────────────────
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
                          .schemaType('homepage')
                          .documentId('homepage')
                      ),
                    S.listItem()
                      .title('👤 Studio / About')
                      .child(
                        S.document()
                          .schemaType('studioPage')
                          .documentId('studioPage')
                      ),
                    S.listItem()
                      .title('📋 Offering / Services')
                      .child(
                        S.document()
                          .schemaType('offeringPage')
                          .documentId('offeringPage')
                      ),
                    S.listItem()
                      .title('📰 Press')
                      .child(
                        S.document()
                          .schemaType('pressPage')
                          .documentId('pressPage')
                      ),
                    S.listItem()
                      .title('✉️ Inquire')
                      .child(
                        S.document()
                          .schemaType('inquirePage')
                          .documentId('inquirePage')
                      ),
                    S.listItem()
                      .title('🏗️ Projects Index (SEO)')
                      .child(
                        S.document()
                          .schemaType('projectsPage')
                          .documentId('projectsPage')
                      ),
                    S.listItem()
                      .title('⚖️ Impressum')
                      .child(
                        S.document()
                          .schemaType('impressum')
                          .documentId('impressum')
                      ),
                  ])
              ),

            S.divider(),

            // ── Press ─────────────────────────────────────────────────────────
            S.listItem()
              .title('Press')
              .icon(() => '📰')
              .child(
                S.documentList()
                  .title('Press Items')
                  .filter('_type == "press"')
                  .defaultOrdering([
                    { field: 'order', direction: 'asc' },
                    { field: 'date',  direction: 'desc' },
                  ])
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
      if (document._type === 'impressum') return `${siteUrl}/impressum`
      return prev
    },
  },
})
