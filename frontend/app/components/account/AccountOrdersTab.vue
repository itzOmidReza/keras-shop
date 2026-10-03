<script setup lang="ts">
import { ShoppingBag } from '@lucide/vue'
import { toFa, formatToman, formatDate } from '~/utils/format'
import type { UserOrderSummary } from '~/types/domain'

defineProps<{
  orders: UserOrderSummary[]
}>()
</script>

<template>
  <div class="space-y-4">
    <div v-if="orders.length > 0" class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.orderNumber"
        class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sand/60">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-ink">کد سفارش:</span>
              <span class="text-xs font-mono font-bold text-rose">{{ order.orderNumber }}</span>
            </div>
            <p class="text-[11px] text-muted-foreground">
              ثبت شده در {{ formatDate(order.createdAt) }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <span
              class="rounded-full px-3 py-1 text-xs font-bold"
              :class="order.status === 'delivered' ? 'bg-sage/15 text-sage' : 'bg-rose/10 text-rose'"
            >
              {{ order.statusLabel }}
            </span>

            <NuxtLink
              :to="`/tracking?order=${order.orderNumber}`"
              class="rounded-xl border border-sand px-3 py-1.5 text-xs font-bold text-ink hover:border-rose hover:text-rose transition-colors"
            >
              پیگیری مرسوله
            </NuxtLink>
          </div>
        </div>

        <!-- اقلام سفارش -->
        <div class="space-y-3">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center gap-4 py-2 border-b border-sand/30 last:border-none"
          >
            <div class="w-14 h-18 rounded-xl overflow-hidden bg-sand/30 shrink-0">
              <NuxtImg
                :src="item.image || '/placeholder.jpg'"
                :alt="item.title"
                class="w-full h-full object-cover"
              />
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-xs sm:text-sm font-bold text-ink truncate">{{ item.title }}</h3>
              <div class="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                <span>سایز: {{ item.size }}</span>
                <span>|</span>
                <span>تعداد: {{ toFa(item.quantity) }} عدد</span>
              </div>
            </div>

            <div class="text-end">
              <span class="text-xs font-bold text-ink block">{{ formatToman(item.price * item.quantity) }}</span>
            </div>
          </div>
        </div>

        <!-- خلاصه مالی سفارش -->
        <div class="pt-3 border-t border-sand/60 flex items-center justify-between text-xs font-bold">
          <span class="text-muted-foreground">مبلغ کل پرداخت شده:</span>
          <span class="text-sm font-bold text-ink">{{ formatToman(order.finalTotal) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="rounded-3xl border border-sand bg-white p-12 text-center space-y-4">
      <ShoppingBag class="w-12 h-12 text-sand mx-auto" />
      <h3 class="text-sm font-bold text-ink">سفارشی ثبت نشده است</h3>
      <p class="text-xs text-muted-foreground">محصولات مورد علاقه خود را انتخاب کنید و اولین سفارش خود را ثبت نمایید.</p>
      <NuxtLink
        to="/shop"
        class="inline-flex items-center gap-2 rounded-xl bg-rose px-6 py-2.5 text-xs font-bold text-white hover:bg-rose/90 transition-colors"
      >
        مشاهده کاتالوگ فروشگاه
      </NuxtLink>
    </div>
  </div>
</template>
