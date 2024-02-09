<template>
  <div>
    <ClientOnly>
      <TheNavbar />
      <nav>navbar</nav>
      <slot />
      <footer>footer</footer>
    </ClientOnly>
  </div>
</template>
