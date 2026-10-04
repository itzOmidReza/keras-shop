<!-- frontend/app/components/ops/catalog/OpsWarehouseTransferModal.vue -->
<script setup lang="ts">
import { ArrowLeftRight, Check, X } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useOpsWarehouses } from '~/composables/ops/useOpsWarehouses'
import { toFa } from '~/utils/format'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const {
  warehouses,
  stratifiedStocks,
  transferStock,
} = useOpsWarehouses()

const sourceWh = ref('wh-tehran')
const targetWh = ref('wh-atelier')
const selectedSku = ref('KRS-COAT-KSH-M')
const transferQty = ref(3)
const transferNotes = ref('تامین سفارشات آتلیه نیاوران')

const currentSourceItem = computed(() => {
  return stratifiedStocks.value.find(s => s.sku === selectedSku.value && s.warehouseId === sourceWh.value)
})

const handleExecuteTransfer = () => {
  if (sourceWh.value === targetWh.value) {
    toast.error('انبار مبدا و مقصد نمی‌توانند یکسان باشند')
    return
  }

  const ok = transferStock(
    sourceWh.value,
    targetWh.value,
    selectedSku.value,
    transferQty.value,
    transferNotes.value,
  )

  if (ok) {
    emit('update:open', false)
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div class="bg-white rounded-2xl border border-sand shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="p-5 border-b border-sand flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-sand/40 text-ink flex items-center justify-center">
            <ArrowLeftRight class="w-4 h-4 text-rose" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-ink">صدور حواله انتقال بین‌انباری (Inter-Warehouse Transfer)</h3>
            <p class="text-2xs text-muted-foreground mt-0.5">جابجایی قانونی کالا بین مراکز لجستیکی آتلیه کراس</p>
          </div>
        </div>
        <button
          type="button"
          class="text-muted-foreground hover:text-ink cursor-pointer p-1"
          @click="emit('update:open', false)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="p-5 space-y-4">
        <!-- انتخاب انبارها -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-2xs font-bold text-muted-foreground mb-1">انبار مبدا:</label>
            <select
              v-model="sourceWh"
              class="w-full h-9 px-2.5 rounded-xl border border-sand bg-paper text-xs font-bold text-ink focus:outline-hidden"
            >
              <option v-for="w in warehouses" :key="w.id" :value="w.id">
                {{ w.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-2xs font-bold text-muted-foreground mb-1">انبار مقصد:</label>
            <select
              v-model="targetWh"
              class="w-full h-9 px-2.5 rounded-xl border border-sand bg-paper text-xs font-bold text-ink focus:outline-hidden"
            >
              <option v-for="w in warehouses" :key="w.id" :value="w.id">
                {{ w.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- انتخاب کالا و تعداد -->
        <div class="space-y-3 p-3 bg-sand/20 rounded-xl">
          <div>
            <label class="block text-2xs font-bold text-muted-foreground mb-1">کالا و کد SKU:</label>
            <select
              v-model="selectedSku"
              class="w-full h-9 px-2.5 rounded-xl border border-sand bg-white text-xs font-medium text-ink focus:outline-hidden"
            >
              <option v-for="s in stratifiedStocks" :key="s.id" :value="s.sku">
                {{ s.title }} ({{ s.sku }}) - سایز {{ s.size }}
              </option>
            </select>
          </div>

          <div class="flex items-center justify-between text-2xs text-muted-foreground font-mono">
            <span>موجودی آزاد در مبدا:</span>
            <strong class="text-ink font-bold">{{ toFa(currentSourceItem?.available ?? 0) }} عدد</strong>
          </div>

          <div>
            <label class="block text-2xs font-bold text-muted-foreground mb-1">تعداد انتقالی:</label>
            <input
              v-model.number="transferQty"
              type="number"
              min="1"
              :max="currentSourceItem?.available ?? 1"
              class="w-full h-9 px-3 rounded-xl border border-sand bg-white text-xs font-mono font-bold text-ink focus:outline-hidden"
            >
          </div>
        </div>

        <!-- توضیحات حواله -->
        <div>
          <label class="block text-2xs font-bold text-muted-foreground mb-1">علت و توضیحات حواله انبار:</label>
          <input
            v-model="transferNotes"
            type="text"
            placeholder="مثال: تامین سفارشات مشتریان یا کسری موجودی آتلیه..."
            class="w-full h-9 px-3 rounded-xl border border-sand bg-white text-xs text-ink focus:outline-hidden"
          >
        </div>
      </div>

      <div class="p-4 bg-sand/10 border-t border-sand flex items-center justify-end gap-2">
        <button
          type="button"
          class="h-9 px-3 rounded-xl border border-sand bg-white text-xs font-bold text-ink hover:bg-sand/30 cursor-pointer"
          @click="emit('update:open', false)"
        >
          انصراف
        </button>
        <button
          type="button"
          class="h-9 px-4 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="handleExecuteTransfer"
        >
          <Check class="w-4 h-4 text-emerald-400" />
          <span>تایید و صدور حواله انبار</span>
        </button>
      </div>
    </div>
  </div>
</template>
