<script setup>
const route = useRoute()
</script>
<template>
  <main>Post uid: {{ route.query.user }}</main>
</template>
