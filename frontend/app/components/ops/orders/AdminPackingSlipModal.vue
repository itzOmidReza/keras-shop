<!-- frontend/app/components/ops/orders/AdminPackingSlipModal.vue -->
<script setup lang="ts">
import {
  Printer,
  Package,
} from '@lucide/vue'
import { useAdminOrders } from '~/composables/ops/useAdminOrders'
import { toFa } from '~/utils/format'

const {
  isPackingSlipOpen,
  selectedOrderForPackingSlip,
  closePackingSlip,
  printCurrentSlip,
} = useAdminOrders()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isPackingSlipOpen && selectedOrderForPackingSlip"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans overflow-y-auto"
      role="dialog"
    >
      <div
        class="bg-white rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 my-8"
      >
        <!-- نوار ابزار کنترل مودال (عدم نمایش در پرینت) -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
          <div class="flex items-center gap-2">
            <Package class="w-5 h-5 text-ink" />
            <h3 class="text-sm font-bold text-slate-900">
              برگ ارسال مرسوله پستی (Packing Slip)
            </h3>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-8.5 px-3.5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              @click="printCurrentSlip"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>چاپ برگه</span>
            </button>

            <button
              type="button"
              class="h-8.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              @click="closePackingSlip"
            >
              بستن
            </button>
          </div>
        </div>

        <!-- برگه آدرس آماده چاپ (استاندارد جعبه و پاکت پستی) -->
        <div class="border-2 border-black rounded-xl p-5 space-y-4 bg-white text-black print:border-black print:p-0">
          <!-- سربرگ فرستنده -->
          <div class="border-b border-black pb-3 flex items-start justify-between">
            <div class="space-y-0.5">
              <span class="text-xs font-bold text-slate-500 block">فرستنده:</span>
              <span class="text-sm font-black tracking-wider block">آتلیه طراحی و دوخت پوشاک کراس</span>
              <span class="text-xs block text-slate-700">تهران، خیابان فرشته، پلاک ۲۴ • پشتیبانی: ۰۲۱-۲۲۰۱۸۸۹۹</span>
            </div>
            <div class="text-end font-mono">
              <span class="text-xs font-bold block">{{ selectedOrderForPackingSlip.orderNumber }}</span>
              <span class="text-[10px] text-slate-500 font-sans block">{{ selectedOrderForPackingSlip.createdAt }}</span>
            </div>
          </div>

          <!-- باکس مشخصات گیرنده -->
          <div class="border-2 border-black rounded-lg p-3.5 space-y-2 bg-slate-50/60">
            <span class="text-xs font-bold text-slate-500 block">گیرنده مرسوله:</span>
            <div class="text-sm font-black">
              {{ selectedOrderForPackingSlip.recipientName }}
            </div>
            <div class="text-xs text-slate-800 leading-relaxed">
              {{ selectedOrderForPackingSlip.shippingAddress }}
            </div>
            <div class="flex items-center justify-between pt-1 border-t border-slate-300 text-xs font-mono font-bold">
              <span>تلفن: {{ selectedOrderForPackingSlip.recipientPhone }}</span>
              <span>کد پستی: {{ selectedOrderForPackingSlip.postalCode || '۱۹۶۵۹۴۳۲۱۱' }}</span>
            </div>
          </div>

          <!-- خلاصه اقلام داخل کارتن -->
          <div class="space-y-1.5 pt-1">
            <span class="text-[11px] font-bold text-slate-600 block">محتویات بسته:</span>
            <div class="border border-slate-300 rounded-lg overflow-hidden text-xs">
              <div
                v-for="(item, i) in selectedOrderForPackingSlip.items"
                :key="i"
                class="p-2 border-b border-slate-200 last:border-b-0 flex items-center justify-between"
              >
                <span>{{ item.title }} — سایز: {{ item.size }} — {{ item.color }}</span>
                <span class="font-mono font-bold">{{ toFa(item.quantity) }} عدد</span>
              </div>
            </div>
          </div>

          <!-- بارکد پستی شبیه‌سازی‌شده -->
          <div v-if="selectedOrderForPackingSlip.trackingCode" class="text-center pt-2">
            <div class="font-mono text-xs font-black dir-ltr">
              {{ selectedOrderForPackingSlip.trackingCode }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
