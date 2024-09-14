<template>
  <div ref="target" class="relative">
    <v-btn
      v-if="!isLoggedIn"
      icon="mdi-login"
      aria-label="User Login"
      @click.stop="toggleDropdown"
    />
    <ul
      v-if="showDropdown"
      :class="$style.dropdown"
      class="absolute min-w-[80px] top-[calc(100%+10px)] right-0 gap-1 rounded-lg bg-white text-balck p-1 flex flex-col"
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
</style>
