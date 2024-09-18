<template>
  <div ref="target" class="relative">
    <!-- Match the circular style with the LoginSelector -->
    <v-btn icon class="dark:bg-gray-500" @click.stop="toggleDropdown">
      <component :is="currentLangFlag" class="h-6 w-6" />
    </v-btn>

    <!-- Dropdown for Dark Mode -->
    <div v-if="colorMode.preference == 'dark'">
      <ul
        v-if="showDropdown"
        class="flex flex-col absolute top-[calc(100%+10px)] left-0 min-w-[100px] rounded-lg p-1 dark:bg-gray-500"
      >
        <!-- Arrow Effect -->
        <div
          class="absolute left-3 -top-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-gray-500"
        ></div>

        <li v-for="option in options" :key="option.value">
          <NuxtLink
            :to="switchLocalePath(option.value)"
            class="flex w-full rounded-lg px-2 py-1 dark:hover:bg-surface-800 dark:text-white"
            @click.stop="() => (showDropdown = false)"
          >
            {{ option.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <!-- Dropdown for Light Mode -->
    <div v-else>
      <ul
        v-if="showDropdown"
        class="flex flex-col absolute top-[calc(100%+10px)] left-0 min-w-[100px] rounded-lg p-1 bg-white"
      >
        <!-- Arrow Effect -->
        <div
          class="absolute left-3 -top-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"
        ></div>

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

  const colorMode = useColorMode();
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
