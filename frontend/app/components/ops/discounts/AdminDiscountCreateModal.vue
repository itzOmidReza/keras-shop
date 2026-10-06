<!-- frontend/app/components/ops/discounts/AdminDiscountCreateModal.vue -->
<script setup lang="ts">
import { Tag, X } from '@lucide/vue'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  create: [coupon: {
    code: string
    type: 'percent' | 'fixed'
    value: number
    minOrder: number
    maxDiscount: number
    expiresAt: string
    limit: number
  }]
}>()

const newCoupon = ref({
  code: '',
  type: 'percent' as 'percent' | 'fixed',
  value: 20,
  minOrder: 1500000,
  maxDiscount: 500000,
  expiresAt: '۱۴۰۵/۰۹/۳۰',
  limit: 100,
})

const handleCreate = () => {
  if (!newCoupon.value.code.trim()) return
  emit('create', { ...newCoupon.value })
  newCoupon.value = {
    code: '',
    type: 'percent',
    value: 20,
    minOrder: 1500000,
    maxDiscount: 500000,
    expiresAt: '۱۴۰۵/۰۹/۳۰',
    limit: 100,
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans"
      role="dialog"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <Tag class="w-5 h-5 text-ink" />
            <h3 class="text-sm font-bold text-slate-900">
              ایجاد کد تخفیف جدید
            </h3>
          </div>
          <button
            type="button"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            @click="emit('update:open', false)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="block font-bold text-slate-800">کد کوپن (حروف انگلیسی یا عدد):</label>
            <input
              v-model="newCoupon.code"
              type="text"
              placeholder="مثال: FALL1405"
              dir="ltr"
              class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink text-start"
            >
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block font-bold text-slate-800">نوع تخفیف:</label>
              <select
                v-model="newCoupon.type"
                class="w-full h-9.5 px-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white outline-hidden"
              >
                <option value="percent">درصدی (٪)</option>
                <option value="fixed">مبلغ ثابت (تومان)</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-800">مقدار تخفیف:</label>
              <input
                v-model.number="newCoupon.value"
                type="number"
                class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block font-bold text-slate-800">حداقل خرید (تومان):</label>
              <input
                v-model.number="newCoupon.minOrder"
                type="number"
                class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
              >
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-800">سقف تخفیف (تومان):</label>
              <input
                v-model.number="newCoupon.maxDiscount"
                type="number"
                class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block font-bold text-slate-800">تاریخ انقضا:</label>
              <input
                v-model="newCoupon.expiresAt"
                type="text"
                placeholder="۱۴۰۵/۰۹/۳۰"
                class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
              >
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-800">تعداد مجاز مصرف:</label>
              <input
                v-model.number="newCoupon.limit"
                type="number"
                class="w-full h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-ink"
              >
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            class="h-9 px-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="emit('update:open', false)"
          >
            انصراف
          </button>
          <button
            type="button"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer shadow-2xs"
            @click="handleCreate"
          >
            ثبت کوپن
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
