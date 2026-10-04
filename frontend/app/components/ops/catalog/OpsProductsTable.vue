<!-- frontend/app/components/ops/catalog/OpsProductsTable.vue -->
<script setup lang="ts">
import { Edit3, Trash2, Zap } from '@lucide/vue'
import { formatToman } from '~/utils/format'
import { useOpsProducts } from '~/composables/ops/useOpsProducts'
import type { ProductDetail } from '~/types/domain'

defineProps<{
  products: ProductDetail[]
}>()

const emit = defineEmits<{
  (e: 'editQuick' | 'editFull' | 'delete' | 'toggleActive', product: ProductDetail): void
}>()

const { getProductTotalStock } = useOpsProducts()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-start text-xs font-sans">
      <thead class="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold">
        <tr>
          <th class="p-3 text-start">کالا و مشخصات</th>
          <th class="p-3 text-start">بخش و دسته‌بندی</th>
          <th class="p-3 text-start">فصل</th>
          <th class="p-3 text-start">قیمت پایه و فروش</th>
          <th class="p-3 text-start">موجودی انبار</th>
          <th class="p-3 text-start">وضعیت عرضه</th>
          <th class="p-3 text-end">عملیات</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr
          v-for="product in products"
          :key="product.id"
          class="hover:bg-slate-50/70 transition-colors"
        >
          <!-- کالا و عکس -->
          <td class="p-3">
            <div class="flex items-center gap-3">
              <img
                :src="product.images?.[0]?.url || 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=200&q=80'"
                :alt="product.title"
                class="w-11 h-13 rounded-lg object-cover shrink-0 border border-slate-200"
              >
              <div class="min-w-0">
                <span class="font-bold text-slate-900 block truncate max-w-xs">{{ product.title }}</span>
                <span class="text-[10px] text-slate-400 font-mono block mt-0.5">{{ product.slug }}</span>
                <span v-if="product.badge" class="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                  {{ product.badge }}
                </span>
              </div>
            </div>
          </td>

          <!-- بخش و دسته -->
          <td class="p-3">
            <span class="font-bold text-slate-800 block">
              {{ product.division === 'apparel' ? 'پوشاک' : 'اکسسوری' }}
            </span>
            <span class="text-[10px] text-slate-500 block mt-0.5">{{ product.category }}</span>
          </td>

          <!-- فصل -->
          <td class="p-3">
            <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
              {{ product.season }}
            </span>
          </td>

          <!-- قیمت -->
          <td class="p-3 font-mono tabular-nums">
            <span class="font-bold text-slate-900 block">{{ formatToman(product.price) }} تومان</span>
            <span
              v-if="product.compare_at_price && product.compare_at_price > product.price"
              class="text-[10px] text-slate-400 line-through block"
            >
              {{ formatToman(product.compare_at_price) }}
            </span>
          </td>

          <!-- موجودی -->
          <td class="p-3">
            <span
              class="px-2 py-0.5 rounded-md font-bold text-xs font-mono tabular-nums"
              :class="getProductTotalStock(product) < 10 ? 'bg-rose-50 text-rose border border-rose/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
            >
              {{ getProductTotalStock(product) }} عدد
            </span>
          </td>

          <!-- سوئیچ فعال/غیرفعال -->
          <td class="p-3">
            <button
              type="button"
              class="px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors"
              :class="product.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'"
              @click="emit('toggleActive', product)"
            >
              {{ product.is_active ? 'فعال' : 'غیرفعال' }}
            </button>
          </td>

          <!-- عملیات -->
          <td class="p-3 text-end">
            <div class="flex items-center justify-end gap-1.5">
              <button
                type="button"
                class="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 cursor-pointer transition-colors"
                title="ویرایش سریع قیمت و موجودی"
                @click="emit('editQuick', product)"
              >
                <Zap class="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                data-testid="edit-product-btn"
                class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                title="ویرایش جامع کالا"
                @click="emit('editFull', product)"
              >
                <Edit3 class="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                data-testid="delete-product-btn"
                class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose cursor-pointer transition-colors"
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
</template>
