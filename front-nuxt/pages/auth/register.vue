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
  import { ref } from 'vue'; // Ensure `navigateTo` and `useLocalePath` are imported
  definePageMeta({
    // layout: 'auth',
    middleware: ['non-auth'],
  });
  const email = ref('');
  const password = ref('');
  const retypePassword = ref('');
  const axios = useAxios();
  const localePath = useLocalePath();
  const { doRegister } = useAuth();
  const { locale } = useI18n();

  const redirectToLogin = () => {
    navigateTo({ path: localePath('auth-login') });
  };

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
      // const response = await fetch('http://localhost:3005/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: email.value,
      //     password: password.value,
      //   }),
      // });
      await doRegister(axios, userInfo, locale.value);

      // eslint-disable-next-line no-alert
      alert('Registration successful!');
      await navigateTo({ path: localePath('auth-verify-email') });
      // Redirect to login or handle success further
    } catch (error) {
      console.error('Error during registration:', error);
      // eslint-disable-next-line no-alert
      alert('Error during registration');
    } finally {
      console.log('hi');
    }
  };
</script>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
