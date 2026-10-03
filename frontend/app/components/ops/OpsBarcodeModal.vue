<script setup lang="ts">
import { Sparkles } from '@lucide/vue'

const {
  isBarcodeModalOpen,
  barcodeInput,
  generateSampleBarcode,
  submitBarcode,
} = useOpsOrders()
</script>

<template>
  <!-- مودال تخصیص بارکد ۲۴ رقمی پست (Exact Text Preserved) -->
  <Dialog :open="isBarcodeModalOpen" @update:open="isBarcodeModalOpen = $event">
    <DialogContent class="sm:max-w-md bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl">
      <DialogHeader>
        <DialogTitle class="text-base font-black text-slate-900">
          تخصیص بارکد ۲۴ رقمی شرکت ملی پست
        </DialogTitle>
        <DialogDescription class="text-xs text-slate-600">
          کد رهگیری صادرشده از باجه پستی را وارد کنید تا پیامک رهگیری به خریدار ارسال شود.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">بارکد ۲۴ رقمی مرسوله</label>
          <input
            v-model="barcodeInput"
            data-testid="dispatch-barcode-input"
            type="text"
            maxlength="24"
            placeholder="مثال: 982341908234123456789012"
            class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono tracking-widest text-slate-900 outline-hidden focus:bg-white focus:border-ink"
          >
        </div>

        <button
          type="button"
          class="text-xs text-ink hover:underline font-bold cursor-pointer flex items-center gap-1"
          @click="generateSampleBarcode"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>تولید بارکد ۲۴ رقمی نمونه برای تست</span>
        </button>
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          @click="isBarcodeModalOpen = false"
        >
          انصراف
        </button>
        <button
          type="button"
          data-testid="submit-barcode-btn"
          class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer"
          @click="submitBarcode"
        >
          ثبت بارکد و ارسال مرسوله
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
