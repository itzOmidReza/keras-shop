<!-- frontend/app/components/ops/taxonomy/TaxonomyCategoriesTab.vue -->
<script setup lang="ts">
import { Plus, Trash2, FolderTree, Check, X } from '@lucide/vue'
import { useAdminTaxonomy } from '~/composables/admin/useAdminTaxonomy'

const {
  store,
  categoryForm,
  handleCreateCategory,
  handleToggleCategoryActive,
  handleDeleteCategory,
} = useAdminTaxonomy()

const autoSlug = () => {
  if (categoryForm.value.name && !categoryForm.value.slug) {
    categoryForm.value.slug = categoryForm.value.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- فرم ثبت دسته‌بندی جدید -->
    <div class="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-4">
      <div class="flex items-center gap-2 text-slate-800 font-bold text-xs pb-3 border-b border-slate-100">
        <FolderTree class="w-4 h-4 text-sky-600" />
        <span>افزودن دسته‌بندی جدید به کاتالوگ</span>
      </div>

      <form class="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end" @submit.prevent="handleCreateCategory">
        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">عنوان فارسی:</label>
          <input
            v-model="categoryForm.name"
            type="text"
            placeholder="مثال: شومیز و بلوز"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800 font-bold"
            @blur="autoSlug"
          >
        </div>

        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">شناسه انگلیسی (URL Slug):</label>
          <input
            v-model="categoryForm.slug"
            type="text"
            placeholder="shirts-blouses"
            dir="ltr"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800"
          >
        </div>

        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">شاخه اصلی (Division):</label>
          <select
            v-model="categoryForm.division"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800 cursor-pointer"
          >
            <option value="apparel">پوشاک (Apparel)</option>
            <option value="accessories">اکسسوری و زیورآلات (Accessories)</option>
          </select>
        </div>

        <div class="sm:col-span-1">
          <button
            type="submit"
            data-testid="add-category-btn"
            class="w-full h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus class="w-4 h-4" />
            <span>ثبت دسته‌بندی</span>
          </button>
        </div>
      </form>
    </div>

    <!-- جدول دسته‌بندی‌ها -->
    <div class="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs border-collapse">
          <thead class="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
            <tr>
              <th class="p-3 text-start">عنوان دسته‌بندی</th>
              <th class="p-3 text-start">شناسه پیوند (Slug)</th>
              <th class="p-3 text-center">بخش (Division)</th>
              <th class="p-3 text-center">وضعیت انتشار</th>
              <th class="p-3 text-center w-24">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="cat in store.categories"
              :key="cat.id"
              class="hover:bg-slate-50/60 transition-colors"
            >
              <td class="p-3 font-bold text-slate-900">
                {{ cat.name }}
              </td>
              <td class="p-3 font-mono text-slate-500 text-[11px]">
                {{ cat.slug }}
              </td>
              <td class="p-3 text-center">
                <span
                  class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  :class="cat.division === 'apparel'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ cat.division === 'apparel' ? 'پوشاک' : 'اکسسوری' }}
                </span>
              </td>
              <td class="p-3 text-center">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                  :class="cat.isActive
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
                  @click="handleToggleCategoryActive(cat)"
                >
                  <component :is="cat.isActive ? Check : X" class="w-3 h-3" />
                  <span>{{ cat.isActive ? 'فعال' : 'غیرفعال' }}</span>
                </button>
              </td>
              <td class="p-3 text-center">
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose hover:bg-rose/10 transition-colors cursor-pointer"
                  title="حذف دسته‌بندی"
                  @click="handleDeleteCategory(cat)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

