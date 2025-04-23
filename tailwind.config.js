/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4ade80',
          DEFAULT: '#16a34a',
          dark: '#166534',
        },
        secondary: {
          light: '#a1a1aa',
          DEFAULT: '#71717a',
          dark: '#27272a',
        },
        water: {
          light: '#67e8f9',
          DEFAULT: '#06b6d4',
          dark: '#0e7490',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'page-transition': 'pageTransition 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pageTransition: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      lineHeight: {
        'relaxed': '1.75',
        'loose': '2',
      },
      boxShadow: {
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
}
