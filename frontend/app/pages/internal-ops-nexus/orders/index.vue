<!-- frontend/app/pages/internal-ops-nexus/orders/index.vue -->
<script setup lang="ts">
import { useAdminOrders } from '~/composables/admin/useAdminOrders'
import AdminOrdersFilterBar from '~/components/ops/orders/AdminOrdersFilterBar.vue'
import AdminOrdersTable from '~/components/ops/orders/AdminOrdersTable.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({
  title: 'میز مدیریت سفارش‌ها و ارسال مرسولات | آتلیه کراس',
  robots: 'noindex, nofollow',
})

const {
  activeStatusTab,
  searchQuery,
  carrierFilter,
  filteredOrders,
  counts,
  updateStatus,
  openOrderDetail,
  openPackingSlip,
  openBarcodeModal,
  openManualOrderModal,
} = useAdminOrders()

const tabs = computed(() => [
  { id: 'all', label: 'همه سفارش‌ها', count: counts.value.all },
  { id: 'processing', label: 'در حال آماده‌سازی', count: counts.value.processing },
  { id: 'shipped', label: 'ارسال‌شده به پست', count: counts.value.shipped },
  { id: 'delivered', label: 'تحویل نهایی', count: counts.value.delivered },
  { id: 'archived', label: 'مرجوعی / لغو', count: counts.value.archived },
] as const)
</script>

<template>
  <div class="space-y-6 font-sans" data-testid="nexus-fulfillment-view">
    <!-- هدر، فیلتر وضعیت، فیلتر شرکت حمل و جست‌وجوی ترکیبی -->
    <AdminOrdersFilterBar
      v-model:active-status-tab="activeStatusTab"
      v-model:carrier-filter="carrierFilter"
      v-model:search-query="searchQuery"
      :tabs="tabs"
      @open-manual-order="openManualOrderModal"
    />

    <!-- جدول استاندارد سفارش‌ها با سلکتور وضعیت خط لوله -->
    <AdminOrdersTable
      :orders="filteredOrders"
      @update-status="updateStatus"
      @open-detail="openOrderDetail"
      @open-packing-slip="openPackingSlip"
      @open-barcode="openBarcodeModal"
    />

    <!-- دراور و مودال‌های مدیریت سفارش به صورت کامپوننت‌های Lazy -->
    <LazyAdminOrderDetailDrawer />
    <LazyAdminPackingSlipModal />
    <LazyAdminBarcodeModal />
    <LazyAdminManualOrderModal />
  </div>
</template>
