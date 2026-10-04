<!-- frontend/app/components/ops/analytics/OpsDeadStockAnalyzer.vue -->
<script setup lang="ts">
import { AlertTriangle, TrendingDown } from '@lucide/vue'
import { useOpsAnalyticsBI } from '~/composables/ops/useOpsAnalyticsBI'
import { formatToman, toFa } from '~/utils/format'

const { deadStockItems, totalFrozenCapital } = useOpsAnalyticsBI()
</script>

<template>
  <div class="bg-white border border-sand/80 rounded-2xl p-5 shadow-2xs space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-sand/60">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
          <AlertTriangle class="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">تحلیل کالاهای راکد و سرمایه بلوکه‌شده (Dead Stock Analyzer)</h3>
          <p class="text-2xs text-muted-foreground mt-0.5">پایش اقلام بدون فروش بیش از ۶۰ روز و نرخ گردش پایین انبار</p>
        </div>
      </div>

      <div class="text-end">
        <span class="text-2xs text-muted-foreground block">کل سرمایه منجمد در انبار:</span>
        <span class="text-sm font-black font-mono text-rose">{{ formatToman(totalFrozenCapital) }} تومان</span>
      </div>
    </div>

    <div class="overflow-x-auto border border-sand/70 rounded-xl">
      <table class="w-full text-xs text-start">
        <thead class="bg-sand/30 text-muted-foreground text-2xs font-bold border-b border-sand">
          <tr>
            <th class="p-3 text-start">عنوان و کد کالا</th>
            <th class="p-3 text-start">روزهای بدون فروش</th>
            <th class="p-3 text-start">موجودی راکد</th>
            <th class="p-3 text-start">سرمایه منجمد (تومان)</th>
            <th class="p-3 text-start">نرخ گردش انبار (Turnover)</th>
            <th class="p-3 text-start">راهکار پیشنهادی</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-sand/40">
          <tr v-for="item in deadStockItems" :key="item.sku" class="hover:bg-sand/10 transition-colors">
            <td class="p-3">
              <span class="font-bold text-ink block">{{ item.title }}</span>
              <span class="font-mono text-2xs text-muted-foreground">{{ item.sku }}</span>
            </td>
            <td class="p-3 font-mono font-bold text-rose">
              {{ toFa(item.daysWithoutSale) }} روز
            </td>
            <td class="p-3 font-mono text-ink">
              {{ toFa(item.stagnantQty) }} عدد
            </td>
            <td class="p-3 font-mono font-bold text-slate-900">
              {{ formatToman(item.frozenCapital) }}
            </td>
            <td class="p-3 font-mono text-2xs text-slate-700">
              <span class="inline-flex items-center gap-1">
                <TrendingDown class="w-3 h-3 text-rose" />
                <span>{{ toFa(item.turnoverRatio) }}x</span>
              </span>
            </td>
            <td class="p-3 text-2xs text-slate-600">
              <span class="bg-rose/10 text-rose px-2 py-0.5 rounded-full font-bold">
                تخفیف ویژه فصلی در کمپین حراج
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
