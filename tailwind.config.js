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
        }
      },
    },
  },
  plugins: [],
}
