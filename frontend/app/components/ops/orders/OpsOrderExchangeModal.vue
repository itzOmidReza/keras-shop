<!-- frontend/app/components/ops/orders/OpsOrderExchangeModal.vue -->
<script setup lang="ts">
import {
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowLeftRight,
} from '@lucide/vue'
import { useOpsFulfillmentDesk } from '~/composables/ops/useOpsFulfillmentDesk'
import { toFa } from '~/utils/format'

const {
  isExchangeModalOpen,
  selectedItemForExchange,
  requestSizeExchange,
} = useOpsFulfillmentDesk()

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
const targetSize = ref('L')
const exchangeReason = ref('small_fit')
const exchangeNote = ref('')
const isSubmitting = ref(false)

// وضعیت شبیه‌سازی موجودی سایز انتخابی
const stockForTargetSize = computed(() => {
  if (targetSize.value === selectedItemForExchange.value?.item.size) return 0
  const hash = targetSize.value.charCodeAt(0) % 5
  return hash + 2
})

const reasons = [
  { id: 'small_fit', label: 'کوچک بودن اندازه (تنگ بودن سرشانه یا دور سینه)' },
  { id: 'large_fit', label: 'بزرگ بودن اندازه (آزادی بیش از حد یا بلندی آستین)' },
  { id: 'customer_preference', label: 'تغییر سلیقه خریدار به سبک اورسایز (Oversized)' },
]

watch(selectedItemForExchange, (val) => {
  if (val) {
    // پیش‌فرض یک سایز بزرگتر یا متفاوت را انتخاب می‌کنیم
    const currentIdx = availableSizes.indexOf(val.item.size)
    if (currentIdx !== -1 && currentIdx < availableSizes.length - 1) {
      targetSize.value = availableSizes[currentIdx + 1]!
    } else {
      targetSize.value = 'M'
    }
  }
})

const handleConfirmExchange = () => {
  if (!selectedItemForExchange.value) return
  isSubmitting.value = true

  const success = requestSizeExchange(
    selectedItemForExchange.value.order.orderNumber,
    selectedItemForExchange.value.item.title,
    selectedItemForExchange.value.item.size,
    targetSize.value,
    exchangeNote.value || 'ثبت درخواست تعویض سایز توسط واحد امور مشتریان',
  )

  isSubmitting.value = false
  if (success) {
    isExchangeModalOpen.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isExchangeModalOpen && selectedItemForExchange"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200/80 my-8"
      >
        <!-- سربرگ -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <RotateCcw class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-base font-black text-slate-900 tracking-tight">
                فرایند تعویض سایز و مرجوعی معکوس
              </h2>
              <p class="text-xs text-slate-500 font-mono">
                سفارش: {{ selectedItemForExchange.order.orderNumber }} — {{ selectedItemForExchange.order.recipientName }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
            @click="isExchangeModalOpen = false"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- کارت کالای مورد نظر برای تعویض -->
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <img
            :src="selectedItemForExchange.item.image"
            :alt="selectedItemForExchange.item.title"
            class="w-14 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
          >
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-slate-900 truncate">
              {{ selectedItemForExchange.item.title }}
            </h4>
            <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
              <span>رنگ: {{ selectedItemForExchange.item.color }}</span>
              <span>•</span>
              <span>سایز فعلی: <strong class="text-rose font-bold">{{ selectedItemForExchange.item.size }}</strong></span>
            </div>
            <span class="text-[10px] text-slate-400 font-mono block mt-0.5">
              SKU: {{ selectedItemForExchange.item.sku }}
            </span>
          </div>
        </div>

        <!-- انتخاب سایز مقصد و وضعیت رزرو انبار -->
        <div class="space-y-3">
          <label class="block text-xs font-bold text-slate-800">
            سایز درخواستی جدید جهت رزرو در انبار:
          </label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="size in availableSizes"
              :key="size"
              type="button"
              :disabled="size === selectedItemForExchange.item.size"
              class="h-10 rounded-xl text-xs font-bold transition-all border flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              :class="targetSize === size ? 'bg-ink text-white border-ink shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              @click="targetSize = size"
            >
              {{ size }}
            </button>
          </div>

          <!-- اعلان رزرو انبار -->
          <div
            class="flex items-center gap-2 p-3 rounded-xl text-xs"
            :class="stockForTargetSize > 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'"
          >
            <CheckCircle2 v-if="stockForTargetSize > 0" class="w-4 h-4 shrink-0" />
            <AlertCircle v-else class="w-4 h-4 shrink-0" />
            <span>
              وضعیت موجودی سایز {{ targetSize }}:
              <strong>{{ stockForTargetSize > 0 ? `موجود (${toFa(stockForTargetSize)} عدد در انبار مرکز آماده رزرو)` : 'اتمام موجودی' }}</strong>
            </span>
          </div>
        </div>

        <!-- علت تعویض -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-800">
            علت تعویض سایز:
          </label>
          <select
            v-model="exchangeReason"
            class="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white outline-hidden"
          >
            <option v-for="r in reasons" :key="r.id" :value="r.id">
              {{ r.label }}
            </option>
          </select>
        </div>

        <!-- یادداشت کارشناس -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-800">
            یادداشت داخلی برای اپراتور انبار و کنترل بهداشت:
          </label>
          <textarea
            v-model="exchangeNote"
            rows="2"
            placeholder="مثال: بسته‌بندی اولیه باز نشده و تگ الصاقی پلمپ است..."
            class="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white outline-hidden resize-none"
          />
        </div>

        <!-- ۳ گام پردازش لجستیک معکوس -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-[11px]">
          <h4 class="font-bold text-slate-800 flex items-center gap-1.5">
            <ArrowLeftRight class="w-3.5 h-3.5 text-slate-600" />
            <span>چرخه استاندارد تعویض سایز کراس:</span>
          </h4>
          <div class="space-y-1.5 text-slate-600">
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px]">۱</span>
              <span>رزرو آنی سایز درخواستی در سامانه و صدور بارکد مرجوعی معکوس</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">۲</span>
              <span>دریافت بسته مرجوعی در انبار و تست عدم بوی عطر، عدم شستشو و اصالت تگ</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">۳</span>
              <span>ترخیص و ارسال اتوماتیک سایز جدید با پست پیشتاز</span>
            </div>
          </div>
        </div>

        <!-- دکمه‌های عملیات -->
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            class="h-10 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="isExchangeModalOpen = false"
          >
            انصراف
          </button>

          <button
            type="button"
            :disabled="stockForTargetSize === 0 || isSubmitting"
            class="h-10 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleConfirmExchange"
          >
            <RotateCcw class="w-4 h-4" />
            <span>ثبت تعویض و رزرو انبار</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
