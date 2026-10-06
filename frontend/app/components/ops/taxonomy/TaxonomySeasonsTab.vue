<!-- frontend/app/components/ops/taxonomy/TaxonomySeasonsTab.vue -->
<script setup lang="ts">
import { Plus, Trash2, Calendar, Sparkles, Check, X } from '@lucide/vue'

const {
  store,
  seasonForm,
  handleCreateSeason,
  handleSetCurrentSeason,
  handleToggleSeasonActive,
  handleDeleteSeason,
} = useAdminTaxonomy()

const autoSlug = () => {
  if (seasonForm.value.name && !seasonForm.value.slug) {
    seasonForm.value.slug = seasonForm.value.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- فرم ثبت دراپ / فصل جدید -->
    <div class="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-4">
      <div class="flex items-center gap-2 text-slate-800 font-bold text-xs pb-3 border-b border-slate-100">
        <Calendar class="w-4 h-4 text-rose" />
        <span>افزودن دراپ فصلی جدید</span>
      </div>

      <form class="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end" @submit.prevent="handleCreateSeason">
        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">نام فصل / دراپ:</label>
          <input
            v-model="seasonForm.name"
            type="text"
            placeholder="مثال: زمستان ۱۴۰۵"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800 font-bold"
            @blur="autoSlug"
          >
        </div>

        <div class="space-y-1 sm:col-span-1">
          <label class="block text-[11px] font-bold text-slate-700">شناسه پیوند (Slug):</label>
          <input
            v-model="seasonForm.slug"
            type="text"
            placeholder="winter-1405"
            dir="ltr"
            class="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white outline-hidden focus:border-slate-800"
          >
        </div>

        <div class="space-y-1 sm:col-span-1 flex items-center h-9">
          <label class="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
            <input
              v-model="seasonForm.isCurrentDrop"
              type="checkbox"
              class="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
            >
            <span>تنظیم به عنوان دراپ جاری</span>
          </label>
        </div>

        <div class="sm:col-span-1">
          <button
            type="submit"
            data-testid="add-season-btn"
            class="w-full h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus class="w-4 h-4" />
            <span>ثبت دراپ</span>
          </button>
        </div>
      </form>
    </div>

    <!-- لیست دراپ‌ها و فصل‌ها -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="season in store.seasons"
        :key="season.id"
        class="p-5 rounded-2xl border transition-all shadow-2xs space-y-4"
        :class="season.isCurrentDrop
          ? 'border-rose/50 bg-rose/5 ring-1 ring-rose/30'
          : 'border-slate-200/80 bg-white'"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-slate-900">
                {{ season.name }}
              </h3>
              <span
                v-if="season.isCurrentDrop"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose text-white shadow-2xs"
              >
                <Sparkles class="w-3 h-3" />
                <span>دراپ جاری فروشگاه</span>
              </span>
            </div>
            <p class="text-xs font-mono text-slate-500">
              شناسه سیستم: {{ season.slug }}
            </p>
          </div>

          <button
            type="button"
            class="p-1.5 rounded-lg text-slate-400 hover:text-rose hover:bg-rose/10 transition-colors cursor-pointer"
            title="حذف فصل"
            @click="handleDeleteSeason(season)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100/80 text-xs">
          <div class="flex items-center gap-2">
            <button
              v-if="!season.isCurrentDrop"
              type="button"
              class="px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-colors"
              @click="handleSetCurrentSeason(season)"
            >
              انتخاب به عنوان دراپ جاری
            </button>
            <span v-else class="text-xs font-bold text-rose">
              ✓ فعال در هدر و بنرها
            </span>
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
            :class="season.isActive
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
            @click="handleToggleSeasonActive(season)"
          >
            <component :is="season.isActive ? Check : X" class="w-3 h-3" />
            <span>{{ season.isActive ? 'فعال' : 'آرشیو شده' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

