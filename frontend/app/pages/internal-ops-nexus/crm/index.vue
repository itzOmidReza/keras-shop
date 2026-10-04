<!-- frontend/app/pages/internal-ops-nexus/crm/index.vue -->
<script setup lang="ts">
import OpsDomainSubNav from '~/components/ops/common/OpsDomainSubNav.vue'
import OpsCrmView from '~/components/ops/OpsCrmView.vue'
import OpsRfmCohortTable from '~/components/ops/analytics/OpsRfmCohortTable.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'مشتریان و وفاداری | مرکز عملیات کراس', robots: 'noindex, nofollow' })

const activeSubTab = ref<'members' | 'rfm'>('members')
const subNavTabs = [
  { id: 'members', label: 'اعضای رسمی باشگاه' },
  { id: 'rfm', label: 'تحلیل بخش‌بندی RFM' },
]
</script>

<template>
  <div class="space-y-4 max-w-7xl mx-auto font-sans">
    <!-- تب‌های افقی سطح دوم ناوبری مشتریان (44px) -->
    <OpsDomainSubNav v-model="activeSubTab" :tabs="subNavTabs" />

    <OpsRfmCohortTable v-if="activeSubTab === 'rfm'" />
    <OpsCrmView v-else />
  </div>
</template>
