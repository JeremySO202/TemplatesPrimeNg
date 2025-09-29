/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class', // Habilitar modo oscuro basado en clase
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-primeui')],
};
