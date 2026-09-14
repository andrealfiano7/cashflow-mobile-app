/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9fa',
          100: '#d7f0f4',
          200: '#b4e1e8',
          300: '#84cdd7',
          400: '#4fb0bf',
          500: '#0193A5',
          600: '#027184',
          700: '#025a6b',
          800: '#004A59',
          900: '#003d4a',
          950: '#002832',
        },
        emerald: {
          50: '#f0f9fa',
          100: '#d7f0f4',
          200: '#b4e1e8',
          300: '#84cdd7',
          400: '#4fb0bf',
          500: '#0193A5',
          600: '#027184',
          700: '#025a6b',
          800: '#004A59',
          900: '#003d4a',
          950: '#002832',
        },
        rose: {
          50: '#fff5f1',
          100: '#ffe8de',
          200: '#ffd0bc',
          300: '#F6A278',
          400: '#f48553',
          500: '#F16744',
          600: '#df502c',
          700: '#C73618',
          800: '#9e2d16',
          900: '#822715',
          950: '#471107',
        },
        slate: {
          850: '#151f32',
          950: '#0b1120',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'float': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
