<template>
  <v-container
    fluid
    class="d-flex justify-center items-center fill-height dark:bg-black text-white error-page"
  >
    <v-card class="pa-6 mx-auto" elevation="2">
      <!-- Error Message Title -->
      <v-card-title class="text-center">
        <span class="text-h5 font-weight-bold">{{ t('Error.error') }}</span>
      </v-card-title>

      <!-- Error Message Content -->
      <v-card-text>
        <!-- Conditional rendering based on errorCode -->
        <span v-if="errorCode">{{ t(`Error.${errorCode}`) }}</span>
        <span v-else>{{ t('Error.404') }}</span>
      </v-card-text>

      <!-- Buttons: Back to Login and Home -->
      <v-card-actions class="justify-center">
        <v-btn
          color="primary"
          class="my-2"
          @click="navigateTo({ path: localePath('auth-login') })"
        >
          {{ t('_Global.login') }}
        </v-btn>
        <v-btn
          color="secondary"
          class="my-2"
          @click="navigateTo({ path: localePath('index') })"
        >
          {{ t('_Global.home') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const { t } = useI18n();

  // Extract the message from query parameters
  const errorCode = ref('');

  onMounted(() => {
    errorCode.value = route.query.message ?? null;
  });
</script>
