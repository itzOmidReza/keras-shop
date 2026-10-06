<!-- frontend/app/components/account/AccountOverviewTab.vue -->
<script setup lang="ts">
import {
  Clock,
  Package,
  MapPin,
  ArrowLeft,
  FileText,
  ShoppingBag,
} from '@lucide/vue'
import { toFa, formatToman, formatDate } from '~/utils/format'
import type { UserOrderSummary, UserAddress, User } from '~/types/domain'

defineProps<{
  user?: User | null
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
    <!-- سلام و پیام خوش‌آمدگویی ادیتوریال -->
    <div class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-1">
      <h2 class="text-base font-bold text-ink">
        خوش آمدید، {{ user?.fullName || 'همراه گرامی آتلیه' }}
      </h2>
      <p class="text-xs text-muted-foreground leading-relaxed">
        به پورتال مشتریان آتلیه کراس خوش آمدید. خلاصه سفارش‌ها و نشانی‌های تحویل شما در این بخش قابل مدیریت است.
        <span v-if="user?.createdAt" class="ms-1 font-mono text-muted-foreground/80">
          (عضویت از {{ formatDate(user.createdAt) }})
        </span>
      </p>
    </div>

    <!-- کارت‌های معیارهای آماری (دقیقاً ۲ کارت بدون امتیازات ساختگی) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="rounded-3xl border border-sand bg-white p-6 space-y-3 shadow-2xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-muted-foreground">سفارش‌های در حال پردازش</span>
          <div class="w-9 h-9 rounded-xl bg-rose/10 flex items-center justify-center text-rose">
            <Clock class="w-4.5 h-4.5" />
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold font-mono text-ink">{{ toFa(activeOrdersCount) }}</span>
          <span class="text-xs text-muted-foreground font-medium">مرسوله فعال</span>
        </div>
        <p class="text-[11px] text-muted-foreground pt-2 border-t border-sand/50">
          در فرآیند آماده‌سازی، بسته‌بندی و تحویل به پست
        </p>
      </div>

      <div class="rounded-3xl border border-sand bg-white p-6 space-y-3 shadow-2xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-muted-foreground">کل خریدهای ثبت‌شده</span>
          <div class="w-9 h-9 rounded-xl bg-sage/15 flex items-center justify-center text-sage">
            <Package class="w-4.5 h-4.5" />
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold font-mono text-ink">{{ toFa(ordersCount) }}</span>
          <span class="text-xs text-muted-foreground font-medium">سفارش تکمیل‌شده</span>
        </div>
        <p class="text-[11px] text-muted-foreground pt-2 border-t border-sand/50">
          مجموع کل خریدهای ثبت‌شده از آتلیه طراحی کراس
        </p>
      </div>
    </div>

    <!-- آخرین سفارش کاربر (Spotlight) -->
    <div class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-ink flex items-center gap-2">
          <Package class="w-4 h-4 text-rose" />
          <span>آخرین سفارش ثبت‌شده</span>
        </h3>

        <button
          v-if="ordersCount > 0"
          type="button"
          class="text-xs font-bold text-rose hover:underline cursor-pointer"
          @click="emit('switchTab', 'orders')"
        >
          مشاهده تمام سفارش‌ها
        </button>
      </div>

      <div v-if="recentOrder" class="rounded-2xl border border-sand/70 p-4 space-y-3 bg-paper/40">
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

        <!-- بند انگشتی تصاویر اقلام سفارش و اکشن‌های دوگانه -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-sand/60">
          <div class="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0">
            <div
              v-for="item in recentOrder.items"
              :key="item.id"
              class="w-13 h-16 rounded-xl overflow-hidden bg-sand/30 border border-sand shrink-0 shadow-2xs"
            >
              <NuxtImg
                :src="item.image || '/placeholder.jpg'"
                :alt="item.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="ps-2">
              <span class="text-xs font-bold text-ink block font-mono">
                {{ formatToman(recentOrder.finalTotal) }} تومان
              </span>
              <span class="text-[11px] text-muted-foreground block">
                {{ recentOrder.items.length }} قلم کالا
              </span>
            </div>
          </div>

          <!-- دو اکشن خرد: پیگیری مرسوله و مشاهده فاکتور -->
          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink
              :to="`/checkout/success?order=${recentOrder.orderNumber}`"
              class="h-9 px-3.5 rounded-xl border border-sand bg-white hover:bg-sand/30 text-ink text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileText class="w-3.5 h-3.5 text-muted-foreground" />
              <span>مشاهده فاکتور</span>
            </NuxtLink>

            <NuxtLink
              :to="`/tracking?order=${recentOrder.orderNumber}`"
              class="h-9 px-3.5 rounded-xl bg-ink hover:bg-ink/90 text-paper text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>پیگیری مرسوله</span>
              <ArrowLeft class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 space-y-3 text-muted-foreground">
        <div class="w-12 h-12 rounded-2xl bg-sand/40 mx-auto flex items-center justify-center text-muted-foreground">
          <ShoppingBag class="w-6 h-6 stroke-1" />
        </div>
        <p class="text-xs">هنوز سفارشی در حساب شما ثبت نشده است.</p>
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-rose hover:underline"
        >
          <span>مشاهده کاتالوگ و خرید اول</span>
          <ArrowLeft class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>

    <!-- پیش‌نمایش نشانی پیش‌فرض -->
    <div class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-ink flex items-center gap-2">
          <MapPin class="w-4 h-4 text-rose" />
          <span>نشانی پیش‌فرض تحویل مرسوله</span>
        </h3>

        <button
          type="button"
          class="text-xs font-bold text-rose hover:underline cursor-pointer"
          @click="emit('switchTab', 'addresses')"
        >
          {{ defaultAddress ? 'ویرایش نشانی' : 'مدیریت نشانی‌ها' }}
        </button>
      </div>

      <div v-if="defaultAddress" class="rounded-2xl border border-sand/70 p-4 space-y-2 text-xs bg-paper/40">
        <div class="flex items-center justify-between font-bold text-ink">
          <span>{{ defaultAddress.title }} - {{ defaultAddress.fullName }}</span>
          <span class="text-[11px] font-mono text-muted-foreground">{{ toFa(defaultAddress.phoneNumber) }}</span>
        </div>
        <p class="text-muted-foreground leading-relaxed">
          {{ defaultAddress.province }}، {{ defaultAddress.city }}، {{ defaultAddress.exactAddress }}
        </p>
        <div v-if="defaultAddress.postalCode" class="pt-1 text-[11px] text-muted-foreground font-mono">
          کد پستی: {{ toFa(defaultAddress.postalCode) }}
        </div>
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
