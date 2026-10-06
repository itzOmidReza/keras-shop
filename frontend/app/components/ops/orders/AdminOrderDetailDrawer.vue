<!-- frontend/app/components/ops/orders/AdminOrderDetailDrawer.vue -->
<script setup lang="ts">
import {
  X,
  Copy,
  Printer,
  Truck,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import {
  useAdminOrders,
  PIPELINE_STATUSES,
  ORDER_STATUS_CONFIG,
  SHIPPING_CARRIERS,
} from '~/composables/admin/useAdminOrders'
import { toFa, formatToman } from '~/utils/format'
import type { OrderStatus } from '~/types/domain'

const {
  isDetailDrawerOpen,
  selectedOrderForDetail,
  closeOrderDetail,
  updateStatus,
  dispatchShippingAPI,
  setTrackingCode,
  inquireCarrierStatus,
  activeInquiryResult,
  isInquiring,
  generateCustomerSMS,
  openPackingSlip,
} = useAdminOrders()

const trackingInput = ref('')
const selectedCarrier = ref('شرکت ملی پست (پیشتاز)')
const customNote = ref('')

watch(selectedOrderForDetail, (order) => {
  if (order) {
    trackingInput.value = order.trackingCode || ''
    selectedCarrier.value = order.carrier || 'شرکت ملی پست (پیشتاز)'
    customNote.value = ''
  }
})

const copyText = (text: string, label: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    toast.success(`${label} در کلیپ‌بورد کپی شد.`)
  }
}

const handleStatusChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  if (!selectedOrderForDetail.value) return
  const newStatus = target.value as OrderStatus
  updateStatus(selectedOrderForDetail.value.orderNumber, newStatus)
}

const handleManualSaveTracking = () => {
  if (!selectedOrderForDetail.value) return
  if (!trackingInput.value.trim()) {
    toast.error('لطفاً کد رهگیری پستی را وارد نمایید.')
    return
  }
  setTrackingCode(
    selectedOrderForDetail.value.orderNumber,
    trackingInput.value.trim(),
    selectedCarrier.value,
  )
}

const handleGenerateCarrierBarcode = () => {
  if (!selectedOrderForDetail.value) return
  const barcode = dispatchShippingAPI(
    selectedOrderForDetail.value.orderNumber,
    selectedCarrier.value,
  )
  trackingInput.value = barcode
}

const handleInquireStatus = () => {
  if (!selectedOrderForDetail.value) return
  if (!selectedOrderForDetail.value.trackingCode) {
    toast.error('جهت استعلام آنلاین ابتدا باید کد رهگیری صادر یا ثبت شده باشد.')
    return
  }
  inquireCarrierStatus(selectedOrderForDetail.value)
}

const handleCopySMS = () => {
  if (!selectedOrderForDetail.value) return
  const sms = generateCustomerSMS(selectedOrderForDetail.value)
  copyText(sms, 'متن پیامک اطلاع‌رسانی')
}

const trackingPortalUrl = computed(() => {
  if (!selectedOrderForDetail.value?.trackingCode) return '#'
  const isTipax = selectedOrderForDetail.value.carrier.includes('تیپاکس')
  return isTipax
    ? `https://tipaxco.com/tracking?id=${selectedOrderForDetail.value.trackingCode}`
    : `https://tracking.post.ir/?id=${selectedOrderForDetail.value.trackingCode}`
})
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
        class="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250 border-s border-slate-200"
      >
        <!-- هدر دراور -->
        <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-sm text-slate-900">{{ selectedOrderForDetail.orderNumber }}</span>
              <span
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                :class="ORDER_STATUS_CONFIG[selectedOrderForDetail.status]?.badgeClass || 'bg-slate-100 text-slate-700'"
              >
                {{ ORDER_STATUS_CONFIG[selectedOrderForDetail.status]?.label || selectedOrderForDetail.statusLabel }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              ثبت سفارش: {{ selectedOrderForDetail.createdAt }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-8.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
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
          <!-- کنترل وضعیت و خط لوله سفارش (Status Pipeline Control) -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock class="w-4 h-4 text-amber-600" />
                <span>مرحله و وضعیت خط‌سفارش (Lifecycle Status):</span>
              </span>
              <span class="text-[11px] text-slate-500 font-mono">
                به‌روزرسانی آنی
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">تغییر وضعیت مستقیم:</label>
                <select
                  :value="selectedOrderForDetail.status"
                  class="w-full h-9.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white outline-hidden cursor-pointer"
                  @change="handleStatusChange"
                >
                  <option
                    v-for="s in PIPELINE_STATUSES"
                    :key="s.value"
                    :value="s.value"
                  >
                    {{ s.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">شرکت پستی / متصدی ارسال:</label>
                <select
                  v-model="selectedCarrier"
                  class="w-full h-9.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white outline-hidden cursor-pointer"
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
            </div>
          </div>

          <!-- بخش وب‌سرویس پستی و بارکد ۲۴ رقمی -->
          <div class="bg-indigo-50/60 border border-indigo-200/90 rounded-2xl p-4 space-y-3.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Truck class="w-4 h-4 text-indigo-600" />
                <span>وب‌سرویس پستی و بارکد ۲۴ رقمی:</span>
              </label>

              <!-- دکمه صدور خودکار بارکد از وبسرویس -->
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                @click="handleGenerateCarrierBarcode"
              >
                <Sparkles class="w-3 h-3" />
                <span>دریافت خودکار بارکد ۲۴ رقمی</span>
              </button>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <input
                  v-model="trackingInput"
                  type="text"
                  placeholder="بارکد ۲۴ رقمی (مثال: 626019...)"
                  dir="ltr"
                  class="flex-1 h-9.5 px-3 rounded-xl border border-indigo-200 text-xs font-mono font-bold text-slate-900 bg-white outline-hidden focus:border-indigo-600 text-start"
                >
                <button
                  type="button"
                  class="h-9.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors shrink-0"
                  @click="handleManualSaveTracking"
                >
                  ثبت کد
                </button>
              </div>

              <!-- کلیدهای تعاملی رهگیری پستی -->
              <div v-if="selectedOrderForDetail.trackingCode" class="flex flex-wrap items-center gap-2 pt-1">
                <!-- استعلام زنده وضعیت پستی -->
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 hover:bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                  :disabled="isInquiring"
                  @click="handleInquireStatus"
                >
                  <Search class="w-3.5 h-3.5 text-indigo-600" />
                  <span>استعلام آخرین وضعیت پستی</span>
                </button>

                <!-- پیوند مستقیم به سامانه رهگیری شرکت ملی پست -->
                <a
                  :href="trackingPortalUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>سامانه رهگیری پست (tracking.post.ir)</span>
                  <ExternalLink class="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            <!-- کارت نتیجه استعلام زنده وضعیت پستی -->
            <div
              v-if="activeInquiryResult"
              class="bg-white border border-indigo-200 rounded-xl p-3.5 space-y-2.5 animate-in fade-in"
            >
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <span class="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                  <span>نتیجه استعلام شرکت ملی پست</span>
                </span>
                <span class="text-[10px] text-slate-400 font-mono">{{ activeInquiryResult.lastUpdate }}</span>
              </div>

              <div class="text-xs text-slate-700 font-medium">
                آخرین رویداد ثبت‌شده: <strong class="text-indigo-800">{{ activeInquiryResult.status }}</strong>
              </div>

              <div class="space-y-1.5 pt-1">
                <div
                  v-for="(cp, i) in activeInquiryResult.checkpoints"
                  :key="i"
                  class="text-[11px] p-2 rounded-lg bg-slate-50 flex items-start gap-2 border border-slate-100"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div class="flex-1">
                    <div class="font-bold text-slate-800 flex items-center justify-between">
                      <span>{{ cp.title }}</span>
                      <span class="text-[10px] text-slate-400 font-mono">{{ cp.timestamp }}</span>
                    </div>
                    <div class="text-slate-500 mt-0.5">{{ cp.location }} — {{ cp.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- پیش‌نمایش پیامک اطلاع‌رسانی به خریدار -->
          <div class="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <MessageSquare class="w-4 h-4 text-amber-700" />
                <span>متن پیامک ارسالی به خریدار (SMS Dispatch Template):</span>
              </span>
              <button
                type="button"
                class="text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                @click="handleCopySMS"
              >
                <Copy class="w-3 h-3" />
                <span>کپی متن پیامک</span>
              </button>
            </div>

            <div class="p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-line dir-rtl select-all">
              {{ generateCustomerSMS(selectedOrderForDetail) }}
            </div>
          </div>

          <!-- مشخصات گیرنده و نشانی پستی کامل -->
          <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span class="text-xs font-bold text-slate-900">مشخصات گیرنده و نشانی پستی</span>
              <button
                type="button"
                class="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                @click="copyText(`${selectedOrderForDetail.recipientName} - ${selectedOrderForDetail.recipientPhone} - ${selectedOrderForDetail.shippingAddress} - کدپستی: ${selectedOrderForDetail.postalCode || '۱۹۶۵۹۴۳۲۱۱'}`, 'آدرس کامل')"
              >
                <Copy class="w-3 h-3" />
                <span>کپی آدرس کامل</span>
              </button>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-slate-500">نام گیرنده:</span>
                <span class="font-bold text-slate-900">{{ selectedOrderForDetail.recipientName }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-slate-500">شماره همراه:</span>
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

          <!-- لیست دقیق اقلام داخل بسته با تصویر و مشخصات -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>اقلام داخل بسته ({{ toFa(selectedOrderForDetail.items.length) }} قلم)</span>
              <span class="text-slate-400 font-normal">جهت تطبیق با برگه آدرس</span>
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
                  class="w-14 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
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

          <!-- تاریخچه و وقایع سفارش (Timeline) -->
          <div v-if="selectedOrderForDetail.timeline?.length" class="space-y-3">
            <h3 class="text-xs font-bold text-slate-900">
              تاریخچه تغییرات و رهگیری داخلی
            </h3>
            <div class="space-y-2 border-s-2 border-slate-200 ps-4 ms-2">
              <div
                v-for="(ev, index) in selectedOrderForDetail.timeline"
                :key="index"
                class="relative text-xs space-y-0.5 pb-2"
              >
                <span class="absolute -start-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-white" />
                <div class="flex items-center justify-between font-bold text-slate-800">
                  <span>{{ ev.title }}</span>
                  <span class="text-[10px] text-slate-400 font-mono">{{ ev.timestamp }}</span>
                </div>
                <p class="text-[11px] text-slate-500 leading-normal">{{ ev.description }}</p>
              </div>
            </div>
          </div>

          <!-- خلاصه مالی و پرداخت -->
          <div class="border-t border-slate-200 pt-4 space-y-2 text-xs">
            <div class="flex items-center justify-between text-slate-500">
              <span>شیوه پرداخت:</span>
              <span class="font-bold text-slate-800">{{ selectedOrderForDetail.paymentMethod || 'پرداخت الکترونیک (شاپرک)' }}</span>
            </div>
            <div class="flex items-center justify-between text-sm font-bold text-slate-900 pt-1">
              <span>مبلغ کل فاکتور:</span>
              <span class="font-mono tabular-nums">{{ formatToman(selectedOrderForDetail.totalAmount) }} تومان</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
