<!-- frontend/app/components/ops/orders/AdminOrdersTable.vue -->
<script setup lang="ts">
import {
  Eye,
  Printer,
  Truck,
  Copy,
  ExternalLink,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import {
  ORDER_STATUS_CONFIG,
  PIPELINE_STATUSES,
} from '~/composables/admin/useAdminOrders'
import { toFa, formatToman } from '~/utils/format'
import type { TrackOrderResponse, OrderStatus } from '~/types/domain'

defineProps<{
  orders: TrackOrderResponse[]
}>()

const emit = defineEmits<{
  updateStatus: [orderNumber: string, status: OrderStatus]
  openDetail: [order: TrackOrderResponse]
  openPackingSlip: [order: TrackOrderResponse]
  openBarcode: [order: TrackOrderResponse]
}>()

const copyText = (text: string, label: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    toast.success(`${label} در کلیپ‌بورد کپی شد.`)
  }
}

const handleInlineStatusChange = (orderNumber: string, e: Event) => {
  const target = e.target as HTMLSelectElement
  const newStatus = target.value as OrderStatus
  emit('updateStatus', orderNumber, newStatus)
}
</script>

<template>
  <div class="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
    <div class="overflow-x-auto">
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
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="order in orders"
            :key="order.orderNumber"
            class="hover:bg-slate-50/70 transition-colors"
          >
            <!-- کد سفارش و تاریخ -->
            <td class="p-3.5">
              <span class="font-mono font-bold text-slate-900 text-xs block">{{ order.orderNumber }}</span>
              <span class="text-[10px] text-slate-400 block mt-0.5">{{ order.createdAt }}</span>
            </td>

            <!-- خریدار و شماره تماس -->
            <td class="p-3.5">
              <div class="space-y-0.5 max-w-xs">
                <span class="font-bold text-slate-900 block truncate">{{ order.recipientName }}</span>
                <div class="flex items-center gap-1">
                  <span class="text-[11px] text-slate-500 font-mono dir-ltr">{{ order.recipientPhone }}</span>
                  <button
                    type="button"
                    class="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="کپی شماره تلفن"
                    @click="copyText(order.recipientPhone || '', 'شماره تلفن')"
                  >
                    <Copy class="w-3 h-3" />
                  </button>
                </div>
                <span class="text-[10px] text-slate-400 block truncate" :title="order.shippingAddress">
                  {{ order.shippingAddress }}
                </span>
              </div>
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

            <!-- شرکت حمل و بارکد ۲۴ رقمی پستی -->
            <td class="p-3.5">
              <div class="space-y-1">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 inline-block">
                  {{ order.carrier || 'شرکت ملی پست' }}
                </span>

                <div v-if="order.trackingCode" class="flex items-center gap-1">
                  <span class="font-mono text-[11px] font-bold text-indigo-700 dir-ltr">
                    {{ order.trackingCode }}
                  </span>
                  <button
                    type="button"
                    class="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="کپی بارکد ۲۴ رقمی"
                    @click="copyText(order.trackingCode, 'بارکد رهگیری')"
                  >
                    <Copy class="w-3 h-3" />
                  </button>
                  <a
                    :href="order.carrier.includes('تیپاکس') ? `https://tipaxco.com/tracking?id=${order.trackingCode}` : `https://tracking.post.ir/?id=${order.trackingCode}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-0.5 text-slate-400 hover:text-indigo-600"
                    title="مشاهده در سامانه رهگیری پست"
                  >
                    <ExternalLink class="w-3 h-3" />
                  </a>
                </div>
                <div v-else class="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>فاقد بارکد</span>
                  <button
                    type="button"
                    class="text-[10px] text-amber-700 hover:underline font-bold cursor-pointer"
                    @click="emit('openBarcode', order)"
                  >
                    (صدور بارکد)
                  </button>
                </div>
              </div>
            </td>

            <!-- مبلغ کل -->
            <td class="p-3.5 font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap">
              {{ formatToman(order.totalAmount) }} تومان
            </td>

            <!-- سلکتور وضعیت خط لوله به صورت اینلاین -->
            <td class="p-3.5">
              <div class="relative w-44">
                <select
                  :value="order.status"
                  class="w-full h-8 ps-2.5 pe-6 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer outline-hidden focus:ring-1 focus:ring-slate-400"
                  :class="ORDER_STATUS_CONFIG[order.status]?.badgeClass || 'bg-slate-50 text-slate-700 border-slate-200'"
                  @change="handleInlineStatusChange(order.orderNumber, $event)"
                >
                  <option
                    v-for="st in PIPELINE_STATUSES"
                    :key="st.value"
                    :value="st.value"
                  >
                    {{ st.label }}
                  </option>
                </select>
              </div>
            </td>

            <!-- دکمه‌های عملیات سریع -->
            <td class="p-3.5 text-end">
              <div class="flex items-center justify-end gap-1.5">
                <!-- مشاهده جزئیات دراور -->
                <button
                  type="button"
                  class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                  title="مشاهده جزئیات سفارش"
                  @click="emit('openDetail', order)"
                >
                  <Eye class="w-3.5 h-3.5" />
                </button>

                <!-- چاپ برگه آدرس پستی (Packing Slip) -->
                <button
                  type="button"
                  data-testid="print-packing-slip-btn"
                  class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                  title="چاپ برگه آدرس و فاکتور مرسوله"
                  @click="emit('openPackingSlip', order)"
                >
                  <Printer class="w-3.5 h-3.5" />
                </button>

                <!-- تخصیص بارکد ۲۴ رقمی -->
                <button
                  type="button"
                  data-testid="assign-barcode-btn"
                  class="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer transition-colors"
                  title="تخصیص بارکد ۲۴ رقمی پست"
                  @click="emit('openBarcode', order)"
                >
                  <Truck class="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="orders.length === 0" class="p-10 text-center text-slate-400 text-xs space-y-1">
      <p class="font-bold text-slate-700">هیچ سفارشی مطابق معیارهای فیلتر یافت نشد.</p>
      <p class="text-[11px]">می‌توانید فیلتر وضعیت، نام شرکت حمل یا عبارت جست‌وجو را تغییر دهید.</p>
    </div>
  </div>
</template>
