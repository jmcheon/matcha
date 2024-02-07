<script setup>
const route = useRoute();
</script>
<template>
  <main>{{ route.params.uid }}</main>
</template>
