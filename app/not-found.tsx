/**
 * Root-level 404 — rendered outside the [locale] layout tree.
 * Shown only when Next.js cannot match any locale prefix at all.
 * Falls back to English; no next-intl context available here.
 */
import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: '#ede8e2',
          color: '#2d1d17',
          fontFamily: 'Georgia, serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '520px' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              opacity: 0.4,
              marginBottom: '1.5rem',
            }}
          >
            404
          </p>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 52px)',
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
            }}
          >
            Page not found
          </h1>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.65,
              opacity: 0.65,
              marginBottom: '2.5rem',
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1px solid #2d1d17',
              padding: '14px 24px',
              textDecoration: 'none',
              color: '#2d1d17',
              transition: 'all 0.2s',
            }}
          >
            Back to homepage
          </Link>
        </div>
      </body>
    </html>
  )
}
