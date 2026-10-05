<!-- frontend/app/components/ops/orders/AdminBarcodeModal.vue -->
<script setup lang="ts">
import {
  Truck,
  X,
  Sparkles,
} from '@lucide/vue'
import { useAdminOrders } from '~/composables/ops/useAdminOrders'

const {
  isBarcodeModalOpen,
  selectedOrderForBarcode,
  submitBarcode,
} = useAdminOrders()

const barcodeInput = ref('')

watch(selectedOrderForBarcode, (order) => {
  if (order) {
    barcodeInput.value = order.trackingCode || ''
  }
})

const generateTestBarcode = () => {
  barcodeInput.value = `18939${Math.floor(1000000000000000000 + Math.random() * 9000000000000000000)}`.slice(0, 24)
}

const handleSubmit = () => {
  if (selectedOrderForBarcode.value && barcodeInput.value) {
    submitBarcode(selectedOrderForBarcode.value.orderNumber, barcodeInput.value)
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isBarcodeModalOpen && selectedOrderForBarcode"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans"
      role="dialog"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <Truck class="w-5 h-5 text-amber-600" />
            <h3 class="text-sm font-bold text-slate-900">
              تخصیص بارکد ۲۴ رقمی شرکت ملی پست
            </h3>
          </div>
          <button
            type="button"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            @click="isBarcodeModalOpen = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3">
          <div class="text-xs text-slate-600">
            سفارش: <strong class="font-mono text-slate-900">{{ selectedOrderForBarcode.orderNumber }}</strong> — {{ selectedOrderForBarcode.recipientName }}
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-800">بارکد ۲۴ رقمی پست پیشتاز:</label>
              <button
                type="button"
                class="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                @click="generateTestBarcode"
              >
                <Sparkles class="w-3 h-3" />
                <span>تولید بارکد ۲۴ رقمی نمونه برای تست</span>
              </button>
            </div>
            <input
              v-model="barcodeInput"
              type="text"
              placeholder="بارکد ۲۴ رقمی را وارد نمایید..."
              dir="ltr"
              class="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink text-start"
            >
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            class="h-9 px-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="isBarcodeModalOpen = false"
          >
            انصراف
          </button>
          <button
            type="button"
            data-testid="submit-barcode-btn"
            class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer shadow-2xs"
            @click="handleSubmit"
          >
            ثبت بارکد
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
