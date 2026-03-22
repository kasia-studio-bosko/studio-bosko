/**
 * Minimal layout for the embedded Sanity Studio at /cms.
 *
 * The root layout (app/layout.tsx) intentionally omits <html>/<body>
 * because the locale layout (app/[locale]/layout.tsx) provides them
 * for all website routes. But /cms falls outside [locale], so it
 * needs its own <html>/<body> here.
 *
 * No global styles, no nav, no footer — Sanity Studio manages its
 * own full-page UI.
 */
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
