<script setup>
  import { ref } from 'vue';

  const route = useRoute();
  const axios = useAxios();
  const localePath = useLocalePath();
  const { t } = useI18n();

  const newPassword = ref('');
  const confirmPassword = ref('');
  const loading = ref(false);
  const errorGlobal = ref('');
  const dirty = ref(false);

  // Retrieve token from query params (usually passed in password reset link)
  const token = ref(route.query.token || '');

  const handleResetPassword = async () => {
    dirty.value = true;

    if (newPassword.value !== confirmPassword.value) {
      errorGlobal.value = t('Error.PASSWORDS_DO_NOT_MATCH');
      return;
    }

    try {
      loading.value = true;
      errorGlobal.value = '';
      // Simulate API call for resetting password
      await axios.post('/api/auth/reset-password', {
        token: token.value,
        newPassword: newPassword.value,
      });

      // Redirect to login page after successful reset
      await navigateTo({ path: localePath('auth-login') });
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

  const navigateToLogin = () => {
    navigateTo({ path: localePath('auth-login') });
  };
</script>

<template>
  <v-container
    fluid
    class="d-flex justify-center align-center fill-height dark:bg-black"
  >
    <v-card class="pa-6" elevation="2" width="450">
      <v-card-title class="text-center">
        <span class="text-h5 font-weight-bold">
          {{ $t('AuthResetPassword.resetPassword') }}
        </span>
      </v-card-title>

      <v-form @submit.prevent="handleResetPassword">
        <!-- New Password Field -->
        <v-text-field
          v-model="newPassword"
          :label="$t('_Global.newPassword')"
          type="password"
          :rules="[
            (v) =>
              !!v || $t('Error.REQUIRED', { value: $t('_Global.newPassword') }),
          ]"
          required
        />

        <!-- Confirm Password Field -->
        <v-text-field
          v-model="confirmPassword"
          :label="$t('_Global.confirmPassword')"
          type="password"
          :rules="[
            (v) =>
              !!v ||
              $t('Error.REQUIRED', { value: $t('_Global.confirmPassword') }),
          ]"
          required
        />

        <!-- Error Message -->
        <v-alert v-if="dirty && errorGlobal" type="error" class="mt-4">
          {{ errorGlobal }}
        </v-alert>

        <!-- Submit Button -->
        <v-btn
          color="primary"
          block
          class="mt-4"
          :loading="loading"
          type="submit"
        >
          {{ $t('AuthResetPassword.reset') }}
        </v-btn>
      </v-form>

      <!-- Back to Login Button -->
      <v-card-actions class="justify-center mt-4">
        <v-btn text @click="navigateToLogin">
          {{ $t('_Global.backToLogin') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
