<!-- frontend/app/components/ops/products/AdminProductsFilterBar.vue -->
<script setup lang="ts">
import { Search } from '@lucide/vue'

defineProps<{
  searchQuery: string
  selectedCategory: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedCategory': [value: string]
}>()
</script>

<template>
  <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
    <div class="relative w-full sm:w-80">
      <input
        :value="searchQuery"
        type="text"
        placeholder="جستجوی نام لباس، اسلاگ یا کد کالا..."
        class="w-full h-9.5 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-hidden"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      >
      <Search class="w-4 h-4 text-slate-400 absolute inset-s-3 top-2.5" />
    </div>

    <div class="flex items-center gap-2 w-full sm:w-auto">
      <select
        :value="selectedCategory"
        class="h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white outline-hidden cursor-pointer w-full sm:w-auto"
        @change="emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
      >
        <option value="all">همه دسته‌بندی‌ها</option>
        <option value="apparel">پوشاک اصلی</option>
        <option value="accessories">اکسسوری و کیف</option>
        <option value="coats-jackets">کت و پالتو</option>
        <option value="dresses">پیراهن</option>
        <option value="shirts-blouses">شومیز و بلوز</option>
      </select>
    </div>
  </div>
</template>
