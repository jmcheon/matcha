<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center dark:bg-black"
  >
    <p class="mb-4 text-lg dark:text-white">hello world</p>
    <button class="py-2 px-4 rounded dark:text-white" @click="goToRegister">
      Register
    </button>
    <button class="py-2 px-4 rounded dark:text-white" @click="goToLogin">
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
