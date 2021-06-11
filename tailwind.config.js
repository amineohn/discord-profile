const colors = require('tailwindcss/colors')
module.exports = {
  purge: ["./src/**/*.{ts,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        indigo: colors.indigo,
        red: colors.red,
        yellow: colors.yellow,
        amber: colors.amber,
        lime: colors.lime,
        green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        'light-blue': colors.lightBlue,
        blue: colors.blue,
        violet: colors.violet,
        fuchsia: colors.fuchsia,
        rose: colors.rose,
        cyan: colors.cyan,
        orange: colors.orange,
        'warm-gray': colors.warmGray,
        'true-gray': colors.trueGray,
        coolGray: colors.coolGray,
        blueGray: colors.blueGray,
        'spotify': {
          '50': '#1DB954'
        },
        'blurple-discord': {
          '50': '#5865F2'
        },
        'yellow-discord': {
          '50': '#FEE75C'
        },
        'green-discord': {
          '50': '#57F287'
        },
        'red-discord': {
          '50': '#ED4245'
        },
        'fuchsia-discord': {
          '50': '#EB459E'
        },
        'black-discord': {
          '50': '#23272A'
        },
        'black-specific-discord': {
          '50': '#191D1F'
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  mode: "jit",
};
