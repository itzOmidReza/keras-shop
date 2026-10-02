<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import MobileNav from '~/components/layout/MobileNav.vue'
import CartDrawer from '~/components/cart/CartDrawer.vue'
import AuthModal from '~/components/auth/AuthModal.vue'

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
    <AuthModal />
  </div>
</template>
