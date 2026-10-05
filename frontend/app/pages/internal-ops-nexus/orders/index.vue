<!-- frontend/app/pages/internal-ops-nexus/orders/index.vue -->
<script setup lang="ts">
import OpsDomainSubNav from '~/components/ops/common/OpsDomainSubNav.vue'
import OpsOrdersView from '~/components/ops/OpsOrdersView.vue'
import { useOpsModals } from '~/composables/ops/useOpsModals'
import { useOpsFulfillmentDesk } from '~/composables/ops/useOpsFulfillmentDesk'
import { useOpsShippingManifest } from '~/composables/ops/useOpsShippingManifest'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'فروش و مرسوله‌ها | مرکز عملیات کراس', robots: 'noindex, nofollow' })

const {
  isPackingScanOpen,
  isRmaOpen,
} = useOpsModals()

const { isScanToPackOpen } = useOpsFulfillmentDesk()
const { isPostManifestOpen } = useOpsShippingManifest()

const activeSubTab = ref('desk')
const subNavTabs = [
  { id: 'desk', label: 'میز سفارش‌ها' },
  { id: 'scan', label: 'اسکن و تایید بارکد پست' },
  { id: 'manifest', label: 'مانیفست ترخیص پست' },
  { id: 'rma', label: 'مرجوعی و استرداد (RMA)' },
]

watch(activeSubTab, (tab) => {
  if (tab === 'scan') {
    isScanToPackOpen.value = true
  } else if (tab === 'manifest') {
    isPostManifestOpen.value = true
  } else if (tab === 'rma') {
    isRmaOpen.value = true
  }
})

watch([isScanToPackOpen, isPostManifestOpen, isRmaOpen], ([scan, manifest, rma]) => {
  if (!scan && !manifest && !rma && activeSubTab.value !== 'desk') {
    activeSubTab.value = 'desk'
  }
})
</script>

<template>
  <div class="space-y-4 max-w-7xl mx-auto font-sans">
    <!-- تب‌های افقی سطح دوم ناوبری سفارش‌ها (44px) -->
    <OpsDomainSubNav v-model="activeSubTab" :tabs="subNavTabs" />

    <!-- محتوای میز سفارش‌ها -->
    <OpsOrdersView />

    <!-- دیالوگ‌های لود تنبل موجود -->
    <LazyOpsBarcodeModal />
    <LazyOpsManualOrderModal />
    <LazyOpsPackingSlipModal />
    <LazyOpsPackingBarcodeScanModal v-model:open="isPackingScanOpen" />
    <LazyOpsRmaModal v-model:open="isRmaOpen" />
  </div>
</template>
