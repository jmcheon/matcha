<template>
  <div class="flex flex-col min-h-screen items-center justify-center">
    <header>
      <img class="h-1px" src="public/logo.png" alt="Logo" />
    </header>
    <slot class="flex-grow" />
    <footer class="mt-auto h-1/5">
      <ClientOnly>
        <TheNavbar />
      </ClientOnly>
    </footer>
  </div>
</template>
