<script setup>
  import { useUserStore } from '@/stores/account.store';

  const { isLoggedIn } = storeToRefs(useUserStore());
  const localePath = useLocalePath();
</script>

<template>
  <nav
    class="fixed top-0 z-[999] h-[112px] w-full bg-gradient-to-b from-pink-500 to-transparent"
  >
    <div class="mx-auto flex max-w-[1280px] items-center justify-between p-4">
      <!-- Logo on the left -->
      <div class="flex items-center px-3 py-3">
        <NuxtLink @click="navigateTo({ path: localePath('index') })">
          <img
            src="/matcha-logo.png"
            alt="Matcha Logo"
            class="h-12 w-auto cursor-pointer"
          />
        </NuxtLink>
      </div>

      <!-- Right side icons and selectors with uniform larger spacing -->
      <div class="ml-auto flex items-center space-x-10 px-3">
        <LanguageSelector class="mr-4" />
        <DarkModeSelector class="mr-4" />
        <MenuSelector v-if="isLoggedIn" />
        <LoginSelector v-else />
      </div>
    </div>
  </nav>
</template>
