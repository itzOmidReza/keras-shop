<!-- frontend/app/components/ops/OpsAnalyticsView.vue -->
<script setup lang="ts">
import { Plus, Package, Truck, CreditCard } from '@lucide/vue'
import OpsExecutiveKpis from '~/components/ops/analytics/OpsExecutiveKpis.vue'
import OpsRevenueChart from '~/components/ops/analytics/OpsRevenueChart.vue'
import OpsCategoryDoughnut from '~/components/ops/analytics/OpsCategoryDoughnut.vue'
import OpsExecutiveDigestCard from '~/components/ops/analytics/OpsExecutiveDigestCard.vue'
import OpsRfmCohortTable from '~/components/ops/analytics/OpsRfmCohortTable.vue'
import OpsDeadStockAnalyzer from '~/components/ops/analytics/OpsDeadStockAnalyzer.vue'

const router = useRouter()
const switchView = (view: string) => {
  router.push({ path: '/internal-ops-nexus', query: { view } })
}
</script>

<template>
  <section data-testid="nexus-analytics-view" class="space-y-6">
    <!-- هدر بخش دیده‌بان -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          دیده‌بان اجرایی و نظارت مالی
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          شاخص‌های کلیدی عملکرد آتلیه مد، نمودارهای تحلیلی و وضعیت فروش کالکشن پاییز ۱۴۰۵
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-9 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="switchView('products')"
        >
          <Plus class="w-4 h-4 text-slate-500" />
          <span>محصول جدید</span>
        </button>
        <button
          type="button"
          class="h-9 px-3.5 rounded-xl bg-ink text-white hover:bg-ink/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="switchView('fulfillment')"
        >
          <Plus class="w-4 h-4" />
          <span>ثبت سفارش دستی</span>
        </button>
      </div>
    </div>

    <!-- ۱. کارت‌های شاخص‌های کلیدی (KPIs Grid) -->
    <OpsExecutiveKpis />

    <!-- ۲. خلاصه گزارش مدیریتی روزانه (Executive AI Digest) -->
    <OpsExecutiveDigestCard />

    <!-- ۳. نمودارهای تصویری Chart.js (فروش خطی و دونات دسته‌بندی) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <OpsRevenueChart />
      </div>
      <div>
        <OpsCategoryDoughnut />
      </div>
    </div>

    <!-- ۴. ماتریس بخش‌بندی مشتریان (RFM Cohort) -->
    <OpsRfmCohortTable />

    <!-- ۵. تحلیل کالاهای راکد و خواب سرمایه (Dead Stock) -->
    <OpsDeadStockAnalyzer />

    <!-- ۶. کارت‌های خلاصه عملیات سریع (Operations Shortcuts) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 text-ink font-bold text-sm">
            <Package class="w-4 h-4" />
            <span>کاتالوگ فعال آتلیه</span>
          </div>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            ۲۴ محصول تعریف‌شده با موجودی انبار در ۵ سایز. کالکشن پاییز ۱۴۰۵ در وضعیت فعال قرار دارد.
          </p>
        </div>
        <button
          type="button"
          class="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          @click="switchView('products')"
        >
          مدیریت کالاها و انبار
        </button>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 text-purple-700 font-bold text-sm">
            <Truck class="w-4 h-4" />
            <span>سفارش‌های در حال ارسال</span>
          </div>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            صدور بارکد ۲۴ رقمی پست پیشتاز برای مرسولات و ثبت سفارشات تلفنی و اینستاگرامی.
          </p>
        </div>
        <button
          type="button"
          class="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          @click="switchView('fulfillment')"
        >
          مشاهده میز سفارش‌ها
        </button>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CreditCard class="w-4 h-4" />
            <span>تسویه حساب شاپرک</span>
          </div>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            گزارش لحظه‌ای شماره ارجاع‌های بانکی (RRN)، کارمزد ۱٪ شاپرک و خروجی اکسل دفتر کل.
          </p>
        </div>
        <button
          type="button"
          class="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          @click="switchView('finance')"
        >
          مشاهده دفتر کل مالی
        </button>
      </div>
    </div>
  </section>
</template>
