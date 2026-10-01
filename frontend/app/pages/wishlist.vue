<!-- frontend/app/pages/wishlist.vue -->
<script setup lang="ts">
import { Heart, Sparkles, ArrowLeft } from '@lucide/vue'

useSeoMeta({
  title: 'علاقه‌مندی‌ها | کراس',
  description: 'لیست محصولات برگزیده و نشان‌شده شما در برند پوشاک ورزشی کراس',
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-16 max-w-4xl">
    <!-- هدر صفحه -->
    <div class="mb-8 border-b border-sand pb-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight flex items-center gap-2">
          <Heart class="w-6 h-6 text-rose" />
          <span>لیست علاقه‌مندی‌ها</span>
        </h1>
        <p class="text-xs sm:text-sm text-muted-foreground mt-1">
          محصولات برگزیده و نشان‌شده شما جهت دسترسی سریع و خرید در آینده
        </p>
      </div>

      <NuxtLink
        to="/shop"
        class="hidden sm:flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-rose transition-colors"
      >
        <span>مشاهده فروشگاه</span>
        <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
      </NuxtLink>
    </div>

    <!-- وضعیت خالی بودن علاقه‌مندی‌ها -->
    <div class="max-w-md mx-auto rounded-3xl border border-sand bg-white p-8 sm:p-12 text-center space-y-6 shadow-xs my-8">
      <div class="w-20 h-20 rounded-2xl bg-sand/40 mx-auto flex items-center justify-center text-rose">
        <Heart class="w-10 h-10 stroke-1" />
      </div>

      <div class="space-y-2">
        <h2 class="text-xl font-bold text-ink">
          لیست علاقه‌مندی‌های شما خالی است
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          می‌توانید با انتخاب آیکون قلب روی هر محصول در کاتالوگ یا صفحه جزئیات، آن را به لیست برگزیده‌های خود اضافه کنید.
        </p>
      </div>

      <div class="pt-2">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center justify-center gap-2 bg-rose hover:bg-rose/90 text-white font-bold text-xs h-12 px-8 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Sparkles class="w-4 h-4" />
          <span>کاوش در محصولات کراس</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
