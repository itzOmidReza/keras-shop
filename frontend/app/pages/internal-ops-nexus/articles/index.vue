<!-- frontend/app/pages/internal-ops-nexus/articles/index.vue -->
<script setup lang="ts">
import { useAdminArticles } from '~/composables/admin/useAdminArticles'
import AdminArticlesFilterBar from '~/components/ops/articles/AdminArticlesFilterBar.vue'
import AdminArticlesTable from '~/components/ops/articles/AdminArticlesTable.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({
  title: 'مدیریت مجله و مقالات ادیتوریال | مرکز عملیات کراس',
  robots: 'noindex, nofollow',
})

const {
  searchQuery,
  selectedCategory,
  selectedStatus,
  filteredArticles,
  stats,
  deleteArticle,
  togglePublishStatus,
} = useAdminArticles()

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedStatus.value = 'all'
}
</script>

<template>
  <div class="space-y-6 font-sans pb-16" dir="rtl" data-testid="admin-articles-workspace">
    <!-- نوار هدر، آمار و فیلترها -->
    <AdminArticlesFilterBar
      v-model:selected-status="selectedStatus"
      v-model:selected-category="selectedCategory"
      v-model:search-query="searchQuery"
      :total-count="stats.total"
      :stats="stats"
    />

    <!-- جدول مقالات -->
    <AdminArticlesTable
      :articles="filteredArticles"
      @toggle-status="togglePublishStatus"
      @delete="deleteArticle"
      @reset-filters="resetFilters"
    />
  </div>
</template>
