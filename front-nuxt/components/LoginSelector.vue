<template>
  <div ref="target" class="relative">
    <v-btn
      v-if="!isLoggedIn"
      icon="mdi-login"
      class="dark:bg-gray-500"
      aria-label="User Login"
      @click.stop="toggleDropdown"
    />
    <div v-if="colorMode.preference == 'dark'">
      <ul
        v-if="showDropdown"
        :class="$style['dark-dropdown']"
        class="flex flex-col absolute top-[calc(100%+10px)] right-0 min-w-[80px] p-1 rounded-lg dark:bg-gray-500"
      >
        <li v-for="option in options" :key="option.value">
          <div
            class="flex w-full rounded-lg px-2 py-1 dark:hover:bg-surface-800 dark:text-white"
            @click="navigateTo({ path: localePath(option.value) })"
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
        class="flex flex-col absolute top-[calc(100%+10px)] right-0 min-w-[80px] p-1 rounded-lg bg-white"
      >
        <li v-for="option in options" :key="option.value">
          <div
            class="flex w-full rounded-lg px-2 py-1 hover:bg-surface-200"
            @click="navigateTo({ path: localePath(option.value) })"
          >
            {{ option.name }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { navigateTo } from 'nuxt/app';

  const localePath = useLocalePath();
  const { t } = useI18n();
  const { isLoggedIn } = storeToRefs(useUserStore());
  const options = computed(() => [
    {
      name: t('Navbar.LoginSelector.login'),
      value: 'auth-login',
    },
    {
      name: t('Navbar.LoginSelector.register'),
      value: 'auth-register',
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
