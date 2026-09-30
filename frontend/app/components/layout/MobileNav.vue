<script setup lang="ts">
import { House, Store, ShoppingBag, User } from '@lucide/vue'

const items = [
  { to: '/', label: 'خانه', icon: House },
  { to: '/shop', label: 'فروشگاه', icon: Store },
  { to: '/cart', label: 'سبد', icon: ShoppingBag },
  { to: '/account', label: 'حساب', icon: User },
]
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-40 border-t bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
    aria-label="ناوبری موبایل">
    <ul class="grid grid-cols-4">
      <li v-for="item in items" :key="item.to">
        <NuxtLink :to="item.to"
          class="text-muted-foreground flex h-14 flex-col items-center justify-center gap-1 text-xs"
          exact-active-class="text-ink font-bold">
          <component :is="item.icon" class="size-5" aria-hidden="true" />
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
