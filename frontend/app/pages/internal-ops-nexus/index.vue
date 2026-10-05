<!-- frontend/app/pages/internal-ops-nexus/index.vue -->
<script setup lang="ts">
import {
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  Shirt,
} from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'
import { useAdminOverview } from '~/composables/ops/useAdminOverview'
import { toFa, formatToman } from '~/utils/format'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

const authStore = useAuthStore()
if (!authStore.isAuthenticated || authStore.user?.role !== 'super_admin') {
  throw createError({ statusCode: 404, statusMessage: 'صفحه مورد نظر یافت نشد', fatal: true })
}

useSeoMeta({ title: 'پیشخوان مدیریت آتلیه کراس | HQ', robots: 'noindex, nofollow' })

const {
  todaySales,
  monthSales,
  pendingOrders,
  pendingOrdersCount,
  lowStockItems,
  lowStockCount,
  quickAdvanceOrder,
} = useAdminOverview()
</script>

<template>
  <div class="space-y-6 font-sans" data-testid="nexus-analytics-view">
    <!-- هدر پیشخوان -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          پیشخوان عملیات و آمار فروش
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          دیده‌بان سفارش‌های جاری، مبالغ فروش و وضعیت موجودی کالاهای آتلیه کراس
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/internal-ops-nexus/orders"
          class="h-9 px-3.5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
        >
          <Package class="w-4 h-4 text-amber-300" />
          <span>میز بسته‌بندی سفارش‌ها</span>
        </NuxtLink>
      </div>
    </div>

    <!-- ۴ کارت اصلی کسب‌وکار واقعی بوتیک -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- ۱. فروش امروز -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">فروش ناخالص امروز</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <div class="space-y-1">
          <div class="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
            {{ formatToman(todaySales) }} <span class="text-xs font-sans font-normal text-slate-500">تومان</span>
          </div>
          <div class="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight class="w-3.5 h-3.5" />
            <span>+۱۸٪ رشد نسبت به روز گذشته</span>
          </div>
        </div>
      </div>

      <!-- ۲. فروش این ماه -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">فروش این ماه (مهر ۱۴۰۵)</span>
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Calendar class="w-4 h-4" />
          </div>
        </div>
        <div class="space-y-1">
          <div class="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
            {{ formatToman(monthSales) }} <span class="text-xs font-sans font-normal text-slate-500">تومان</span>
          </div>
          <div class="text-[11px] text-slate-400 font-medium">
            تارگت ماهانه: ۲۰۰ میلیون تومان
          </div>
        </div>
      </div>

      <!-- ۳. سفارش‌های نیازمند آماده‌سازی -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">نیازمند بسته‌بندی</span>
          <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Package class="w-4 h-4" />
          </div>
        </div>
        <div class="space-y-1">
          <div class="text-xl sm:text-2xl font-black text-slate-900 font-mono tabular-nums">
            {{ toFa(pendingOrdersCount) }} <span class="text-xs font-sans font-normal text-slate-500">سفارش</span>
          </div>
          <div class="text-[11px] text-amber-600 font-bold">
            در انتظار آماده‌سازی و الصاق بارکد پست
          </div>
        </div>
      </div>

      <!-- ۴. هشدار کسری موجودی -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">هشدار کسری موجودی</span>
          <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose flex items-center justify-center">
            <AlertTriangle class="w-4 h-4" />
          </div>
        </div>
        <div class="space-y-1">
          <div class="text-xl sm:text-2xl font-black text-rose font-mono tabular-nums">
            {{ toFa(lowStockCount) }} <span class="text-xs font-sans font-normal text-slate-500">قلم بحرانی</span>
          </div>
          <div class="text-[11px] text-rose font-medium">
            موجودی کمتر از ۲ عدد در انبار
          </div>
        </div>
      </div>
    </div>

    <!-- دو بخش متمرکز کاری: سفارش‌های نیازمند اقدام فوری + جدول کالاهای رو به اتمام -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- بخش ۱: سفارش‌های نیازمند اقدام فوری (۸ ستون) -->
      <div class="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
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
            <span>مشاهده همه ({{ toFa(pendingOrdersCount) }})</span>
            <ChevronLeft class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>

        <div v-if="pendingOrders.length === 0" class="p-8 text-center text-slate-400 text-xs">
          هیچ سفارشی در صف آماده‌سازی وجود ندارد.
        </div>

        <div v-else class="space-y-2.5">
          <div
            v-for="order in pendingOrders.slice(0, 4)"
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
                @click="quickAdvanceOrder(order.orderNumber)"
              >
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>تایید و ارسال</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- بخش ۲: هشدار کالاهای رو به اتمام (۵ ستون) -->
      <div class="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-rose" />
            <h2 class="text-sm font-bold text-slate-900">
              هشدار شارژ موجودی انبار
            </h2>
          </div>
          <NuxtLink
            to="/internal-ops-nexus/products"
            class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>کاتالوگ کالاها</span>
            <ChevronLeft class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>

        <div v-if="lowStockItems.length === 0" class="p-8 text-center text-slate-400 text-xs">
          تمام کالاها دارای موجودی کافی هستند.
        </div>

        <div v-else class="divide-y divide-slate-100">
          <div
            v-for="(item, idx) in lowStockItems.slice(0, 5)"
            :key="idx"
            class="py-2.5 flex items-center justify-between gap-3 text-xs"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                class="w-9 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
              >
              <div v-else class="w-9 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Shirt class="w-4 h-4 text-slate-400" />
              </div>

              <div class="min-w-0">
                <h4 class="font-bold text-slate-900 truncate text-[11px]">{{ item.title }}</h4>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                  <span>سایز: <strong>{{ item.size }}</strong></span>
                  <span>•</span>
                  <span>{{ item.color }}</span>
                </div>
              </div>
            </div>

            <div class="shrink-0 text-end">
              <span class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-50 text-rose border border-rose-200">
                {{ toFa(item.stock) }} عدد
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
