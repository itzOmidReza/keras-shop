<!-- frontend/app/pages/internal-ops-nexus/index.vue -->
<script setup lang="ts">
import { Package } from '@lucide/vue'
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
    <AdminOverviewKpis
      :today-sales="todaySales"
      :month-sales="monthSales"
      :pending-orders-count="pendingOrdersCount"
      :low-stock-count="lowStockCount"
    />

    <!-- دو بخش متمرکز کاری: سفارش‌های نیازمند اقدام فوری + جدول کالاهای رو به اتمام -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7">
        <AdminOverviewPendingOrders
          :orders="pendingOrders"
          :total-count="pendingOrdersCount"
          @advance="quickAdvanceOrder"
        />
      </div>

      <div class="lg:col-span-5">
        <AdminOverviewLowStock
          :items="lowStockItems"
        />
      </div>
    </div>
  </div>
</template>
