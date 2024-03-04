// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/styles/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  typescript: {
    shim: false,
    // typeCheck: true,
  },
  // ...
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    // ...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  i18n: {
    defaultLocale: 'en',
    vueI18n: './i18n.config.ts',
    defaultBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'en',
    },
  },
});
