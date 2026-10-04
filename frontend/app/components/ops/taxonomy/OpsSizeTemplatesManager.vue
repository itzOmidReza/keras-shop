<!-- frontend/app/components/ops/taxonomy/OpsSizeTemplatesManager.vue -->
<script setup lang="ts">
import { Plus, Ruler } from '@lucide/vue'
import { useOpsTaxonomy } from '~/composables/ops/useOpsTaxonomy'

const { sizeTemplates } = useOpsTaxonomy()
</script>

<template>
  <div class="space-y-4 font-sans">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div>
        <h3 class="text-sm font-bold text-slate-900">
          قالب‌های مرجع راهنمای اندازه و ابعاد (Size Guides)
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          تعریف ماتریس‌های اندازه‌گیری استاندارد با امکان بارگذاری خودکار در صفحه محصول
        </p>
      </div>

      <button
        type="button"
        class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        @click="() => {}"
      >
        <Plus class="w-4 h-4" />
        <span>ایجاد قالب جدید</span>
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="tpl in sizeTemplates"
        :key="tpl.id"
        class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3"
      >
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <Ruler class="w-4 h-4 text-slate-500" />
            <span class="text-xs font-black text-slate-900">{{ tpl.name }}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
              {{ tpl.categoryType }}
            </span>
          </div>

          <span class="text-[11px] text-slate-500">
            خطای دوخت تا ±۲ سانتیمتر
          </span>
        </div>

        <!-- جدول اندازه‌ها -->
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs font-sans">
            <thead class="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-100">
              <tr>
                <th class="p-2 text-start">سایز</th>
                <th
                  v-for="col in tpl.columns"
                  :key="col"
                  class="p-2 text-start"
                >
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="row in tpl.rows"
                :key="row.size"
                class="hover:bg-slate-50/50"
              >
                <td class="p-2 font-mono font-bold text-slate-900">
                  {{ row.size }}
                </td>
                <td
                  v-for="col in tpl.columns"
                  :key="col"
                  class="p-2 font-mono tabular-nums text-slate-700"
                >
                  {{ row.measurements[col] ?? '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
