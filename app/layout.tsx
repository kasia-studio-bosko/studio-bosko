import type { Metadata } from 'next'
import './globals.css'

// Root layout – minimal wrapper. All real layout is in app/[locale]/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bosko.studio'
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The <html> and <body> tags are provided by app/[locale]/layout.tsx
  // This root layout is required by Next.js but acts as a pass-through
  return <>{children}</>
}
