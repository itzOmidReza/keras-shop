<!-- frontend/app/components/ops/taxonomy/TaxonomySizesTab.vue -->
<script setup lang="ts">
import { Plus, Trash2, Ruler } from '@lucide/vue'
import type { CustomSize } from '~/types/domain'

const { store, sizeForm, handleCreateSize, handleDeleteSize } = useAdminTaxonomy()

const groups: { key: CustomSize['group']; label: string }[] = [
  { key: 'alpha', label: 'سایزهای الفبایی (Alpha)' },
  { key: 'numeric', label: 'سایزهای عددی (Numeric)' },
  { key: 'free', label: 'تک سایز / فری‌سایز (Free)' },
  { key: 'accessory', label: 'اکسسوری و زیورآلات (Accessory)' },
]

const getSizesForGroup = (group: CustomSize['group']) => {
  return store.sizes
    .filter((s) => s.group === group)
    .sort((a, b) => a.order - b.order)
}
</script>

<template>
  <div class="space-y-6">
    <!-- فرم ثبت سریع سایز جدید -->
    <div class="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-4">
      <div class="flex items-center gap-2 text-slate-800 font-bold text-xs pb-3 border-b border-slate-100">
        <Ruler class="w-4 h-4 text-emerald-600" />
        <span>افزودن سایز جدید به سیستم</span>
      </div>

      <form class="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end" @submit.prevent="handleCreateSize">
        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">عنوان سایز:</label>
          <input
            v-model="sizeForm.name"
            type="text"
            placeholder="مثال: 46 یا 2XL"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800 font-bold"
          >
        </div>

        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">گروه سایزبندی:</label>
          <select
            v-model="sizeForm.group"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800 cursor-pointer"
          >
            <option value="alpha">الفبایی (XS, S, M...)</option>
            <option value="numeric">عددی (36, 38, 40...)</option>
            <option value="free">فری‌سایز / تک‌سایز</option>
            <option value="accessory">اکسسوری و شال</option>
          </select>
        </div>

        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">ترتیب نمایش (Order):</label>
          <input
            v-model.number="sizeForm.order"
            type="number"
            min="1"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800"
          >
        </div>

        <div class="sm:col-span-1">
          <button
            type="submit"
            data-testid="add-size-btn"
            class="w-full h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus class="w-4 h-4" />
            <span>افزودن سایز</span>
          </button>
        </div>
      </form>
    </div>

    <!-- گروه‌بندی سایزها -->
    <div class="space-y-4">
      <div
        v-for="grp in groups"
        :key="grp.key"
        class="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-3"
      >
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 class="text-xs font-bold text-slate-800">
            {{ grp.label }}
          </h3>
          <span class="text-[11px] text-slate-400 font-mono">
            {{ getSizesForGroup(grp.key).length }} سایز
          </span>
        </div>

        <div class="flex flex-wrap gap-2.5">
          <div
            v-for="size in getSizesForGroup(grp.key)"
            :key="size.id"
            class="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all text-xs font-bold text-slate-800"
          >
            <span class="font-mono">{{ size.name }}</span>
            <span class="text-[10px] text-slate-400 font-mono font-normal">#{{ size.order }}</span>
            <button
              type="button"
              class="text-slate-400 hover:text-rose transition-colors p-0.5 rounded cursor-pointer"
              title="حذف سایز"
              @click="handleDeleteSize(size)"
            >
              <Trash2 class="w-3 h-3" />
            </button>
          </div>

          <div
            v-if="getSizesForGroup(grp.key).length === 0"
            class="text-xs text-slate-400 py-2"
          >
            هیچ سایزی در این گروه ثبت نشده است.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

