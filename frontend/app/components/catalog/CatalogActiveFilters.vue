<!-- frontend/app/components/catalog/CatalogActiveFilters.vue -->
<script setup lang="ts">
import { X, RotateCcw } from '@lucide/vue'
import { formatToman, toFa } from '~/utils/format'
import {
  type FilterState,
  getCategoryLabel,
} from '~/composables/catalog/useCatalogFilters'
import { BRAND_LABELS } from '~/composables/catalog/useShopCatalog'
import type { ProductCategory } from '~/types/domain'

const props = defineProps<{
  filters: FilterState
  searchQuery?: string | null
  badgeQuery?: string | null
  brandQuery?: string | null
  minPrice: number
  maxPrice: number
  activeCount: number
}>()

const emit = defineEmits<{
  removeDivision: []
  removeBrand: []
  removeCategory: [slug: ProductCategory]
  removeSize: [size: string]
  removeColor: [color: string]
  resetPrice: []
  clearSearch: []
  clearBadge: []
  resetAll: []
}>()

const resolvedBrandLabel = computed(() => {
  const b = props.filters.brand || props.brandQuery
  if (!b) return null
  return BRAND_LABELS[b] || b
})
</script>

<template>
  <div
    v-if="activeCount > 0"
    class="flex flex-wrap items-center gap-2 pt-3 pb-1 text-xs"
    aria-label="فیلترهای اعمال‌شده"
  >
    <span class="text-xs text-muted-foreground font-medium me-1">
      فیلترهای فعال:
    </span>

    <!-- جست‌وجو -->
    <span
      v-if="searchQuery"
      class="inline-flex items-center gap-1.5 rounded-lg bg-sand/70 border border-sand px-2.5 py-1 text-xs text-ink font-medium transition-all"
    >
      <span>جست‌وجو: <strong class="text-rose font-bold">«{{ searchQuery }}»</strong></span>
      <button
        type="button"
        class="text-muted-foreground hover:text-rose cursor-pointer transition-colors p-0.5 rounded-xs"
        aria-label="حذف جست‌وجو"
        @click="emit('clearSearch')"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </span>

    <!-- نشان -->
    <span
      v-if="badgeQuery"
      class="inline-flex items-center gap-1.5 rounded-lg bg-rose/10 border border-rose/20 px-2.5 py-1 text-xs text-rose font-bold transition-all"
    >
      <span>نشان: {{ badgeQuery === 'sale' ? 'حراج فصل' : badgeQuery }}</span>
      <button
        type="button"
        class="text-rose hover:text-ink cursor-pointer transition-colors p-0.5 rounded-xs"
        aria-label="حذف نشان"
        @click="emit('clearBadge')"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </span>

    <!-- شاخه -->
    <span
      v-if="filters.division"
      class="inline-flex items-center gap-1.5 rounded-lg bg-sand/70 border border-sand px-2.5 py-1 text-xs text-ink font-medium transition-all"
    >
      <span>شاخه: {{ filters.division === 'apparel' ? 'پوشاک' : 'اکسسوری' }}</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-rose cursor-pointer transition-colors p-0.5 rounded-xs"
        aria-label="حذف فیلتر شاخه"
        @click="emit('removeDivision')"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </span>

    <!-- برند (در صورت ورود از طریق پیوندهای مارکی صفحه اصلی) -->
    <span
      v-if="resolvedBrandLabel"
      class="inline-flex items-center gap-1.5 rounded-lg bg-sand/70 border border-sand px-2.5 py-1 text-xs text-ink font-medium transition-all"
    >
      <span>برند: <strong>{{ resolvedBrandLabel }}</strong></span>
      <button
        type="button"
        class="text-muted-foreground hover:text-rose cursor-pointer transition-colors p-0.5 rounded-xs"
        aria-label="حذف فیلتر برند"
        @click="emit('removeBrand')"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </span>

    <!-- دسته‌بندی‌ها -->
    <span
      v-for="cat in filters.categories"
      :key="cat"
      class="inline-flex items-center gap-1.5 rounded-lg bg-sand/70 border border-sand px-2.5 py-1 text-xs text-ink font-medium transition-all"
    >
      <span>{{ getCategoryLabel(cat) }}</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-rose cursor-pointer transition-colors p-0.5 rounded-xs"
        :aria-label="`حذف فیلتر ${getCategoryLabel(cat)}`"
        @click="emit('removeCategory', cat)"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </span>

    <!-- سایزها -->
    <span
      v-for="size in filters.sizes"
      :key="size"
      class="inline-flex items-center gap-1.5 rounded-lg bg-sand/70 border border-sand px-2.5 py-1 text-xs text-ink font-medium transition-all"
    >
      <span>سایز {{ size }}</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-rose cursor-pointer transition-colors p-0.5 rounded-xs"
        :aria-label="`حذف فیلتر سایز ${size}`"
        @click="emit('removeSize', size)"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </span>

    <!-- رنگ‌ها -->
    <span
      v-for="color in filters.colors"
      :key="color"
      class="inline-flex items-center gap-1.5 rounded-lg bg-sand/70 border border-sand px-2.5 py-1 text-xs text-ink font-medium transition-all"
    >
      <span>{{ color }}</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-rose cursor-pointer transition-colors p-0.5 rounded-xs"
        :aria-label="`حذف فیلتر رنگ ${color}`"
        @click="emit('removeColor', color)"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </span>

    <!-- بازه قیمت -->
    <span
      v-if="filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice"
      class="inline-flex items-center gap-1.5 rounded-lg bg-sand/70 border border-sand px-2.5 py-1 text-xs text-ink font-medium transition-all"
    >
      <span>قیمت: {{ toFa(formatToman(filters.priceRange[0])) }} تا {{ toFa(formatToman(filters.priceRange[1])) }}</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-rose cursor-pointer transition-colors p-0.5 rounded-xs"
        aria-label="حذف فیلتر قیمت"
        @click="emit('resetPrice')"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </span>

    <!-- پاک کردن همه فیلترها -->
    <button
      type="button"
      data-testid="clear-all-chips-btn"
      class="inline-flex items-center gap-1 text-xs font-bold text-rose hover:text-rose/80 transition-colors cursor-pointer ms-1 py-1"
      @click="emit('resetAll')"
    >
      <RotateCcw class="w-3 h-3" />
      <span>حذف همه فیلترها</span>
    </button>
  </div>
</template>
