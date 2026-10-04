<!-- frontend/app/pages/internal-ops-nexus/index.vue -->
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useOpsModals } from '~/composables/ops/useOpsModals'
import OpsRbacBar from '~/components/ops/auth/OpsRbacBar.vue'
import OpsConflictBanner from '~/components/ops/common/OpsConflictBanner.vue'
import OpsCommandPalette from '~/components/ops/common/OpsCommandPalette.vue'
import OpsQuickPeekDrawer from '~/components/ops/common/OpsQuickPeekDrawer.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

const authStore = useAuthStore()
if (!authStore.isAuthenticated || authStore.user?.role !== 'super_admin') {
  throw createError({ statusCode: 404, statusMessage: 'صفحه مورد نظر یافت نشد', fatal: true })
}

useSeoMeta({ title: 'مرکز فرماندهی آتلیه کراس | HQ Nexus', robots: 'noindex, nofollow' })

const route = useRoute()
const router = useRouter()
const {
  is2FaOpen, isSessionsOpen, isAuditOpen, isCommandPaletteOpen,
  isMatrixOpen, isTransferOpen, isPackingScanOpen, isRmaOpen,
  isConflictBannerVisible, isQuickPeekOpen, quickPeekData,
} = useOpsModals()

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

const navTabs = [
  { id: 'analytics', label: 'دیده‌بان اجرایی', testId: 'tab-view-analytics' },
  { id: 'products', label: 'محصولات و انبارداری', testId: 'tab-view-products' },
  { id: 'fulfillment', label: 'میز سفارش‌ها', testId: 'tab-view-fulfillment' },
  { id: 'inventory', label: 'ماتریس انبار', testId: 'tab-view-inventory' },
  { id: 'finance', label: 'امور مالی و شاپرک', testId: 'tab-view-finance' },
  { id: 'articles', label: 'مجله و مقالات', testId: 'tab-view-articles' },
  { id: 'vouchers', label: 'کدهای تخفیف', testId: 'tab-view-vouchers' },
]
</script>

<template>
  <div class="space-y-5 max-w-7xl mx-auto">
    <!-- نوار RBAC، سطح دسترسی و اپراتور -->
    <OpsRbacBar
      @open2fa="is2FaOpen = true"
      @open-sessions="isSessionsOpen = true"
      @open-audit="isAuditOpen = true"
    />

    <!-- بنر هشدار تداخل همزمانی ویرایش -->
    <OpsConflictBanner
      :show="isConflictBannerVisible"
      @dismiss="isConflictBannerVisible = false"
      @reload="isConflictBannerVisible = false"
    />

    <!-- تب‌های ناوبری سریع دسکتاپ و موبایل -->
    <div class="flex items-center justify-between border-b border-sand pb-3 gap-2 overflow-x-auto">
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          v-for="t in navTabs"
          :key="t.id"
          type="button"
          :data-testid="t.testId"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === t.id ? 'bg-ink text-paper shadow-2xs' : 'text-slate-600 hover:text-ink hover:bg-sand/30'"
          @click="switchView(t.id)"
        >
          {{ t.label }}
        </button>
      </div>

      <div class="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <button
          type="button"
          class="px-2.5 py-1 rounded-lg border border-sand bg-paper hover:bg-sand/40 text-[11px] font-sans font-bold text-ink cursor-pointer flex items-center gap-1.5"
          @click="isCommandPaletteOpen = true"
        >
          <span>پالت دستورات</span>
          <kbd class="px-1 py-0.5 rounded bg-sand/60 text-[10px] font-mono">⌘K</kbd>
        </button>
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

    <!-- ابزارهای کمکی و دراورها -->
    <OpsCommandPalette v-model:open="isCommandPaletteOpen" @navigate="switchView" />
    <OpsQuickPeekDrawer v-model:open="isQuickPeekOpen" :data="quickPeekData" />

    <!-- دیالوگ‌ها و مودال‌های لود تنبل -->
    <LazyOpsProductModal />
    <LazyOpsProductDeleteDialog />
    <LazyOpsBarcodeModal />
    <LazyOpsManualOrderModal />
    <LazyOpsPackingSlipModal />
    <LazyOpsArticleModal />
    <LazyOpsTwoFactorModal v-model:open="is2FaOpen" />
    <LazyOpsSessionSentinelModal v-model:open="isSessionsOpen" />
    <LazyOpsAuditTrailTable v-model:open="isAuditOpen" />
    <LazyOpsCatalogMatrixModal v-model:open="isMatrixOpen" />
    <LazyOpsWarehouseTransferModal v-model:open="isTransferOpen" />
    <LazyOpsPackingBarcodeScanModal v-model:open="isPackingScanOpen" />
    <LazyOpsRmaModal v-model:open="isRmaOpen" />
  </div>
</template>
