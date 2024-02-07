/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'presets/**/*.{js,vue,ts}',
    'components/**/*.{js,vue,ts}',
    'layout/**/*.{js,vue,ts}',
    'pages/**/*.{js,vue,ts}',
    'plugins/**/*.{js,ts}',
  ],
  theme: {
    screens: {
      llg: { max: '1440px' },
      lg: { max: '1280px' },
      xlg: { max: '1024px' },
      md: { max: '960px' },
      sm: { max: '720px' },
      xs: { max: '540px' },
      'up-lg': { min: '1281px' },
      'up-xlg': { min: '1025px' },
      'up-md': { min: '961px' },
      'up-sm': { min: '721px' },
      'up-xs': { min: '541px' },
    },
    extend: {
      colors: {
        'primary-50': 'rgb(var(--primary-50))',
        'primary-100': 'rgb(var(--primary-100))',
        'primary-200': 'rgb(var(--primary-200))',
        'primary-300': 'rgb(var(--primary-300))',
        'primary-400': 'rgb(var(--primary-400))',
        'primary-500': 'rgb(var(--primary-500))',
        'primary-600': 'rgb(var(--primary-600))',
        'primary-700': 'rgb(var(--primary-700))',
        'primary-800': 'rgb(var(--primary-800))',
        'primary-900': 'rgb(var(--primary-900))',
        'primary-950': 'rgb(var(--primary-950))',
        'surface-0': 'rgb(var(--surface-0))',
        'surface-50': 'rgb(var(--surface-50))',
        'surface-100': 'rgb(var(--surface-100))',
        'surface-200': 'rgb(var(--surface-200))',
        'surface-300': 'rgb(var(--surface-300))',
        'surface-400': 'rgb(var(--surface-400))',
        'surface-500': 'rgb(var(--surface-500))',
        'surface-600': 'rgb(var(--surface-600))',
        'surface-700': 'rgb(var(--surface-700))',
        'surface-800': 'rgb(var(--surface-800))',
        'surface-900': 'rgb(var(--surface-900))',
        'surface-950': 'rgb(var(--surface-950))',
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