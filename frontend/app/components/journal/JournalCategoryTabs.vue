<!-- frontend/app/components/journal/JournalCategoryTabs.vue -->
<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import { JOURNAL_CATEGORIES, type JournalCategoryTab } from '~/composables/journal/useJournalArticles'

defineProps<{
  activeCategory: JournalCategoryTab
  searchQuery: string
}>()

const emit = defineEmits<{
  'update:activeCategory': [value: JournalCategoryTab]
  'update:searchQuery': [value: string]
}>()

const onSelectCategory = (tabId: JournalCategoryTab) => {
  emit('update:activeCategory', tabId)
}

const onSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:searchQuery', target.value)
}

const clearSearch = () => {
  emit('update:searchQuery', '')
}
</script>

<template>
  <div class="space-y-4 my-8" data-testid="journal-category-tabs">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <!-- تب‌های مینیمال دسته‌بندی موضوعی -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        <button
          v-for="cat in JOURNAL_CATEGORIES"
          :key="cat.id"
          type="button"
          :data-testid="`journal-tab-${cat.id}`"
          class="px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer"
          :class="[
            activeCategory === cat.id
              ? 'bg-ink text-white shadow-xs'
              : 'bg-white text-ink/70 hover:text-ink hover:bg-sand/40 border border-sand/70',
          ]"
          @click="onSelectCategory(cat.id)"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- نوار جست‌وجوی سریع ادیتوریال -->
      <div class="relative w-full md:w-72">
        <input
          :value="searchQuery"
          type="text"
          placeholder="جست‌وجو در مقالات و روایات..."
          data-testid="journal-search-input"
          class="w-full bg-white border border-sand/80 focus:border-ink rounded-full ps-10 pe-9 py-2 text-xs sm:text-sm text-ink placeholder:text-ink/40 focus:outline-hidden transition-all shadow-2xs"
          @input="onSearchInput"
        >
        <Search class="w-4 h-4 text-ink/40 absolute start-3.5 top-1/2 -translate-y-1/2" />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute end-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-ink/40 hover:text-ink cursor-pointer"
          @click="clearSearch"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
