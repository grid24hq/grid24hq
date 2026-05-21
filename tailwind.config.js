/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Grid24HQ brand palette
        brand: {
          black:   '#0a0a0a',
          dark:    '#111111',
          card:    '#161616',
          border:  '#222222',
          red:     '#e63300',
          orange:  '#ff6600',
          amber:   '#ffaa00',
          muted:   '#888888',
          light:   '#f0f0f0',
        },
        // Series accent colours — used for badges, highlights
        series: {
          wec:    '#3b82f6',   // blue
          motogp: '#f97316',   // orange
          gt3:    '#22c55e',   // green
          imsa:   '#a855f7',   // purple
          wsb:    '#ec4899',   // pink
          moto2:  '#eab308',   // yellow
          moto3:  '#14b8a6',   // teal
        },
      },
      fontFamily: {
        head:   ['"Barlow Condensed"', 'sans-serif'],
        body:   ['Rajdhani', 'sans-serif'],
        ui:     ['"Inter"', 'sans-serif'],
        mono:   ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(rgba(230,51,0,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(230,51,0,0.06) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid-40': '40px 40px',
      },
      animation: {
        'ticker':     'ticker 40s linear infinite',
        'pulse-dot':  'pulseDot 1.2s ease-in-out infinite',
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
