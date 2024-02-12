<script setup lang="ts">
definePageMeta({
  layout: 'login',
});
const email = ref('');
const password = ref('');
</script>

<template>
  <div class="flex flex-col items-center space-y-6">
    <div class="mt-40" />
    <div>
      <NuxtImg width="500" height="175" src="/logo.png" />
      <img width="32" height="32" src="/favicon.ico" />
    </div>
    <div class="flex flex-row pb-2">
      <div class="flex flex-col pr-2">
        <InputText v-model="email" type="text" size="small" placeholder="Email" class="mb-auto" />
        <InputText v-model="password" type="text" size="small" placeholder="Password" />
      </div>
      <Button>Login</Button>
    </div>
    <div class="flex flex-row text-center space-x-2">
      <div><NuxtLink to="/createAccount" /> Create Account</div>
      <!-- <p class="text-center">Forgot password?</p> -->
    </div>
    <div class="flex flex-col">
      <div>
        <p class="text-center pb-5" />
        social login
      </div>
      <div class="flex flex-row space-x-4">
        <Button>a</Button>
        <Button>b</Button>
        <Button>c</Button>
      </div>
    </div>
  </div>
</template>
