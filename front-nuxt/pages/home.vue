<!-- Your Page Component -->
<template>
  <div class="flex items-center justify-center h-full dark:bg-black">
    <p class="text-lg text-center dark:text-white">
      the difference in between index and home is index is before logging in and
      home is after logging in
    </p>
  </div>
</template>

<script setup>
  definePageMeta({
    // layout: 'auth',
    middleware: ['strict-auth'],
  });
</script>
