<!-- frontend/app/pages/internal-ops-nexus/index.vue -->
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

const authStore = useAuthStore()

// اعتبارسنجی امنیتی سخت‌گیرانه سمت کامپوننت برای پرتاب ۴۰۴
if (!authStore.isAuthenticated || authStore.user?.role !== 'super_admin') {
  throw createError({
    statusCode: 404,
    statusMessage: 'صفحه مورد نظر یافت نشد',
    fatal: true,
  })
}

useSeoMeta({
  title: 'مرکز فرماندهی آتلیه کراس | HQ Nexus',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const router = useRouter()

const currentView = computed(() => {
  const v = route.query.view as string
  if (['analytics', 'products', 'fulfillment', 'inventory', 'orders', 'finance', 'articles', 'vouchers', 'crm'].includes(v)) {
    return v === 'orders' ? 'fulfillment' : v
  }
  return 'analytics'
})

const switchView = (view: string) => {
  router.push({ path: '/internal-ops-nexus', query: { view } })
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- تب‌های ناوبری سریع دسکتاپ و موبایل (Breadcrumbs / Quick Switch) -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 overflow-x-auto">
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          data-testid="tab-view-analytics"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'analytics' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('analytics')"
        >
          دیده‌بان اجرایی
        </button>

        <button
          type="button"
          data-testid="tab-view-products"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'products' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('products')"
        >
          محصولات و انبارداری
        </button>

        <button
          type="button"
          data-testid="tab-view-fulfillment"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'fulfillment' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('fulfillment')"
        >
          میز سفارش‌ها
        </button>

        <button
          type="button"
          data-testid="tab-view-inventory"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'inventory' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('inventory')"
        >
          ماتریس انبار
        </button>

        <button
          type="button"
          data-testid="tab-view-finance"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'finance' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('finance')"
        >
          امور مالی و شاپرک
        </button>

        <button
          type="button"
          data-testid="tab-view-articles"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'articles' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('articles')"
        >
          مجله و مقالات
        </button>

        <button
          type="button"
          data-testid="tab-view-vouchers"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'vouchers' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('vouchers')"
        >
          کدهای تخفیف
        </button>
      </div>

      <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
        <span>پایگاه داده: آنلاین</span>
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      </div>
    </div>

    <!-- بخش‌های محتوایی -->
    <OpsAnalyticsView v-if="currentView === 'analytics'" />
    <OpsProductsView v-else-if="currentView === 'products'" />
    <OpsOrdersView v-else-if="currentView === 'fulfillment'" />
    <OpsInventoryView v-else-if="currentView === 'inventory'" />
    <OpsFinanceView v-else-if="currentView === 'finance'" />
    <OpsArticlesView v-else-if="currentView === 'articles'" />
    <OpsVouchersView v-else-if="currentView === 'vouchers'" />
    <OpsCrmView v-else-if="currentView === 'crm'" />

    <!-- دیالوگ‌ها و مودال‌های لود تنبل (Lazy Dialogs) -->
    <LazyOpsProductModal />
    <LazyOpsProductDeleteDialog />
    <LazyOpsBarcodeModal />
    <LazyOpsManualOrderModal />
    <LazyOpsPackingSlipModal />
    <LazyOpsArticleModal />
  </div>
</template>
