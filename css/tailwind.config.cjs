// A tailwind config desiged for use with the autodark plugin in this directory.
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const formsPlugin = require('@tailwindcss/forms');
const { autoDarkPlugin, autoDarkColors } = require('./tailwind-autodark.cjs');

const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: colors.orange,
        ...autoDarkColors({ colors: ['gray', 'accent'] }),
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    formsPlugin,
    autoDarkPlugin({
      mainElement: 'body',
      colors: ['gray', 'accent'],
    }),
  ],
};

module.exports = config;
