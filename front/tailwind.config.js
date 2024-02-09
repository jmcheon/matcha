/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  darkMode: 'class',
  content: [
    'presets/**/*.{js,vue,ts}',
    'components/**/*.{js,vue,ts}',
    'layout/**/*.{js,vue,ts}',
    'pages/**/*.{js,vue,ts}',
    'plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.red,
        'surface-0': colors.gray[0],
        'surface-50': colors.gray[50],
        'surface-100': colors.gray[100],
        'surface-200': colors.gray[200],
        'surface-300': colors.gray[300],
        'surface-400': colors.gray[400],
        'surface-500': colors.gray[500],
        'surface-600': colors.gray[600],
        'surface-700': colors.gray[700],
        'surface-800': colors.gray[800],
        'surface-900': colors.gray[900],
        'surface-950': colors.gray[950],
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      // Add custom typo classes
      addUtilities({
        '.typo-giga-title': {
          fontWeight: '600',
          fontSize: '64px',
          fontStyle: 'normal',
          lineHeight: '80px',
        },
        '.typo-mega-title': {
          fontWeight: '600',
          fontSize: '48px',
          fontStyle: 'normal',
          lineHeight: '64px',
        },
        '.typo-extra-large-title': {
          fontWeight: '600',
          fontSize: '40px',
          fontStyle: 'normal',
          lineHeight: '56px',
        },
        '.typo-large-title': {
          fontWeight: '600',
          fontSize: '32px',
          fontStyle: 'normal',
          lineHeight: '48px',
        },
        '.typo-title': {
          fontWeight: '600',
          fontSize: '28px',
          fontStyle: 'normal',
          lineHeight: '40px',
        },
        '.typo-headline-bold': {
          fontWeight: '600',
          fontSize: '24px',
          fontStyle: 'normal',
          lineHeight: '32px',
        },
        '.typo-headline': {
          fontWeight: '400',
          fontSize: '24px',
          fontStyle: 'normal',
          lineHeight: '32px',
        },
        '.typo-callout-bold': {
          fontWeight: '600',
          fontSize: '20px',
          fontStyle: 'normal',
          lineHeight: '28px',
        },
        '.typo-callout': {
          fontWeight: '400',
          fontSize: '20px',
          fontStyle: 'normal',
          lineHeight: '28px',
        },
        '.typo-body-bold': {
          fontWeight: '600',
          fontSize: '16px',
          fontStyle: 'normal',
          lineHeight: '24px',
        },
        '.typo-body': {
          fontWeight: '400',
          fontSize: '16px',
          fontStyle: 'normal',
          lineHeight: '24px',
        },
        '.typo-sub-text-bold': {
          fontWeight: '600',
          fontSize: '14px',
          fontStyle: 'normal',
          lineHeight: '20px',
        },
        '.typo-sub-text': {
          fontWeight: '400',
          fontSize: '14px',
          fontStyle: 'normal',
          lineHeight: '20px',
        },
        '.typo-caption-bold': {
          fontWeight: '600',
          fontSize: '12px',
          fontStyle: 'normal',
          lineHeight: '16px',
        },
        '.typo-caption': {
          fontWeight: '400',
          fontSize: '12px',
          fontStyle: 'normal',
          lineHeight: '16px',
        },
      });
    },
  ],
};
