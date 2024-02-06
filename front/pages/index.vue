<script setup>
// const onUpdate = t => {}

// const { counter, state } = useAdder()

import { counterStore } from '@/stores/counterStore'
import { storeToRefs } from 'pinia'

const { state } = storeToRefs(counterStore())
const store = counterStore()
</script>
<template>
  <main>
    <button @click="counterStore().counter">Click</button>
    {{ state }}
  </main>
</template>
