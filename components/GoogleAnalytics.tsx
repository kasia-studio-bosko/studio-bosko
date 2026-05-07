// Server component – renders GA4 inline scripts directly in <head>
// Uses raw <script> tags instead of next/script to avoid injection issues
// with nested layouts in Next.js App Router.

const GA_MEASUREMENT_ID = 'G-LEKRHQ3GJE'

export default function GoogleAnalytics() {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  )
}
