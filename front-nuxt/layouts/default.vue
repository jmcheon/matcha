<!-- layout/default.vue -->
<template>
  <TheNavbar />
  <slot></slot>
  <TheFooter v-if="isLoggedIn" />
</template>

<script setup>
  const { isLoggedIn } = storeToRefs(useUserStore());
</script>
