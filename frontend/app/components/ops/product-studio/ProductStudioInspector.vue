<!-- frontend/app/components/ops/product-studio/ProductStudioInspector.vue -->
<script setup lang="ts">
import type { Component } from 'vue'
import { CheckCircle2, AlertCircle, Sparkles, Eye, Layers, Image as ImageIcon, Grid, Cpu, Ruler, Globe } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import { toFa, formatToman } from '~/utils/format'

const {
  title,
  styleCode,
  badge,
  mediaList,
  selectedColors,
  selectedSizes,
  variants,
  seoScore,
  seoIssues,
  autoGenerateSeo,
  sectionStatuses,
  completionPercentage,
} = useOpsProductStudio()

const scrollToSection = (anchor: string) => {
  if (typeof document !== 'undefined') {
    const el = document.querySelector(anchor)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

const sectionIcons: Record<string, Component> = {
  identity: Layers,
  media: ImageIcon,
  variants: Grid,
  specs: Cpu,
  sizechart: Ruler,
  strategy: Globe,
}

const previewPrice = computed(() => {
  const first = variants.value[0]
  return first ? first.salePrice : 2450000
})

const previewRegularPrice = computed(() => {
  const first = variants.value[0]
  return first ? first.regularPrice : 2450000
})
</script>

<template>
  <aside class="space-y-4 font-sans select-none">
    <!-- ۱. کارت پیشرفت و ناوبر سریع بخش‌ها (Completion & Section Navigator) -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3.5">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>وضعیت تکمیل شناسنامه</span>
        </h3>
        <span class="text-xs font-mono font-bold text-ink bg-sand-100/70 px-2 py-0.5 rounded-md tabular-nums">
          {{ toFa(completionPercentage) }}٪
        </span>
      </div>

      <!-- نوار پیشرفت درصد تکمیل -->
      <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-ink transition-all duration-300 rounded-full"
          :style="{ width: `${completionPercentage}%` }"
        />
      </div>

      <!-- فهرست سرفصل‌ها با اسکرول نرم -->
      <div class="space-y-1 pt-1 text-xs">
        <button
          v-for="sec in sectionStatuses"
          :key="sec.id"
          type="button"
          class="w-full flex items-center justify-between p-2 rounded-xl text-start transition-all cursor-pointer group hover:bg-slate-50"
          @click="scrollToSection(sec.anchor)"
        >
          <div class="flex items-center gap-2 min-w-0">
            <component
              :is="sectionIcons[sec.id] || Layers"
              class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 transition-colors shrink-0"
            />
            <span class="text-[11px] font-medium text-slate-700 group-hover:text-slate-900 truncate">
              {{ sec.title }}
            </span>
          </div>

          <div class="shrink-0 ms-2">
            <span
              v-if="sec.complete"
              class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600"
              title="تکمیل شده"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
            </span>
            <span
              v-else
              class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 text-amber-500"
              title="نیازمند بازبینی"
            >
              <AlertCircle class="w-3.5 h-3.5" />
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- ۲. پیش‌نمایش زنده کارت کالا در ویترین (Real-Time Live Card Preview) -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <Eye class="w-3.5 h-3.5 text-slate-500" />
          <span>پیش‌نمایش زنده در ویترین</span>
        </div>
        <span class="text-[10px] text-slate-400 font-mono">LIVE PDP</span>
      </div>

      <!-- مینیاتور کارت کالا -->
      <div class="rounded-xl border border-slate-200/70 overflow-hidden bg-slate-50 group transition-all">
        <div class="relative aspect-3/4 bg-slate-100 overflow-hidden">
          <img
            v-if="mediaList[0]?.url"
            :src="mediaList[0].url"
            :alt="title || 'اثر آتلیه کراس'"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          >
          <div v-else class="w-full h-full flex items-center justify-center text-slate-300 text-xs font-medium">
            تصویر کاور
          </div>

          <!-- بج کالا -->
          <span
            v-if="badge"
            class="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-ink text-white text-[10px] font-bold shadow-xs"
          >
            {{ badge }}
          </span>
        </div>

        <div class="p-3 bg-white space-y-1.5 text-start">
          <div class="text-[10px] font-mono text-slate-400">
            {{ styleCode || 'KER-ITEM' }}
          </div>
          <h4 class="text-xs font-bold text-slate-900 truncate">
            {{ title || 'عنوان اثر آتلیه' }}
          </h4>

          <!-- قیمت و تخفیف -->
          <div class="flex items-center gap-2 pt-0.5">
            <span class="text-xs font-bold text-ink">
              {{ formatToman(previewPrice) }}
            </span>
            <span
              v-if="previewRegularPrice > previewPrice"
              class="text-[10px] text-slate-400 line-through tabular-nums"
            >
              {{ formatToman(previewRegularPrice) }}
            </span>
          </div>

          <!-- سایزها و رنگ‌ها -->
          <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
            <span>{{ toFa(selectedColors.length) }} رنگ</span>
            <div class="flex items-center gap-1 font-mono">
              <span
                v-for="sz in selectedSizes.slice(0, 4)"
                :key="sz"
                class="px-1 rounded bg-slate-100 text-slate-700"
              >
                {{ sz }}
              </span>
              <span v-if="selectedSizes.length > 4">+{{ toFa(selectedSizes.length - 4) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ۳. شاخص سئو و اصلاح سریع (SEO Score & Quick Fix) -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-bold text-slate-900">شاخص سلامت سئو</h3>
        <span
          class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold"
          :class="seoScore >= 80 ? 'bg-emerald-100 text-emerald-800' : seoScore >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'"
        >
          {{ toFa(seoScore) }} / ۱۰۰
        </span>
      </div>

      <!-- موارد نیازمند اقدام -->
      <div v-if="seoIssues.length > 0" class="space-y-1.5 text-[11px] text-slate-600">
        <div
          v-for="(issue, idx) in seoIssues"
          :key="idx"
          class="flex items-start gap-1.5 text-amber-700 bg-amber-50/70 p-2 rounded-lg"
        >
          <AlertCircle class="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{{ issue }}</span>
        </div>
      </div>
      <div v-else class="text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg flex items-center gap-1.5">
        <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
        <span>شاخص سئوی اثر در سطح بهینه قرار دارد.</span>
      </div>

      <!-- دکمه اصلاح و تولید خودکار -->
      <button
        type="button"
        class="w-full h-8 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        @click="autoGenerateSeo"
      >
        <Sparkles class="w-3.5 h-3.5 text-ink" />
        <span>تولید خودکار متا از روی عنوان اثر</span>
      </button>
    </div>
  </aside>
</template>
