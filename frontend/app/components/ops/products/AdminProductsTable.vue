<!-- frontend/app/components/ops/products/AdminProductsTable.vue -->
<script setup lang="ts">
import {
  Edit3,
  Trash2,
  Shirt,
  CheckCircle2,
  XCircle,
} from '@lucide/vue'
import { toFa, formatToman } from '~/utils/format'
import type { ProductDetail } from '~/types/domain'

defineProps<{
  products: ProductDetail[]
}>()

const emit = defineEmits<{
  toggleActive: [product: ProductDetail]
  delete: [product: ProductDetail]
}>()

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
            v-for="product in products"
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
                @click="emit('toggleActive', product)"
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
                  @click="emit('delete', product)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="products.length === 0" class="p-10 text-center text-slate-400 text-xs space-y-1">
      <p class="font-bold text-slate-700">هیچ محصولی با این فیلترها یافت نشد.</p>
      <p class="text-[11px]">می‌توانید کلمه جست‌وجو را تغییر دهید.</p>
    </div>
  </div>
</template>
