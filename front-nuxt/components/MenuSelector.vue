<template>
  <div ref="target" class="relative">
    <v-btn
      icon="mdi-cog"
      aria-label="User Menu"
      class="dark:bg-gray-500"
      @click.stop="toggleDropdown"
    />

    <!-- Dropdown for Dark Mode -->
    <div v-if="colorMode.preference === 'dark'">
      <ul
        v-if="showDropdown"
        class="flex flex-col absolute top-[calc(100%+10px)] right-0 min-w-[80px] gap-1 p-1 rounded-lg bg-gray-500 text-white"
      >
        <!-- Arrow Effect -->
        <div
          class="absolute right-3 -top-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-gray-500"
        ></div>

        <li
          v-for="option in options"
          :key="option.value"
          @click="handleAction(option.value)"
        >
          <div
            class="flex w-full rounded-lg px-2 py-1 hover:bg-surface-800 text-white"
          >
            {{ option.name }}
          </div>
        </li>
      </ul>
    </div>

    <!-- Dropdown for Light Mode -->
    <div v-else>
      <ul
        v-if="showDropdown"
        class="flex flex-col absolute top-[calc(100%+10px)] right-0 min-w-[80px] gap-1 p-1 rounded-lg bg-white text-black"
      >
        <!-- Arrow Effect -->
        <div
          class="absolute right-3 -top-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"
        ></div>

        <li
          v-for="option in options"
          :key="option.value"
          @click="handleAction(option.value)"
        >
          <div class="flex w-full rounded-lg px-2 py-1 hover:bg-surface-200">
            {{ option.name }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { onClickOutside } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const localePath = useLocalePath();

  const options = computed(() => [
    { name: t('Navbar.MenuSelector.chat'), value: 'menu-chat' },
    { name: t('Navbar.MenuSelector.noti'), value: 'menu-noti' },
    { name: t('Navbar.MenuSelector.profile'), value: 'menu-profile' },
    { name: t('Navbar.MenuSelector.logout'), value: 'menu-logout' },
  ]);

  const colorMode = useColorMode();
  const showDropdown = ref(false);

  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };

  const target = ref(null);
  onClickOutside(target, () => {
    showDropdown.value = false;
  });

  const axios = useAxios();
  const { doLogout } = useAuth();

  const handleAction = async (value) => {
    if (value === 'menu-logout') {
      await doLogout(axios);
      await navigateTo({ path: localePath('index') });
    }
  };
</script>
