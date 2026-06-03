/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: 'var(--coral)',
          light: 'var(--coral-light)',
          dark: 'var(--coral-dark)',
        },
        amber: {
          DEFAULT: 'var(--amber)',
          light: 'var(--amber-light)',
        },
        cream: {
          DEFAULT: 'var(--cream)',
          dark: 'var(--cream-dark)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          light: 'var(--ink-light)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          light: 'var(--muted-light)',
        },
        sage: {
          DEFAULT: 'var(--sage)',
          light: 'var(--sage-light)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          dark: 'var(--surface-dark)',
        },
        border: {
          DEFAULT: 'var(--border)',
          dark: 'var(--border-dark)',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(232,85,62,0.35)',
        'glow': '0 0 24px rgba(232,85,62,0.45)',
        'glow-lg': '0 0 48px rgba(232,85,62,0.55)',
        'glass': '0 8px 32px rgba(28,22,18,0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glass-panel': '0 24px 64px rgba(28,22,18,0.4), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'blob': {
          '0%,100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.7)' },
        },
        'border-beam': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.5s ease-out both',
        'blob': 'blob 12s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'border-beam': 'border-beam 4s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
