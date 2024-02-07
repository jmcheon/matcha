<script>
import 'primevue/resources/themes/aura-light-green/theme.css';
</script>
<script setup>
// const onUpdate = t => {}

// const { counter, state } = useAdder()

import { storeToRefs } from 'pinia';
import { counterStore } from '@/stores/counterStore';
const { state } = storeToRefs(counterStore());

// const store = counterStore()
</script>
<template>
  <main>
    <Button @click="counterStore().counter">Click</Button>
    {{ state }}
  </main>
</template>
