import { defineStore } from 'pinia'
import { ref } from 'vue'

export const counterStore = defineStore('counter', () => {
  const state = ref(1)
  const counter = () => {
    state.value++
  }

  return {
    state,
    counter,
  }
})
