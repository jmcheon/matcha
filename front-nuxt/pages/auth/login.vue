<template>
  <v-container
    fluid
    class="d-flex justify-center align-center fill-height dark:bg-black"
  >
    <v-card class="pa-6" elevation="2" width="450">
      <v-card-title class="text-center">
        <span class="text-h5 font-weight-bold">Login</span>
      </v-card-title>

      <v-form @submit.prevent="handleLogin">
        <!-- Username Input Field -->
        <v-text-field
          v-model="username"
          :label="$t('_Global.username')"
          :error="!!errorUsername"
          :messages="[errorUsername]"
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
          {{ $t(`_Global.login`) }}
        </v-btn>
      </v-form>

      <!-- Register link -->
      <v-card-actions class="justify-center">
        <p class="text-center text-sm">
          {{ $t('AuthLogin.accountDont') }}
          <v-btn
            text
            class="text-blue-500"
            @click="navigateTo({ path: localePath('auth-register') })"
          >
            Register
          </v-btn>
        </p>
      </v-card-actions>

      <!-- Forgot Password link -->
      <v-card-actions class="justify-center">
        <p class="text-center text-sm">
          {{ $t('AuthLogin.forgotPassword') }}
          <v-btn
            text
            @click="navigateTo({ path: localePath('auth-forgot-password') })"
            >Forgot Password</v-btn
          >
        </p>
      </v-card-actions>

      <!-- Responsive Social Login Buttons with Tailwind CSS -->
      <div class="d-flex flex-column align-center">
        <div>Social login</div>
        <v-card-actions class="d-flex justify-center">
          <v-btn class="text-black mx-2" @click="onGoogleLogin">
            <v-icon left>mdi-google</v-icon>
          </v-btn>
          <v-btn class="text-black mx-2" @click="onGithubLogin">
            <v-icon left>mdi-github</v-icon>
          </v-btn>
          <v-btn class="text-black mx-2" @click="onFtLogin">
            <v-icon left> <FtLogo class="h-8 w-8" /></v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue';
  import FtLogo from '~/assets/icons/42.svg';

  definePageMeta({
    // layout: 'auth',
    middleware: ['non-auth'],
  });

  const localePath = useLocalePath();
  const username = ref('');
  const password = ref('');
  const { doLogin, onGoogleLogin, onGithubLogin, onFtLogin } = useAuth();
  const { getProfile } = useProfile();
  const { isEmailVerified, isProfileGenerated, isProfileImageUploaded } =
    storeToRefs(useUserStore());
  const { t } = useI18n();
  const loading = ref(false);
  const dirty = ref(false);
  const errorGlobal = ref('');

  const { usernameValidator, passwordValidator } = useValidator();
  const { error: errorUsername } = usernameValidator(dirty, username, t);
  const { error: errorPassword } = passwordValidator(dirty, password, t);

  // Handle traditional login form submission
  const handleLogin = async () => {
    dirty.value = true;

    if (errorUsername.value || errorPassword.value) {
      return;
    }
    if (!username.value || !password.value) return;
    // Add your login logic here
    try {
      loading.value = true;
      errorGlobal.value = '';
      await doLogin({
        username: username.value,
        password: password.value,
      });
      await getProfile();
      if (isEmailVerified.value) {
        if (isProfileGenerated.value) {
          // User is verified and has a generated profile
          if (isProfileImageUploaded.value)
            await navigateTo({ path: localePath('home') });
          else
            await navigateTo({ path: localePath('auth-upload-profile-image') });
        } else {
          // User is verified but does not have a generated profile
          await navigateTo({ path: localePath('auth-generate-profile') });
        }
      } else {
        // User is not verified
        await navigateTo({ path: localePath('auth-verify-email') });
      }
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

  // Redirect to backend which handles 42Intra OAuth2
</script>
