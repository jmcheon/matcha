<script setup>
  import { onClickOutside } from '@vueuse/core';
  const { t } = useI18n();
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
      navigateTo({ path: localePath('index') });
    }
  };
</script>

<template>
  <div ref="target" class="relative">
    <v-btn
      icon="mdi-account"
      aria-label="User Menu"
      @click.stop="toggleDropdown"
    />
    <ul
      v-if="showDropdown"
      :class="$style.dropdown"
      class="absolute min-w-[80px] top-[calc(100%+10px)] right-0 gap-1 rounded-lg bg-white text-balck p-1 flex flex-col"
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
</template>

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
</style>
