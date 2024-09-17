<script setup>
  definePageMeta({
    layout: 'auth',
    middleware: ['loose-auth'],
  });
</script>

<template>
  <div class="flex items-center justify-center h-full dark:bg-black">
    <!-- <h1 class="mt-10 text-center text-3xl font-[800] sm:text-4xl lg:mb-10">
      {{ $t('AuthVerifyEmail.title') }}
    </h1>
    <p class="text-center text-2xl text-gray-400">
      {{ $t('AuthVerifyEmail.description') }}
    </p> -->
    <p class="text-lg text-center dark:text-white">email verification page</p>
  </div>
</template>
