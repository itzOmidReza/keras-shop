<!-- frontend/app/components/ops/common/OpsChartCard.vue -->
<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type ChartOptions,
  type ChartType,
} from 'chart.js'
import { Line as LineChart, Bar as BarChart, Doughnut as DoughnutChart } from 'vue-chartjs'

if (import.meta.client) {
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    CategoryScale,
    LinearScale,
  )
}

const props = defineProps<{
  type: 'line' | 'bar' | 'doughnut'
  title: string
  subtitle?: string
  data: ChartData<ChartType>
  options?: ChartOptions<ChartType>
  height?: number
}>()

const defaultOptions: ChartOptions<ChartType> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      rtl: true,
      labels: {
        font: { family: 'Vazirmatn, sans-serif', size: 11 },
        color: 'rgb(71, 85, 105)',
      },
    },
    tooltip: {
      rtl: true,
      titleFont: { family: 'Vazirmatn, sans-serif' },
      bodyFont: { family: 'Vazirmatn, sans-serif' },
    },
  },
}

const mergedOptions = computed(() => ({
  ...defaultOptions,
  ...props.options,
}))
</script>

<template>
  <div class="bg-white border border-sand/80 rounded-2xl p-5 shadow-2xs space-y-3">
    <div class="flex items-start justify-between">
      <div>
        <h4 class="text-sm font-bold text-ink">{{ title }}</h4>
        <p v-if="subtitle" class="text-2xs text-muted-foreground mt-0.5">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </div>

    <div :style="{ height: `${height || 260}px` }" class="relative w-full">
      <ClientOnly>
        <LineChart
          v-if="type === 'line'"
          :data="(data as unknown as ChartData<'line'>)"
          :options="(mergedOptions as unknown as ChartOptions<'line'>)"
        />
        <BarChart
          v-else-if="type === 'bar'"
          :data="(data as unknown as ChartData<'bar'>)"
          :options="(mergedOptions as unknown as ChartOptions<'bar'>)"
        />
        <DoughnutChart
          v-else-if="type === 'doughnut'"
          :data="(data as unknown as ChartData<'doughnut'>)"
          :options="(mergedOptions as unknown as ChartOptions<'doughnut'>)"
        />
        <template #fallback>
          <div class="w-full h-full bg-sand/10 rounded-xl flex items-center justify-center text-xs text-muted-foreground animate-pulse">
            در حال بارگذاری نمودار تحلیلی...
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>
