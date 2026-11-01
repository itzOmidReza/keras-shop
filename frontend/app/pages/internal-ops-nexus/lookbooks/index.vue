<!-- frontend/app/pages/internal-ops-nexus/lookbooks/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({
  title: 'مدیریت ست‌ها و استایل‌های ادیتوریال | مرکز عملیات کراس',
  robots: 'noindex, nofollow',
})

const {
  filteredLookbooks,
  stats,
  isLoading,
  searchQuery,
  selectedStatus,
  fetchAdminLookbooks,
  deleteLookbook,
  toggleLookbookStatus,
} = useAdminLookbooks()

onMounted(() => {
  fetchAdminLookbooks()
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
}
</script>

<template>
  <div class="space-y-6 font-sans pb-16" dir="rtl" data-testid="admin-lookbooks-workspace">
    <!-- نوار فیلترها، آمار و دکمه طراحی ست -->
    <AdminLookbooksFilterBar
      v-model:selected-status="selectedStatus"
      v-model:search-query="searchQuery"
      :total-count="stats.total"
      :stats="stats"
    />

    <!-- جدول ست‌های استایل ادیتوریال -->
    <AdminLookbooksTable
      :lookbooks="filteredLookbooks"
      :is-loading="isLoading"
      @toggle-status="toggleLookbookStatus"
      @delete="deleteLookbook"
      @reset-filters="resetFilters"
    />
  </div>
</template>
