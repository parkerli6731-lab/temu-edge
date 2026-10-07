/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        temu: {
          orange: '#fb5b03',
          darkOrange: '#e04c00',
          yellow: '#ffbf00',
          dark: '#222222',
          lightBg: '#f6f6f6',
        },
      },
    },
  },
  plugins: [],
};
