<script setup lang="ts">
import {
  Clock,
  Package,
  Sparkles,
  MapPin,
  ArrowLeft,
} from '@lucide/vue'
import { toFa, formatToman, formatDate } from '~/utils/format'
import type { UserOrderSummary, UserAddress } from '~/types/domain'

defineProps<{
  activeOrdersCount: number
  ordersCount: number
  recentOrder: UserOrderSummary | null
  defaultAddress: UserAddress | null
}>()

const emit = defineEmits<{
  (e: 'switchTab', tab: 'orders' | 'addresses'): void
  (e: 'openAddressModal'): void
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- کارت‌های معیارهای آماری -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="rounded-2xl border border-sand bg-white p-5 space-y-2 shadow-2xs">
        <span class="text-xs font-medium text-muted-foreground">سفارش‌های در حال پردازش</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-bold font-mono text-ink">{{ toFa(activeOrdersCount) }}</span>
          <Clock class="w-5 h-5 text-rose" />
        </div>
        <p class="text-[11px] text-muted-foreground pt-1 border-t border-sand/40">
          آماده‌سازی در انبار مرکزی
        </p>
      </div>

      <div class="rounded-2xl border border-sand bg-white p-5 space-y-2 shadow-2xs">
        <span class="text-xs font-medium text-muted-foreground">کل سفارش‌های ثبت شده</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-bold font-mono text-ink">{{ toFa(ordersCount) }}</span>
          <Package class="w-5 h-5 text-sage" />
        </div>
        <p class="text-[11px] text-muted-foreground pt-1 border-t border-sand/40">
          سابقه خرید پوشاک کراس
        </p>
      </div>

      <div class="rounded-2xl border border-sand bg-white p-5 space-y-2 shadow-2xs">
        <span class="text-xs font-medium text-muted-foreground">امتیاز باشگاه مشتریان</span>
        <div class="flex items-baseline justify-between">
          <span class="text-2xl font-bold font-mono text-ink">{{ toFa(240) }}</span>
          <Sparkles class="w-5 h-5 text-clay" />
        </div>
        <p class="text-[11px] text-muted-foreground pt-1 border-t border-sand/40">
          سطح آرامش (نقره‌ای)
        </p>
      </div>
    </div>

    <!-- آخرین سفارش کاربر -->
    <div class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-ink flex items-center gap-2">
          <Package class="w-4 h-4 text-rose" />
          <span>آخرین سفارش ثبت‌شده</span>
        </h2>

        <button
          v-if="ordersCount > 0"
          type="button"
          class="text-xs font-bold text-rose hover:underline cursor-pointer"
          @click="emit('switchTab', 'orders')"
        >
          مشاهده تمام سفارش‌ها
        </button>
      </div>

      <div v-if="recentOrder" class="rounded-2xl border border-sand/70 p-4 space-y-3 bg-paper/30">
        <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="font-medium text-muted-foreground">شماره سفارش:</span>
            <span class="font-bold font-mono text-ink">{{ recentOrder.orderNumber }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium text-muted-foreground">تاریخ:</span>
            <span>{{ formatDate(recentOrder.createdAt) }}</span>
          </div>
          <span
            class="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            :class="recentOrder.status === 'delivered' ? 'bg-sage/15 text-sage' : 'bg-rose/10 text-rose'"
          >
            {{ recentOrder.statusLabel }}
          </span>
        </div>

        <!-- بند انگشتی تصاویر اقلام سفارش -->
        <div class="flex items-center gap-3 pt-2">
          <div
            v-for="item in recentOrder.items"
            :key="item.id"
            class="w-14 h-16 rounded-xl overflow-hidden bg-sand/30 border border-sand shrink-0"
          >
            <NuxtImg
              :src="item.image || '/placeholder.jpg'"
              :alt="item.title"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="ms-auto text-end">
            <span class="text-xs font-bold text-ink block">
              {{ formatToman(recentOrder.finalTotal) }}
            </span>
            <NuxtLink
              :to="`/tracking?order=${recentOrder.orderNumber}`"
              class="text-[11px] font-bold text-rose hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>رهگیری مرسوله</span>
              <ArrowLeft class="w-3 h-3" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-xs text-muted-foreground">
        هنوز سفارشی در حساب شما ثبت نشده است.
      </div>
    </div>

    <!-- پیش‌نمایش نشانی پیش‌فرض -->
    <div class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-ink flex items-center gap-2">
          <MapPin class="w-4 h-4 text-rose" />
          <span>نشانی پیش‌فرض تحویل</span>
        </h2>

        <button
          type="button"
          class="text-xs font-bold text-rose hover:underline cursor-pointer"
          @click="emit('switchTab', 'addresses')"
        >
          مدیریت نشانی‌ها
        </button>
      </div>

      <div v-if="defaultAddress" class="rounded-2xl border border-sand/70 p-4 space-y-1.5 text-xs bg-paper/30">
        <div class="flex items-center justify-between font-bold text-ink">
          <span>{{ defaultAddress.title }} - {{ defaultAddress.fullName }}</span>
          <span class="text-[10px] font-mono text-muted-foreground">{{ toFa(defaultAddress.phoneNumber) }}</span>
        </div>
        <p class="text-muted-foreground leading-relaxed">
          {{ defaultAddress.province }}، {{ defaultAddress.city }}، {{ defaultAddress.exactAddress }}
        </p>
      </div>

      <div v-else class="text-center py-6 space-y-2">
        <p class="text-xs text-muted-foreground">نشانی ثبت‌شده‌ای ندارید.</p>
        <button
          type="button"
          class="text-xs font-bold text-rose hover:underline cursor-pointer"
          @click="emit('openAddressModal')"
        >
          افزودن نشانی جدید
        </button>
      </div>
    </div>
  </div>
</template>
