// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/eslint-module', '@nuxtjs/tailwindcss', 'nuxt-primevue'],
  primevue: {
    unstyled: true,
    importPT: { from: path.resolve(__dirname, './presets/lara/') }, // import and apply preset
  },
});
