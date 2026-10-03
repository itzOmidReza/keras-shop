<script setup lang="ts">
import { AlertCircle, ArrowLeft, PackageSearch } from '@lucide/vue'

defineProps<{
  isLoading: boolean
  errorMessage: string
  hasSearched: boolean
}>()
</script>

<template>
  <div>
    <!-- حالت در حال بارگذاری -->
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="h-28 bg-white rounded-3xl border border-sand/70 p-6" />
      <div class="h-44 bg-white rounded-3xl border border-sand/70 p-6" />
      <div class="h-56 bg-white rounded-3xl border border-sand/70 p-6" />
    </div>

    <!-- وضعیت خطا یا عدم یافتن سفارش -->
    <div
      v-else-if="errorMessage"
      class="rounded-3xl border border-rose/30 bg-white p-8 sm:p-10 text-center space-y-4 shadow-2xs"
    >
      <div class="w-14 h-14 rounded-2xl bg-rose/10 text-rose mx-auto flex items-center justify-center">
        <AlertCircle class="w-7 h-7" />
      </div>

      <div class="space-y-2">
        <h3 class="text-base sm:text-lg font-bold text-ink">
          نتیجه‌ای یافت نشد
        </h3>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          {{ errorMessage }}
        </p>
      </div>

      <div class="pt-2">
        <NuxtLink
          to="/contact?subject=order"
          class="inline-flex items-center gap-2 text-xs font-bold text-rose hover:underline"
        >
          <span>ارتباط با کانسیرژ برای بررسی سفارش</span>
          <ArrowLeft class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>

    <!-- وضعیت پیش از اولین جستجو -->
    <div
      v-else-if="!hasSearched"
      class="rounded-3xl border border-sand bg-white p-12 text-center space-y-4 shadow-2xs"
    >
      <div class="w-16 h-16 rounded-2xl bg-sand/30 text-rose mx-auto flex items-center justify-center">
        <PackageSearch class="w-8 h-8" />
      </div>
      <h3 class="text-base font-bold text-ink">
        سفارش خود را جستجو کنید
      </h3>
      <p class="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
        با وارد کردن شماره سفارش یا شماره تلفن همراه، اطلاعات کامل بارکد پستی و موقعیت مکانی مرسوله نمایش داده خواهد شد.
      </p>
    </div>
  </div>
</template>
