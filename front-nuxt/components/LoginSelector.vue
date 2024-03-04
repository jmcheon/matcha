<script setup>
  const { t } = useI18n();
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
</script>

<template>
  <div>
    <button @click.stop="toggleDropdown">login</button>
    <ul v-if="showDropdown">
      <li
        v-for="option in options"
        :key="option.value"
        class="absolute top-[calc(100%+10px)] right-0 gap-1 bg-white rounded-lg p-1 flex flex-col"
      >
        <div>
          {{ option.name }}
        </div>
      </li>
    </ul>
  </div>
</template>

<!-- <sytle module lang="scss">
.dropdown::before {
  position: absolute;
  right: 15px;
  bottom: 100%;
  display: block;
}
</sytle> -->
