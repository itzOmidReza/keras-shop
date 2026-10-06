<!-- frontend/app/components/ops/taxonomy/TaxonomyBrandsTab.vue -->
<script setup lang="ts">
import { Plus, Trash2, Award, Star } from '@lucide/vue'

const {
  store,
  brandForm,
  handleCreateBrand,
  handleToggleBrandFeatured,
  handleDeleteBrand,
} = useAdminTaxonomy()

const autoSlug = () => {
  if (brandForm.value.name && !brandForm.value.slug) {
    brandForm.value.slug = brandForm.value.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- فرم ثبت برند جدید -->
    <div class="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-4">
      <div class="flex items-center gap-2 text-slate-800 font-bold text-xs pb-3 border-b border-slate-100">
        <Award class="w-4 h-4 text-amber-600" />
        <span>افزودن برند یا لاین اختصاصی جدید</span>
      </div>

      <form class="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end" @submit.prevent="handleCreateBrand">
        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">نام تجاری برند:</label>
          <input
            v-model="brandForm.name"
            type="text"
            placeholder="مثال: Massimo Dutti"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800 font-bold"
            @blur="autoSlug"
          >
        </div>

        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">شناسه پیوند (Slug):</label>
          <input
            v-model="brandForm.slug"
            type="text"
            placeholder="massimo-dutti"
            dir="ltr"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800"
          >
        </div>

        <div class="space-y-1 sm:col-span-1 flex items-center h-9">
          <label class="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
            <input
              v-model="brandForm.isFeatured"
              type="checkbox"
              class="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
            >
            <span>نمایش در نوار شرکا (صفحه اول)</span>
          </label>
        </div>

        <div class="sm:col-span-1">
          <button
            type="submit"
            data-testid="add-brand-btn"
            class="w-full h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus class="w-4 h-4" />
            <span>ثبت برند</span>
          </button>
        </div>
      </form>
    </div>

    <!-- جدول برندها -->
    <div class="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs border-collapse">
          <thead class="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
            <tr>
              <th class="p-3 text-start">نام برند</th>
              <th class="p-3 text-start">شناسه پیوند (Slug)</th>
              <th class="p-3 text-center">وضعیت مارکی و صفحه اصلی</th>
              <th class="p-3 text-center w-24">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="brand in store.brands"
              :key="brand.id"
              class="hover:bg-slate-50/60 transition-colors"
            >
              <td class="p-3 font-bold text-slate-900">
                {{ brand.name }}
              </td>
              <td class="p-3 font-mono text-slate-500 text-[11px]">
                {{ brand.slug }}
              </td>
              <td class="p-3 text-center">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                  :class="brand.isFeatured
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
                  @click="handleToggleBrandFeatured(brand)"
                >
                  <Star class="w-3 h-3" :class="brand.isFeatured ? 'fill-amber-500 text-amber-500' : ''" />
                  <span>{{ brand.isFeatured ? 'برجسته در صفحه اصلی' : 'عادی' }}</span>
                </button>
              </td>
              <td class="p-3 text-center">
                <button
                  type="button"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose hover:bg-rose/10 transition-colors cursor-pointer"
                  title="حذف برند"
                  @click="handleDeleteBrand(brand)"
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

