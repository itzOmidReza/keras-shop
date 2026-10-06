<!-- frontend/app/components/ops/overview/AdminOverviewPendingOrders.vue -->
<script setup lang="ts">
import { ChevronLeft, CheckCircle2 } from '@lucide/vue'
import { toFa, formatToman } from '~/utils/format'
import type { TrackOrderResponse } from '~/types/domain'

defineProps<{
  orders: TrackOrderResponse[]
  totalCount: number
}>()

const emit = defineEmits<{
  advance: [orderNumber: string]
}>()
</script>

<template>
  <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-amber-500" />
        <h2 class="text-sm font-bold text-slate-900">
          سفارش‌های آماده‌سازی و ارسال فوری
        </h2>
      </div>
      <NuxtLink
        to="/internal-ops-nexus/orders"
        class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
      >
        <span>مشاهده همه ({{ toFa(totalCount) }})</span>
        <ChevronLeft class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>

    <div v-if="orders.length === 0" class="p-8 text-center text-slate-400 text-xs">
      هیچ سفارشی در صف آماده‌سازی وجود ندارد.
    </div>

    <div v-else class="space-y-2.5">
      <div
        v-for="order in orders.slice(0, 4)"
        :key="order.orderNumber"
        class="p-3.5 rounded-xl border border-slate-200/70 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
      >
        <div class="space-y-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-xs text-slate-900">{{ order.orderNumber }}</span>
            <span class="text-xs font-bold text-slate-800">• {{ order.recipientName }}</span>
          </div>
          <div class="text-[11px] text-slate-500 truncate">
            {{ order.items.map(i => `${i.title} (${i.size})`).join('، ') }}
          </div>
          <div class="text-[11px] font-mono font-bold text-slate-700">
            {{ formatToman(order.totalAmount) }} تومان
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            class="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            @click="emit('advance', order.orderNumber)"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>تایید و ارسال</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
