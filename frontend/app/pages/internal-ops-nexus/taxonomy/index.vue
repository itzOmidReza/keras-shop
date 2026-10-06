<!-- frontend/app/pages/internal-ops-nexus/taxonomy/index.vue -->
<script setup lang="ts">
import { Palette, Ruler, FolderTree, Award, Calendar, RefreshCw } from '@lucide/vue'
definePageMeta({
  layout: 'ops',
  middleware: 'ops-guard',
})

useSeoMeta({
  title: 'مدیریت ویژگی‌ها و دسته‌بندی‌ها | پیشخوان عملیات کراس',
})

const { store, activeTab } = useAdminTaxonomy()

const tabs = [
  { id: 'colors' as const, label: 'پالت رنگ‌ها', icon: Palette, count: () => store.colors.length },
  { id: 'sizes' as const, label: 'گروه‌های سایز', icon: Ruler, count: () => store.sizes.length },
  { id: 'categories' as const, label: 'دسته‌بندی‌ها', icon: FolderTree, count: () => store.categories.length },
  { id: 'brands' as const, label: 'برندها و لاین‌ها', icon: Award, count: () => store.brands.length },
  { id: 'seasons' as const, label: 'دراپ‌ها و فصل‌ها', icon: Calendar, count: () => store.seasons.length },
]

const handleRefresh = () => {
  store.fetchTaxonomy(true)
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto font-sans" data-testid="ops-taxonomy-workspace">
    <!-- هدر بخش ویژگی‌ها -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          مدیریت ویژگی‌ها، متغیرها و دسته‌بندی‌ها
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          تعریف و مدیریت پویا رنگ‌ها، اندازه‌ها، دسته‌بندی‌های کاتالوگ، برندهای همکار و دراپ‌های فصلی
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
          :disabled="store.isLoading"
          @click="handleRefresh"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="store.isLoading ? 'animate-spin text-slate-400' : ''" />
          <span>همگام‌سازی داده‌ها</span>
        </button>
      </div>
    </div>

    <!-- منوی تب‌های افقی ۵گانه -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :data-testid="`taxonomy-tab-${tab.id}`"
        class="h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        :class="activeTab === tab.id
          ? 'bg-slate-900 text-white shadow-2xs'
          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60'"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        <span>{{ tab.label }}</span>
        <span
          class="text-[10px] font-mono px-1.5 py-0.2 rounded-full"
          :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'"
        >
          {{ tab.count() }}
        </span>
      </button>
    </div>

    <!-- بدنه تب‌های فعال -->
    <div>
      <TaxonomyColorsTab v-if="activeTab === 'colors'" />
      <TaxonomySizesTab v-else-if="activeTab === 'sizes'" />
      <TaxonomyCategoriesTab v-else-if="activeTab === 'categories'" />
      <TaxonomyBrandsTab v-else-if="activeTab === 'brands'" />
      <TaxonomySeasonsTab v-else-if="activeTab === 'seasons'" />
    </div>
  </div>
</template>

