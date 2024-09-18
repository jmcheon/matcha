<template>
  <div ref="target" class="relative">
    <v-btn
      icon="mdi-cog"
      aria-label="User Menu"
      class="dark:bg-gray-500"
      @click.stop="toggleDropdown"
    />
    <div v-if="colorMode.preference == 'dark'">
      <ul
        v-if="showDropdown"
        :class="$style['dark-dropdown']"
        class="flex flex-col absolute top-[calc(100%+10px)] right-0 min-w-[80px] gap-1 p-1 rounded-lg dark:bg-gray-500"
      >
        <li
          v-for="option in options"
          :key="option.value"
          @click="handleAction(option.value)"
        >
          <div
            class="flex w-full rounded-lg px-2 py-1 dark:hover:bg-surface-800 dark:text-white"
          >
            {{ option.name }}
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <ul
        v-if="showDropdown"
        :class="$style.dropdown"
        class="flex flex-col absolute top-[calc(100%+10px)] right-0 min-w-[80px] gap-1 p-1 rounded-lg bg-white text-balck"
      >
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
  import { onClickOutside } from '@vueuse/core';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const localePath = useLocalePath();
  const options = computed(() => [
    {
      name: t('Navbar.MenuSelector.chat'),
      value: 'menu-chat',
    },
    {
      name: t('Navbar.MenuSelector.noti'),
      value: 'menu-noti',
    },
    {
      name: t('Navbar.MenuSelector.profile'),
      value: 'menu-profile',
    },
    {
      name: t('Navbar.MenuSelector.logout'),
      value: 'menu-logout',
    },
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

  // Handle logout functionality
  const handleAction = async (value) => {
    if (value === 'menu-logout') {
      await doLogout(axios);
      // Add your actual logout logic here
      await navigateTo({ path: localePath('index') });
    }
  };
</script>

<style module>
  .dropdown::before {
    position: absolute;
    right: 15px;
    bottom: 100%;
    display: block;
    width: 0;
    height: 0;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
    border-top: 10px solid transparent;
    content: '';
  }

  .dark-dropdown::before {
    position: absolute;
    right: 15px;
    bottom: 100%;
    display: block;
    width: 0;
    height: 0;
    border-right: 10px solid transparent;
    border-bottom: 10px solid gray;
    border-top: 10px solid transparent;
    content: '';
  }
</style>
