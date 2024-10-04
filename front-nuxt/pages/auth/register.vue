<template>
  <v-container
    fluid
    class="d-flex justify-center align-center fill-height dark:bg-black"
  >
    <v-card class="pa-6" elevation="2" width="450">
      <v-card-title class="text-center">
        <span class="text-h5 font-weight-bold">{{
          $t('AuthRegister.title')
        }}</span>
      </v-card-title>

      <v-form @submit.prevent="handleRegister">
        <!-- Username Input Field -->
        <v-text-field
          v-model="username"
          :label="$t('_Global.username')"
          :error="!!errorUsername"
          :messages="[errorUsername]"
          required
        />

        <!-- Email Input Field -->
        <v-text-field
          v-model="email"
          :label="$t('_Global.email')"
          type="email"
          :error="!!errorEmail"
          :messages="[errorEmail]"
          required
        />

        <!-- Password Input Field -->
        <v-text-field
          v-model="password"
          :label="$t('_Global.password')"
          type="password"
          :error="!!errorPassword"
          :messages="[errorPassword]"
          required
        />

        <!-- Retype Password Input Field -->
        <v-text-field
          v-model="retypePassword"
          :label="$t('_Global.retypePassword')"
          type="password"
          :error="!!errorRetypePassword"
          :messages="[errorRetypePassword]"
          required
        />

        <v-card-text>
          <!-- Conditional rendering based on errorCode -->
          <span v-if="socialProvider">{{
            t(`AuthRegister.socialLoginMessage`)
          }}</span>
        </v-card-text>

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
          {{ $t('AuthRegister.register') }}
        </v-btn>
      </v-form>

      <v-card-actions class="justify-center">
        <p class="text-center text-sm">
          {{ $t('AuthRegister.alreadyAccount') }}
          <v-btn text @click="navigateTo({ path: localePath('auth-login') })">{{
            $t('_Global.login')
          }}</v-btn>
        </p>
      </v-card-actions>
      <v-card-actions class="justify-center">
        <p class="text-center text-sm">
          {{ $t('AuthRegister.forgotPassword') }}
          <v-btn
            text
            @click="navigateTo({ path: localePath('auth-forgot-password') })"
            >{{ $t('_Global.forgotPassword') }}</v-btn
          >
        </p>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { jwtDecode } from 'jwt-decode';

  const axios = useAxios();
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const retypePassword = ref('');
  const socialProvider = ref('');
  const socialId = ref('');
  const localePath = useLocalePath();
  const { t } = useI18n();
  const loading = ref(false);
  const dirty = ref(false);
  const errorGlobal = ref('');

  // Validators (assuming you have your custom useValidator)
  const { usernameValidator, emailValidator, passwordValidator } =
    useValidator();
  const { error: errorUsername } = usernameValidator(dirty, username, t);
  const { error: errorEmail } = emailValidator(dirty, email, t);
  const { error: errorPassword } = passwordValidator(dirty, password, t);
  const { error: errorRetypePassword } = passwordValidator(
    dirty,
    retypePassword,
    t,
  );

  const { doRegister } = useAuth();
  const { locale } = useI18n();
  const route = useRoute();

  onMounted(() => {
    const queryToken = route.query.token;
    if (queryToken) {
      // Decode the token without verifying it
      const decodedPayload = jwtDecode(queryToken);
      email.value = decodedPayload.email;
      socialProvider.value = decodedPayload.provider;
      socialId.value = decodedPayload.id;
      console.log('Decoded Token:', decodedPayload);
    }
  });

  const handleRegister = async () => {
    dirty.value = true;

    if (
      errorUsername.value ||
      errorEmail.value ||
      errorPassword.value ||
      errorRetypePassword.value
    ) {
      return;
    }

    if (password.value !== retypePassword.value) {
      errorGlobal.value = t('Error.PASSWORDS_DO_NOT_MATCH');
      return;
    }

    const userInfo = {
      username: username.value,
      email: email.value,
      password: password.value,
    };

    let socialInfo = {};
    if (socialProvider.value && socialId.value) {
      socialInfo = {
        id: socialId.value,
        provider: socialProvider.value,
      };
    }

    try {
      loading.value = true;
      errorGlobal.value = '';
      // if (token.value) {
      //   console.log('token check', token.value);
      // }
      await doRegister(axios, userInfo, locale.value, socialInfo);
      await navigateTo({ path: localePath('auth-verify-email') });
    } catch (e) {
      if (e.response && e.response.data.code) {
        console.log('checker', e.response.data);
        errorGlobal.value = t(`Error.${e.response.data.code}`);
      } else {
        errorGlobal.value = t('Error.GENERAL_ERROR');
      }
    } finally {
      loading.value = false;
    }
  };
</script>
