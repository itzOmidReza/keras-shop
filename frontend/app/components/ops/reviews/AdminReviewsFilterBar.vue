<!-- frontend/app/components/ops/reviews/AdminReviewsFilterBar.vue -->
<script setup lang="ts">
import { Search, X, Star, RotateCcw } from '@lucide/vue'
import type { ReviewStatus } from '~/types/domain'

const {
  activeTabFilter,
  searchQuery,
  selectedRating,
  counts,
} = useAdminReviews()

interface TabItem {
  id: 'all' | ReviewStatus
  label: string
  count: number
  badgeColor: string
}

const tabs = computed<TabItem[]>(() => [
  {
    id: 'all',
    label: 'همه دیدگاه‌ها',
    count: counts.value.all,
    badgeColor: 'bg-slate-100 text-slate-700',
  },
  {
    id: 'pending',
    label: 'در انتظار بررسی',
    count: counts.value.pending,
    badgeColor: counts.value.pending > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600',
  },
  {
    id: 'approved',
    label: 'تاییدشده',
    count: counts.value.approved,
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'rejected',
    label: 'ردشده',
    count: counts.value.rejected,
    badgeColor: 'bg-rose-100 text-rose-800',
  },
])

const ratingOptions = [
  { value: null, label: 'همه امتیازها' },
  { value: 5, label: '۵ ستاره' },
  { value: 4, label: '۴ ستاره' },
  { value: 3, label: '۳ ستاره' },
  { value: 2, label: '۲ ستاره' },
  { value: 1, label: '۱ ستاره' },
]

const hasActiveFilters = computed(() => {
  return activeTabFilter.value !== 'all' || searchQuery.value.trim() !== '' || selectedRating.value !== null
})

const handleResetFilters = () => {
  activeTabFilter.value = 'all'
  searchQuery.value = ''
  selectedRating.value = null
}
</script>

<template>
  <div class="space-y-4">
    <!-- ردیف تب‌های وضعیت و فیلترها -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
      <!-- تب‌های وضعیت بررسی -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activeTabFilter === tab.id"
          :data-testid="`filter-tab-${tab.id}`"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          :class="[
            activeTabFilter === tab.id
              ? 'bg-ink text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80',
          ]"
          @click="activeTabFilter = tab.id"
        >
          <span>{{ tab.label }}</span>
          <span
            class="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold"
            :class="[
              activeTabFilter === tab.id
                ? 'bg-white/20 text-white'
                : tab.badgeColor,
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- دکمه بازنشانی فیلترها -->
      <button
        v-if="hasActiveFilters"
        type="button"
        class="inline-flex items-center gap-1 text-xs text-rose hover:text-rose/80 font-bold self-end md:self-auto cursor-pointer transition-colors"
        @click="handleResetFilters"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>بازنشانی فیلترها</span>
      </button>
    </div>

    <!-- نوار جستجو و فیلتر امتیاز ستاره‌ای -->
    <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
      <!-- ورودی جستجو -->
      <div class="sm:col-span-8 lg:col-span-9 relative">
        <Search class="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          data-testid="reviews-search-input"
          placeholder="جستجو در نام خریدار، متن دیدگاه، نام یا شناسه محصول..."
          class="w-full h-10 ps-10 pe-9 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors"
        >
        <button
          v-if="searchQuery"
          type="button"
          class="absolute end-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          @click="searchQuery = ''"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- فیلتر امتیاز ستاره‌ای -->
      <div class="sm:col-span-4 lg:col-span-3">
        <div class="relative">
          <select
            v-model="selectedRating"
            data-testid="reviews-rating-select"
            class="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-slate-800 transition-colors cursor-pointer appearance-none"
          >
            <option
              v-for="opt in ratingOptions"
              :key="String(opt.value)"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
          <div class="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center gap-1">
            <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
