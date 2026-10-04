<!-- frontend/app/components/ops/catalog/OpsCatalogSpreadsheet.vue -->
<script setup lang="ts">
import { Save, RotateCcw, TableProperties, Sparkles } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { toFa } from '~/utils/format'

interface SpreadsheetRow {
  id: string
  title: string
  sku: string
  color: string
  size: string
  basePrice: number
  salePrice: number
  stock: number
  isDirty?: boolean
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const initialData: SpreadsheetRow[] = [
  { id: '1', title: 'پالتو پشمی کشمیر دست‌دوز', sku: 'KRS-COAT-M', color: 'مشکی موکا', size: 'M', basePrice: 4850000, salePrice: 4250000, stock: 12 },
  { id: '2', title: 'پالتو پشمی کشمیر دست‌دوز', sku: 'KRS-COAT-S', color: 'مشکی موکا', size: 'S', basePrice: 4850000, salePrice: 4250000, stock: 4 },
  { id: '3', title: 'شومیز ابریشم سیلک طبیعی', sku: 'KRS-BLS-SLK', color: 'شنی نچرال', size: 'Free Size', basePrice: 2850000, salePrice: 2450000, stock: 22 },
  { id: '4', title: 'بافت یقه اسکی مرینوس', sku: 'KRS-KNIT-MRN-L', color: 'سبز مریم‌گلی', size: 'L', basePrice: 3250000, salePrice: 2850000, stock: 8 },
  { id: '5', title: 'شلوار راسته پشمی آتلیه', sku: 'KRS-PNT-WOL-M', color: 'خاک رس', size: 'M', basePrice: 2450000, salePrice: 2150000, stock: 15 },
]

const rows = ref<SpreadsheetRow[]>(JSON.parse(JSON.stringify(initialData)))
const dirtyCount = computed(() => rows.value.filter(r => r.isDirty).length)

const markDirty = (row: SpreadsheetRow) => {
  row.isDirty = true
}

const handleSaveAll = () => {
  rows.value.forEach(r => (r.isDirty = false))
  toast.success('تمامی تغییرات قیمت و موجودی اکسل با موفقیت ذخیره شد')
}

const handleResetAll = () => {
  rows.value = JSON.parse(JSON.stringify(initialData))
  toast.info('تغییرات ذخیره‌نشده جدول اکسل لغو گردید')
}
</script>

<template>
  <div class="bg-white border border-sand/80 rounded-2xl p-5 shadow-2xs space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand/60">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
          <TableProperties class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">نمای گسترده اکسل و ویرایش سریع کاتالوگ (Spreadsheet Mode)</h3>
          <p class="text-2xs text-muted-foreground mt-0.5">ویرایش دسته‌ای و زنده قیمت‌ها و موجودی انبار بدون باز کردن پنجره جداگانه</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span v-if="dirtyCount > 0" class="inline-flex items-center gap-1 text-2xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
          <Sparkles class="w-3 h-3 text-amber-600 animate-spin" />
          <span>{{ toFa(dirtyCount) }} ردیف تغییر کرده</span>
        </span>

        <button
          v-if="dirtyCount > 0"
          type="button"
          class="h-8 px-2.5 rounded-lg border border-sand bg-white hover:bg-sand/30 text-ink text-xs font-bold flex items-center gap-1 cursor-pointer"
          @click="handleResetAll"
        >
          <RotateCcw class="w-3 h-3 text-muted-foreground" />
          <span>لغو تغییرات</span>
        </button>

        <button
          type="button"
          :disabled="dirtyCount === 0"
          class="h-8 px-3 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 flex items-center gap-1 cursor-pointer disabled:opacity-40"
          @click="handleSaveAll"
        >
          <Save class="w-3.5 h-3.5" />
          <span>ذخیره دسته‌ای</span>
        </button>

        <button
          type="button"
          class="h-8 px-2.5 rounded-lg border border-sand text-slate-600 hover:text-ink text-xs font-bold cursor-pointer"
          @click="emit('close')"
        >
          بستن اکسل
        </button>
      </div>
    </div>

    <!-- جدول اکسل -->
    <div class="overflow-x-auto border border-sand/70 rounded-xl">
      <table class="w-full text-xs text-start">
        <thead class="bg-sand/30 text-muted-foreground font-bold border-b border-sand text-2xs">
          <tr>
            <th class="p-3 text-start">عنوان کالا</th>
            <th class="p-3 text-start">SKU</th>
            <th class="p-3 text-start">رنگ و سایز</th>
            <th class="p-3 text-start">قیمت پایه (تومان)</th>
            <th class="p-3 text-start">قیمت فروش تخفیفی (تومان)</th>
            <th class="p-3 text-start">موجودی انبار</th>
            <th class="p-3 text-center">وضعیت</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-sand/50">
          <tr
            v-for="row in rows"
            :key="row.id"
            class="transition-colors"
            :class="row.isDirty ? 'bg-amber-50/40' : 'hover:bg-sand/10'"
          >
            <td class="p-3 font-bold text-ink max-w-44 truncate">
              {{ row.title }}
            </td>
            <td class="p-3 font-mono text-2xs text-muted-foreground">
              {{ row.sku }}
            </td>
            <td class="p-3 text-2xs text-ink">
              <span class="font-bold">{{ row.color }}</span> / <span>{{ row.size }}</span>
            </td>
            <td class="p-2">
              <input
                v-model.number="row.basePrice"
                type="number"
                class="w-28 h-8 px-2 text-xs font-mono font-bold rounded-lg border bg-white focus:outline-hidden"
                :class="row.isDirty ? 'border-amber-400 bg-amber-50/20' : 'border-sand'"
                @input="markDirty(row)"
              >
            </td>
            <td class="p-2">
              <input
                v-model.number="row.salePrice"
                type="number"
                class="w-28 h-8 px-2 text-xs font-mono font-bold rounded-lg border bg-white focus:outline-hidden"
                :class="row.isDirty ? 'border-amber-400 bg-amber-50/20' : 'border-sand'"
                @input="markDirty(row)"
              >
            </td>
            <td class="p-2">
              <input
                v-model.number="row.stock"
                type="number"
                class="w-16 h-8 px-2 text-center text-xs font-mono font-bold rounded-lg border bg-white focus:outline-hidden"
                :class="row.isDirty ? 'border-amber-400 bg-amber-50/20' : 'border-sand'"
                @input="markDirty(row)"
              >
            </td>
            <td class="p-3 text-center">
              <span
                v-if="row.isDirty"
                class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800"
              >
                تغییر یافته
              </span>
              <span
                v-else
                class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600"
              >
                همگام
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
