<!-- frontend/app/components/ops/analytics/OpsCategoryDoughnut.vue -->
<script setup lang="ts">
import { useOpsAnalyticsBI } from '~/composables/ops/useOpsAnalyticsBI'
import OpsChartCard from '~/components/ops/common/OpsChartCard.vue'

const { categoryDoughnutData } = useOpsAnalyticsBI()
</script>

<template>
  <OpsChartCard
    type="doughnut"
    title="توزیع فروش بر اساس دسته‌بندی کالاها"
    subtitle="سهم ریالی هر دسته از پوشاک در سبد خرید کالکشن پاییز ۱۴۰۵"
    :data="categoryDoughnutData"
    :height="260"
  />
</template>
