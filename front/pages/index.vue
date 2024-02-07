<script setup>
// const onUpdate = t => {}

// const { counter, state } = useAdder()

import { storeToRefs } from 'pinia'
import { counterStore } from '@/stores/counterStore'

const { state } = storeToRefs(counterStore())
// const store = counterStore()
</script>
<template>
  <main>
    <button @click="counterStore().counter">Click</button>
    {{ state }}
  </main>
</template>
