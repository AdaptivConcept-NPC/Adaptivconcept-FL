/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adaptiv-orange': 'rgb(255, 55, 21)',
        'adaptiv-orange-hover': 'rgb(220, 45, 15)',
        'dark-bg': '#0a0a0a',
      },
      fontFamily: {
        comfortaa: ['Comfortaa', 'cursive'],
        vietnam: ['"Be Vietnam Pro"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        grindy: ['GrindyBrush', 'sans-serif'],
      },
      fontSize: {
        '10xl': '9rem',
        '11xl': '10rem',
        '12xl': '12rem',
      },
    },
  },
  plugins: [],
}
