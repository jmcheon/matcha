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

<template>
  <div ref="target" class="relative">
    <v-btn rounded @click.stop="toggleDropdown">
      <component :is="currentLangFlag" class="h-6 w-6 fill-primary-400" />
    </v-btn>
    <ul
      v-if="showDropdown"
      :class="$style.dropdown"
      class="absolute flex flex-col top-full min-w-[100px] left-0 bg-white text-black rounded-lg p-1 gap-1"
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
