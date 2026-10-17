<!-- frontend/app/components/ops/orders/AdminOrdersTable.vue -->
<script setup lang="ts">
import {
  ChevronRight,
  ChevronLeft,
  PackageOpen,
} from '@lucide/vue'
import { toFa } from '~/utils/format'
import type { TrackOrderResponse, OrderStatus } from '~/types/domain'

const props = withDefaults(
  defineProps<{
    orders: TrackOrderResponse[]
    isLoading?: boolean
    currentPage?: number
    pageSize?: number
    totalOrders?: number
    totalPages?: number
  }>(),
  {
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    totalOrders: 0,
    totalPages: 1,
  },
)

const emit = defineEmits<{
  updateStatus: [orderNumber: string, status: OrderStatus]
  openDetail: [order: TrackOrderResponse]
  openPackingSlip: [order: TrackOrderResponse]
  openBarcode: [order: TrackOrderResponse]
  pageChange: [page: number]
  pageSizeChange: [size: number]
}>()

const visiblePageRange = computed(() => {
  const current = props.currentPage
  const total = props.totalPages
  const delta = 2
  const range: number[] = []

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }
  return range
})

const startItemIndex = computed(() => {
  if (props.totalOrders === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const endItemIndex = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalOrders)
})
</script>

<template>
  <div class="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
    <div class="overflow-x-auto min-h-[300px]">
      <table class="w-full text-start text-xs border-collapse">
        <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
          <tr>
            <th class="p-3.5 text-start">کد سفارش و تاریخ</th>
            <th class="p-3.5 text-start">خریدار و نشانی</th>
            <th class="p-3.5 text-start">اقلام بسته</th>
            <th class="p-3.5 text-start">شرکت حمل و بارکد ۲۴ رقمی</th>
            <th class="p-3.5 text-start">مبلغ فاکتور</th>
            <th class="p-3.5 text-start">وضعیت خط سفارش (Pipeline)</th>
            <th class="p-3.5 text-end">عملیات</th>
          </tr>
        </thead>

        <!-- اسکلتون لودینگ برای جلوگیری از جهش بصری (CLS) -->
        <AdminOrdersTableSkeleton v-if="isLoading" :rows="pageSize" />

        <!-- ردیف‌های اصلی جدول -->
        <tbody v-else-if="orders.length > 0" class="divide-y divide-slate-100">
          <AdminOrdersTableRow
            v-for="order in orders"
            :key="order.orderNumber"
            :order="order"
            @update-status="(num, st) => emit('updateStatus', num, st)"
            @open-detail="(ord) => emit('openDetail', ord)"
            @open-packing-slip="(ord) => emit('openPackingSlip', ord)"
            @open-barcode="(ord) => emit('openBarcode', ord)"
          />
        </tbody>
      </table>
    </div>

    <!-- حالت خالی جدول بدون رکورد -->
    <div
      v-if="!isLoading && orders.length === 0"
      class="p-12 text-center text-slate-400 text-xs space-y-3"
    >
      <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <PackageOpen class="w-6 h-6" />
      </div>
      <div>
        <p class="font-bold text-slate-800 text-sm">هیچ سفارشی مطابق معیارهای فیلتر یافت نشد.</p>
        <p class="text-[11px] text-slate-500 mt-1">می‌توانید فیلتر وضعیت، نام شرکت حمل یا عبارت جست‌وجو را تغییر دهید.</p>
      </div>
    </div>

    <!-- نوار صفحه‌بندی مدرن و ریسپانسیو (Pagination Controls) -->
    <div
      v-if="totalOrders > 0"
      class="border-t border-slate-200/80 px-4 py-3 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
    >
      <!-- شمارش اقلام -->
      <div class="text-slate-500 font-medium text-[11px]">
        نمایش
        <span class="font-mono font-bold text-slate-900">{{ toFa(startItemIndex) }}</span>
        تا
        <span class="font-mono font-bold text-slate-900">{{ toFa(endItemIndex) }}</span>
        از مجموع
        <span class="font-mono font-bold text-slate-900">{{ toFa(totalOrders) }}</span>
        سفارش
      </div>

      <!-- کنترل‌های شماره صفحات و اندازه صفحه -->
      <div class="flex items-center gap-3">
        <!-- سلکتور اندازه صفحه -->
        <div class="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span>تعداد:</span>
          <select
            :value="pageSize"
            class="h-7 px-2 rounded-lg bg-white border border-slate-200 text-[11px] font-mono font-bold text-slate-700 outline-hidden focus:border-slate-400 cursor-pointer"
            @change="emit('pageSizeChange', Number(($event.target as HTMLSelectElement).value))"
          >
            <option :value="10">{{ toFa(10) }} در صفحه</option>
            <option :value="20">{{ toFa(20) }} در صفحه</option>
            <option :value="50">{{ toFa(50) }} در صفحه</option>
            <option :value="100">{{ toFa(100) }} در صفحه</option>
          </select>
        </div>

        <!-- دکمه‌های ناوبری صفحات -->
        <div class="flex items-center gap-1">
          <!-- صفحه قبل -->
          <button
            type="button"
            :disabled="currentPage <= 1 || isLoading"
            class="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="صفحه قبلی"
            @click="emit('pageChange', currentPage - 1)"
          >
            <ChevronRight class="w-3.5 h-3.5" />
          </button>

          <!-- دکمه‌های شماره صفحه -->
          <button
            v-for="p in visiblePageRange"
            :key="p"
            type="button"
            class="w-7 h-7 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer"
            :class="p === currentPage ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'"
            @click="emit('pageChange', p)"
          >
            {{ toFa(p) }}
          </button>

          <!-- صفحه بعد -->
          <button
            type="button"
            :disabled="currentPage >= totalPages || isLoading"
            class="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="صفحه بعدی"
            @click="emit('pageChange', currentPage + 1)"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
