<!-- frontend/app/components/ops/orders/AdminOrderDetailDrawer.vue -->
<script setup lang="ts">
import {
  X,
  Copy,
  Printer,
  Truck,
  MapPin,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useAdminOrders } from '~/composables/ops/useAdminOrders'
import { toFa, formatToman } from '~/utils/format'

const {
  isDetailDrawerOpen,
  selectedOrderForDetail,
  closeOrderDetail,
  setTrackingCode,
  openPackingSlip,
} = useAdminOrders()

const trackingInput = ref('')

watch(selectedOrderForDetail, (order) => {
  if (order) {
    trackingInput.value = order.trackingCode || ''
  }
})

const copyText = (text: string, label: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    toast.success(`${label} در کلیپ‌بورد کپی شد.`)
  }
}

const handleSaveTracking = () => {
  if (!selectedOrderForDetail.value) return
  if (!trackingInput.value.trim()) {
    toast.error('لطفاً کد رهگیری پستی را وارد نمایید.')
    return
  }
  setTrackingCode(selectedOrderForDetail.value.orderNumber, trackingInput.value.trim())
}
</script>

<template>
  <Teleport to="body">
    <!-- پس‌زمینه محو -->
    <div
      v-if="isDetailDrawerOpen && selectedOrderForDetail"
      class="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex justify-end font-sans transition-opacity"
      @click.self="closeOrderDetail"
    >
      <!-- دراور اسلاید از راست -->
      <div
        class="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250 border-s border-slate-200"
      >
        <!-- هدر دراور -->
        <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-sm text-slate-900">{{ selectedOrderForDetail.orderNumber }}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {{ selectedOrderForDetail.statusLabel }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              ثبت‌شده در: {{ selectedOrderForDetail.createdAt }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-8.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              @click="openPackingSlip(selectedOrderForDetail)"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>چاپ برگه آدرس</span>
            </button>

            <button
              type="button"
              class="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              @click="closeOrderDetail"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- محتوای دراور اسکرول‌پذیر -->
        <div class="flex-1 overflow-y-auto p-5 space-y-6">
          <!-- مشخصات تحویل‌گیرنده و نشانی پستی کامل -->
          <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span class="text-xs font-bold text-slate-900">مشخصات گیرنده و نشانی پستی</span>
              <button
                type="button"
                class="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                @click="copyText(`${selectedOrderForDetail.recipientName} - ${selectedOrderForDetail.recipientPhone} - ${selectedOrderForDetail.shippingAddress} - کدپستی: ${selectedOrderForDetail.postalCode || '۱۹۶۵۹'}`, 'آدرس کامل')"
              >
                <Copy class="w-3 h-3" />
                <span>کپی کل آدرس</span>
              </button>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-slate-500">نام گیرنده:</span>
                <span class="font-bold text-slate-900">{{ selectedOrderForDetail.recipientName }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-slate-500">شماره تماس:</span>
                <div class="flex items-center gap-1">
                  <span class="font-mono font-bold text-slate-900 dir-ltr">{{ selectedOrderForDetail.recipientPhone }}</span>
                  <button
                    type="button"
                    class="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    @click="copyText(selectedOrderForDetail.recipientPhone || '', 'شماره تماس')"
                  >
                    <Copy class="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div class="flex items-start gap-1.5 pt-1 text-slate-700">
                <MapPin class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span class="leading-relaxed">{{ selectedOrderForDetail.shippingAddress }}</span>
              </div>

              <div class="flex items-center justify-between pt-1 border-t border-slate-200/40">
                <span class="text-slate-500">کد پستی ۱۰ رقمی:</span>
                <div class="flex items-center gap-1">
                  <span class="font-mono font-bold text-slate-900">{{ selectedOrderForDetail.postalCode || '۱۹۶۵۹۴۳۲۱۱' }}</span>
                  <button
                    type="button"
                    class="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    @click="copyText(selectedOrderForDetail.postalCode || '1965943211', 'کد پستی')"
                  >
                    <Copy class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- باکس ثبت کد رهگیری پستی (پست یا تیپاکس) -->
          <div class="bg-indigo-50/50 border border-indigo-200/80 rounded-2xl p-4 space-y-3">
            <label class="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Truck class="w-4 h-4 text-indigo-600" />
              <span>کد رهگیری مرسوله (کد ۲۴ رقمی پست یا تیپاکس):</span>
            </label>

            <div class="flex items-center gap-2">
              <input
                v-model="trackingInput"
                type="text"
                placeholder="مثال: 189390012345678901234567"
                dir="ltr"
                class="flex-1 h-9.5 px-3 rounded-xl border border-indigo-200 text-xs font-mono font-bold text-slate-900 bg-white outline-hidden focus:border-indigo-600 text-start"
              >
              <button
                type="button"
                class="h-9.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-2xs"
                @click="handleSaveTracking"
              >
                ثبت و ارسال
              </button>
            </div>

            <p class="text-[11px] text-slate-500">
              با ثبت کد رهگیری، پیامک اطلاع‌رسانی برای خریدار ارسال شده و وضعیت سفارش به «ارسال‌شده» تغییر می‌یابد.
            </p>
          </div>

          <!-- لیست دقیق اقلام داخل بسته برای جلوگیری از اشتباه پرسنل -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>اقلام داخل بسته ({{ toFa(selectedOrderForDetail.items.length) }} قلم)</span>
              <span class="text-slate-400 font-normal">جهت چک نهایی بسته‌بندی</span>
            </h3>

            <div class="space-y-2.5">
              <div
                v-for="(item, idx) in selectedOrderForDetail.items"
                :key="idx"
                class="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3 shadow-2xs"
              >
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-12 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                >
                <div class="flex-1 min-w-0">
                  <h4 class="text-xs font-bold text-slate-900 truncate">{{ item.title }}</h4>
                  <div class="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
                    <span>رنگ: <strong>{{ item.color || 'مشکی' }}</strong></span>
                    <span>•</span>
                    <span>سایز: <strong class="text-rose">{{ item.size }}</strong></span>
                    <span>•</span>
                    <span>تعداد: <strong class="font-mono">{{ toFa(item.quantity) }}</strong></span>
                  </div>
                  <div class="text-[11px] font-mono font-bold text-slate-800 mt-1">
                    {{ formatToman(item.price) }} تومان
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- خلاصه فاکتور -->
          <div class="border-t border-slate-200 pt-4 space-y-2 text-xs">
            <div class="flex items-center justify-between text-slate-500">
              <span>روش پرداخت:</span>
              <span class="font-bold text-slate-800">{{ selectedOrderForDetail.paymentMethod || 'پرداخت آنلاین' }}</span>
            </div>
            <div class="flex items-center justify-between text-sm font-bold text-slate-900 pt-1">
              <span>مبلغ کل پرداختی:</span>
              <span class="font-mono tabular-nums">{{ formatToman(selectedOrderForDetail.totalAmount) }} تومان</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
