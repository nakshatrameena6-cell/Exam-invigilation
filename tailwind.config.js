/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#014502',
        'primary-hover': '#013602',
        'secondary-bg': '#EEFFF2',
        'secondary-accent': '#99E200',
        'olive': '#A9C667',
        success: '#3BB54A',
        warning: '#FFF100',
        hover: '#FFDF25',
        highlight: '#7B540E',
        info: '#5FA3D8',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'ui-serif', 'serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 10px 20px -2px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
};
