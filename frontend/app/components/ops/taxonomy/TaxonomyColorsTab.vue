<!-- frontend/app/components/ops/taxonomy/TaxonomyColorsTab.vue -->
<script setup lang="ts">
import { Plus, Trash2, Palette } from '@lucide/vue'

const { store, colorForm, handleCreateColor, handleDeleteColor } = useAdminTaxonomy()
</script>

<template>
  <div class="space-y-6">
    <!-- فرم سریع ثبت رنگ جدید -->
    <div class="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-4">
      <div class="flex items-center gap-2 text-slate-800 font-bold text-xs pb-3 border-b border-slate-100">
        <Palette class="w-4 h-4 text-purple-600" />
        <span>افزودن رنگ جدید به پالت استودیو</span>
      </div>

      <form class="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end" @submit.prevent="handleCreateColor">
        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">نام رنگ (فارسی):</label>
          <input
            v-model="colorForm.name"
            type="text"
            placeholder="مثال: کاراملی روشن"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800"
          >
        </div>

        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">کد هگز و پیش‌نمایش:</label>
          <div class="flex items-center gap-2">
            <input
              v-model="colorForm.hex"
              type="color"
              class="w-9 h-9 p-0.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer shrink-0"
            >
            <input
              v-model="colorForm.hex"
              type="text"
              placeholder="کد هگز مثلا c2a68c"
              dir="ltr"
              class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800"
            >
          </div>
        </div>

        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">شناسه انگلیسی (اختیاری):</label>
          <input
            v-model="colorForm.slug"
            type="text"
            placeholder="light-caramel"
            dir="ltr"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800"
          >
        </div>

        <div class="sm:col-span-1">
          <button
            type="submit"
            data-testid="add-color-btn"
            class="w-full h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus class="w-4 h-4" />
            <span>افزودن رنگ</span>
          </button>
        </div>
      </form>
    </div>

    <!-- شبکه کارت‌های رنگ -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
      <div
        v-for="color in store.colors"
        :key="color.id"
        class="group p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-2.5 relative"
      >
        <div class="flex items-center gap-2.5">
          <span
            class="w-8 h-8 rounded-xl border border-slate-200 shrink-0 shadow-2xs"
            :style="{ backgroundColor: color.hex }"
          />
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold text-slate-800 truncate">
              {{ color.name }}
            </h4>
            <p class="text-[10px] font-mono text-slate-500 dir-ltr text-end truncate">
              {{ color.hex }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
          <span class="font-mono truncate">{{ color.slug }}</span>
          <button
            type="button"
            class="text-rose hover:text-rose/80 p-1 rounded-lg hover:bg-rose/10 transition-colors cursor-pointer"
            title="حذف رنگ"
            @click="handleDeleteColor(color)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

