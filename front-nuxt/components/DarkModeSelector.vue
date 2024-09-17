<template>
  <div>
    <v-btn
      icon="mdi-theme-light-dark"
      aria-label="Toggle Dark Mode"
      class="dark:bg-gray-500"
      @click="toggleDarkMode"
    />
  </div>
</template>

<script setup>
  const colorMode = useColorMode();

  const toggleDarkMode = () => {
    colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
  };
</script>
