<!-- frontend/app/components/ops/product-studio/ProductStudioSizeChart.vue -->
<script setup lang="ts">
import { Ruler, Sparkles, Plus, Trash2, Info } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import { useOpsTaxonomy } from '~/composables/ops/useOpsTaxonomy'

const {
  sizeChartTemplateId,
  sizeChartRows,
  sizeToleranceNote,
} = useOpsProductStudio()

const { sizeTemplates } = useOpsTaxonomy()

// بارگذاری الگوی سایز
const applySizeTemplate = () => {
  const tpl = sizeTemplates.value.find((t) => t.id === sizeChartTemplateId.value)
  if (tpl && tpl.rows && tpl.rows.length > 0) {
    sizeChartRows.value = tpl.rows.map((r) => {
      const m = r.measurements as Record<string, number>
      return {
        size: r.size,
        chest: Number(m['دور سینه']) || undefined,
        waist: Number(m['دور کمر']) || undefined,
        hip: Number(m['دور باسن']) || undefined,
        length: Number(m['قد لباس']) || Number(m['قد کل شلوار']) || Number(m['طول (سانتیمتر)']) || undefined,
        sleeve: Number(m['قد آستین']) || undefined,
        inseam: Number(m['قد داخل شلوار (Inseam)']) || undefined,
      }
    })
  }
}

const addRow = () => {
  sizeChartRows.value.push({
    size: 'سایز جدید',
    chest: 90,
    waist: 70,
    hip: 95,
    length: 65,
    sleeve: 60,
  })
}

const removeRow = (idx: number) => {
  sizeChartRows.value.splice(idx, 1)
}
</script>

<template>
  <section class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5 font-sans">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-amber-50 text-amber-700">
          <Ruler class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900">
            جدول تطبیق و ابعاد اندازه‌گیری (Interactive Size Chart Builder)
          </h2>
          <p class="text-[11px] text-slate-500">
            ابعاد بر اساس سانتیمتر (CM)، تعیین تلرانس خطای دوخت و فراخوانی الگوهای آماده
          </p>
        </div>
      </div>

      <!-- فراخوانی الگو -->
      <div class="flex items-center gap-2 text-xs">
        <select
          v-model="sizeChartTemplateId"
          class="h-8 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[11px] outline-hidden focus:border-ink"
          @change="applySizeTemplate"
        >
          <option
            v-for="tpl in sizeTemplates"
            :key="tpl.id"
            :value="tpl.id"
          >
            الگو: {{ tpl.name }}
          </option>
        </select>
        <button
          type="button"
          class="h-8 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          @click="applySizeTemplate"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>بارگذاری</span>
        </button>
      </div>
    </div>

    <!-- جدول اندازه‌گیری بر حسب سانتیمتر -->
    <div class="overflow-x-auto border border-slate-200 rounded-xl">
      <table class="w-full text-start text-xs border-collapse">
        <thead>
          <tr class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
            <th class="py-2.5 px-3 text-start">سایز</th>
            <th class="py-2.5 px-3 text-start">دور سینه (cm)</th>
            <th class="py-2.5 px-3 text-start">دور کمر (cm)</th>
            <th class="py-2.5 px-3 text-start">دور باسن (cm)</th>
            <th class="py-2.5 px-3 text-start">قد اثر (cm)</th>
            <th class="py-2.5 px-3 text-start">قد آستین (cm)</th>
            <th class="py-2.5 px-2 text-center w-10">حذف</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="(row, idx) in sizeChartRows"
            :key="idx"
            class="hover:bg-slate-50/80 transition-colors"
          >
            <!-- نام سایز -->
            <td class="py-2 px-3">
              <input
                v-model="row.size"
                type="text"
                class="w-16 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-center text-xs text-slate-900 outline-hidden focus:bg-white focus:border-ink"
              >
            </td>

            <!-- دور سینه -->
            <td class="py-2 px-3">
              <input
                v-model.number="row.chest"
                type="number"
                class="w-16 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-center text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink tabular-nums"
              >
            </td>

            <!-- دور کمر -->
            <td class="py-2 px-3">
              <input
                v-model.number="row.waist"
                type="number"
                class="w-16 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-center text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink tabular-nums"
              >
            </td>

            <!-- دور باسن -->
            <td class="py-2 px-3">
              <input
                v-model.number="row.hip"
                type="number"
                class="w-16 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-center text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink tabular-nums"
              >
            </td>

            <!-- قد اثر -->
            <td class="py-2 px-3">
              <input
                v-model.number="row.length"
                type="number"
                class="w-16 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-center text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink tabular-nums"
              >
            </td>

            <!-- قد آستین -->
            <td class="py-2 px-3">
              <input
                v-model.number="row.sleeve"
                type="number"
                class="w-16 h-7 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-center text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink tabular-nums"
              >
            </td>

            <!-- حذف سطر -->
            <td class="py-2 px-2 text-center">
              <button
                type="button"
                class="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="حذف این ردیف"
                @click="removeRow(idx)"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- دکمه افزودن سطر دستی و تلرانس -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
      <button
        type="button"
        class="h-8 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
        @click="addRow"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>افزودن ردیف سایز دلخواه</span>
      </button>

      <div class="flex items-center gap-2">
        <label class="font-bold text-slate-600 text-[11px]">یادداشت تلرانس دوخت:</label>
        <input
          v-model="sizeToleranceNote"
          type="text"
          class="w-64 h-8 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[11px] outline-hidden focus:bg-white focus:border-ink"
        >
      </div>
    </div>

    <div class="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2 text-xs text-amber-800">
      <Info class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <span class="text-[11px] leading-relaxed">
        جدول سایز استاندارد مستقیماً در برگه جزییات محصول (PDP) برای مشتریان باز خواهد شد و ابعاد الگو را به صورت تعاملی نمایش می‌دهد.
      </span>
    </div>
  </section>
</template>
