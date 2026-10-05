<!-- frontend/app/components/ops/orders/OpsWavePickingModal.vue -->
<script setup lang="ts">
import {
  Boxes,
  CheckCircle2,
  Printer,
  X,
  Check,
} from '@lucide/vue'
import { useOpsFulfillmentDesk } from '~/composables/ops/useOpsFulfillmentDesk'
import { toFa } from '~/utils/format'

const {
  isWavePickingOpen,
  wavePickingRows,
  selectedOrderIds,
} = useOpsFulfillmentDesk()

const checkedRows = ref<Record<string, boolean>>({})

const totalItemsToPick = computed(() => {
  return wavePickingRows.value.reduce((acc, row) => acc + row.totalQuantity, 0)
})

const completedItemsCount = computed(() => {
  return wavePickingRows.value
    .filter((row) => checkedRows.value[row.key])
    .reduce((acc, row) => acc + row.totalQuantity, 0)
})

const progressPercentage = computed(() => {
  if (totalItemsToPick.value === 0) return 0
  return Math.round((completedItemsCount.value / totalItemsToPick.value) * 100)
})

const toggleRowChecked = (key: string) => {
  checkedRows.value[key] = !checkedRows.value[key]
}

const toggleAllChecked = () => {
  const allChecked = wavePickingRows.value.every((r) => checkedRows.value[r.key])
  for (const r of wavePickingRows.value) {
    checkedRows.value[r.key] = !allChecked
  }
}

const handlePrint = () => {
  if (import.meta.client && typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div
    v-if="isWavePickingOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans"
  >
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- هدر دیالوگ -->
      <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center">
            <Boxes class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-bold text-slate-900">
              لیست تجمیعی گردآوری کالا از انبار (Wave Picking List)
            </h2>
            <p class="text-[11px] text-slate-500 mt-0.5">
              تجمیع اقلام {{ toFa(selectedOrderIds.length > 0 ? selectedOrderIds.length : 'کلیه') }} سفارش بر اساس مدل، کالیته رنگ و سایز
            </p>
          </div>
        </div>

        <button
          type="button"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          @click="isWavePickingOpen = false"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- نوار پیشرفت و خلاصه گردآوری -->
      <div class="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-3">
          <span class="font-bold text-slate-700">پیشرفت انبارداری:</span>
          <span class="font-mono font-bold text-ink bg-sand-100/70 px-2 py-0.5 rounded-md tabular-nums">
            {{ toFa(completedItemsCount) }} از {{ toFa(totalItemsToPick) }} قلم ({{ toFa(progressPercentage) }}٪)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-8 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            @click="toggleAllChecked"
          >
            <Check class="w-3.5 h-3.5 text-slate-500" />
            <span>انتخاب همه</span>
          </button>
          <button
            type="button"
            class="h-8 px-3 rounded-xl bg-ink hover:bg-ink/90 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-xs"
            @click="handlePrint"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>چاپ برگه انباردار</span>
          </button>
        </div>
      </div>

      <!-- لیست تجمیعی اقلام گردآوری -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
        <div
          v-for="row in wavePickingRows"
          :key="row.key"
          class="p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer"
          :class="checkedRows[row.key] ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950' : 'border-slate-200 bg-white hover:bg-slate-50/80'"
          @click="toggleRowChecked(row.key)"
        >
          <!-- تصویر و مشخصات لباس -->
          <div class="flex items-center gap-3 min-w-0">
            <input
              type="checkbox"
              :checked="checkedRows[row.key]"
              class="w-4 h-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              @click.stop="toggleRowChecked(row.key)"
            >
            <img
              v-if="row.image"
              :src="row.image"
              :alt="row.title"
              class="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
            >
            <div class="min-w-0">
              <span class="text-xs font-bold text-slate-900 block truncate">{{ row.title }}</span>
              <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span class="font-bold text-slate-700">رنگ: {{ row.color }}</span>
                <span>•</span>
                <span class="font-bold font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-800">سایز {{ row.size }}</span>
                <span>•</span>
                <span class="font-mono text-[10px] text-slate-400">کد: {{ row.sku }}</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-1 font-mono">
                سفارش‌ها: {{ row.orderNumbers.join('، ') }}
              </div>
            </div>
          </div>

          <!-- تعداد مورد نیاز برای انبارداری -->
          <div class="text-end shrink-0">
            <div class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 font-bold font-mono text-sm border border-slate-200 tabular-nums">
              {{ toFa(row.totalQuantity) }} عدد
            </div>
            <span
              v-if="checkedRows[row.key]"
              class="text-[10px] text-emerald-700 font-bold block mt-1 flex items-center gap-0.5 justify-end"
            >
              <CheckCircle2 class="w-3 h-3 text-emerald-600" />
              <span>گردآوری شد</span>
            </span>
          </div>
        </div>

        <div v-if="wavePickingRows.length === 0" class="p-8 text-center text-slate-500 text-xs">
          اقلامی برای گردآوری در این دسته سفارش‌ها موجود نیست.
        </div>
      </div>

      <!-- فوتر دیالوگ -->
      <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <span class="text-[11px] text-slate-500">
          توصیه: اقلام پس از گردآوری جهت بررسی کنترل کیفیت (QC) به میز بسته‌بندی منتقل شوند.
        </span>
        <button
          type="button"
          class="h-9 px-4 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
          @click="isWavePickingOpen = false"
        >
          بستن پنجره
        </button>
      </div>
    </div>
  </div>
</template>
