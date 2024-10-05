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
  build: {
    transpile: ['vuetify'],
  },
  typescript: {
    shim: false,
    // typeCheck: true,
  },
  runtimeConfig: {
    public: {
      JWT_ACCESS_DURATION: process.env.JWT_ACCESS_DURATION,
      // BACK_HOST: process.env.BACK_HOST,
      BACK_HOST: process.env.FASTAPI_HOST,
      FRONT_HOST: process.env.FRONT_HOST,
    },
  },
  modules: [
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-svgo',
    '@nuxtjs/color-mode', // Add this line to include the color-mode module
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    // ...
  ],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  svgo: {
    defaultImport: 'components',
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'en',
    },
    locales: [
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
      },
    ],
  },
  vuetify: {
    treeShake: true,
  },
});
