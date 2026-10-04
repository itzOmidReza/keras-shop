<script setup lang="ts">
import { RotateCcw, X, SlidersHorizontal } from '@lucide/vue'
import { formatToman, toFa } from '~/utils/format'
import {
  type FilterState,
  getCategoryLabel,
  getSeasonLabel,
  getBrandLabel,
  countActiveFilters,
} from '~/composables/catalog/useCatalogFilters'
import type { ProductCategory } from '~/types/domain'

const props = defineProps<{
  modelValue: FilterState
  minPrice: number
  maxPrice: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: FilterState): void
  (e: 'reset'): void
}>()

const activeCount = computed(() =>
  countActiveFilters(props.modelValue, props.minPrice, props.maxPrice),
)

function removeSeason() {
  emit('update:modelValue', { ...props.modelValue, season: null })
}

function removeDivision() {
  emit('update:modelValue', { ...props.modelValue, division: null })
}

function removeBrand() {
  emit('update:modelValue', { ...props.modelValue, brand: null })
}

function removeCategory(slug: ProductCategory) {
  emit('update:modelValue', {
    ...props.modelValue,
    categories: props.modelValue.categories.filter(c => c !== slug),
  })
}

function removeSize(size: string) {
  emit('update:modelValue', {
    ...props.modelValue,
    sizes: props.modelValue.sizes.filter(s => s !== size),
  })
}

function removeColor(color: string) {
  emit('update:modelValue', {
    ...props.modelValue,
    colors: props.modelValue.colors.filter(c => c !== color),
  })
}

function resetPrice() {
  emit('update:modelValue', {
    ...props.modelValue,
    priceRange: [props.minPrice, props.maxPrice],
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- هدر فیلتر و دکمه بازنشانی -->
    <div class="flex items-center justify-between border-b border-sand pb-4">
      <div class="flex items-center gap-2">
        <SlidersHorizontal class="w-4 h-4 text-rose" />
        <h3 class="text-sm font-bold text-ink">
          فیلترهای کاتالوگ
        </h3>
        <span
          v-if="activeCount > 0"
          class="rounded-full bg-rose/10 text-rose px-2 py-0.5 text-[10px] font-bold"
        >
          {{ toFa(activeCount) }}
        </span>
      </div>

      <button
        v-if="activeCount > 0"
        type="button"
        class="inline-flex items-center gap-1 text-xs font-medium text-rose hover:text-rose/80 transition-colors cursor-pointer"
        @click="emit('reset')"
      >
        <RotateCcw class="h-3 w-3" />
        <span>پاک کردن همه</span>
      </button>
    </div>

    <!-- چیپ‌های فیلترهای فعال -->
    <div v-if="activeCount > 0" class="flex flex-wrap gap-1.5 pb-2 border-b border-sand/60">
      <!-- چیپ فصل -->
      <span
        v-if="modelValue.season"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>فصل: {{ getSeasonLabel(modelValue.season) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          aria-label="حذف فیلتر فصل"
          @click="removeSeason"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ شاخه اصلی -->
      <span
        v-if="modelValue.division"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>شاخه: {{ modelValue.division === 'apparel' ? 'پوشاک' : 'اکسسوری' }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          aria-label="حذف فیلتر شاخه"
          @click="removeDivision"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ برند -->
      <span
        v-if="modelValue.brand"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>برند: {{ getBrandLabel(modelValue.brand) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          aria-label="حذف فیلتر برند"
          @click="removeBrand"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ دسته‌بندی‌ها -->
      <span
        v-for="cat in modelValue.categories"
        :key="cat"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>{{ getCategoryLabel(cat) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          :aria-label="`حذف فیلتر ${getCategoryLabel(cat)}`"
          @click="removeCategory(cat)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ سایزها -->
      <span
        v-for="size in modelValue.sizes"
        :key="size"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>سایز {{ size }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          :aria-label="`حذف فیلتر سایز ${size}`"
          @click="removeSize(size)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ رنگ‌ها -->
      <span
        v-for="color in modelValue.colors"
        :key="color"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>{{ color }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          :aria-label="`حذف فیلتر رنگ ${color}`"
          @click="removeColor(color)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>

      <!-- چیپ بازه قیمت -->
      <span
        v-if="modelValue.priceRange[0] > minPrice || modelValue.priceRange[1] < maxPrice"
        class="inline-flex items-center gap-1 rounded-lg bg-sand/60 px-2 py-1 text-[11px] font-bold text-ink"
      >
        <span>قیمت: {{ toFa(formatToman(modelValue.priceRange[0])) }} تا {{ toFa(formatToman(modelValue.priceRange[1])) }}</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
          aria-label="حذف فیلتر قیمت"
          @click="resetPrice"
        >
          <X class="w-3 h-3" />
        </button>
      </span>
    </div>
  </div>
</template>
