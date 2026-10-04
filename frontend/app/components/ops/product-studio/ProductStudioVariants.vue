<!-- frontend/app/components/ops/product-studio/ProductStudioVariants.vue -->
<script setup lang="ts">
import { Grid, RefreshCw, Plus, Trash2, Check, ArrowRightLeft } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import { useOpsTaxonomy, type ColorSwatch } from '~/composables/ops/useOpsTaxonomy'
import { useAuthStore } from '~/stores/auth'
import { toFa } from '~/utils/format'
import OpsQuickAddAttributeModal from '~/components/ops/taxonomy/OpsQuickAddAttributeModal.vue'

const {
  division,
  selectedColors,
  selectedSizes,
  variants,
  generateCartesianVariants,
  bulkApplyPricing,
  bulkApplyStock,
  markDirty,
} = useOpsProductStudio()

const { colorSwatches } = useOpsTaxonomy()
const authStore = useAuthStore()

const isQuickAddColorOpen = ref(false)

// ورودی‌های اعمال گروهی
const bulkRegularPriceInput = ref<number>(2450000)
const bulkSalePriceInput = ref<number>(2450000)
const bulkStockInput = ref<number>(10)

// سطح دسترسی به قیمت تمام‌شده
const canViewCostPrice = computed(() => {
  const role = authStore.user?.role as string | undefined
  return !role || role === 'super_admin' || role === 'accountant'
})

const availableSizesList = computed(() => {
  if (division.value === 'accessories') {
    return ['Free']
  }
  return ['XS', 'S', 'M', 'L', 'XL', '2XL', 'Free']
})

const toggleColor = (colorName: string) => {
  const idx = selectedColors.value.indexOf(colorName)
  if (idx > -1) {
    if (selectedColors.value.length > 1) {
      selectedColors.value.splice(idx, 1)
    }
  } else {
    selectedColors.value.push(colorName)
  }
  markDirty()
}

const toggleSize = (size: string) => {
  const idx = selectedSizes.value.indexOf(size)
  if (idx > -1) {
    if (selectedSizes.value.length > 1) {
      selectedSizes.value.splice(idx, 1)
    }
  } else {
    selectedSizes.value.push(size)
  }
  markDirty()
}

// تولید خودکار ترکیبات دکارتی هنگام تغییر کالیته رنگ یا سایز
watch(
  [selectedColors, selectedSizes],
  () => {
    generateCartesianVariants()
  },
  { deep: true },
)

// تولید مجدد دستی با اخطار تأییدیه
const handleManualRegenerate = () => {
  if (typeof window !== 'undefined') {
    const ok = window.confirm('آیا از بازسازی ماتریس متغیرها اطمینان دارید؟ تغییرات دستی پیشین حفظ اما ردیف‌های ترکیبی بازتولید می‌شوند.')
    if (!ok) return
  }
  generateCartesianVariants()
  markDirty()
}

const applyBulkPricingAction = () => {
  bulkApplyPricing(bulkRegularPriceInput.value, bulkSalePriceInput.value)
  markDirty()
}

const applyBulkStockAction = () => {
  bulkApplyStock(bulkStockInput.value)
  markDirty()
}

const removeVariantRow = (idx: number) => {
  variants.value.splice(idx, 1)
  markDirty()
}

const totalStockCount = computed(() => {
  return variants.value.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
})

const onColorCreated = (payload: { type: string, item: unknown }) => {
  if (payload.type === 'color' && payload.item && typeof payload.item === 'object' && 'name' in payload.item) {
    selectedColors.value.push((payload.item as ColorSwatch).name)
    generateCartesianVariants()
    markDirty()
  }
  isQuickAddColorOpen.value = false
}
</script>

<template>
  <section id="section-variants" class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5 font-sans">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
          <Grid class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900">
            ماتریس متغیرها و انبارداری
          </h2>
          <p class="text-[11px] text-slate-500">
            تولید هوشمند دکارتی کالیته رنگ و سایز، کد بارکد ملی و موجودی تفکیکی
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg tabular-nums">
          {{ toFa(variants.length) }} متغیر | کل موجودی: {{ toFa(totalStockCount) }}
        </span>
        <button
          type="button"
          class="h-8 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="handleManualRegenerate"
        >
          <RefreshCw class="w-3.5 h-3.5" />
          <span>تولید مجدد ماتریس</span>
        </button>
      </div>
    </div>

    <!-- انتخاب رنگ‌های کاتالوگ -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs font-bold text-slate-700">
        <span>۱. انتخاب رنگ‌های فعال برای این محصول:</span>
        <button
          type="button"
          class="text-ink hover:underline flex items-center gap-1 text-[11px] font-medium cursor-pointer"
          @click="isQuickAddColorOpen = true"
        >
          <Plus class="w-3 h-3" />
          <span>تعریف رنگ جدید در مخزن</span>
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="swatch in colorSwatches"
          :key="swatch.id"
          type="button"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer"
          :class="selectedColors.includes(swatch.name) ? 'border-ink bg-sand-100/60 text-slate-900 ring-1 ring-ink/20 font-bold' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
          @click="toggleColor(swatch.name)"
        >
          <span
            class="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
            :style="{ backgroundColor: swatch.hex }"
          />
          <span>{{ swatch.name }}</span>
          <Check v-if="selectedColors.includes(swatch.name)" class="w-3.5 h-3.5 text-ink ms-0.5" />
        </button>
      </div>
    </div>

    <!-- انتخاب سایزبندی -->
    <div class="space-y-2">
      <span class="block text-xs font-bold text-slate-700">۲. انتخاب سایزهای قابل عرضه:</span>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="sz in availableSizesList"
          :key="sz"
          type="button"
          class="min-w-10 h-8 px-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer"
          :class="selectedSizes.includes(sz) ? 'border-ink bg-ink text-white shadow-2xs' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
          @click="toggleSize(sz)"
        >
          {{ sz }}
        </button>
      </div>
    </div>

    <!-- نوار عملیات گروهی (Bulk Quick Apply) -->
    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2 text-slate-700 font-bold">
        <ArrowRightLeft class="w-4 h-4 text-slate-500" />
        <span>اعمال گروهی به همه ردیف‌ها:</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- قیمت پایه و فروش -->
        <div class="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
          <span class="text-[10px] text-slate-400">فروش:</span>
          <input
            v-model.number="bulkSalePriceInput"
            type="number"
            class="w-24 text-center font-mono font-bold text-slate-900 outline-hidden tabular-nums"
          >
          <span class="text-[10px] text-slate-400">تومان</span>
        </div>

        <button
          type="button"
          class="h-8 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          @click="applyBulkPricingAction"
        >
          ثبت نرخ یکپارچه
        </button>

        <div class="h-4 w-px bg-slate-300 hidden sm:block" />

        <!-- موجودی -->
        <div class="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
          <span class="text-[10px] text-slate-400">موجودی:</span>
          <input
            v-model.number="bulkStockInput"
            type="number"
            class="w-14 text-center font-mono font-bold text-slate-900 outline-hidden tabular-nums"
          >
          <span class="text-[10px] text-slate-400">عدد</span>
        </div>

        <button
          type="button"
          class="h-8 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          @click="applyBulkStockAction"
        >
          ثبت موجودی یکپارچه
        </button>
      </div>
    </div>

    <!-- جدول ماتریس متغیرها با پیام وضعیت خالی دوستانه -->
    <div v-if="variants.length > 0" class="overflow-x-auto border border-slate-200 rounded-xl">
      <table class="w-full text-start text-xs border-collapse">
        <thead>
          <tr class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
            <th class="py-2.5 px-3 text-start">رنگ</th>
            <th class="py-2.5 px-3 text-start">سایز</th>
            <th class="py-2.5 px-3 text-start">کد SKU</th>
            <th class="py-2.5 px-3 text-start">بارکد ملی</th>
            <th class="py-2.5 px-3 text-start">موجودی انبار</th>
            <th class="py-2.5 px-3 text-start">قیمت پایه (تومان)</th>
            <th class="py-2.5 px-3 text-start">قیمت نهایی فروش</th>
            <th v-if="canViewCostPrice" class="py-2.5 px-3 text-start">قیمت تمام‌شده (تولید)</th>
            <th class="py-2.5 px-2 text-center w-10">حذف</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="(row, idx) in variants"
            :key="row.id"
            class="hover:bg-slate-50/80 transition-colors"
          >
            <!-- رنگ -->
            <td class="py-2 px-3">
              <div class="flex items-center gap-2">
                <span
                  class="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                  :style="{ backgroundColor: row.colorHex }"
                />
                <span class="font-medium text-slate-800">{{ row.color }}</span>
              </div>
            </td>

            <!-- سایز -->
            <td class="py-2 px-3 font-mono font-bold text-slate-900">
              {{ row.size }}
            </td>

            <!-- کد SKU -->
            <td class="py-2 px-3">
              <input
                v-model="row.sku"
                type="text"
                dir="ltr"
                class="w-28 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 outline-hidden focus:bg-white focus:border-ink"
                @input="markDirty"
              >
            </td>

            <!-- بارکد -->
            <td class="py-2 px-3 font-mono text-slate-600 text-[11px] tabular-nums" dir="ltr">
              {{ row.barcode }}
            </td>

            <!-- موجودی انبار -->
            <td class="py-2 px-3">
              <input
                v-model.number="row.stock"
                type="number"
                min="0"
                class="w-16 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-center text-xs outline-hidden focus:bg-white focus:border-ink tabular-nums"
                :class="row.stock <= 2 ? 'text-rose-600 bg-rose-50/50 border-rose-200' : 'text-slate-900'"
                @input="markDirty"
              >
            </td>

            <!-- قیمت پایه -->
            <td class="py-2 px-3">
              <input
                v-model.number="row.regularPrice"
                type="number"
                class="w-24 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink tabular-nums"
                @input="markDirty"
              >
            </td>

            <!-- قیمت نهایی فروش -->
            <td class="py-2 px-3">
              <input
                v-model.number="row.salePrice"
                type="number"
                class="w-24 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-xs text-ink outline-hidden focus:bg-white focus:border-ink tabular-nums"
                @input="markDirty"
              >
            </td>

            <!-- قیمت تمام‌شده (فقط مجاز برای سوپرادمین و حسابداری) -->
            <td v-if="canViewCostPrice" class="py-2 px-3">
              <input
                v-model.number="row.costPrice"
                type="number"
                class="w-20 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-600 outline-hidden focus:bg-white focus:border-ink tabular-nums"
                @input="markDirty"
              >
            </td>

            <!-- حذف سطر -->
            <td class="py-2 px-2 text-center">
              <button
                type="button"
                class="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="حذف این متغیر"
                @click="removeVariantRow(idx)"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- وضعیت خالی دوستانه -->
    <div v-else class="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <Grid class="w-8 h-8 text-slate-300 mx-auto mb-2" />
      <p class="text-xs text-slate-600 font-medium">
        حداقل یک رنگ و یک سایز را در بالا انتخاب کنید تا جدول ماتریس متغیرها خودکار تشکیل شود.
      </p>
      <p class="text-[11px] text-slate-400 mt-1">
        با فعال‌سازی هر مشخصه، بارکد و ردیف‌های انبارداری بلافاصله ایجاد خواهند شد.
      </p>
    </div>

    <!-- میکرو مودال رنگ -->
    <OpsQuickAddAttributeModal
      v-model:open="isQuickAddColorOpen"
      default-type="color"
      @created="onColorCreated"
    />
  </section>
</template>
