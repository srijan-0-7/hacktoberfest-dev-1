/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f2f8f4',
          100: '#e1efe5',
          200: '#c5e0cf',
          300: '#9bcab0',
          400: '#6cae8d',
          500: '#489270',
          600: '#347558',
          700: '#2b5d47',
          800: '#254b3a',
          900: '#1b3b2e',
          950: '#0e2019',
        },
        moss: {
          50: '#fbfbe9',
          100: '#f5f6c8',
          200: '#ecf095',
          300: '#dfe55c',
          400: '#cfd72e',
          500: '#b4be1f',
          600: '#8e9816',
          700: '#6c7415',
          800: '#565c17',
          900: '#484d18',
        },
        bark: {
          50: '#faf8f5',
          100: '#f4efe8',
          200: '#e8ded2',
          300: '#d7c4b4',
          400: '#c1a592',
          500: '#ad8a75',
          600: '#9b7662',
          700: '#7f5f4e',
          800: '#684f43',
          900: '#554238',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
