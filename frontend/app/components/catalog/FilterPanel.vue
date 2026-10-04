<!-- frontend/app/components/catalog/FilterPanel.vue -->
<script setup lang="ts">
import { ArrowLeft, RotateCcw } from '@lucide/vue'
import { toFa } from '~/utils/format'
import {
  type FilterState,
  useCatalogFilters,
} from '~/composables/catalog/useCatalogFilters'
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
  (e: 'reset' | 'applied'): void
}>()

const {
  draftFilters,
  draftActiveCount,
  hasUnappliedChanges,
  setSeason,
  setDivision,
  setCategories,
  setBrand,
  setSizes,
  setColors,
  setPriceRange,
  applyFilters,
  resetAllFilters,
} = useCatalogFilters({
  modelValue: toRef(props, 'modelValue'),
  minPrice: props.minPrice,
  maxPrice: props.maxPrice,
  onApply: (newFilters) => {
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
  <div class="space-y-6 relative flex flex-col justify-between">
    <div class="space-y-6">
      <!-- هدر و چیپ‌های فیلترهای فعال (متصل به پیش‌نویس برای حذف سریع) -->
      <FilterActiveChips
        :model-value="draftFilters"
        :min-price="props.minPrice"
        :max-price="props.maxPrice"
        @update:model-value="draftFilters = $event"
        @reset="resetAllFilters"
      />

      <!-- ۱. فصل و کالکشن -->
      <FilterSeasonSelector
        :model-value="draftFilters.season"
        @update:model-value="setSeason"
      />

      <!-- ۲. شاخه اصلی و آکاردئون دسته‌بندی‌ها -->
      <FilterDivisionAccordion
        :division="draftFilters.division"
        :categories="draftFilters.categories"
        :apparel-count="props.apparelCount"
        :accessories-count="props.accessoriesCount"
        :category-counts="props.categoryCounts"
        @update:division="setDivision"
        @update:categories="setCategories"
      />

      <!-- ۳. برندهای همکار -->
      <FilterBrandPills
        :model-value="draftFilters.brand"
        @update:model-value="setBrand"
      />

      <!-- ۴. سایزبندی -->
      <FilterSizeSelector
        :model-value="draftFilters.sizes"
        @update:model-value="setSizes"
      />

      <!-- ۵. رنگ‌بندی طبیعی -->
      <FilterColorSwatches
        :model-value="draftFilters.colors"
        @update:model-value="setColors"
      />

      <!-- ۶. اسلایدر قیمت -->
      <FilterPriceSlider
        :model-value="draftFilters.priceRange"
        :min-price="props.minPrice"
        :max-price="props.maxPrice"
        @update:model-value="setPriceRange"
      />
    </div>

    <!-- نوار چسبان کنترل و اعمال فیلترها (Sticky Bottom Action Dock) -->
    <div
      class="sticky bottom-0 -mx-5 -mb-5 px-5 py-3.5 bg-white/95 backdrop-blur-md border-t border-sand/80 shadow-md transition-all z-20 space-y-2 mt-6 rounded-b-2xl"
      :class="{ 'ring-1 ring-rose/30 shadow-lg': hasUnappliedChanges }"
    >
      <!-- وضعیت بصری تغییرات اعمال نشده -->
      <div
        v-if="hasUnappliedChanges"
        class="flex items-center justify-between text-[11px] font-bold text-rose animate-in fade-in slide-in-from-bottom-1 duration-200"
      >
        <span class="inline-flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
          <span>تغییرات جدید آماده اعمال است</span>
        </span>
        <span class="text-2xs font-normal text-muted-foreground">برای دیدن کالاها کلیک کنید</span>
      </div>

      <div class="flex items-center gap-2">
        <!-- دکمه اصلی: اعمال فیلترها -->
        <button
          type="button"
          data-testid="apply-filters-btn"
          class="flex-1 h-11 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-98"
          :class="[
            hasUnappliedChanges
              ? 'bg-rose text-white hover:bg-rose/90 shadow-rose/20 ring-2 ring-rose/30'
              : 'bg-ink text-paper hover:bg-ink/90',
          ]"
          :aria-label="`اعمال فیلترها و مشاهده محصولات${draftActiveCount > 0 ? ` (${toFa(draftActiveCount)})` : ''}`"
          @click="applyFilters"
        >
          <span class="flex items-center gap-1.5 min-w-0 truncate">
            <span>اعمال فیلترها</span>
            <span
              v-if="draftActiveCount > 0"
              class="rounded-full bg-white/20 text-white px-2 py-0.5 text-[10px] font-bold"
            >
              {{ toFa(draftActiveCount) }}
            </span>
          </span>
          <ArrowLeft class="w-4 h-4 shrink-0" />
        </button>

        <!-- دکمه فرعی: حذف همه / بازنشانی -->
        <button
          v-if="draftActiveCount > 0"
          type="button"
          data-testid="reset-filters-btn"
          class="h-11 px-3 rounded-xl border border-sand bg-sand/20 hover:bg-sand/50 text-ink text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-2xs hover:text-rose active:scale-98"
          title="حذف همه فیلترها"
          aria-label="حذف همه فیلترها"
          @click="resetAllFilters"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">حذف همه</span>
        </button>
      </div>
    </div>
  </div>
</template>
