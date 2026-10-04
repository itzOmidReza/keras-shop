<!-- frontend/app/components/ops/OpsAnalyticsView.vue -->
<script setup lang="ts">
import { Plus, Package, Truck, CreditCard, Users } from '@lucide/vue'
import OpsExecutiveKpis from '~/components/ops/analytics/OpsExecutiveKpis.vue'
import OpsRevenueChart from '~/components/ops/analytics/OpsRevenueChart.vue'
import OpsCategoryDoughnut from '~/components/ops/analytics/OpsCategoryDoughnut.vue'
import OpsExecutiveDigestCard from '~/components/ops/analytics/OpsExecutiveDigestCard.vue'
import OpsRecentOrdersCard from '~/components/ops/analytics/OpsRecentOrdersCard.vue'

const router = useRouter()
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <section data-testid="nexus-analytics-view" class="space-y-6 font-sans">
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
          @click="navigateTo('/internal-ops-nexus/products/new')"
        >
          <Plus class="w-4 h-4 text-slate-500" />
          <span>لباس جدید</span>
        </button>
        <button
          type="button"
          class="h-9 px-3.5 rounded-xl bg-ink text-white hover:bg-ink/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="navigateTo('/internal-ops-nexus/orders')"
        >
          <Plus class="w-4 h-4" />
          <span>میز سفارش‌ها</span>
        </button>
      </div>
    </div>

    <!-- ۱. کارت‌های ۴ شاخص کلیدی (Top 4 KPIs) -->
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

    <!-- ۴. جدول آخرین سفارش‌های نیازمند اقدام فوری -->
    <OpsRecentOrdersCard />

    <!-- ۵. کارت‌های دسترسی مستقیم به دپارتمان‌های اصلی (Direct Quick-Links) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- کاتالوگ محصولات -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div class="flex items-center gap-2 text-ink font-bold text-xs">
            <Package class="w-4 h-4" />
            <span>کاتالوگ محصولات</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">
            مدیریت محصولات، قیمت‌گذاری و ماتریس ۶ سایزی موجودی انبار.
          </p>
        </div>
        <button
          type="button"
          class="mt-3 w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          @click="navigateTo('/internal-ops-nexus/products')"
        >
          ورود به کاتالوگ
        </button>
      </div>

      <!-- سفارش‌ها و توزیع -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div class="flex items-center gap-2 text-purple-700 font-bold text-xs">
            <Truck class="w-4 h-4" />
            <span>فروش و مرسوله‌ها</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">
            صدور بارکد ۲۴ رقمی پست پیشتاز، برگ ارسال و بازرسی RMA.
          </p>
        </div>
        <button
          type="button"
          class="mt-3 w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          @click="navigateTo('/internal-ops-nexus/orders')"
        >
          مشاهده سفارش‌ها
        </button>
      </div>

      <!-- امور مالی و شاپرک -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div class="flex items-center gap-2 text-emerald-700 font-bold text-xs">
            <CreditCard class="w-4 h-4" />
            <span>امور مالی و تسویه</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">
            گزارش شماره ارجاع‌های شاپرک، تراز روزانه و خروجی اکسل.
          </p>
        </div>
        <button
          type="button"
          class="mt-3 w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          @click="navigateTo('/internal-ops-nexus/finance')"
        >
          مشاهده دفتر کل مالی
        </button>
      </div>

      <!-- مشتریان و وفاداری -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div class="flex items-center gap-2 text-amber-700 font-bold text-xs">
            <Users class="w-4 h-4" />
            <span>مشتریان و وفاداری</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">
            باشگاه مشتریان رسمی، رده‌بندی پلاتینوم و ماتریس RFM.
          </p>
        </div>
        <button
          type="button"
          class="mt-3 w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          @click="navigateTo('/internal-ops-nexus/crm')"
        >
          باشگاه مشتریان
        </button>
      </div>
    </div>
  </section>
</template>
