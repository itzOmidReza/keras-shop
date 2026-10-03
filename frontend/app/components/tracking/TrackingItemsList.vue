<script setup lang="ts">
import { toFa, formatToman } from '~/utils/format'
import type { TrackOrderResponse } from '~/types/domain'

defineProps<{
  items: TrackOrderResponse['items']
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- کارت لیست اقلام خریداری‌شده در این سفارش -->
    <div class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-4 shadow-2xs">
      <h3 class="text-sm sm:text-base font-bold text-ink pb-2 border-b border-sand/60">
        اقلام موجود در این مرسوله
      </h3>

      <div class="divide-y divide-sand/40">
        <div
          v-for="(item, idx) in items"
          :key="item.title + item.size + idx"
          class="py-4 first:pt-2 last:pb-0 flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-4">
            <div class="w-14 h-18 rounded-xl overflow-hidden bg-sand/30 shrink-0 border border-sand/50">
              <NuxtImg
                :src="item.image || '/placeholder.jpg'"
                :alt="item.title"
                class="w-full h-full object-cover"
              />
            </div>

            <div class="space-y-1">
              <h4 class="text-xs sm:text-sm font-bold text-ink">
                {{ item.title }}
              </h4>
              <div class="flex items-center gap-2 text-2xs text-muted-foreground">
                <span>سایز: {{ item.size }}</span>
                <span v-if="item.color">| رنگ: {{ item.color }}</span>
                <span>| تعداد: {{ toFa(item.quantity) }}</span>
              </div>
            </div>
          </div>

          <div class="text-end text-xs font-bold text-ink shrink-0 font-mono">
            {{ formatToman(item.price * item.quantity) }}
          </div>
        </div>
      </div>
    </div>

    <!-- بنر پشتیبانی و همراهی -->
    <div class="rounded-3xl border border-sand/70 bg-sand/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
      <div class="space-y-1">
        <h4 class="text-sm font-bold text-ink">
          نیاز به راهنمایی بیشتر در خصوص ارسال این سفارش دارید؟
        </h4>
        <p class="text-xs text-muted-foreground">
          تیم کانسیرژ کراس در تمام ساعات کاری آماده پاسخگویی و پیگیری امور لجستیک شماست.
        </p>
      </div>

      <NuxtLink
        to="/contact?subject=order"
        class="px-6 py-2.5 rounded-full bg-ink text-sand hover:bg-ink/90 text-xs font-bold transition-colors shrink-0"
      >
        گفت‌وگو با پشتیبانی
      </NuxtLink>
    </div>
  </div>
</template>
