// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';

export default defineNuxtConfig({
  devtools: { enabled: true },
  srr: false,
  modules: ['@pinia/nuxt', '@nuxtjs/eslint-module', 'nuxt-primevue', '@vueuse/nuxt'],
  primevue: {
    unstyled: true,
    importPT: { from: path.resolve(__dirname, './presets/lara/') }, // import and apply preset
  },
  css: ['~/assets/styles/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'bg-surface-50 dark:bg-surface-800',
      },
      bodyAttrs: {
        class: 'bg-surface-50 dark:bg-surface-800',
      },
    },
  },
});
