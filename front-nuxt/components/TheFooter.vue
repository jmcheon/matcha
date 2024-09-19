<template>
  <footer
    class="fixed bottom-0 left-0 w-full bg-pink-500 p-4 h-20 flex justify-center items-center"
  >
    <div class="flex justify-center items-center gap-10">
      <v-btn
        icon="mdi-bell"
        aria-label="Notifications"
        class="dark:bg-gray-500"
        @click="navigateTo({ path: localePath('notifications') })"
      />
      <v-btn
        icon="mdi-magnify"
        aria-label="Find"
        class="dark:bg-gray-500"
        @click="navigateTo({ path: localePath('find') })"
      />
      <v-btn
        icon="mdi-heart"
        aria-label="Swipe"
        class="dark:bg-gray-500"
        @click="navigateTo({ path: localePath('swipe') })"
      />
      <v-btn
        icon="mdi-chat"
        aria-label="Chat"
        class="dark:bg-gray-500"
        @click="navigateTo({ path: localePath('chat') })"
      />
      <v-btn
        icon="mdi-account"
        aria-label="My Profile"
        class="dark:bg-gray-500"
        @click="navigateTo({ path: localePath('profile') })"
      />
    </div>
  </footer>
</template>

<script setup>
  import { navigateTo } from 'nuxt/app';

  const localePath = useLocalePath();
</script>
