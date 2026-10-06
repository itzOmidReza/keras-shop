<!-- frontend/app/components/ops/overview/AdminOverviewKpis.vue -->
<script setup lang="ts">
import {
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
} from '@lucide/vue'
import { toFa, formatToman } from '~/utils/format'

defineProps<{
  todaySales: number
  monthSales: number
  pendingOrdersCount: number
  lowStockCount: number
}>()
</script>

<template>
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
</template>
