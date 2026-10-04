<!-- frontend/app/components/ops/analytics/OpsRfmCohortTable.vue -->
<script setup lang="ts">
import { Users2, ArrowUpRight } from '@lucide/vue'
import { useOpsRFM } from '~/composables/ops/useOpsRFM'
import { formatToman, toFa } from '~/utils/format'

const { rfmSegments } = useOpsRFM()
</script>

<template>
  <div class="bg-white border border-sand/80 rounded-2xl p-5 shadow-2xs space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-sand/60">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-sand/40 text-ink flex items-center justify-center">
          <Users2 class="w-4 h-4 text-rose" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">ماتریس بخش‌بندی مشتریان (RFM Cohort Segmentation)</h3>
          <p class="text-2xs text-muted-foreground mt-0.5">تفکیک مشتریان بر پایه تازگی خرید، فراوانی سفارشات و ارزش پولی</p>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto border border-sand/70 rounded-xl">
      <table class="w-full text-xs text-start">
        <thead class="bg-sand/30 text-muted-foreground text-2xs font-bold border-b border-sand">
          <tr>
            <th class="p-3 text-start">خوشه مشتریان</th>
            <th class="p-3 text-start">تعداد مشتریان</th>
            <th class="p-3 text-start">سهم از کل</th>
            <th class="p-3 text-start">میانگین خرید</th>
            <th class="p-3 text-start">استراتژی و اقدام پیشنهادی</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-sand/40">
          <tr v-for="seg in rfmSegments" :key="seg.id" class="hover:bg-sand/10 transition-colors">
            <td class="p-3">
              <span class="inline-block px-2 py-0.5 rounded-full text-2xs font-bold border" :class="seg.colorBadge">
                {{ seg.name }}
              </span>
              <p class="text-2xs text-muted-foreground mt-1 leading-relaxed">{{ seg.description }}</p>
            </td>
            <td class="p-3 font-mono font-bold text-ink">
              {{ toFa(seg.customerCount) }} نفر
            </td>
            <td class="p-3 font-mono text-2xs text-slate-600">
              {{ seg.percentage }}
            </td>
            <td class="p-3 font-mono font-bold text-slate-800">
              {{ formatToman(seg.avgSpend) }} تومان
            </td>
            <td class="p-3 text-2xs text-slate-700 max-w-xs leading-relaxed">
              <div class="flex items-start gap-1">
                <ArrowUpRight class="w-3.5 h-3.5 text-rose shrink-0 mt-0.5" />
                <span>{{ seg.recommendedAction }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
