<script setup lang="ts">
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
    <LazyCartDrawer class="print:hidden" />
    <LazyAuthModal class="print:hidden" />
  </div>
</template>
