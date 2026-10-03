<!-- frontend/app/components/catalog/FilterPanel.vue -->
<script setup lang="ts">
import type { FilterState } from '~/composables/catalog/useCatalogFilters'
import FilterActiveChips from '~/components/catalog/filters/FilterActiveChips.vue'
import FilterSeasonSelector from '~/components/catalog/filters/FilterSeasonSelector.vue'
import FilterDivisionAccordion from '~/components/catalog/filters/FilterDivisionAccordion.vue'
import FilterBrandPills from '~/components/catalog/filters/FilterBrandPills.vue'
import FilterSizeSelector from '~/components/catalog/filters/FilterSizeSelector.vue'
import FilterColorSwatches from '~/components/catalog/filters/FilterColorSwatches.vue'
import FilterPriceSlider from '~/components/catalog/filters/FilterPriceSlider.vue'

export type { FilterState }

const props = withDefaults(
  defineProps<{
    modelValue: FilterState
    minPrice?: number
    maxPrice?: number
    apparelCount?: number
    accessoriesCount?: number
    categoryCounts?: Record<string, number>
  }>(),
  {
    minPrice: 300000,
    maxPrice: 5500000,
    apparelCount: 16,
    accessoriesCount: 8,
    categoryCounts: () => ({
      'shirts-blouses': 4,
      'knitwear': 4,
      'coats-jackets': 3,
      'pants': 3,
      'tops': 2,
      'hair-accessories': 3,
      'bandanas': 3,
      'scarves': 2,
    }),
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: FilterState): void
  (e: 'reset'): void
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- هدر و چیپ‌های فیلترهای فعال -->
    <FilterActiveChips
      :model-value="props.modelValue"
      :min-price="props.minPrice"
      :max-price="props.maxPrice"
      @update:model-value="emit('update:modelValue', $event)"
      @reset="emit('reset')"
    />

    <!-- ۱. فصل و کالکشن -->
    <FilterSeasonSelector
      :model-value="props.modelValue.season"
      @update:model-value="val => emit('update:modelValue', { ...props.modelValue, season: val })"
    />

    <!-- ۲. شاخه اصلی و آکاردئون دسته‌بندی‌ها -->
    <FilterDivisionAccordion
      :division="props.modelValue.division"
      :categories="props.modelValue.categories"
      :apparel-count="props.apparelCount"
      :accessories-count="props.accessoriesCount"
      :category-counts="props.categoryCounts"
      @update:division="val => emit('update:modelValue', { ...props.modelValue, division: val })"
      @update:categories="val => emit('update:modelValue', { ...props.modelValue, categories: val })"
    />

    <!-- ۳. برندهای همکار -->
    <FilterBrandPills
      :model-value="props.modelValue.brand"
      @update:model-value="val => emit('update:modelValue', { ...props.modelValue, brand: val })"
    />

    <!-- ۴. سایزبندی -->
    <FilterSizeSelector
      :model-value="props.modelValue.sizes"
      @update:model-value="val => emit('update:modelValue', { ...props.modelValue, sizes: val })"
    />

    <!-- ۵. رنگ‌بندی طبیعی -->
    <FilterColorSwatches
      :model-value="props.modelValue.colors"
      @update:model-value="val => emit('update:modelValue', { ...props.modelValue, colors: val })"
    />

    <!-- ۶. اسلایدر قیمت -->
    <FilterPriceSlider
      :model-value="props.modelValue.priceRange"
      :min-price="props.minPrice"
      :max-price="props.maxPrice"
      @update:model-value="val => emit('update:modelValue', { ...props.modelValue, priceRange: val })"
    />
  </div>
</template>
