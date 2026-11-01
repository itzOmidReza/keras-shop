<!-- frontend/app/components/ops/lookbooks/AdminLookbooksFilterBar.vue -->
<script setup lang="ts">
import { Search, Plus, Sparkles, X } from '@lucide/vue'
import { toFa } from '~/utils/format'

defineProps<{
  totalCount: number
  stats: {
    total: number
    active: number
    inactive: number
  }
  selectedStatus: 'all' | 'active' | 'inactive'
  searchQuery: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedStatus', value: 'all' | 'active' | 'inactive'): void
  (e: 'update:searchQuery', value: string): void
}>()

const onSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:searchQuery', target.value)
}

const clearSearch = () => {
  emit('update:searchQuery', '')
}
</script>

<template>
  <div class="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
    <!-- ردیف بالای نوار: تیتر، آمار و دکمه افزودن ست جدید -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
          <Sparkles class="w-5 h-5" />
        </div>
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            مدیریت ست‌ها و استایل‌های ادیتوریال (Lookbook)
          </h1>
          <p class="text-xs text-slate-500">
            طراحی و تنظیم بسته‌های استایلینگ همراه با تخفیف‌های باندل و هات‌اسپات‌های تعاملی
          </p>
        </div>
      </div>

      <NuxtLink
        to="/internal-ops-nexus/lookbooks/new"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 active:scale-98"
        data-testid="create-new-lookbook-button"
      >
        <Plus class="w-4 h-4" />
        <span>طراحی ست جدید</span>
      </NuxtLink>
    </div>

    <!-- ردیف فیلترهای جستجو و تب‌های وضعیت -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
      <!-- جست‌وجوی زنده -->
      <div class="relative w-full md:w-80">
        <input
          :value="searchQuery"
          type="text"
          placeholder="جست‌وجوی عنوان یا توضیحات ست..."
          class="w-full h-10 ps-10 pe-9 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
          data-testid="lookbooks-search-input"
          @input="onSearchInput"
        >
        <Search class="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute end-3 top-3 text-slate-400 hover:text-slate-600"
          @click="clearSearch"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- وضعیت‌های ست (همه، فعال، غیرفعال) -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0"
          :class="[
            selectedStatus === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          ]"
          @click="emit('update:selectedStatus', 'all')"
        >
          همه ({{ toFa(stats.total) }})
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0"
          :class="[
            selectedStatus === 'active'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
          ]"
          @click="emit('update:selectedStatus', 'active')"
        >
          فعال در ویترین ({{ toFa(stats.active) }})
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0"
          :class="[
            selectedStatus === 'inactive'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
          ]"
          @click="emit('update:selectedStatus', 'inactive')"
        >
          غیرفعال ({{ toFa(stats.inactive) }})
        </button>
      </div>
    </div>
  </div>
</template>
