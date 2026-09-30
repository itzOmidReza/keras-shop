<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <div class="flex-1 pb-20 md:pb-0">
      <slot />
    </div>
    <AppFooter />
    <MobileNav />
  </div>
</template>
