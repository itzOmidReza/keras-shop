<!-- frontend/app/pages/internal-ops-nexus/products/index.vue -->
<script setup lang="ts">
import { Plus } from '@lucide/vue'
import type { ProductDetail } from '~/types/domain'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'محصولات و لباس‌ها | مدیریت آتلیه کراس', robots: 'noindex, nofollow' })

const {
  searchQuery,
  selectedCategory,
  filteredProducts,
  deleteProduct,
  toggleProductActive,
} = useAdminProducts()

const productToDelete = ref<ProductDetail | null>(null)
const isConfirmDeleteOpen = ref(false)

const openDeleteConfirm = (product: ProductDetail) => {
  productToDelete.value = product
  isConfirmDeleteOpen.value = true
}

const confirmDelete = () => {
  if (productToDelete.value) {
    deleteProduct(productToDelete.value.id)
    isConfirmDeleteOpen.value = false
    productToDelete.value = null
  }
}
</script>

<template>
  <div class="space-y-6 font-sans" data-testid="nexus-products-view">
    <!-- هدر صفحه و دکمه افزودن -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          محصولات و لباس‌های آتلیه
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          مدیریت کاتالوگ لباس‌ها، تنوع‌های رنگ و سایز، قیمت‌گذاری و وضعیت موجودی
        </p>
      </div>

      <NuxtLink
        to="/internal-ops-nexus/products/new"
        data-testid="add-product-btn"
        class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all w-fit"
      >
        <Plus class="w-4 h-4" />
        <span>+ افزودن محصول جدید</span>
      </NuxtLink>
    </div>

    <!-- فیلترها و جست‌وجو -->
    <AdminProductsFilterBar
      v-model:search-query="searchQuery"
      v-model:selected-category="selectedCategory"
    />

    <!-- جدول محصولات -->
    <AdminProductsTable
      :products="filteredProducts"
      @toggle-active="toggleProductActive"
      @delete="openDeleteConfirm"
    />

    <!-- مودال تایید حذف محصول به صورت Lazy -->
    <LazyAdminProductDeleteModal
      v-if="isConfirmDeleteOpen"
      :open="isConfirmDeleteOpen"
      :product="productToDelete"
      @update:open="isConfirmDeleteOpen = $event"
      @confirm="confirmDelete"
    />
  </div>
</template>
