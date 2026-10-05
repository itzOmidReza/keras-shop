<!-- frontend/app/components/ops/orders/OpsOrdersTable.vue -->
<script setup lang="ts">
import {
  Copy,
  ScanBarcode,
  Printer,
  ChevronLeft,
  Truck,
  AlertTriangle,
  RotateCcw,
  FileText,
} from '@lucide/vue'
import {
  useOpsFulfillmentDesk,
  type FulfillmentOrder,
  type FulfillmentStage,
} from '~/composables/ops/useOpsFulfillmentDesk'
import { useOpsShippingManifest } from '~/composables/ops/useOpsShippingManifest'
import { useOpsOrders } from '~/composables/ops/useOpsOrders'
import { toFa, formatToman } from '~/utils/format'

const {
  filteredDeskOrders,
  selectedOrderIds,
  toggleOrderSelection,
  selectAll,
  clearSelection,
  transitionOrderStage,
  openOrderDetailDrawer,
  isScanToPackOpen,
  isExchangeModalOpen,
  selectedItemForExchange,
} = useOpsFulfillmentDesk()

const {
  CARRIER_CONFIGS,
  openThermalLabel,
} = useOpsShippingManifest()

const {
  openBarcodeModal,
  openPackingSlip,
  copyToClipboard,
} = useOpsOrders()

const isAllSelected = computed(() => {
  return (
    filteredDeskOrders.value.length > 0 &&
    filteredDeskOrders.value.every((o) => selectedOrderIds.value.includes(o.orderNumber))
  )
})

const handleSelectAllToggle = () => {
  if (isAllSelected.value) {
    clearSelection()
  } else {
    selectAll()
  }
}

const getStageBadge = (stage: FulfillmentStage) => {
  switch (stage) {
    case 'registered':
      return { label: 'ثبت جدید', class: 'bg-amber-50 text-amber-800 border-amber-200' }
    case 'picking':
      return { label: 'انبارداری', class: 'bg-sky-50 text-sky-800 border-sky-200' }
    case 'packing':
      return { label: 'بسته‌بندی و QC', class: 'bg-indigo-50 text-indigo-800 border-indigo-200' }
    case 'shipped':
      return { label: 'تحویل به پست/پیک', class: 'bg-purple-50 text-purple-800 border-purple-200' }
    case 'delivered':
      return { label: 'تحویل نهایی', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
    default:
      return { label: stage, class: 'bg-slate-50 text-slate-700 border-slate-200' }
  }
}

const handleStartScanToPack = (order: FulfillmentOrder) => {
  openOrderDetailDrawer(order)
  isScanToPackOpen.value = true
}

const handleStartExchange = (order: FulfillmentOrder) => {
  if (order.items.length > 0) {
    selectedItemForExchange.value = { order, item: order.items[0]! }
    isExchangeModalOpen.value = true
  }
}
</script>

<template>
  <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden font-sans">
    <div class="overflow-x-auto">
      <table class="w-full text-start text-xs border-collapse">
        <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
          <tr>
            <th class="p-3 text-center w-10">
              <input
                type="checkbox"
                :checked="isAllSelected"
                class="w-4 h-4 rounded-md border-slate-300 text-ink focus:ring-ink cursor-pointer"
                title="انتخاب همه سفارش‌ها"
                @change="handleSelectAllToggle"
              >
            </th>
            <th class="p-3 text-start">سفارش و خریدار</th>
            <th class="p-3 text-start">اقلام لباس</th>
            <th class="p-3 text-start">حمل، بارکد و تاخیر</th>
            <th class="p-3 text-start">فاکتور و پرداخت</th>
            <th class="p-3 text-start">مرحله لجستیک</th>
            <th class="p-3 text-end">عملیات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="order in filteredDeskOrders"
            :key="order.orderNumber"
            class="hover:bg-slate-50/80 transition-colors group cursor-default"
            :class="selectedOrderIds.includes(order.orderNumber) ? 'bg-amber-50/30' : ''"
          >
            <!-- چک‌باکس انتخاب -->
            <td class="p-3 text-center">
              <input
                type="checkbox"
                :checked="selectedOrderIds.includes(order.orderNumber)"
                class="w-4 h-4 rounded-md border-slate-300 text-ink focus:ring-ink cursor-pointer"
                @change="toggleOrderSelection(order.orderNumber)"
              >
            </td>

            <!-- سفارش و خریدار -->
            <td class="p-3" @click="openOrderDetailDrawer(order)">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 font-mono text-xs">{{ order.orderNumber }}</span>
                <span
                  class="px-1.5 py-0.5 rounded text-[10px] font-bold"
                  :class="order.shift === 'morning' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'"
                >
                  {{ order.shift === 'morning' ? 'نوبت صبح' : 'نوبت عصر' }}
                </span>
              </div>
              <div class="text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
                <span>{{ order.recipientName }}</span>
                <span class="text-[10px] text-slate-400 font-mono">({{ order.recipientPhone || '—' }})</span>
              </div>
              <div class="text-[11px] text-slate-500 truncate max-w-xs mt-0.5" :title="order.shippingAddress">
                {{ order.shippingAddress }}
              </div>
            </td>

            <!-- اقلام لباس -->
            <td class="p-3" @click="openOrderDetailDrawer(order)">
              <div class="flex items-center gap-1.5">
                <!-- تصاویر کوچک اقلام -->
                <div class="flex -space-x-2 space-x-reverse overflow-hidden shrink-0">
                  <img
                    v-for="(item, idx) in order.items.slice(0, 3)"
                    :key="idx"
                    :src="item.image"
                    :alt="item.title"
                    class="w-7 h-7 rounded-lg object-cover border border-white shadow-2xs bg-slate-100"
                  >
                </div>
                <div class="text-[11px] text-slate-700 min-w-0">
                  <span class="font-bold block truncate max-w-[140px]">{{ order.items[0]?.title }}</span>
                  <span class="text-[10px] text-slate-500 font-mono">
                    {{ order.items[0]?.color }} • سایز {{ order.items[0]?.size }}
                    <span v-if="order.items.length > 1" class="text-ink font-bold">
                      +{{ toFa(order.items.length - 1) }} قلم دیگر
                    </span>
                  </span>
                </div>
              </div>
            </td>

            <!-- شرکت حمل، بارکد و تاخیر -->
            <td class="p-3">
              <div class="flex items-center gap-1.5">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="[
                    order.carrierType === 'post' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    order.carrierType === 'tipax' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                    order.carrierType === 'chapar' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    'bg-purple-50 text-purple-800 border border-purple-200'
                  ]"
                >
                  {{ CARRIER_CONFIGS[order.carrierType]?.shortName || 'پست' }}
                </span>

                <!-- نشان هشدار تاخیر بیش از ۴ روز -->
                <span
                  v-if="order.isDelayed"
                  class="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 animate-pulse"
                  title="بیش از ۴ روز در وضعیت ارسال بدون تایید نهایی تحویل"
                >
                  <AlertTriangle class="w-3 h-3 text-rose-600" />
                  <span>معطله ({{ toFa(order.delayedDays || 4) }} روز)</span>
                </span>
              </div>

              <!-- بارکد رهگیری -->
              <div v-if="order.trackingCode" class="flex items-center gap-1 mt-1 text-[11px] font-mono text-slate-800">
                <span class="truncate max-w-[130px]">{{ order.trackingCode }}</span>
                <button
                  type="button"
                  class="p-0.5 hover:text-ink text-slate-400 cursor-pointer"
                  title="کپی کد رهگیری"
                  @click="copyToClipboard(order.trackingCode)"
                >
                  <Copy class="w-3 h-3" />
                </button>
              </div>
              <span v-else class="text-[10px] text-slate-400 block mt-1">بارکد صادر نشده</span>
            </td>

            <!-- فاکتور و پرداخت -->
            <td class="p-3 font-mono">
              <span class="font-bold text-slate-900 block text-xs">{{ formatToman(order.totalAmount) }} ت</span>
              <span
                class="text-[10px] font-sans font-medium block"
                :class="order.freightMode === 'cod' ? 'text-amber-700' : 'text-emerald-700'"
              >
                {{ order.freightMode === 'cod' ? 'پس‌کرایه (COD)' : 'پرداخت آنلاین' }}
              </span>
            </td>

            <!-- مرحله لجستیک و تغییر سریع -->
            <td class="p-3">
              <select
                :value="order.stage"
                class="h-8 px-2 rounded-lg text-[11px] font-bold border transition-colors outline-hidden cursor-pointer"
                :class="getStageBadge(order.stage).class"
                @change="transitionOrderStage(order.orderNumber, ($event.target as HTMLSelectElement).value as any)"
              >
                <option value="registered">ثبت جدید</option>
                <option value="picking">انبارداری و گردآوری</option>
                <option value="packing">بسته‌بندی و QC</option>
                <option value="shipped">تحویل به پست/پیک</option>
                <option value="delivered">تحویل نهایی</option>
              </select>
            </td>

            <!-- عملیات -->
            <td class="p-3 text-end">
              <div class="flex items-center justify-end gap-1">
                <!-- اسکن و بسته‌بندی -->
                <button
                  type="button"
                  class="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold cursor-pointer"
                  title="میز اسکن و تایید بارکد کالا (Scan-to-Pack)"
                  @click="handleStartScanToPack(order)"
                >
                  <ScanBarcode class="w-3.5 h-3.5" />
                </button>

                <!-- چاپ لیبل ۱۰×۱۵ -->
                <button
                  type="button"
                  class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="چاپ برچسب پستی حرارتی ۱۰×۱۵"
                  @click="openThermalLabel(order)"
                >
                  <Printer class="w-3.5 h-3.5" />
                </button>

                <!-- تعویض سایز -->
                <button
                  type="button"
                  class="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer"
                  title="ثبت درخواست تعویض سایز"
                  @click="handleStartExchange(order)"
                >
                  <RotateCcw class="w-3.5 h-3.5" />
                </button>

                <!-- تخصیص بارکد (پشتیبانی از تست‌های E2E) -->
                <button
                  type="button"
                  data-testid="assign-barcode-btn"
                  class="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer"
                  title="تخصیص بارکد ۲۴ رقمی پست"
                  @click="openBarcodeModal(order)"
                >
                  <Truck class="w-3.5 h-3.5" />
                </button>

                <!-- چاپ برگ فاکتور پستی (پشتیبانی از تست‌های E2E) -->
                <button
                  type="button"
                  data-testid="print-packing-slip-btn"
                  class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="چاپ فاکتور و برگ ارسال مرسوله پستی"
                  @click="openPackingSlip(order)"
                >
                  <FileText class="w-3.5 h-3.5" />
                </button>

                <!-- مشاهده جزییات دراور -->
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                  title="مشاهده جزئیات سفارش"
                  @click="openOrderDetailDrawer(order)"
                >
                  <ChevronLeft class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- وضعیت خالی بودن جدول -->
    <div
      v-if="filteredDeskOrders.length === 0"
      class="p-8 text-center space-y-2 text-slate-500 text-xs"
    >
      <p class="font-bold text-slate-700">هیچ سفارشی مطابق معیارهای فیلتر یافت نشد.</p>
      <p class="text-[11px] text-slate-400">می‌توانید کلمه جستجو یا تب وضعیت را تغییر دهید.</p>
    </div>
  </div>
</template>
