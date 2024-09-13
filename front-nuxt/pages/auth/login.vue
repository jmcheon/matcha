<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center bg-blue-300 space-y-6"
  >
    <!-- Login Form -->
    <div class="bg-blue-400 p-6 rounded-lg shadow-lg w-80">
      <h2 class="text-center text-xl font-bold mb-4">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md"
        >
          Login
        </button>
      </form>
      <!-- Register link -->
      <p class="mt-4 text-center text-sm text-gray-600">
        Don't have an account?
        <button
          class="text-blue-500 hover:underline"
          @click="redirectToRegister"
        >
          Register
        </button>
      </p>
    </div>

    <!-- Social Login Buttons -->
    <div class="flex space-x-4">
      <button
        class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md"
        @click="onGoogleLogin"
      >
        Sign in with Google
      </button>
      <button
        class="px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md"
        @click="redirectTo42Intra"
      >
        Sign in with 42Intra
      </button>
    </div>
  </main>
</template>

<script setup>
  import { ref } from 'vue';

  definePageMeta({
    // layout: 'auth',
    middleware: ['non-auth'],
  });
  const localePath = useLocalePath();
  const axios = useAxios();
  const email = ref('');
  const password = ref('');
  const { doLogin, onGoogleLogin, onGithubLogin, onFtLogin } = useAuth();
  const { isEmailVerified, isProfileGenerated } = storeToRefs(useUserStore());
  const { t } = useI18n();

  // Handle traditional login form submission
  const handleLogin = async () => {
    console.log('Login attempted with', email.value, password.value);
    // Add your login logic here
    try {
      await doLogin(axios, {
        email: email.value,
        password: password.value,
      });
      if (isEmailVerified.value) {
        if (isProfileGenerated.value) {
          // User is verified and has a generated profile
          await navigateTo({ path: localePath('index') });
        } else {
          // User is verified but does not have a generated profile
          await navigateTo({ path: localePath('auth-generate-profile') });
        }
      } else {
        // User is not verified
        await navigateTo({ path: localePath('auth-verify-email') });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // eslint-disable-next-line no-alert
      alert('Error during registration');
    } finally {
      console.log('hi');
    }
  };

  // Redirect to backend which handles Google OAuth2

  const redirectToRegister = () => {
    navigateTo({ path: localePath('auth-register') });
  };

  // Redirect to backend which handles 42Intra OAuth2
  const redirectTo42Intra = () => {
    const intraOAuthUrl = `http://localhost:3005/social/42intra`;
    window.location.href = intraOAuthUrl;
  };
</script>

<style>
  /* Styling to center everything horizontally and vertically */
  html,
  body {
    margin: 0;
    height: 100%;
  }

  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  button {
    cursor: pointer;
  }
</style>
