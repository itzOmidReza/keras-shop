<!-- frontend/app/pages/internal-ops-nexus/discounts/index.vue -->
<script setup lang="ts">
import { Plus, Search } from '@lucide/vue'
definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'تخفیف‌ها و کوپن‌ها | مدیریت آتلیه کراس', robots: 'noindex, nofollow' })

const {
  filteredDiscounts,
  searchQuery,
  isCreateModalOpen,
  toggleDiscount,
  deleteDiscount,
  createDiscount,
} = useAdminDiscounts()

const handleCreate = (couponData: Parameters<typeof createDiscount>[0]) => {
  createDiscount(couponData)
}
</script>

<template>
  <div class="space-y-6 font-sans" data-testid="nexus-vouchers-view">
    <!-- هدر صفحه -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          تخفیف‌ها و کوپن‌های پروموشن
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          تعریف کدهای تخفیف، درصد یا مبلغ ثابت، حداقل سبد خرید و تاریخ انقضا
        </p>
      </div>

      <button
        type="button"
        class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all w-fit"
        @click="isCreateModalOpen = true"
      >
        <Plus class="w-4 h-4" />
        <span>+ ایجاد کد تخفیف جدید</span>
      </button>
    </div>

    <!-- نوار جست‌وجو -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3">
      <div class="relative w-full sm:w-80">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجوی کد تخفیف (مثال: KERAS-PRO)..."
          class="w-full h-9.5 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-hidden uppercase"
        >
        <Search class="w-4 h-4 text-slate-400 absolute inset-s-3 top-2.5" />
      </div>
    </div>

    <!-- جدول کدهای تخفیف -->
    <AdminDiscountsTable
      :discounts="filteredDiscounts"
      @toggle="toggleDiscount"
      @delete="deleteDiscount"
    />

    <!-- مودال ایجاد کد تخفیف به صورت Lazy -->
    <LazyAdminDiscountCreateModal
      v-if="isCreateModalOpen"
      :open="isCreateModalOpen"
      @update:open="isCreateModalOpen = $event"
      @create="handleCreate"
    />
  </div>
</template>
