/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // Automatic Day / Dark mode following device preferences
  theme: {
    extend: {
      colors: {
        dana: {
          50: '#eef8ff',
          100: '#d9f0ff',
          200: '#bce4ff',
          300: '#8ed2ff',
          400: '#58b7ff',
          500: '#118EEA',
          600: '#0070c7',
          700: '#0059a0',
          800: '#034c85',
          900: '#093f6e',
          950: '#062849',
        },
        brutal: {
          bg: '#f5f5f0',
          darkBg: '#0c0c0e',
          card: '#ffffff',
          darkCard: '#17171c',
          yellow: '#facc15',
          green: '#4ade80',
          cyan: '#38bdf8',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-dark': '4px 4px 0px 0px #ffffff',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-sm-dark': '2px 2px 0px 0px #ffffff',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-lg-dark': '6px 6px 0px 0px #ffffff',
      }
    },
  },
  plugins: [],
}
