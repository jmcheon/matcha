<script setup>
  const year = new Date().getFullYear();
</script>

<template>
  <footer class="h-[64px] bg-pink-500 p-4 text-center">
    <p>© {{ year }} Matcha. {{ $t('Footer.copyright') }}</p>
  </footer>
</template>
