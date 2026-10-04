<!-- frontend/app/components/ops/OpsProductsView.vue -->
<script setup lang="ts">
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  TableProperties,
  Grid,
  ArrowLeftRight,
} from '@lucide/vue'
import { formatToman } from '~/utils/format'
import { useOpsProducts } from '~/composables/ops/useOpsProducts'
import { useOpsModals } from '~/composables/ops/useOpsModals'
import OpsCatalogSpreadsheet from '~/components/ops/catalog/OpsCatalogSpreadsheet.vue'

const {
  productSearchQuery,
  selectedProductDivision,
  selectedProductSeason,
  filteredProducts,
  getProductTotalStock,
  toggleProductActive,
  openAddProductModal,
  openEditProductModal,
  isDeleteProductDialogOpen,
  productToDelete,
} = useOpsProducts()

const { isSpreadsheetOpen, isMatrixOpen, isTransferOpen } = useOpsModals()
</script>

<template>
  <section data-testid="nexus-products-view" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          مدیریت محصولات و کاتالوگ آتلیه
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          تعریف محصول جدید، ویرایش متغیرهای سایز، قیمت‌گذاری و کنترل عرضه
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="h-10 px-3 rounded-xl border border-sand bg-white hover:bg-sand/30 text-ink text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="isSpreadsheetOpen = !isSpreadsheetOpen"
        >
          <TableProperties class="w-4 h-4 text-emerald-700" />
          <span>{{ isSpreadsheetOpen ? 'بستن اکسل' : 'نمای اکسل کاتالوگ' }}</span>
        </button>

        <button
          type="button"
          class="h-10 px-3 rounded-xl border border-sand bg-white hover:bg-sand/30 text-ink text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="isMatrixOpen = true"
        >
          <Grid class="w-4 h-4 text-rose" />
          <span>ماتریس متغیرها</span>
        </button>

        <button
          type="button"
          class="h-10 px-3 rounded-xl border border-sand bg-white hover:bg-sand/30 text-ink text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="isTransferOpen = true"
        >
          <ArrowLeftRight class="w-4 h-4 text-slate-600" />
          <span>حواله انبار</span>
        </button>

        <button
          type="button"
          data-testid="add-product-btn"
          class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          @click="openAddProductModal"
        >
          <Plus class="w-4 h-4" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>
    </div>

    <!-- ویرایشگر اکسل کاتالوگ -->
    <OpsCatalogSpreadsheet v-if="isSpreadsheetOpen" @close="isSpreadsheetOpen = false" />

    <!-- فیلترها و جستجوی کالاها -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
      <div class="relative w-full md:w-80">
        <input
          v-model="productSearchQuery"
          type="text"
          placeholder="جستجوی عنوان، شناسه (Slug) یا برند..."
          class="w-full h-10 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-ink transition-all outline-hidden"
        >
        <Search class="w-4 h-4 text-slate-400 absolute inset-s-3 top-3" />
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
        <!-- فیلتر بخش -->
        <select
          v-model="selectedProductDivision"
          class="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden focus:border-ink"
        >
          <option value="all">
            همه بخش‌ها
          </option>
          <option value="apparel">
            پوشاک (Apparel)
          </option>
          <option value="accessories">
            اکسسوری (Accessories)
          </option>
        </select>

        <!-- فیلتر فصل -->
        <select
          v-model="selectedProductSeason"
          class="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden focus:border-ink"
        >
          <option value="all">
            همه فصل‌ها
          </option>
          <option value="fall-1405">
            پاییز ۱۴۰۵
          </option>
          <option value="winter-1405">
            زمستان ۱۴۰۵
          </option>
          <option value="spring-1406">
            بهار ۱۴۰۶
          </option>
          <option value="four-season">
            چهار فصل
          </option>
        </select>
      </div>
    </div>

    <!-- جدول جامع محصولات -->
    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs">
          <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th class="p-3.5 text-start">
                کالا و مشخصات
              </th>
              <th class="p-3.5 text-start">
                بخش و دسته‌بندی
              </th>
              <th class="p-3.5 text-start">
                فصل
              </th>
              <th class="p-3.5 text-start">
                قیمت پایه و فروش
              </th>
              <th class="p-3.5 text-start">
                موجودی انبار
              </th>
              <th class="p-3.5 text-start">
                وضعیت عرضه
              </th>
              <th class="p-3.5 text-end">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- کالا و عکس -->
              <td class="p-3.5">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.images?.[0]?.url || 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=200&q=80'"
                    :alt="product.title"
                    class="w-12 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                  >
                  <div class="min-w-0">
                    <span class="font-bold text-slate-900 block truncate max-w-xs">{{ product.title }}</span>
                    <span class="text-[10px] text-slate-500 font-mono block mt-0.5">{{ product.slug }}</span>
                    <span v-if="product.badge" class="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                      {{ product.badge }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- بخش و دسته -->
              <td class="p-3.5">
                <span class="font-bold text-slate-800 block">
                  {{ product.division === 'apparel' ? 'پوشاک' : 'اکسسوری' }}
                </span>
                <span class="text-[10px] text-slate-500 block mt-0.5">{{ product.category }}</span>
              </td>

              <!-- فصل -->
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                  {{ product.season }}
                </span>
              </td>

              <!-- قیمت -->
              <td class="p-3.5 font-mono">
                <span class="font-bold text-slate-900 block">{{ formatToman(product.price) }} تومان</span>
                <span
                  v-if="product.compare_at_price && product.compare_at_price > product.price"
                  class="text-[10px] text-slate-400 line-through block"
                >
                  {{ formatToman(product.compare_at_price) }}
                </span>
              </td>

              <!-- موجودی -->
              <td class="p-3.5">
                <div class="flex items-center gap-1.5 font-mono">
                  <span
                    class="px-2 py-0.5 rounded-md font-bold text-xs"
                    :class="getProductTotalStock(product) < 10 ? 'bg-rose-50 text-rose border border-rose/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
                  >
                    {{ getProductTotalStock(product) }} عدد
                  </span>
                </div>
              </td>

              <!-- سوئیچ فعال/غیرفعال -->
              <td class="p-3.5">
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors"
                  :class="product.is_active ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
                  @click="toggleProductActive(product)"
                >
                  {{ product.is_active ? 'فعال' : 'غیرفعال' }}
                </button>
              </td>

              <!-- عملیات -->
              <td class="p-3.5 text-end">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    data-testid="edit-product-btn"
                    class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    title="ویرایش محصول"
                    @click="openEditProductModal(product)"
                  >
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    data-testid="delete-product-btn"
                    class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose cursor-pointer"
                    title="حذف / بایگانی"
                    @click="productToDelete = product; isDeleteProductDialogOpen = true"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
