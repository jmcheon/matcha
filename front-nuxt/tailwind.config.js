/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.{js,vue,ts}',
    './pages/**/*.{js,vue,ts}',
    './plugins/**/*.{js,ts}',
    './error.vue',
    './presets/**/*.{js,vue,ts}',
    './nuxt-config.ts',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        primary: colors.amber,
        'surface-0': colors.stone[0],
        'surface-50': colors.stone[50],
        'surface-100': colors.stone[100],
        'surface-200': colors.stone[200],
        'surface-300': colors.stone[300],
        'surface-400': colors.stone[400],
        'surface-500': colors.stone[500],
        'surface-600': colors.stone[600],
        'surface-700': colors.stone[700],
        'surface-800': colors.stone[800],
        'surface-900': colors.stone[900],
        'surface-950': colors.stone[950],
      },
    },
  },
  plugins: [],
};
