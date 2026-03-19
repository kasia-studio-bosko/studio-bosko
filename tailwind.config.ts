import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Studio Bosko brand palette
        beige: '#d4cbc0',
        'beige-light': '#ede8e2',
        'beige-dark': '#c4b9ac',
        orange: '#f5500a',
        'dark-brown': '#2d1d17',
        'near-black': '#120b09',
        'warm-brown': '#705305',
        sage: '#60bf83',
        gold: '#e1cd3c',
        // Semantic aliases
        background: '#ede8e2',
        foreground: '#120b09',
        accent: '#f5500a',
        muted: '#d4cbc0',
      },
      fontFamily: {
        signifier: ['var(--font-signifier)', 'Georgia', 'serif'],
        cadiz: ['var(--font-cadiz)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 5.25rem)', { lineHeight: '1.0', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      spacing: {
        'page-x': 'clamp(1.25rem, 4vw, 3rem)',
        'section-y': 'clamp(4rem, 8vw, 9rem)',
      },
      maxWidth: {
        'page': '1440px',
      },
      aspectRatio: {
        'portrait': '3 / 4',
        'landscape': '4 / 3',
        'wide': '16 / 9',
        'square': '1 / 1',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-quad': 'cubic-bezier(0.45, 0, 0.55, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
