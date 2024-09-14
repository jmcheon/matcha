<!-- layout/default.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <TheNavbar />
    <div class="flex-grow">
      <slot></slot>
    </div>
    <TheFooter v-if="isLoggedIn" />
  </div>
</template>

<script setup>
  const { isLoggedIn } = storeToRefs(useUserStore());
</script>
