const state = ref(0)

export const useAdder = () => {
  return {
    state,
    counter: () => state.value++,
  }
}
