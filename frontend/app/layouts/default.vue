<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import MobileNav from '~/components/layout/MobileNav.vue'
import CartDrawer from '~/components/cart/CartDrawer.vue'
import AuthModal from '~/components/auth/AuthModal.vue'

const isMobileNavOpen = ref(false)

useSchemaOrg([
  defineOrganization({
    name: 'کراس',
    alternateName: 'Keras Atelier',
    url: 'https://keras.ir',
    logo: '/logo.svg',
    description: 'آتلیه تخصصی طراحی و تولید پوشاک ورزشی و لایف‌استایل زنانه کراس',
  }),
  defineWebSite({
    name: 'فروشگاه اینترنتی کراس',
    url: 'https://keras.ir',
    description: 'خرید آنلاین انواع لگینگ، تاپ ورزشی، شومیز، شال و پوشاک تخصصی زنانه',
  }),
])
</script>

<template>
  <div class="min-h-screen flex flex-col bg-paper text-ink">
    <AppHeader class="print:hidden" @open-mobile-menu="isMobileNavOpen = true" />

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter class="print:hidden" />

    <MobileNav :is-open="isMobileNavOpen" class="print:hidden" @close="isMobileNavOpen = false" />
    <CartDrawer class="print:hidden" />
    <AuthModal class="print:hidden" />
  </div>
</template>
