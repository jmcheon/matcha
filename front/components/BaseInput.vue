<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue', 'update:text'])
const onUpdate = e => {
  emit('update:modelValue', e.target.value)
}
const state = ref()
const onUpdateText = t => {}
</script>
<template>
  <div>
    <input :value="modelValue" @input="onUpdate" />

    {{ modelValue }}
  </div>
</template>
