<!-- frontend/app/components/ops/analytics/OpsExecutiveKpis.vue -->
<script setup lang="ts">
import { TrendingUp, Percent, ShoppingCart, CreditCard } from '@lucide/vue'
import { formatToman } from '~/utils/format'

const kpis = [
  {
    title: 'فروش ناخالص دوره (Gross Revenue)',
    amount: 42850000,
    unit: 'تومان',
    growth: '+۱۸.۴٪',
    growthPositive: true,
    subtitle: 'نسبت به دوره مالی پاییز گذشته',
    icon: TrendingUp,
  },
  {
    title: 'حاشیه سود خالص تخمینی',
    amount: 19282500,
    unit: 'تومان',
    growth: '+۱۴.۲٪',
    growthPositive: true,
    subtitle: 'پس از کسر بهای تمام‌شده و مالیات',
    icon: Percent,
  },
  {
    title: 'میانگین ارزش هر سبد (AOV)',
    amount: 2142500,
    unit: 'تومان',
    growth: '+۶.۸٪',
    growthPositive: true,
    subtitle: 'متوسط خرید در سفارش‌های ثبت‌شده',
    icon: ShoppingCart,
  },
  {
    title: 'نرخ سبدهای رهاشده',
    amount: null,
    percentage: '۲۸.۶٪',
    growth: '-۴.۱٪',
    growthPositive: true,
    subtitle: '۲۴ سبد در انتظار یادآوری هوشمند',
    icon: CreditCard,
  },
]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="kpi in kpis"
      :key="kpi.title"
      class="bg-white border border-sand/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-sand transition-all"
    >
      <div class="flex items-start justify-between">
        <span class="text-xs font-bold text-slate-600 block">{{ kpi.title }}</span>
        <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
          <component :is="kpi.icon" class="w-4 h-4" />
        </div>
      </div>

      <div class="mt-4">
        <div v-if="kpi.amount !== null" class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-900 font-mono tracking-tight">{{ formatToman(kpi.amount) }}</span>
          <span class="text-xs text-slate-500">{{ kpi.unit }}</span>
        </div>
        <div v-else class="text-2xl font-black text-slate-900 font-mono tracking-tight">
          {{ kpi.percentage }}
        </div>

        <div class="flex items-center gap-2 mt-2">
          <span
            class="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md"
            :class="kpi.growthPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose border border-rose/30'"
          >
            {{ kpi.growth }}
          </span>
          <span class="text-[11px] text-slate-500 truncate">{{ kpi.subtitle }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
