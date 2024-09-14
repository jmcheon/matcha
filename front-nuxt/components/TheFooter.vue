<script setup>
  const year = new Date().getFullYear();
</script>

<template>
  <footer class="fixed h-20 bottom-0 left-0 w-full bg-pink-500 p-4 text-center">
    <p>© {{ year }} Matcha. {{ $t('Footer.copyright') }}</p>
  </footer>
</template>
