<!-- frontend/app/pages/internal-ops-nexus/products/index.vue -->
<script setup lang="ts">
import { Plus, Search, ChevronRight, ChevronLeft } from '@lucide/vue'
import { useOpsProducts } from '~/composables/ops/useOpsProducts'
import { useOpsModals } from '~/composables/ops/useOpsModals'
import OpsDomainSubNav from '~/components/ops/common/OpsDomainSubNav.vue'
import OpsQuickEditModal from '~/components/ops/catalog/OpsQuickEditModal.vue'
import OpsProductsTable from '~/components/ops/catalog/OpsProductsTable.vue'
import OpsCatalogSpreadsheet from '~/components/ops/catalog/OpsCatalogSpreadsheet.vue'
import OpsInventoryView from '~/components/ops/OpsInventoryView.vue'
import type { ProductDetail } from '~/types/domain'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'کاتالوگ پوشاک | مرکز عملیات کراس', robots: 'noindex, nofollow' })

const router = useRouter()
const {
  productsList,
  productSearchQuery,
  selectedProductDivision,
  selectedProductSeason,
  filteredProducts,
  toggleProductActive,
  isDeleteProductDialogOpen,
  productToDelete,
} = useOpsProducts()

const { isMatrixOpen } = useOpsModals()

const activeSubTab = ref<'list' | 'matrix' | 'spreadsheet'>('list')
const subNavTabs = [
  { id: 'list', label: 'لیست پوشاک' },
  { id: 'matrix', label: 'ماتریس سایز و انبارداری' },
  { id: 'spreadsheet', label: 'ویرایشگر اکسل کاتالوگ' },
]

// صفحه‌بندی (Pagination)
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage) || 1)
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

watch([productSearchQuery, selectedProductDivision, selectedProductSeason], () => {
  currentPage.value = 1
})

// مودال ویرایش سریع قیمت و موجودی
const isQuickEditOpen = ref(false)
const quickEditProduct = ref<ProductDetail | null>(null)
const handleOpenQuickEdit = (p: ProductDetail) => {
  quickEditProduct.value = p
  isQuickEditOpen.value = true
}
</script>

<template>
  <div class="space-y-4 max-w-7xl mx-auto font-sans" data-testid="nexus-products-view">
    <!-- تب‌های افقی سطح دوم ناوبری دامنه (Domain Sub-Navigation - 44px) -->
    <OpsDomainSubNav v-model="activeSubTab" :tabs="subNavTabs" />

    <!-- تب ۲: ماتریس سایز و انبارداری -->
    <OpsInventoryView v-if="activeSubTab === 'matrix'" />

    <!-- تب ۳: ویرایشگر اکسل کاتالوگ -->
    <OpsCatalogSpreadsheet v-else-if="activeSubTab === 'spreadsheet'" @close="activeSubTab = 'list'" />

    <!-- تب ۱: لیست اصلی پوشاک -->
    <div v-else class="space-y-4">
      <!-- نوار عنوان، آمار کالاها و دکمه‌های اکشن -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div class="flex items-center gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-lg font-black text-slate-900 tracking-tight">
                کاتالوگ پوشاک و کالکشن
              </h1>
              <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold tabular-nums">
                {{ productsList.length }} قلم
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              مدیریت شناسنامه آثار، قیمت‌گذاری و ماتریس ۶ سایزی موجودی
            </p>
          </div>
        </div>

        <!-- دکمه افزودن لباس جدید -->
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/internal-ops-nexus/products/new"
            data-testid="add-product-btn"
            class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus class="w-4 h-4" />
            <span>افزودن لباس جدید</span>
          </NuxtLink>
        </div>
      </div>

      <!-- کنترل‌های فیلتر و جست‌وجوی سریع -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div class="relative w-full md:w-80">
          <input
            v-model="productSearchQuery"
            type="text"
            placeholder="جستجوی عنوان، اسلاگ یا برند..."
            class="w-full h-9 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-ink outline-hidden"
          >
          <Search class="w-4 h-4 text-slate-400 absolute inset-s-3 top-2.5" />
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            v-model="selectedProductDivision"
            class="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden"
          >
            <option value="all">همه بخش‌ها</option>
            <option value="apparel">پوشاک (Apparel)</option>
            <option value="accessories">اکسسوری (Accessories)</option>
          </select>

          <select
            v-model="selectedProductSeason"
            class="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden"
          >
            <option value="all">همه فصل‌ها</option>
            <option value="fall-1405">پاییز ۱۴۰۵</option>
            <option value="winter-1405">زمستان ۱۴۰۵</option>
            <option value="spring-1406">بهار ۱۴۰۶</option>
            <option value="four-season">چهار فصل</option>
          </select>
        </div>
      </div>

      <!-- جدول تفکیکی محصولات -->
      <div class="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <OpsProductsTable
          :products="paginatedProducts"
          @edit-quick="handleOpenQuickEdit"
          @edit-full="(p) => router.push(`/internal-ops-nexus/products/${p.id}/edit`)"
          @delete="(p) => { productToDelete = p; isDeleteProductDialogOpen = true }"
          @toggle-active="toggleProductActive"
        />

        <!-- پاورقی صفحه‌بندی (Pagination) -->
        <div class="p-3.5 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs">
          <span class="text-slate-500 font-mono tabular-nums">
            نمایش {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length) }} تا {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} از {{ filteredProducts.length }} قلم
          </span>

          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              :disabled="currentPage <= 1"
              @click="currentPage--"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
            <span class="px-2 font-mono font-bold text-slate-800 tabular-nums">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              type="button"
              class="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال‌های کمکی -->
    <OpsQuickEditModal
      v-model:open="isQuickEditOpen"
      :product="quickEditProduct"
      @saved="() => {}"
    />
    <LazyOpsProductDeleteDialog />
    <LazyOpsCatalogMatrixModal v-model:open="isMatrixOpen" />
  </div>
</template>
