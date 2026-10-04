<!-- frontend/app/pages/internal-ops-nexus/finance/index.vue -->
<script setup lang="ts">
import OpsDomainSubNav from '~/components/ops/common/OpsDomainSubNav.vue'
import OpsFinanceView from '~/components/ops/OpsFinanceView.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'امور مالی و تسویه | مرکز عملیات کراس', robots: 'noindex, nofollow' })

const activeSubTab = ref<'balance' | 'transactions'>('balance')
const subNavTabs = [
  { id: 'balance', label: 'تراز و درآمد' },
  { id: 'transactions', label: 'تراکنش‌های شاپرک' },
]
</script>

<template>
  <div class="space-y-4 max-w-7xl mx-auto font-sans">
    <!-- تب‌های افقی سطح دوم ناوبری مالی (44px) -->
    <OpsDomainSubNav v-model="activeSubTab" :tabs="subNavTabs" />

    <!-- محتوای تراز و امور مالی -->
    <OpsFinanceView />
  </div>
</template>
