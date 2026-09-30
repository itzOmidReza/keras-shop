<script setup lang="ts">
import { Search, ShoppingBag, User } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const links = [
  { to: '/shop', label: 'فروشگاه' },
  { to: '/size-guide', label: 'راهنمای سایز' },
  { to: '/journal', label: 'مجله' },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b bg-paper/90 backdrop-blur">
    <div class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
      <NuxtLink to="/" class="font-display text-xl font-bold">کراس</NuxtLink>

      <nav class="hidden items-center gap-6 md:flex" aria-label="ناوبری اصلی">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="text-sm hover:underline" active-class="font-bold">
          {{ l.label }}
        </NuxtLink>
      </nav>

      <div class="ms-auto flex items-center">
        <Button as-child variant="ghost" size="icon" class="size-11">
          <NuxtLink to="/search" aria-label="جستجو">
            <Search />
          </NuxtLink>
        </Button>
        <Button as-child variant="ghost" size="icon" class="hidden size-11 md:inline-flex">
          <NuxtLink to="/account" aria-label="حساب کاربری">
            <User />
          </NuxtLink>
        </Button>
        <Button as-child variant="ghost" size="icon" class="size-11">
          <NuxtLink to="/cart" aria-label="سبد خرید">
            <ShoppingBag />
          </NuxtLink>
        </Button>
      </div>
    </div>
  </header>
</template>
