<script setup lang="ts">
import {
  TrendingUp,
  Percent,
  ShoppingCart,
  CreditCard,
  Plus,
  Package,
  Truck,
} from '@lucide/vue'

const router = useRouter()
const switchView = (view: string) => {
  router.push({ path: '/internal-ops-nexus', query: { view } })
}

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
  <section data-testid="nexus-analytics-view" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          دیده‌بان اجرایی و نظارت مالی
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          شاخص‌های کلیدی عملکرد آتلیه مد و وضعیت فروش کالکشن پاییز ۱۴۰۵
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

    <!-- کارت‌های شاخص‌های کلیدی (KPIs Grid) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="kpi in kpis"
        :key="kpi.title"
        class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all"
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

    <!-- کارت‌های خلاصه عملیات سریع (Operations Shortcuts) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 text-ink font-bold text-sm">
            <Package class="w-4.5 h-4.5" />
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
            <Truck class="w-4.5 h-4.5" />
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
            <CreditCard class="w-4.5 h-4.5" />
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
