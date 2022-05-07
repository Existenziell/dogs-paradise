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
        ],
        serif: [
          'Berkshire Swash',
        ],
      },
      colors: {
        brand: '#C90076',
        'brand-dark': '#200530',
      },
      backgroundImage: {
        'cloth-pattern': 'url(/icons/cloth.jpg)',
        'parallax-1': 'url(/parallax/walk.jpg)',
        'parallax-1-m': 'url(/parallax/walk-m.jpg)',
        'parallax-2': 'url(/parallax/sergio.jpg)',
        'parallax-2-m': 'url(/parallax/sergio-m.jpg)',
        poly: 'url(/icons/poly.svg)',
      },
      minWidth: {
        '1/4': '25%',
        '1/3': '33%',
        '1/2': '50%',
        '2/3': '66%',
        '3/4': '75%',
        '4/5': '80%',
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
      primary: '#fdbb2d',
      secondary: '#22c1c3',
      // primary: '#00c3ff',
      // secondary: '#ffff1c',
      // primary: '#F4D03F',
      // secondary: '#16A085',
      // primary: '#36D1DC',
      // secondary: '#5B86E5',
      // primary: '#007991',
      // secondary: '#78ffd6',
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
