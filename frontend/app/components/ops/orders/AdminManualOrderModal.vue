<!-- frontend/app/components/ops/orders/AdminManualOrderModal.vue -->
<script setup lang="ts">
import {
  Plus,
  X,
} from '@lucide/vue'
import { useAdminOrders } from '~/composables/admin/useAdminOrders'

const {
  isManualOrderModalOpen,
  createManualOrder,
} = useAdminOrders()

const customerName = ref('سارا رادمنش')
const customerPhone = ref('09121112233')
const shippingAddress = ref('تهران، سعادت‌آباد، خیابان صرافها، پلاک ۱۸')
const orderAmount = ref(2850000)

const handleSubmit = () => {
  createManualOrder({
    recipientName: customerName.value,
    recipientPhone: customerPhone.value,
    shippingAddress: shippingAddress.value,
    totalAmount: orderAmount.value,
  })
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isManualOrderModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans"
      role="dialog"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <Plus class="w-5 h-5 text-ink" />
            <h2 class="text-base font-black text-slate-900 tracking-tight">
              ثبت سفارش دستی جدید
            </h2>
          </div>
          <button
            type="button"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            @click="isManualOrderModalOpen = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="block font-bold text-slate-800">نام خریدار:</label>
            <input
              v-model="customerName"
              type="text"
              class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
            >
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-800">شماره موبایل:</label>
            <input
              v-model="customerPhone"
              type="text"
              dir="ltr"
              class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink text-start"
            >
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-800">نشانی کامل پستی:</label>
            <textarea
              v-model="shippingAddress"
              rows="2"
              class="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink resize-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block font-bold text-slate-800">مبلغ سفارش (تومان):</label>
            <input
              v-model.number="orderAmount"
              type="number"
              class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
            >
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            class="h-9 px-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="isManualOrderModalOpen = false"
          >
            انصراف
          </button>
          <button
            type="button"
            data-testid="submit-manual-order-btn"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer shadow-2xs"
            @click="handleSubmit"
          >
            ثبت سفارش
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
