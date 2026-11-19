/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F2F5F7',
        ink: '#11202F',
        brand: { DEFAULT: '#0B7A75', dark: '#08605C', soft: '#DDF1EF' },
        signal: '#F5A524',
        line: '#D5DDE3',
        muted: '#5B6B7A',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
