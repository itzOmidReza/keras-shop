<script setup lang="ts">
import { Printer } from '@lucide/vue'

const {
  isPackingSlipModalOpen,
  selectedSlipOrder,
  triggerPrintSlip,
} = useOpsOrders()
</script>

<template>
  <!-- مودال چاپ برگ ارسال پستی (Packing Slip Modal) -->
  <Dialog :open="isPackingSlipModalOpen" @update:open="isPackingSlipModalOpen = $event">
    <DialogContent class="sm:max-w-xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-base font-black text-slate-900">
          برگ ارسال مرسوله پستی (Packing Slip)
        </DialogTitle>
        <DialogDescription class="text-xs text-slate-500">
          برچسب چاپی استاندارد برای درج روی جعبه ارسالی آتلیه کراس
        </DialogDescription>
      </DialogHeader>

      <div v-if="selectedSlipOrder" class="p-4 border border-slate-300 rounded-xl space-y-4 text-xs font-sans bg-white">
        <div class="flex items-center justify-between border-b border-slate-300 pb-3">
          <div>
            <span class="font-black text-sm text-slate-900 block">کراس • استودیو مد و لباس</span>
            <span class="text-[10px] text-slate-500 block">برگ ارسال مرسوله پستی</span>
          </div>
          <div class="text-end font-mono">
            <span class="font-bold text-slate-900 block">{{ selectedSlipOrder.orderNumber }}</span>
            <span class="text-[10px] text-slate-500 block">پست پیشتاز</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg text-[11px]">
          <div>
            <span class="font-bold text-slate-700 block">فرستنده:</span>
            <p class="text-slate-600 mt-1 leading-relaxed">
              آتلیه مد کراس — تهران، خیابان فرشته، پلاک ۱۸<br>
              تلفن پشتیبانی: ۰۲۱۲۲۰۰۳۳۰۰
            </p>
          </div>
          <div>
            <span class="font-bold text-slate-700 block">گیرنده:</span>
            <p class="text-slate-900 font-bold mt-1">{{ selectedSlipOrder.recipientName }}</p>
            <p class="text-slate-600 font-mono">{{ selectedSlipOrder.recipientPhone || '—' }}</p>
            <p class="text-slate-600 mt-1 leading-relaxed">{{ selectedSlipOrder.shippingAddress }}</p>
          </div>
        </div>

        <div class="border border-slate-200 rounded-lg overflow-hidden">
          <table class="w-full text-start text-[11px]">
            <thead class="bg-slate-100 font-bold border-b border-slate-200">
              <tr>
                <th class="p-2 text-start">شرح کالا</th>
                <th class="p-2 text-center">سایز</th>
                <th class="p-2 text-center">تعداد</th>
                <th class="p-2 text-end">مبلغ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(item, idx) in selectedSlipOrder.items" :key="idx">
                <td class="p-2 font-bold">{{ item.title }}</td>
                <td class="p-2 text-center font-mono">{{ item.size }}</td>
                <td class="p-2 text-center font-mono">{{ item.quantity }}</td>
                <td class="p-2 text-end font-mono">{{ formatToman(item.price) }} ت</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between items-center pt-2 font-bold text-xs">
          <span>مجموع ارزش فاکتور:</span>
          <span class="font-mono text-sm">{{ formatToman(selectedSlipOrder.totalAmount) }} تومان</span>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
        <button
          type="button"
          class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          @click="isPackingSlipModalOpen = false"
        >
          بستن
        </button>
        <button
          type="button"
          data-testid="do-print-slip-btn"
          class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          @click="triggerPrintSlip"
        >
          <Printer class="w-4 h-4" />
          <span>چاپ برگه ارسال</span>
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
