<!-- frontend/app/components/ops/analytics/OpsRevenueChart.vue -->
<script setup lang="ts">
import { useOpsAnalyticsBI } from '~/composables/ops/useOpsAnalyticsBI'
import OpsChartCard from '~/components/ops/common/OpsChartCard.vue'

const { period, activeRevenueChartData } = useOpsAnalyticsBI()
</script>

<template>
  <OpsChartCard
    type="line"
    title="روند درآمد و گردش مالی کالکشن"
    subtitle="مقایسه رشد خطی درآمد با سال مالی گذشته بر پایه داده‌های ثبت‌شده در پایگاه داده"
    :data="activeRevenueChartData"
    :height="260"
  >
    <template #actions>
      <div class="flex items-center gap-1 p-0.5 bg-sand/30 rounded-lg text-xs font-bold">
        <button
          type="button"
          class="px-2.5 py-1 rounded-md transition-colors cursor-pointer text-2xs"
          :class="period === '30days' ? 'bg-white text-ink shadow-2xs font-bold' : 'text-muted-foreground hover:text-ink'"
          @click="period = '30days'"
        >
          ۳۰ روز اخیر
        </button>
        <button
          type="button"
          class="px-2.5 py-1 rounded-md transition-colors cursor-pointer text-2xs"
          :class="period === '12months' ? 'bg-white text-ink shadow-2xs font-bold' : 'text-muted-foreground hover:text-ink'"
          @click="period = '12months'"
        >
          ۱۲ ماه سال
        </button>
      </div>
    </template>
  </OpsChartCard>
</template>
