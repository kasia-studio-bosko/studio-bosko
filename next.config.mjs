import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern formats (AVIF → WebP → JPEG) automatically
    formats: ['image/avif', 'image/webp'],
    // Standard breakpoints + extra retina sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    // Quality default raised to 90 (can still override per-component)
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async redirects() {
    return [
      // ── /home → / (Framer site had a /home variant) ──────────────────────
      { source: '/home', destination: '/', permanent: true },
      { source: '/de/home', destination: '/de', permanent: true },
      { source: '/pl/home', destination: '/pl', permanent: true },

      // ── /projects/:slug → /project/:slug (plural → singular) ──────────────
      // EN (default locale — no prefix)
      {
        source: '/projects/:slug',
        destination: '/project/:slug',
        permanent: true,
      },
      // DE locale
      {
        source: '/de/projekte/:slug',
        destination: '/de/projekt/:slug',
        permanent: true,
      },
      // PL locale
      {
        source: '/pl/projekty/:slug',
        destination: '/pl/projekt/:slug',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
