<!-- frontend/app/components/ops/taxonomy/OpsCollectionsManager.vue -->
<script setup lang="ts">
import { Plus, Calendar, Sparkles } from '@lucide/vue'
import { useOpsTaxonomy } from '~/composables/ops/useOpsTaxonomy'

const { collectionDrops } = useOpsTaxonomy()
</script>

<template>
  <div class="space-y-4 font-sans">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div>
        <h3 class="text-sm font-bold text-slate-900">
          کالکشن‌ها و دراپ‌های زمان‌بندی‌شده
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          تعریف رویدادهای فصلی، عرضه دراپ‌های محدود (Drop Schedule) و کمپین‌های اختصاصی
        </p>
      </div>

      <button
        type="button"
        class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        @click="() => {}"
      >
        <Plus class="w-4 h-4" />
        <span>تعریف دراپ جدید</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="col in collectionDrops"
        :key="col.id"
        class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-amber-500" />
              <span class="text-xs font-black text-slate-900">{{ col.title }}</span>
            </div>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="col.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'"
            >
              {{ col.isActive ? 'فعال در ویترین' : 'آرشیو شده' }}
            </span>
          </div>

          <div class="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <Calendar class="w-3.5 h-3.5 text-slate-400" />
            <span class="font-mono text-[11px] tabular-nums">بازه عرضه: {{ col.startDate }} تا {{ col.endDate }}</span>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-[10px] font-mono text-slate-400">شناسه فصل: {{ col.season }}</span>
          <button
            type="button"
            class="text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
            @click="col.isActive = !col.isActive"
          >
            {{ col.isActive ? 'تغییر به آرشیو' : 'فعال‌سازی دراپ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
