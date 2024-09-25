<template>
  <div class="flex items-center justify-center h-full dark:bg-black">
    <h1
      class="mt-10 text-center text-3xl font-[800] sm:text-4xl lg:mb-10 dark:text-white"
    >
      {{ $t('AuthVerifyEmail.title') }}
      <p class="text-center text-2xl text-gray-400">
        {{ $t('AuthVerifyEmail.description') }}
      </p>
    </h1>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'auth',
    middleware: ['loose-auth'],
  });
</script>
