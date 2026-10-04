// frontend/app/composables/ops/useOpsAnalyticsBI.ts
import { ref, computed } from 'vue'

export function useOpsAnalyticsBI() {
  const period = ref<'30days' | '12months'>('30days')

  const revenue30Days = {
    labels: ['۱ مهر', '۵ مهر', '۱۰ مهر', '۱۵ مهر', '۲۰ مهر', '۲۵ مهر', '۳۰ مهر'],
    datasets: [
      {
        label: 'فروش دوره جاری (پاییز ۱۴۰۵)',
        borderColor: '#1e293b',
        backgroundColor: 'rgba(30, 41, 59, 0.08)',
        fill: true,
        tension: 0.35,
        data: [4200000, 5800000, 7100000, 6400000, 8900000, 9500000, 10850000],
      },
      {
        label: 'دوره مشابه سال گذشته',
        borderColor: '#94a3b8',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.35,
        data: [3100000, 4200000, 5000000, 4900000, 6200000, 7100000, 8200000],
      },
    ],
  }

  const revenue12Months = {
    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر'],
    datasets: [
      {
        label: 'درآمد کل سالانه (میلیون تومان)',
        borderColor: '#9f1239',
        backgroundColor: 'rgba(159, 18, 57, 0.08)',
        fill: true,
        tension: 0.35,
        data: [28, 34, 41, 39, 48, 56, 68],
      },
    ],
  }

  const activeRevenueChartData = computed(() => {
    return period.value === '30days' ? revenue30Days : revenue12Months
  })

  const categoryDoughnutData = {
    labels: ['پالتو و بارانی', 'شومیز و بلوز سیلک', 'بافت و پلیور کشمیر', 'اکسسوری و شال'],
    datasets: [
      {
        backgroundColor: ['#1e293b', '#9f1239', '#475569', '#cbd5e1'],
        data: [45, 25, 20, 10],
      },
    ],
  }

  // تحلیل موجودی راکد و خواب سرمایه (Dead Stock)
  const deadStockItems = ref([
    {
      sku: 'KRS-SUM-TOP-WHT',
      title: 'تاپ لایه‌ای لینن سفید (آرشیو تابستان)',
      daysWithoutSale: 74,
      stagnantQty: 18,
      unitCost: 850000,
      frozenCapital: 15300000,
      turnoverRatio: 0.4,
    },
    {
      sku: 'KRS-ACC-SCR-PNK',
      title: 'اسکرانچی سیلک رزبری',
      daysWithoutSale: 62,
      stagnantQty: 35,
      unitCost: 120000,
      frozenCapital: 4200000,
      turnoverRatio: 0.6,
    },
  ])

  const totalFrozenCapital = computed(() =>
    deadStockItems.value.reduce((acc, curr) => acc + curr.frozenCapital, 0),
  )

  return {
    period,
    activeRevenueChartData,
    categoryDoughnutData,
    deadStockItems,
    totalFrozenCapital,
  }
}
