<!-- frontend/app/components/ops/discounts/AdminDiscountsTable.vue -->
<script setup lang="ts">
import { CheckCircle2, XCircle, Trash2 } from '@lucide/vue'
import { toFa, formatToman } from '~/utils/format'
import type { AdminDiscountCoupon } from '~/composables/ops/useAdminDiscounts'

defineProps<{
  discounts: AdminDiscountCoupon[]
}>()

const emit = defineEmits<{
  toggle: [coupon: AdminDiscountCoupon]
  delete: [id: string]
}>()
</script>

<template>
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
            v-for="coupon in discounts"
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
                @click="emit('toggle', coupon)"
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
                @click="emit('delete', coupon.id)"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="discounts.length === 0" class="p-10 text-center text-slate-400 text-xs">
      کد تخفیفی با این عبارت یافت نشد.
    </div>
  </div>
</template>
