<!-- frontend/app/pages/internal-ops-nexus/products/index.vue -->
<script setup lang="ts">
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Shirt,
  CheckCircle2,
  XCircle,
} from '@lucide/vue'
import { useAdminProducts } from '~/composables/ops/useAdminProducts'
import { toFa, formatToman } from '~/utils/format'
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

const getTotalStock = (p: ProductDetail): number => {
  if (p.variants && p.variants.length > 0) {
    return p.variants.reduce((sum, v) => sum + v.stock, 0)
  }
  return p.inStock ? 12 : 0
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'coats-jackets': return 'کت و پالتو'
    case 'dresses': return 'پیراهن و سرهمی'
    case 'shirts-blouses': return 'شومیز و بلوز'
    case 'pants-skirts': return 'شلوار و دامن'
    case 'knitwear': return 'بافت و پلیور'
    case 'scarves-shawls': return 'شال و روسری'
    case 'bags': return 'کیف چرم'
    case 'accessories': return 'اکسسوری'
    default: return 'پوشاک زنانه'
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
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="relative w-full sm:w-80">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجوی نام لباس، اسلاگ یا کد کالا..."
          class="w-full h-9.5 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-hidden"
        >
        <Search class="w-4 h-4 text-slate-400 absolute inset-s-3 top-2.5" />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          v-model="selectedCategory"
          class="h-9.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white outline-hidden cursor-pointer w-full sm:w-auto"
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

    <!-- جدول محصولات -->
    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs border-collapse">
          <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
            <tr>
              <th class="p-3.5 text-start">تصویر و مشخصات لباس</th>
              <th class="p-3.5 text-start">دسته‌بندی</th>
              <th class="p-3.5 text-start">تنوع رنگ و سایز</th>
              <th class="p-3.5 text-center">کل موجودی</th>
              <th class="p-3.5 text-start">قیمت (تومان)</th>
              <th class="p-3.5 text-center">وضعیت</th>
              <th class="p-3.5 text-end">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- تصویر و عنوان -->
              <td class="p-3.5">
                <div class="flex items-center gap-3">
                  <img
                    v-if="product.images[0]?.url"
                    :src="product.images[0].url"
                    :alt="product.title"
                    class="w-11 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  >
                  <div v-else class="w-11 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Shirt class="w-5 h-5 text-slate-400" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="font-bold text-slate-900 text-xs truncate max-w-xs">
                      {{ product.title }}
                    </h3>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {{ product.slug }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- دسته‌بندی -->
              <td class="p-3.5 text-slate-600">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-bold text-slate-700">
                  {{ getCategoryLabel(product.category) }}
                </span>
              </td>

              <!-- خلاصه رنگ و سایز -->
              <td class="p-3.5">
                <div class="space-y-1">
                  <!-- سواچ رنگ‌ها -->
                  <div class="flex items-center gap-1">
                    <span
                      v-for="(c, cIdx) in (product.colors || []).slice(0, 4)"
                      :key="cIdx"
                      class="w-3.5 h-3.5 rounded-full border border-slate-300"
                      :style="{ backgroundColor: c.hex }"
                      :title="c.name"
                    />
                    <span v-if="(product.colors || []).length > 4" class="text-[10px] text-slate-400">
                      +{{ toFa((product.colors || []).length - 4) }}
                    </span>
                  </div>
                  <!-- سایزها -->
                  <div class="text-[10px] text-slate-500 font-mono">
                    {{ (product.sizes || []).join('، ') }}
                  </div>
                </div>
              </td>

              <!-- کل موجودی انبار -->
              <td class="p-3.5 text-center font-mono">
                <span
                  class="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums"
                  :class="getTotalStock(product) > 5 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : getTotalStock(product) > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-rose-50 text-rose border border-rose-200'"
                >
                  {{ toFa(getTotalStock(product)) }} عدد
                </span>
              </td>

              <!-- قیمت -->
              <td class="p-3.5 font-mono tabular-nums">
                <div class="font-bold text-slate-900 text-xs">
                  {{ formatToman(product.price) }}
                </div>
                <div v-if="product.compare_at_price && product.compare_at_price > product.price" class="text-[10px] text-slate-400 line-through">
                  {{ formatToman(product.compare_at_price) }}
                </div>
              </td>

              <!-- فعال / ناموجود -->
              <td class="p-3.5 text-center">
                <button
                  type="button"
                  class="p-1 rounded-lg transition-colors cursor-pointer"
                  :title="product.inStock ? 'کلیک جهت غیرفعال‌سازی' : 'کلیک جهت فعال‌سازی'"
                  @click="toggleProductActive(product)"
                >
                  <CheckCircle2 v-if="product.inStock" class="w-4 h-4 text-emerald-600 inline" />
                  <XCircle v-else class="w-4 h-4 text-slate-300 inline" />
                </button>
              </td>

              <!-- عملیات -->
              <td class="p-3.5 text-end">
                <div class="flex items-center justify-end gap-1.5">
                  <NuxtLink
                    :to="`/internal-ops-nexus/products/${product.id}/edit`"
                    class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                    title="ویرایش کالا"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                  </NuxtLink>

                  <button
                    type="button"
                    class="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose cursor-pointer transition-colors"
                    title="حذف کالا"
                    @click="openDeleteConfirm(product)"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredProducts.length === 0" class="p-10 text-center text-slate-400 text-xs space-y-1">
        <p class="font-bold text-slate-700">هیچ محصولی با این فیلترها یافت نشد.</p>
        <p class="text-[11px]">می‌توانید کلمه جست‌وجو را تغییر دهید.</p>
      </div>
    </div>

    <!-- مودال تایید حذف محصول -->
    <Teleport to="body">
      <div
        v-if="isConfirmDeleteOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans"
        role="dialog"
      >
        <div class="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
          <h3 class="text-sm font-bold text-slate-900">حذف محصول از کاتالوگ</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            آیا از حذف محصول «<strong>{{ productToDelete?.title }}</strong>» اطمینان دارید؟ این عمل غیرقابل بازگشت است.
          </p>
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              class="h-8.5 px-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              @click="isConfirmDeleteOpen = false"
            >
              انصراف
            </button>
            <button
              type="button"
              class="h-8.5 px-4 rounded-xl bg-rose text-white text-xs font-bold cursor-pointer"
              @click="confirmDelete"
            >
              تایید حذف
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
