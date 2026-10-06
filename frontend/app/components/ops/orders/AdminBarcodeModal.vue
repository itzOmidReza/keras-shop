<!-- frontend/app/components/ops/orders/AdminBarcodeModal.vue -->
<script setup lang="ts">
import {
  Truck,
  X,
  Sparkles,
  Zap,
} from '@lucide/vue'
import {
  useAdminOrders,
  SHIPPING_CARRIERS,
} from '~/composables/admin/useAdminOrders'

const {
  isBarcodeModalOpen,
  selectedOrderForBarcode,
  submitBarcode,
  generate24DigitBarcode,
  dispatchShippingAPI,
} = useAdminOrders()

const barcodeInput = ref('')
const selectedCarrier = ref('شرکت ملی پست (پیشتاز)')

watch(selectedOrderForBarcode, (order) => {
  if (order) {
    barcodeInput.value = order.trackingCode || ''
    selectedCarrier.value = order.carrier || 'شرکت ملی پست (پیشتاز)'
  }
})

const generateTestBarcode = () => {
  const carrierType = selectedCarrier.value.includes('تیپاکس') ? 'tipax' : 'post'
  barcodeInput.value = generate24DigitBarcode(carrierType)
}

const handleWebserviceDispatch = () => {
  if (!selectedOrderForBarcode.value) return
  const code = dispatchShippingAPI(
    selectedOrderForBarcode.value.orderNumber,
    selectedCarrier.value,
  )
  barcodeInput.value = code
  isBarcodeModalOpen.value = false
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
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
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

        <div class="space-y-3.5">
          <div class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            سفارش: <strong class="font-mono text-slate-900">{{ selectedOrderForBarcode.orderNumber }}</strong> — {{ selectedOrderForBarcode.recipientName }}
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">متصدی و شرکت حمل:</label>
            <select
              v-model="selectedCarrier"
              class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white outline-hidden cursor-pointer"
            >
              <option
                v-for="c in SHIPPING_CARRIERS"
                :key="c.id"
                :value="c.name"
              >
                {{ c.name }}
              </option>
            </select>
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

          <!-- کلید دریافت مستقیم از وب‌سرویس پستی -->
          <button
            type="button"
            class="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            @click="handleWebserviceDispatch"
          >
            <Zap class="w-3.5 h-3.5 text-indigo-600" />
            <span>صدور و تخصیص مستقیم از وب‌سرویس پستی</span>
          </button>
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
