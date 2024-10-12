<template>
  <div class="flex items-center justify-center h-full dark:bg-black">
    <h1
      class="mt-10 text-center text-3xl font-[800] sm:text-4xl lg:mb-10 dark:text-white"
    >
      {{ $t('AuthVerifyEmail.title') }}
      <p class="text-center text-2xl text-gray-400">
        {{ $t('AuthVerifyEmail.description') }}
      </p>
      <v-card-actions class="justify-center">
        <p class="text-center text-sm">
          {{ $t('AuthVerifyEmail.requestEmail') }}
          <v-btn text class="text-blue-500" @click="handleRequestEmail">
            Resend Email
          </v-btn>
        </p>
      </v-card-actions>
    </h1>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'auth',
    middleware: ['loose-auth'],
  });

  const { doRequestEmail } = useAuth();
  const { locale } = useI18n();
  const { t } = useI18n();
  const loading = ref(false);
  const dirty = ref(false);
  const errorGlobal = ref('');

  const handleRequestEmail = async () => {
    dirty.value = true;

    try {
      loading.value = true;
      errorGlobal.value = '';
      // if (token.value) {
      //   console.log('token check', token.value);
      // }
      await doRequestEmail(locale.value);
    } catch (e) {
      if (e.response && e.response.data.code) {
        errorGlobal.value = t(`Error.${e.response.data.code}`);
      } else {
        errorGlobal.value = t('Error.GENERAL_ERROR');
      }
    } finally {
      loading.value = false;
    }
  };
</script>
