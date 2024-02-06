<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <button>{{ props.text }}</button>
</template>
