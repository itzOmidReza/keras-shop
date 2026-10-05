<!-- frontend/app/components/ops/orders/OpsBatchActionDock.vue -->
<script setup lang="ts">
import {
  CheckSquare,
  ListTodo,
  Printer,
  Truck,
  FileSpreadsheet,
  X,
} from '@lucide/vue'
import { useOpsFulfillmentDesk } from '~/composables/ops/useOpsFulfillmentDesk'
import { useOpsShippingManifest } from '~/composables/ops/useOpsShippingManifest'
import { toFa } from '~/utils/format'

const {
  selectedOrderIds,
  clearSelection,
  batchTransitionStage,
  exportDistributionExcel,
  isWavePickingOpen,
  enrichedOrders,
} = useOpsFulfillmentDesk()

const { openBulkThermalLabels } = useOpsShippingManifest()

const selectedOrders = computed(() => {
  return enrichedOrders.value.filter((o) => selectedOrderIds.value.includes(o.orderNumber))
})

const handleBulkPrintThermal = () => {
  openBulkThermalLabels(selectedOrders.value)
}

const handleBulkHandoverToCarrier = () => {
  batchTransitionStage('shipped')
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-16 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-16 opacity-0"
  >
    <div
      v-if="selectedOrderIds.length > 0"
      class="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 font-sans pointer-events-none"
    >
      <div
        class="bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-2xl border border-slate-700/80 flex flex-wrap items-center gap-3 sm:gap-4 pointer-events-auto backdrop-blur-md"
      >
        <!-- تعداد سفارش‌های انتخاب شده -->
        <div class="flex items-center gap-2 pe-3 border-e border-slate-700 text-xs">
          <div class="w-6 h-6 rounded-lg bg-ink/50 border border-slate-600 flex items-center justify-center">
            <CheckSquare class="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span class="font-bold">
            {{ toFa(selectedOrderIds.length) }} سفارش انتخاب شد
          </span>
        </div>

        <!-- لیست برداشت تجمیعی انبارداری (Wave Picking) -->
        <button
          type="button"
          class="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-700"
          title="تولید لیست برداشت تجمیعی انبار (Wave Picking)"
          @click="isWavePickingOpen = true"
        >
          <ListTodo class="w-3.5 h-3.5 text-sky-400" />
          <span>برداشت تجمیعی انبار</span>
        </button>

        <!-- چاپ دسته‌ای برچسب‌های حرارتی ۱۰×۱۵ -->
        <button
          type="button"
          class="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-700"
          title="چاپ تجمیعی برچسب‌های پستی ۱۰×۱۵ حرارتی"
          @click="handleBulkPrintThermal"
        >
          <Printer class="w-3.5 h-3.5 text-amber-400" />
          <span>چاپ لیبل ۱۰×۱۵</span>
        </button>

        <!-- تغییر وضعیت به تحویل به باجه پست -->
        <button
          type="button"
          class="h-9 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          title="انتقال دسته‌ای به مرحله تحویل به باجه پست / کوریر"
          @click="handleBulkHandoverToCarrier"
        >
          <Truck class="w-3.5 h-3.5" />
          <span>تحویل به پست</span>
        </button>

        <!-- خروجی اکسل توزیع -->
        <button
          type="button"
          class="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-700"
          title="دانلود فایل اکسل توزیع و مانیفست مأمور"
          @click="exportDistributionExcel"
        >
          <FileSpreadsheet class="w-3.5 h-3.5 text-emerald-400" />
          <span class="hidden sm:inline">اکسل توزیع</span>
        </button>

        <!-- لغو انتخاب‌ها -->
        <button
          type="button"
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors ms-1"
          title="لغو انتخاب‌ها"
          @click="clearSelection"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>
