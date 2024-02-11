<template>
  <div class="flex flex-col min-h-screen">
    <header>
      <div class="flex flex-col items-center justify-center">
        <img class="w-3" src="public/logo.png" alt="Logo" />
      </div>
    </header>
    <slot class="flex-grow" />
    <footer class="mt-auto h-1/5">
      <ClientOnly>
        <TheNavbar />
      </ClientOnly>
    </footer>
  </div>
</template>
