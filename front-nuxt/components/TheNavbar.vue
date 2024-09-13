<script setup>
  import { useUserStore } from '@/stores/account.store';

  const { isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <nav
    class="fixed top-0 z-[999] h-[112px] w-full bg-gradient-to-b from-pink-500 to-transparent"
  >
    <div class="mx-auto flex max-w-[1280px] justify-between p-4">
      <div>
        <LanguageSelector />
        <DarkModeSelector />
      </div>
      <div class="absolute left-[50%] translate-x-1/2">Logo</div>

      <div>
        <MenuSelector v-if="isLoggedIn" />
        <LoginSelector v-else />
      </div>
    </div>
  </nav>
</template>
