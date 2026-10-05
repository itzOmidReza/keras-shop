<!-- frontend/app/pages/internal-ops-nexus/discounts/index.vue -->
<script setup lang="ts">
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
} from '@lucide/vue'
import { useAdminDiscounts } from '~/composables/ops/useAdminDiscounts'
import { toFa, formatToman } from '~/utils/format'

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

const newCoupon = ref({
  code: '',
  type: 'percent' as 'percent' | 'fixed',
  value: 20,
  minOrder: 1500000,
  maxDiscount: 500000,
  expiresAt: '۱۴۰۵/۰۹/۳۰',
  limit: 100,
})

const handleCreate = () => {
  const created = createDiscount(newCoupon.value)
  if (created) {
    newCoupon.value = {
      code: '',
      type: 'percent',
      value: 20,
      minOrder: 1500000,
      maxDiscount: 500000,
      expiresAt: '۱۴۰۵/۰۹/۳۰',
      limit: 100,
    }
  }
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

    <!-- جست‌وجو -->
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
    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs border-collapse">
          <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
            <tr>
              <th class="p-3.5 text-start">کد تخفیف</th>
              <th class="p-3.5 text-start">نوع و مقدار</th>
              <th class="p-3.5 text-start">حداقل خرید</th>
              <th class="p-3.5 text-start">سقف تخفیف</th>
              <th class="p-3.5 text-start">تاریخ انقضا</th>
              <th class="p-3.5 text-center">مصرف / ظرفیت</th>
              <th class="p-3.5 text-center">وضعیت</th>
              <th class="p-3.5 text-end">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="coupon in filteredDiscounts"
              :key="coupon.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- کد -->
              <td class="p-3.5">
                <span class="font-mono font-black text-sm text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 inline-block">
                  {{ coupon.code }}
                </span>
              </td>

              <!-- نوع و مقدار -->
              <td class="p-3.5 font-bold text-slate-800">
                <span v-if="coupon.type === 'percent'" class="text-indigo-600 font-mono">
                  {{ toFa(coupon.value) }}٪ تخفیف
                </span>
                <span v-else class="text-emerald-700 font-mono">
                  {{ formatToman(coupon.value) }} تومان
                </span>
              </td>

              <!-- حداقل خرید -->
              <td class="p-3.5 font-mono text-slate-700">
                {{ formatToman(coupon.minOrder) }} تومان
              </td>

              <!-- سقف تخفیف -->
              <td class="p-3.5 font-mono text-slate-700">
                {{ formatToman(coupon.maxDiscount) }} تومان
              </td>

              <!-- تاریخ انقضا -->
              <td class="p-3.5 font-mono text-slate-600">
                {{ coupon.expiresAt }}
              </td>

              <!-- مصرف -->
              <td class="p-3.5 text-center font-mono">
                <span class="font-bold text-slate-900">{{ toFa(coupon.usedCount) }}</span>
                <span class="text-slate-400"> / {{ toFa(coupon.limit) }}</span>
              </td>

              <!-- وضعیت فعال/غیرفعال -->
              <td class="p-3.5 text-center">
                <button
                  type="button"
                  class="p-1 rounded-lg transition-colors cursor-pointer"
                  :title="coupon.isActive ? 'کلیک جهت غیرفعال‌سازی' : 'کلیک جهت فعال‌سازی'"
                  @click="toggleDiscount(coupon)"
                >
                  <CheckCircle2 v-if="coupon.isActive" class="w-4 h-4 text-emerald-600 inline" />
                  <XCircle v-else class="w-4 h-4 text-slate-300 inline" />
                </button>
              </td>

              <!-- حذف -->
              <td class="p-3.5 text-end">
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose cursor-pointer transition-colors"
                  title="حذف کد تخفیف"
                  @click="deleteDiscount(coupon.id)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredDiscounts.length === 0" class="p-10 text-center text-slate-400 text-xs">
        کد تخفیفی با این عبارت یافت نشد.
      </div>
    </div>

    <!-- مودال ایجاد کد تخفیف جدید -->
    <Teleport to="body">
      <div
        v-if="isCreateModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans"
        role="dialog"
      >
        <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <Tag class="w-5 h-5 text-ink" />
              <h3 class="text-sm font-bold text-slate-900">
                ایجاد کد تخفیف جدید
              </h3>
            </div>
            <button
              type="button"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              @click="isCreateModalOpen = false"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-3.5 text-xs">
            <div class="space-y-1">
              <label class="block font-bold text-slate-800">کد کوپن (حروف انگلیسی یا عدد):</label>
              <input
                v-model="newCoupon.code"
                type="text"
                placeholder="مثال: FALL1405"
                dir="ltr"
                class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink text-start"
              >
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block font-bold text-slate-800">نوع تخفیف:</label>
                <select
                  v-model="newCoupon.type"
                  class="w-full h-9.5 px-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white outline-hidden"
                >
                  <option value="percent">درصدی (٪)</option>
                  <option value="fixed">مبلغ ثابت (تومان)</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-800">مقدار تخفیف:</label>
                <input
                  v-model.number="newCoupon.value"
                  type="number"
                  class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block font-bold text-slate-800">حداقل خرید (تومان):</label>
                <input
                  v-model.number="newCoupon.minOrder"
                  type="number"
                  class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
                >
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-800">سقف تخفیف (تومان):</label>
                <input
                  v-model.number="newCoupon.maxDiscount"
                  type="number"
                  class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block font-bold text-slate-800">تاریخ انقضا:</label>
                <input
                  v-model="newCoupon.expiresAt"
                  type="text"
                  placeholder="۱۴۰۵/۰۹/۳۰"
                  class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
                >
              </div>

              <div class="space-y-1">
                <label class="block font-bold text-slate-800">تعداد مجاز مصرف:</label>
                <input
                  v-model.number="newCoupon.limit"
                  type="number"
                  class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
                >
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              class="h-9 px-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              @click="isCreateModalOpen = false"
            >
              انصراف
            </button>
            <button
              type="button"
              class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer shadow-2xs"
              @click="handleCreate"
            >
              ثبت کوپن
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
