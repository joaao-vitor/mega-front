/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'menu-start': 'rgba(1, 1, 1, 0.56)',
        black: {
          light: '#111',
          '1000': '#000',
          '800': 'rgba(0, 0, 0, 0.70)',
          '400': 'rgba(0, 0, 0, 0.40)'
        },
      },
      gridTemplateColumns: {
        'header' : '1fr 2fr 1fr'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'bebas': ['Bebas Neue', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
    },
    
  },
  plugins: [],
}

