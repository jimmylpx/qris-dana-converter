/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dana: {
          50: '#eef8ff',
          100: '#d9f0ff',
          200: '#bce4ff',
          300: '#8ed2ff',
          400: '#58b7ff',
          500: '#118EEA', // DANA Primary Blue
          600: '#0070c7',
          700: '#0059a0',
          800: '#034c85',
          900: '#093f6e',
          950: '#062849',
        }
      }
    },
  },
  plugins: [],
}
