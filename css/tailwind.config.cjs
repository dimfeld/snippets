const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');
const formsPlugin = require('@tailwindcss/forms');

const brightnessValues = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const accent = colors.sky;

const isSvench = Boolean(process.env.SVENCH);

const baseContent = ['./src/**/*.{html,js,svelte,ts}'];
const svenchContent = [...baseContent, './src/**/*.svench', './node_modules/svench/**/*.svelte'];

const config = {
  content: isSvench ? svenchContent : baseContent,
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        accent,
        daccent: Object.fromEntries(brightnessValues.map((c) => [c, `var(--color-daccent-${c})`])),
        dgray: Object.fromEntries(brightnessValues.map((c) => [c, `var(--color-dgray-${c})`])),
        dblack: `var(--color-dblack)`,
        dwhite: `var(--color-dwhite)`,
      },
    },
  },

  plugins: [
    formsPlugin,
    plugin(({ addBase, theme }) => {
      const mainElement = isSvench ? '.svench-body' : '#tracksome-top';

      function generateLightDark(colorSource) {
        let lightColorValues = brightnessValues.map((color) =>
          theme(`colors.${colorSource}.${color}`)
        );

        let lightColors = Object.fromEntries(
          brightnessValues.map((color, i) => [
            `--color-d${colorSource}-${color}`,
            lightColorValues[i],
          ])
        );

        let darkColorValues = lightColorValues.slice().reverse();
        let darkColors = Object.fromEntries(
          brightnessValues.map((color, i) => [
            `--color-d${colorSource}-${color}`,
            darkColorValues[i],
          ])
        );

        return {
          light: lightColors,
          dark: darkColors,
        };
      }

      let gray = generateLightDark('gray');
      let accent = generateLightDark('accent');

      let lightColors = {
        '--color-dwhite': 'white',
        '--color-dblack': 'black',
        ...gray.light,
        ...accent.light,
      };

      let darkColors = {
        '--color-dwhite': 'black',
        '--color-dblack': 'white',
        ...gray.dark,
        ...accent.dark,
      };

      addBase({
        [mainElement]: lightColors,
        [`${mainElement}.dark`]: darkColors,
      });
    }),
  ],
};

module.exports = config;
