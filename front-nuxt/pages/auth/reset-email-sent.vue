<template>
  <v-container
    fluid
    class="d-flex justify-center align-center fill-height dark:bg-black"
  >
    <v-card class="pa-6" elevation="2" width="450">
      <v-card-title class="text-center">
        <span class="text-h5 font-weight-bold">
          {{ $t('AuthForgotPassword.passwordResetSent') }}
        </span>
      </v-card-title>

      <v-card-text class="text-center">
        {{ $t('AuthForgotPassword.emailSentTo') }} {{ email }}
      </v-card-text>

      <v-btn color="primary" block @click="navigateToLogin">
        {{ $t('_Global.login') }}
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useLocalePath, navigateTo } from '#imports';

  const route = useRoute();
  const localePath = useLocalePath();
  const email = ref('');

  onMounted(() => {
    email.value = route.query.email || '';
  });

  const navigateToLogin = () => {
    navigateTo({ path: localePath('auth-login') });
  };
</script>
