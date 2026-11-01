<!-- frontend/app/components/ops/lookbooks/AdminLookbooksTable.vue -->
<script setup lang="ts">
import {
  Edit,
  Trash2,
  Sparkles,
  Layers,
  Percent,
} from '@lucide/vue'
import { toFa, formatToman } from '~/utils/format'
import type { StyleLookbook } from '~/types/domain'

defineProps<{
  lookbooks: StyleLookbook[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  toggleStatus: [id: string]
  delete: [id: string]
  resetFilters: []
}>()

const confirmDeleteId = ref<string | null>(null)

const handleDelete = (id: string) => {
  if (confirmDeleteId.value === id) {
    emit('delete', id)
    confirmDeleteId.value = null
  } else {
    confirmDeleteId.value = id
    setTimeout(() => {
      if (confirmDeleteId.value === id) {
        confirmDeleteId.value = null
      }
    }, 4000)
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden" data-testid="admin-lookbooks-table">
    <!-- وضعیت در حال بارگذاری -->
    <div v-if="isLoading" class="p-12 text-center text-slate-500 text-xs">
      در حال دریافت ست‌ها و استایل‌ها...
    </div>

    <!-- جدول رومیزی -->
    <div v-else-if="lookbooks.length > 0" class="overflow-x-auto">
      <table class="w-full text-start text-xs border-collapse">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/75 text-slate-600 font-bold">
            <th class="py-3.5 px-4 text-start">کاور و عنوان ست</th>
            <th class="py-3.5 px-4 text-start">محصولات متصل</th>
            <th class="py-3.5 px-4 text-start">تخفیف پکیج</th>
            <th class="py-3.5 px-4 text-start">قیمت ست</th>
            <th class="py-3.5 px-4 text-start">ترتیب</th>
            <th class="py-3.5 px-4 text-start">وضعیت نمایش</th>
            <th class="py-3.5 px-4 text-end">عملیات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="look in lookbooks"
            :key="look.id"
            class="hover:bg-slate-50/60 transition-colors"
            data-testid="lookbook-row"
          >
            <!-- کاور و عنوان ست -->
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <img
                  :src="look.cover_image || look.image"
                  :alt="look.title"
                  class="w-14 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                >
                <div class="space-y-1 min-w-0">
                  <span v-if="look.tagline || look.subtitle" class="text-[10px] font-bold text-amber-600 block">
                    {{ look.tagline || look.subtitle }}
                  </span>
                  <span class="font-bold text-slate-900 block truncate max-w-xs text-sm">
                    {{ look.title }}
                  </span>
                  <p class="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                    {{ look.description }}
                  </p>
                </div>
              </div>
            </td>

            <!-- محصولات متصل به همراه تصاویر کوچک -->
            <td class="py-3 px-4">
              <div class="space-y-1.5">
                <span class="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                  <Layers class="w-3.5 h-3.5 text-slate-400" />
                  <span>{{ toFa(look.items?.length || look.product_count || 0) }} قلم کالا</span>
                </span>
                <div class="flex items-center -space-x-1.5 rtl:space-x-reverse overflow-hidden">
                  <img
                    v-for="(item, idx) in look.items?.slice(0, 4)"
                    :key="idx"
                    :src="item.image"
                    :alt="item.title"
                    class="w-6 h-7 rounded-md object-cover border border-white shadow-2xs"
                    :title="item.title"
                  >
                </div>
              </div>
            </td>

            <!-- درصد تخفیف پکیج -->
            <td class="py-3 px-4">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                <Percent class="w-3 h-3 text-amber-500" />
                <span>{{ toFa(look.discount_percent || 10) }}٪ تخفیف</span>
              </span>
            </td>

            <!-- قیمت ست (عادی و تخفیف‌دار) -->
            <td class="py-3 px-4">
              <div class="space-y-0.5">
                <span class="font-bold text-slate-900 text-xs block">
                  {{ formatToman(look.discounted_price) }}
                </span>
                <span v-if="look.bundle_total_price > look.discounted_price" class="text-[10px] text-slate-400 line-through block">
                  {{ formatToman(look.bundle_total_price) }}
                </span>
              </div>
            </td>

            <!-- ترتیب نمایش -->
            <td class="py-3 px-4">
              <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {{ toFa(look.display_order ?? 0) }}
              </span>
            </td>

            <!-- وضعیت نمایش -->
            <td class="py-3 px-4">
              <button
                type="button"
                class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
                :class="[
                  look.is_active !== false
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200',
                ]"
                @click="emit('toggleStatus', look.id)"
              >
                {{ look.is_active !== false ? 'فعال در ویترین' : 'غیرفعال' }}
              </button>
            </td>

            <!-- دکمه‌های عملیات -->
            <td class="py-3 px-4 text-end">
              <div class="inline-flex items-center gap-1.5 justify-end">
                <NuxtLink
                  :to="`/internal-ops-nexus/lookbooks/${look.id}/edit`"
                  class="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="ویرایش ست"
                  data-testid="edit-lookbook-button"
                >
                  <Edit class="w-4 h-4" />
                </NuxtLink>

                <button
                  type="button"
                  class="p-2 rounded-xl transition-colors cursor-pointer"
                  :class="[
                    confirmDeleteId === look.id
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50',
                  ]"
                  :title="confirmDeleteId === look.id ? 'برای تایید حذف دوباره کلیک کنید' : 'حذف ست'"
                  data-testid="delete-lookbook-button"
                  @click="handleDelete(look.id)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- وضعیت عدم وجود رکورد -->
    <div v-else class="p-12 text-center space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
        <Sparkles class="w-6 h-6" />
      </div>
      <h3 class="text-sm font-bold text-slate-900">ستی با این مشخصات یافت نشد</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        می‌توانید فیلترهای جستجو را پاک کنید یا اولین ست استایلینگ ادیتوریال خود را طراحی نمایید.
      </p>
      <button
        type="button"
        class="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline pt-2 cursor-pointer"
        @click="emit('resetFilters')"
      >
        <span>پاک کردن فیلترها</span>
      </button>
    </div>
  </div>
</template>
