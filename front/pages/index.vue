<script setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
const value = ref();
</script>

<template>
  <div class="">
    <InputText v-model="value" class="" />
    <Button label="hello" small />
  </div>
</template>
