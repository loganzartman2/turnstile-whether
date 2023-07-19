const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,tsx}'],
  theme: {
    extend: {
      colors: {
        brandPrimary: colors.orange[700],
      },
    },
  },
  plugins: [],
};
