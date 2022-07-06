module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        // https://tailwindcss.com/docs/font-family#customizing
        sans: [
          'Gotu',
        ]
      },
      colors: {
        'brand': '#06768d',
        'brand-dark': '#242424',
        'dark': '#010203',
      },
      backgroundImage: {
        'cloth-pattern': 'url(/icons/cloth.jpg)',
        'parallax-1': 'url(/img/walk.jpg)',
        'parallax-1-m': 'url(/img/walk-m.jpg)',
        'parallax-2': 'url(/img/cozumel-dogs.jpg)',
        'parallax-2-m': 'url(/img/cozumel-dogs.jpg)',
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'tranlate(0px, 0px) scale(1)',
          },
        },
      },
    },
    gradientColorStops: theme => ({
      primary: '#06768d',
      secondary: '#200530',
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
