<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center"
  >
    <p class="mb-4 text-lg">hello world</p>
    <button
      class="text-black py-2 px-4 rounded"
      @click="goToRegister"
    >
      Register
    </button>
    <button class=" text-black py-2 px-4 rounded" @click="goToLogin">
      login
    </button>
  </main>
</template>

<script setup>
  import { navigateTo } from 'nuxt/app';
  const localePath = useLocalePath();

  const goToRegister = () => {
    navigateTo({ path: localePath('auth-register') });
  };

  const goToLogin = () => {
    navigateTo({ path: localePath('auth-login') });
  };
</script>

<style scoped>
  main {
    min-height: 100vh; /* Full screen height */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
