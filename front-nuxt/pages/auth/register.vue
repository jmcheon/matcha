<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-blue-500 p-6 rounded-lg shadow-lg w-80">
      <h2 class="text-center text-xl font-bold mb-4">Register</h2>
      <form @submit.prevent="handleRegister">
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
            :readonly="isSocialLogin"
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
        <div class="mb-4">
          <label
            for="retypePassword"
            class="block text-sm font-medium text-gray-700"
            >Retype Password</label
          >
          <input
            id="retypePassword"
            v-model="retypePassword"
            type="password"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Retype your password"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md"
        >
          Register
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account?
        <button
          href="/login"
          class="text-blue-500 hover:underline"
          @click="redirectToLogin"
        >
          Login
        </button>
      </p>
    </div>
  </main>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAxios, useLocalePath, useI18n, navigateTo } from '#imports';

  const email = ref('');
  const password = ref('');
  const retypePassword = ref('');
  const isSocialLogin = ref(false); // To track if the login was through social

  const axios = useAxios();
  const localePath = useLocalePath();
  const { doRegister } = useAuth();
  const { locale } = useI18n();
  const route = useRoute(); // To access query parameters

  // On component mount, check if email is pre-filled from query parameters
  onMounted(() => {
    const queryEmail = route.query.email;
    const socialLogin = route.query.socialLogin === 'true';

    if (queryEmail) {
      email.value = queryEmail;
      isSocialLogin.value = socialLogin; // Set flag for social login
    }
  });

  // Handle registration form submission
  const handleRegister = async () => {
    if (password.value !== retypePassword.value) {
      // eslint-disable-next-line no-alert
      alert('Passwords do not match');
      return;
    }

    const userInfo = {
      email: email.value,
      password: password.value,
    };

    try {
      await doRegister(axios, userInfo, locale.value, isSocialLogin.value);
      // eslint-disable-next-line no-alert
      alert('Registration successful!');
      await navigateTo({ path: localePath('auth-verify-email') });
    } catch (error) {
      console.error('Error during registration:', error);
      // eslint-disable-next-line no-alert
      alert('Error during registration');
    }
  };

  const redirectToLogin = async () => {
    await navigateTo({ path: localePath('auth-login') });
  };
</script>

<style scoped>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
