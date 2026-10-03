<script setup lang="ts">
import {
  Plus,
  Search,
  Copy,
  Truck,
  Printer,
} from '@lucide/vue'

const {
  ordersList,
  orderStatusFilter,
  orderSearchQuery,
  filteredOrders,
  getStatusBadge,
  updateOrderStatus,
  openBarcodeModal,
  openManualOrderModal,
  copyToClipboard,
  openPackingSlip,
} = useOpsOrders()
</script>

<template>
  <section data-testid="nexus-fulfillment-view" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          میز مدیریت سفارش‌ها و توزیع پستی
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          پردازش وضعیت سفارش‌ها، تخصیص بارکد ۲۴ رقمی پست و ثبت سفارش دستی
        </p>
      </div>

      <button
        type="button"
        data-testid="create-manual-order-btn"
        class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
        @click="openManualOrderModal"
      >
        <Plus class="w-4 h-4" />
        <span>+ ثبت سفارش دستی جدید</span>
      </button>
    </div>

    <!-- فیلترهای وضعیت سفارش -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
      <div class="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          :class="orderStatusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="orderStatusFilter = 'all'"
        >
          همه ({{ ordersList.length }})
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          :class="orderStatusFilter === 'registered' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="orderStatusFilter = 'registered'"
        >
          در انتظار بررسی
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          :class="orderStatusFilter === 'processing' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="orderStatusFilter = 'processing'"
        >
          در حال بسته‌بندی
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          :class="orderStatusFilter === 'handed_over' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="orderStatusFilter = 'handed_over'"
        >
          ارسال با پست
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          :class="orderStatusFilter === 'delivered' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="orderStatusFilter = 'delivered'"
        >
          تحویل شده
        </button>
      </div>

      <div class="relative w-full md:w-72">
        <input
          v-model="orderSearchQuery"
          type="text"
          placeholder="جستجوی شماره سفارش، خریدار یا بارکد..."
          class="w-full h-9 ps-8 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-hidden"
        >
        <Search class="w-3.5 h-3.5 text-slate-400 absolute inset-s-2.5 top-2.5" />
      </div>
    </div>

    <!-- جدول سفارش‌ها -->
    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs">
          <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th class="p-3.5 text-start">سفارش و خریدار</th>
              <th class="p-3.5 text-start">نشانی تحویل</th>
              <th class="p-3.5 text-start">اقلام</th>
              <th class="p-3.5 text-start">مبلغ فاکتور</th>
              <th class="p-3.5 text-start">وضعیت جاری</th>
              <th class="p-3.5 text-start">کد رهگیری پست</th>
              <th class="p-3.5 text-end">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="order in filteredOrders"
              :key="order.orderNumber"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- شماره و خریدار -->
              <td class="p-3.5">
                <span class="font-bold text-slate-900 font-mono block">{{ order.orderNumber }}</span>
                <span class="text-slate-700 font-medium block mt-0.5">{{ order.recipientName }}</span>
                <span class="text-[10px] text-slate-400 font-mono block">{{ order.recipientPhone || '—' }}</span>
              </td>

              <!-- نشانی -->
              <td class="p-3.5 max-w-xs truncate text-slate-600" :title="order.shippingAddress">
                {{ order.shippingAddress }}
              </td>

              <!-- اقلام -->
              <td class="p-3.5">
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-[11px] text-slate-700">
                    {{ order.items.length }} قلم
                  </span>
                </div>
              </td>

              <!-- مبلغ فاکتور -->
              <td class="p-3.5 font-mono font-bold text-slate-900">
                {{ formatToman(order.totalAmount) }} تومان
              </td>

              <!-- وضعیت سفارش و تغییر سریع درون‌خطی -->
              <td class="p-3.5">
                <select
                  :value="order.status"
                  class="h-8 px-2 rounded-lg text-xs font-bold border transition-colors outline-hidden cursor-pointer"
                  :class="getStatusBadge(order.status).class"
                  @change="updateOrderStatus(order, ($event.target as HTMLSelectElement).value as any)"
                >
                  <option value="registered">در انتظار بررسی</option>
                  <option value="processing">در حال بسته‌بندی</option>
                  <option value="handed_over">ارسال با پست</option>
                  <option value="delivered">تحویل شده</option>
                  <option value="canceled">مرجوعی / لغو</option>
                </select>
              </td>

              <!-- بارکد پست -->
              <td class="p-3.5">
                <div v-if="order.trackingCode" class="flex items-center gap-1 font-mono text-[11px] text-slate-800">
                  <span class="truncate max-w-[120px]">{{ order.trackingCode }}</span>
                  <button
                    type="button"
                    class="p-1 hover:text-ink cursor-pointer"
                    title="کپی بارکد"
                    @click="copyToClipboard(order.trackingCode!)"
                  >
                    <Copy class="w-3 h-3" />
                  </button>
                </div>
                <span v-else class="text-slate-400 text-[11px]">صادر نشده</span>
              </td>

              <!-- عملیات -->
              <td class="p-3.5 text-end">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    data-testid="assign-barcode-btn"
                    class="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                    title="تخصیص بارکد ۲۴ رقمی پست"
                    @click="openBarcodeModal(order)"
                  >
                    <Truck class="w-3 h-3" />
                    <span>تخصیص بارکد</span>
                  </button>
                  <button
                    type="button"
                    data-testid="print-packing-slip-btn"
                    class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    title="چاپ فاکتور و برچسب پستی"
                    @click="openPackingSlip(order)"
                  >
                    <Printer class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
