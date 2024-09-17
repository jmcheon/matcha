<template>
  <div ref="target" class="relative">
    <!-- Match the circular style with the LoginSelector -->
    <v-btn icon class="dark:bg-gray-500" @click.stop="toggleDropdown">
      <component :is="currentLangFlag" class="h-6 w-6" />
    </v-btn>

    <ul
      v-if="showDropdown"
      :class="$style.dropdown"
      class="flex flex-col absolute top-[calc(100%+10px)] left-0 min-w-[100px] rounded-lg p-1 bg-white dark:bg-gray-300"
    >
      <li v-for="option in options" :key="option.value">
        <NuxtLink
          :to="switchLocalePath(option.value)"
          class="flex w-full rounded-lg px-2 py-1 hover:bg-surface-200"
          @click.stop="() => (showDropdown = false)"
        >
          {{ option.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { onClickOutside } from '@vueuse/core';
  import EnFlag from '~/assets/icons/en.svg';
  import FrFlag from '~/assets/icons/fr.svg';

  const switchLocalePath = useSwitchLocalePath();
  const { locale } = useI18n();
  const options = [
    { name: 'English', value: 'en' },
    { name: 'Français', value: 'fr' },
  ];

  const showDropdown = ref(false);
  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };
  const currentLangFlag = computed(() => {
    return locale.value === 'fr' ? FrFlag : EnFlag;
  });

  const target = ref(null);
  onClickOutside(target, () => {
    showDropdown.value = false;
  });
</script>

<style module>
  .dropdown::before {
    position: absolute;
    bottom: 100%;
    left: 15px;
    display: block;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-bottom: 10px solid white;
    border-right: 10px solid transparent;
    content: '';
  }
</style>
