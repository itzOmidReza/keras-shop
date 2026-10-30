<!-- frontend/app/components/catalog/FilterPanel.vue -->
<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { toFa } from '~/utils/format'
import type { FilterState } from '~/composables/catalog/useCatalogFilters'

export type { FilterState }

const props = withDefaults(
  defineProps<{
    modelValue: FilterState
    totalItems?: number
    minPrice?: number
    maxPrice?: number
    apparelCount?: number
    accessoriesCount?: number
    categoryCounts?: Record<string, number>
  }>(),
  {
    totalItems: 0,
    minPrice: 300000,
    maxPrice: 5500000,
    apparelCount: 16,
    accessoriesCount: 8,
    categoryCounts: () => ({
      'shirts-blouses': 4, 'knitwear': 4, 'coats-jackets': 3, 'pants': 3,
      'tops': 2, 'hair-accessories': 3, 'bandanas': 3, 'scarves': 2,
    }),
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: FilterState): void
  (e: 'reset' | 'applied'): void
}>()

const {
  draftFilters,
  draftActiveCount,
  setDivision,
  setCategories,
  setSizes,
  setColors,
  setPriceRange,
  applyFilters,
  resetAllFilters,
} = useCatalogFilters({
  modelValue: toRef(props, 'modelValue'),
  minPrice: props.minPrice,
  maxPrice: props.maxPrice,
  onApply: (newFilters: FilterState) => {
    emit('update:modelValue', newFilters)
    emit('applied')
  },
  onReset: () => {
    emit('reset')
    emit('applied')
  },
})
</script>

<template>
  <div class="relative flex flex-col h-full justify-between bg-white overflow-hidden text-start">
    <!-- هدر مینیمال ادیتوریال بالای دراور -->
    <header class="flex items-center justify-between px-6 py-4.5 border-b border-neutral-100 bg-white shrink-0">
      <div class="flex items-center gap-2.5">
        <h2 class="text-base font-bold text-neutral-900 tracking-tight">
          فیلترها
        </h2>
        <span
          v-if="draftActiveCount > 0"
          class="rounded-full bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5"
        >
          {{ toFa(draftActiveCount) }}
        </span>
      </div>

      <!-- دکمه پاک کردن همه فیلترها با رعایت فاصله از دکمه بستن گوشه -->
      <button
        v-if="draftActiveCount > 0"
        type="button"
        data-testid="reset-filters-btn"
        class="text-xs text-neutral-500 hover:text-rose transition-colors cursor-pointer font-medium me-8"
        @click="resetAllFilters"
      >
        پاک کردن همه
      </button>
    </header>

    <!-- بدنه اسکرول‌پذیر فیلترها (۴ بخش استاندارد آتلیه) -->
    <div class="flex-1 overflow-y-auto px-6 py-6 space-y-7">
      <!-- ۱. شاخه اصلی و آکاردئون دسته‌بندی‌ها -->
      <FilterDivisionAccordion
        :division="draftFilters.division"
        :categories="draftFilters.categories"
        :apparel-count="props.apparelCount"
        :accessories-count="props.accessoriesCount"
        :category-counts="props.categoryCounts"
        @update:division="setDivision"
        @update:categories="setCategories"
      />

      <!-- ۲. سایزبندی -->
      <FilterSizeSelector
        :model-value="draftFilters.sizes"
        @update:model-value="setSizes"
      />

      <!-- ۳. رنگ‌بندی طبیعی -->
      <FilterColorSwatches
        :model-value="draftFilters.colors"
        @update:model-value="setColors"
      />

      <!-- ۴. اسلایدر محدوده قیمت -->
      <FilterPriceSlider
        :model-value="draftFilters.priceRange"
        :min-price="props.minPrice"
        :max-price="props.maxPrice"
        @update:model-value="setPriceRange"
      />
    </div>

    <!-- فوتر چسبان با دکمه باوقار مشاهده نتایج -->
    <footer class="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-neutral-100 p-4 shrink-0 z-20">
      <button
        type="button"
        data-testid="apply-filters-btn"
        class="w-full h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2"
        :aria-label="`مشاهده نتایج (${toFa(totalItems)} کالا)`"
        @click="applyFilters"
      >
        <span>مشاهده نتایج ({{ toFa(totalItems) }} کالا)</span>
        <ArrowLeft class="w-4 h-4" />
      </button>
    </footer>
  </div>
</template>
