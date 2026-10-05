<!-- frontend/app/pages/internal-ops-nexus/orders/index.vue -->
<script setup lang="ts">
import {
  Search,
  Plus,
  Eye,
  Printer,
  Truck,
} from '@lucide/vue'
import { useAdminOrders } from '~/composables/ops/useAdminOrders'
import AdminOrderDetailDrawer from '~/components/ops/orders/AdminOrderDetailDrawer.vue'
import AdminPackingSlipModal from '~/components/ops/orders/AdminPackingSlipModal.vue'
import AdminBarcodeModal from '~/components/ops/orders/AdminBarcodeModal.vue'
import AdminManualOrderModal from '~/components/ops/orders/AdminManualOrderModal.vue'
import { toFa, formatToman } from '~/utils/format'
import type { OrderStatus } from '~/types/domain'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'سفارش‌ها و ارسال مرسوله‌ها | مدیریت آتلیه کراس', robots: 'noindex, nofollow' })

const {
  ordersList,
  activeStatusTab,
  searchQuery,
  filteredOrders,
  openOrderDetail,
  openPackingSlip,
  openBarcodeModal,
  openManualOrderModal,
} = useAdminOrders()

const tabs = [
  { id: 'all', label: 'همه سفارش‌ها' },
  { id: 'pending', label: 'در انتظار بسته‌بندی' },
  { id: 'shipped', label: 'ارسال‌شده با پست' },
  { id: 'completed', label: 'تحویل‌شده / لغو' },
] as const

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'registered':
    case 'processing':
      return { label: 'در انتظار بسته‌بندی', class: 'bg-amber-50 text-amber-800 border-amber-200' }
    case 'handed_over':
      return { label: 'ارسال‌شده (پست)', class: 'bg-indigo-50 text-indigo-800 border-indigo-200' }
    case 'delivered':
      return { label: 'تحویل نهایی', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
    case 'canceled':
      return { label: 'لغو شده', class: 'bg-rose-50 text-rose border-rose-200' }
    default:
      return { label: status, class: 'bg-slate-50 text-slate-700 border-slate-200' }
  }
}
</script>

<template>
  <div class="space-y-6 font-sans" data-testid="nexus-fulfillment-view">
    <!-- هدر میز سفارش‌ها -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          سفارش‌ها و ارسال مرسولات
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          بسته‌بندی اقلام، چاپ برگه آدرس کارتن و الصاق کد رهگیری پستی
        </p>
      </div>

      <button
        type="button"
        data-testid="create-manual-order-btn"
        class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all w-fit"
        @click="openManualOrderModal"
      >
        <Plus class="w-4 h-4" />
        <span>+ ثبت سفارش دستی جدید</span>
      </button>
    </div>

    <!-- تب‌های فیلتر وضعیت و جست‌وجو -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- ۴ تب وضعیت شفاف -->
      <div class="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <button
          v-for="t in tabs"
          :key="t.id"
          type="button"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          :class="activeStatusTab === t.id ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'"
          @click="activeStatusTab = t.id"
        >
          {{ t.label }}
          <span v-if="t.id === 'all'" class="text-[10px] opacity-75 ms-1 font-mono">({{ toFa(ordersList.length) }})</span>
        </button>
      </div>

      <!-- جست‌وجو -->
      <div class="relative w-full sm:w-72">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجوی کد سفارش، نام یا کد رهگیری..."
          class="w-full h-9.5 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-hidden"
        >
        <Search class="w-4 h-4 text-slate-400 absolute inset-s-3 top-2.5" />
      </div>
    </div>

    <!-- جدول سفارش‌ها -->
    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs border-collapse">
          <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
            <tr>
              <th class="p-3.5 text-start">کد سفارش</th>
              <th class="p-3.5 text-start">خریدار و تماس</th>
              <th class="p-3.5 text-start">اقلام داخل بسته</th>
              <th class="p-3.5 text-start">مبلغ کل</th>
              <th class="p-3.5 text-start">وضعیت ارسال</th>
              <th class="p-3.5 text-start">کد رهگیری پستی</th>
              <th class="p-3.5 text-end">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="order in filteredOrders"
              :key="order.orderNumber"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- کد سفارش -->
              <td class="p-3.5">
                <span class="font-mono font-bold text-slate-900 text-xs block">{{ order.orderNumber }}</span>
                <span class="text-[10px] text-slate-400 block mt-0.5">{{ order.createdAt }}</span>
              </td>

              <!-- خریدار -->
              <td class="p-3.5">
                <span class="font-bold text-slate-900 block">{{ order.recipientName }}</span>
                <span class="text-[11px] text-slate-500 font-mono block mt-0.5 dir-ltr text-end sm:text-start">{{ order.recipientPhone }}</span>
              </td>

              <!-- اقلام داخل بسته -->
              <td class="p-3.5">
                <div class="space-y-1 max-w-xs">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span
                      v-for="(item, i) in order.items"
                      :key="i"
                      class="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700 truncate"
                    >
                      {{ item.title }} ({{ item.size }})
                    </span>
                  </div>
                  <span class="text-[10px] text-slate-400 block">
                    مجموع: {{ toFa(order.items.reduce((s, it) => s + it.quantity, 0)) }} قلم لباس
                  </span>
                </div>
              </td>

              <!-- مبلغ کل -->
              <td class="p-3.5 font-mono tabular-nums font-bold text-slate-900">
                {{ formatToman(order.totalAmount) }} تومان
              </td>

              <!-- وضعیت ارسال -->
              <td class="p-3.5">
                <span
                  class="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border"
                  :class="getStatusBadge(order.status).class"
                >
                  {{ getStatusBadge(order.status).label }}
                </span>
              </td>

              <!-- کد رهگیری پستی -->
              <td class="p-3.5">
                <span v-if="order.trackingCode" class="font-mono text-[11px] font-bold text-indigo-700 block">
                  {{ order.trackingCode }}
                </span>
                <span v-else class="text-[11px] text-slate-400">
                  صادر نشده
                </span>
              </td>

              <!-- دکمه‌های عملیات سریع -->
              <td class="p-3.5 text-end">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- مشاهده جزئیات دراور -->
                  <button
                    type="button"
                    class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                    title="مشاهده جزئیات سفارش"
                    @click="openOrderDetail(order)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- چاپ برگه آدرس پستی (Packing Slip) -->
                  <button
                    type="button"
                    data-testid="print-packing-slip-btn"
                    class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                    title="چاپ برگه آدرس و فاکتور مرسوله"
                    @click="openPackingSlip(order)"
                  >
                    <Printer class="w-3.5 h-3.5" />
                  </button>

                  <!-- تخصیص بارکد ۲۴ رقمی -->
                  <button
                    type="button"
                    data-testid="assign-barcode-btn"
                    class="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer transition-colors"
                    title="تخصیص بارکد ۲۴ رقمی پست"
                    @click="openBarcodeModal(order)"
                  >
                    <Truck class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredOrders.length === 0" class="p-10 text-center text-slate-400 text-xs space-y-1">
        <p class="font-bold text-slate-700">هیچ سفارشی در این بخش یافت نشد.</p>
        <p class="text-[11px]">می‌توانید تب وضعیت یا کلمه جست‌وجو را تغییر دهید.</p>
      </div>
    </div>

    <!-- دراور و مودال‌های مدیریت سفارش -->
    <AdminOrderDetailDrawer />
    <AdminPackingSlipModal />
    <AdminBarcodeModal />
    <AdminManualOrderModal />
  </div>
</template>
