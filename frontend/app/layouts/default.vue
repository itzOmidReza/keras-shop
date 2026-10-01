<script setup lang="ts">
const isMobileNavOpen = ref(false)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-paper text-ink">
    <AppHeader @open-mobile-menu="isMobileNavOpen = true" />

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />

    <MobileNav :is-open="isMobileNavOpen" @close="isMobileNavOpen = false" />
    <CartDrawer />
  </div>
</template>
