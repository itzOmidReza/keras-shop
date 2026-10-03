<script setup lang="ts">
import { Truck, Clock, Sparkles } from '@lucide/vue'
import { formatDate, formatToman } from '~/utils/format'
import type { TrackOrderResponse } from '~/types/domain'

defineProps<{
  orderData: TrackOrderResponse
}>()
</script>

<template>
  <div class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-sand/60 pb-6">
      <div class="space-y-1">
        <div class="flex items-center gap-3">
          <span class="text-xs text-muted-foreground font-medium">کد سفارش:</span>
          <span class="text-base sm:text-lg font-bold font-mono text-rose">{{ orderData.orderNumber }}</span>
        </div>
        <p class="text-xs text-muted-foreground">
          ثبت سفارش: {{ formatDate(orderData.createdAt) }}
        </p>
      </div>

      <!-- وضعیت سفارش -->
      <div class="flex items-center gap-3">
        <span
          class="px-3.5 py-1 rounded-full text-xs font-bold"
          :class="[
            orderData.status === 'delivered' ? 'bg-sage/15 text-sage border border-sage/30' :
            orderData.status === 'handed_over' ? 'bg-rose/10 text-rose border border-rose/30' :
            orderData.status === 'processing' ? 'bg-clay/15 text-clay border border-clay/30' :
            'bg-sand/60 text-ink border border-sand'
          ]"
        >
          {{ orderData.statusLabel }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div class="p-4 rounded-2xl bg-paper/60 border border-sand/50 space-y-1">
        <span class="text-muted-foreground flex items-center gap-1.5">
          <Truck class="w-3.5 h-3.5 text-rose" />
          <span>ناوگان ارسال</span>
        </span>
        <span class="font-bold text-ink block pt-0.5">{{ orderData.carrier }}</span>
      </div>

      <div class="p-4 rounded-2xl bg-paper/60 border border-sand/50 space-y-1">
        <span class="text-muted-foreground flex items-center gap-1.5">
          <Clock class="w-3.5 h-3.5 text-rose" />
          <span>پیش‌بینی تحویل</span>
        </span>
        <span class="font-bold text-ink block pt-0.5">{{ orderData.estimatedDelivery }}</span>
      </div>

      <div class="p-4 rounded-2xl bg-paper/60 border border-sand/50 space-y-1">
        <span class="text-muted-foreground flex items-center gap-1.5">
          <Sparkles class="w-3.5 h-3.5 text-rose" />
          <span>مبلغ کل سفارش</span>
        </span>
        <span class="font-bold text-ink block pt-0.5">{{ formatToman(orderData.totalAmount) }}</span>
      </div>
    </div>
  </div>
</template>
