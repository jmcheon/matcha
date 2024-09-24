<script setup>
  import { ref } from 'vue';

  // definePageMeta({
  //   // layout: 'auth',
  //   middleware: ['strict-auth'],
  // });

  const axios = useAxios();
  const localePath = useLocalePath();
  const { t } = useI18n();

  const newPassword = ref('');
  const confirmPassword = ref('');
  const loading = ref(false);
  const errorGlobal = ref('');
  const dirty = ref(false);

  const { accountData } = storeToRefs(useUserStore());
  const { updateProfile } = useProfile();

  const { passwordValidator } = useValidator();
  const { error: errorPassword } = passwordValidator(dirty, newPassword, t);
  const { error: errorConfirmPassword } = passwordValidator(
    dirty,
    confirmPassword,
    t,
  );

  const handleResetPassword = async () => {
    dirty.value = true;
    if (errorPassword.value || errorConfirmPassword.value) return;

    if (!newPassword.value || !confirmPassword.value) return;

    if (newPassword.value !== confirmPassword.value) {
      errorGlobal.value = t('Error.PASSWORDS_DO_NOT_MATCH');
      return;
    }

    try {
      loading.value = true;
      console.log(accountData.value);
      // Simulate API call for resetting password
      await updateProfile(axios, accountData.value.account_id, {
        password: newPassword.value,
      });

      // Redirect to login page after successful reset
      await navigateTo({ path: localePath('auth-login') });
      errorGlobal.value = '';
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
          :error="!!errorPassword"
          :messages="[errorPassword]"
          required
        />

        <!-- Confirm Password Field -->
        <v-text-field
          v-model="confirmPassword"
          :label="$t('_Global.confirmPassword')"
          type="password"
          :error="!!errorConfirmPassword"
          :messages="[errorConfirmPassword]"
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
    </v-card>
  </v-container>
</template>
