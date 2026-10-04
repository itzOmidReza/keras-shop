<!-- frontend/app/components/ops/catalog/OpsCatalogMatrixModal.vue -->
<script setup lang="ts">
import { Grid, Sparkles, Check, X } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useOpsCatalogMatrix } from '~/composables/ops/useOpsCatalogMatrix'
import { formatToman, toFa } from '~/utils/format'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const {
  baseSkuPrefix,
  defaultBasePrice,
  defaultStock,
  defaultWeight,
  matrixItems,
  totalVariantStock,
  activeVariantsCount,
  generateMatrix,
} = useOpsCatalogMatrix()

const handleCommitMatrix = () => {
  toast.success(`${toFa(activeVariantsCount.value)} متغیر جدید با موفقیت به کاتالوگ آتلیه الحاق شد`)
  emit('update:open', false)
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div class="bg-white rounded-2xl border border-sand shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="p-5 border-b border-sand flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-sand/50 text-ink flex items-center justify-center">
            <Grid class="w-4 h-4 text-rose" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-ink">ماتریس متغیرهای چندبعدی کالا (Color x Size Matrix)</h3>
            <p class="text-2xs text-muted-foreground mt-0.5">تولید خودکار SKU، بارکد EAN-13، وزن و کنترل موجودی متغیرها</p>
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

      <!-- کنترل‌های ورودی ماتریس -->
      <div class="p-4 bg-paper border-b border-sand/60 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 text-xs">
        <div>
          <label class="block text-2xs text-muted-foreground font-bold mb-1">پیشوند کد SKU:</label>
          <input
            v-model="baseSkuPrefix"
            type="text"
            class="w-full h-8 px-2 font-mono text-2xs rounded-lg border border-sand bg-white"
          >
        </div>
        <div>
          <label class="block text-2xs text-muted-foreground font-bold mb-1">قیمت پایه (تومان):</label>
          <input
            v-model.number="defaultBasePrice"
            type="number"
            class="w-full h-8 px-2 font-mono text-xs rounded-lg border border-sand bg-white"
          >
        </div>
        <div>
          <label class="block text-2xs text-muted-foreground font-bold mb-1">موجودی پیش‌فرض هر سایز:</label>
          <input
            v-model.number="defaultStock"
            type="number"
            class="w-full h-8 px-2 font-mono text-xs rounded-lg border border-sand bg-white"
          >
        </div>
        <div>
          <label class="block text-2xs text-muted-foreground font-bold mb-1">وزن پارچه (گرم):</label>
          <input
            v-model.number="defaultWeight"
            type="number"
            class="w-full h-8 px-2 font-mono text-xs rounded-lg border border-sand bg-white"
          >
        </div>
      </div>

      <!-- پیش‌نمایش جدول متغیرها -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-sand/50 text-xs">
          <span class="font-bold text-ink">ترکیبات تولیدشده ({{ toFa(matrixItems.length) }} ردیف):</span>
          <button
            type="button"
            class="text-2xs font-bold text-rose flex items-center gap-1 cursor-pointer hover:underline"
            @click="generateMatrix"
          >
            <Sparkles class="w-3 h-3" />
            <span>بازسازی ماتریس</span>
          </button>
        </div>

        <div class="border border-sand/70 rounded-xl overflow-hidden">
          <table class="w-full text-xs text-start">
            <thead class="bg-sand/30 text-muted-foreground text-2xs font-bold border-b border-sand/70">
              <tr>
                <th class="p-2.5 text-start">رنگ</th>
                <th class="p-2.5 text-start">سایز</th>
                <th class="p-2.5 text-start">SKU اختصاصی</th>
                <th class="p-2.5 text-start">بارکد EAN-13</th>
                <th class="p-2.5 text-start">موجودی</th>
                <th class="p-2.5 text-start">قیمت (تومان)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-sand/40">
              <tr v-for="item in matrixItems" :key="item.id" class="hover:bg-sand/10">
                <td class="p-2.5 font-bold text-ink">{{ item.color }}</td>
                <td class="p-2.5 font-mono text-2xs font-bold text-slate-800">{{ item.size }}</td>
                <td class="p-2.5 font-mono text-2xs text-muted-foreground">{{ item.sku }}</td>
                <td class="p-2.5 font-mono text-2xs text-slate-600">{{ item.barcode }}</td>
                <td class="p-2.5 font-mono text-xs font-bold text-emerald-800">{{ toFa(item.stock) }}</td>
                <td class="p-2.5 font-mono text-2xs text-ink">{{ formatToman(item.salePrice) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- فوتر -->
      <div class="p-4 bg-sand/10 border-t border-sand flex items-center justify-between shrink-0">
        <div class="text-2xs text-muted-foreground font-mono">
          <span>مجموع موجودی ماتریس: </span>
          <strong class="text-ink font-bold">{{ toFa(totalVariantStock) }} عدد</strong>
        </div>

        <div class="flex items-center gap-2">
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
            @click="handleCommitMatrix"
          >
            <Check class="w-4 h-4 text-emerald-400" />
            <span>ثبت نهایی متغیرها</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
