<script setup>
  import { ref } from 'vue';
  import { useAxios, useLocalePath, useI18n, navigateTo } from '#imports';

  const axios = useAxios();
  const email = ref('');
  const loading = ref(false);
  const errorGlobal = ref('');
  const dirty = ref(false);

  const { locale } = useI18n();
  const { t } = useI18n();
  const localePath = useLocalePath();

  // Validator for email
  const { emailValidator } = useValidator();
  const { error: errorEmail } = emailValidator(dirty, email, t);

  const { doCheckUserCredentials } = useAuth();

  const handleForgotPassword = async () => {
    dirty.value = true;

    if (errorEmail.value) {
      return;
    }

    try {
      loading.value = true;
      errorGlobal.value = '';
      // Simulating API request to send reset password email
      await doCheckUserCredentials(axios, { email: email.value }, locale.value);

      // Redirect to a confirmation page or display success message
      await navigateTo({
        path: localePath('auth-reset-email-sent'),
        query: { email: email.value },
      });
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
        <span class="text-h5 font-weight-bold">{{
          $t('AuthForgotPassword.title')
        }}</span>
      </v-card-title>

      <v-form @submit.prevent="handleForgotPassword">
        <!-- Email Input Field -->
        <v-text-field
          v-model="email"
          :label="$t('_Global.email')"
          type="email"
          :error-messages="errorEmail ? [errorEmail] : []"
          :rules="[
            (v) => !!v || $t('Error.REQUIRED', { value: $t('_Global.email') }),
          ]"
          required
        />

        <!-- Error Message -->
        <v-alert v-if="dirty && errorGlobal" type="error" class="mt-4">
          {{ errorGlobal }}
        </v-alert>

        <!-- Submit Button -->
        <v-btn
          type="submit"
          color="primary"
          class="mt-4"
          :loading="loading"
          block
        >
          {{ $t('AuthForgotPassword.submit') }}
        </v-btn>
      </v-form>

      <v-card-actions class="justify-center flex-column">
        <p class="text-center text-sm">
          {{ $t('AuthForgotPassword.rememberAccount') }}
          <v-btn text @click="navigateTo({ path: localePath('auth-login') })">
            {{ $t('_Global.login') }}
          </v-btn>
        </p>
        <p class="text-center text-sm">
          {{ $t('AuthForgotPassword.accountDont') }}
          <v-btn
            text
            @click="navigateTo({ path: localePath('auth-register') })"
          >
            {{ $t('_Global.register') }}
          </v-btn>
        </p>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
