<!-- frontend/app/pages/tracking.vue -->
<script setup lang="ts">
import { Clock } from '@lucide/vue'
useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://keras.ir/tracking',
    },
  ],
})

useSeoMeta({
  title: 'پیگیری سفارش و رهگیری مرسولات | کراس',
  description: 'سامانه پیگیری وضعیت سفارش، مشاهده بارکد پستی ۲۴ رقمی و مراحل آماده‌سازی پوشاک ورزشی کراس',
  ogTitle: 'پیگیری سفارش و رهگیری مرسولات | کراس',
  ogDescription: 'سامانه پیگیری وضعیت سفارش، مشاهده بارکد پستی ۲۴ رقمی و مراحل آماده‌سازی پوشاک ورزشی کراس',
  ogLocale: 'fa_IR',
  ogSiteName: 'کراس | Keras',
  twitterCard: 'summary_large_image',
})

const {
  searchQuery,
  isLoading,
  orderData,
  errorMessage,
  hasSearched,
  isCopied,
  handleSearch,
  clearSearch,
  applyPill,
  copyTrackingCode,
} = useOrderTracking()
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20">
    <!-- بخش معرفی و هیرو و فرم جستجو -->
    <TrackingHeroSearch
      v-model:search-query="searchQuery"
      :is-loading="isLoading"
      @search="handleSearch"
      @clear="clearSearch"
      @apply-pill="applyPill"
    />

    <!-- بخش نتایج جستجو -->
    <main class="container mx-auto px-4 max-w-4xl py-12">
      <!-- حالت‌های خالی، در حال بارگذاری یا خطای جستجو -->
      <TrackingEmptyStates
        v-if="isLoading || errorMessage || !orderData"
        :is-loading="isLoading"
        :error-message="errorMessage"
        :has-searched="hasSearched"
      />

      <!-- نمایش اطلاعات سفارش یافته شده -->
      <div v-else class="space-y-8">
        <!-- کارت خلاصه و وضعیت کلی -->
        <TrackingOrderSummaryCard :order-data="orderData" />

        <!-- کارت تایم‌لاین مراحل ارسال -->
        <div class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
          <div class="flex items-center justify-between border-b border-sand/60 pb-4">
            <h3 class="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
              <Clock class="w-4 h-4 text-rose" />
              <span>مراحل آماده‌سازی و ارسال مرسوله</span>
            </h3>
            <span class="text-2xs text-muted-foreground">به‌روزرسانی خودکار</span>
          </div>

          <TrackingTimeline
            :timeline="orderData.timeline"
            :current-status="orderData.status"
          />
        </div>

        <!-- کارت بارکد رهگیری پستی و مشخصات تحویل -->
        <TrackingBarcodeCard
          :order-data="orderData"
          :is-copied="isCopied"
          @copy-tracking-code="copyTrackingCode"
        />

        <!-- کارت لیست اقلام خریداری‌شده در این سفارش و پشتیبانی -->
        <TrackingItemsList :items="orderData.items" />
      </div>
    </main>
  </div>
</template>
